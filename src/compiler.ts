/** @module assemblyscript */ /** */

import * as base64 from "@protobufjs/base64";
import * as binaryen from "./binaryen";
import * as builtins from "./builtins";
import * as expressions from "./expressions";
import compileStore from "./expressions/helpers/store";
import * as library from "./library";
import Profiler from "./profiler";
import * as reflection from "./reflection";
import * as statements from "./statements";
import * as typescript from "./typescript";

// Malloc, free, etc. is present as a base64 encoded blob and prepared once when required.
let mallocWasm: Uint8Array;

/** Compiler options. */
export interface CompilerOptions {
  /** Whether compilation shall be performed in silent mode without writing to console. Defaults to `false`. */
  silent?: boolean;
  /** Whether to use built-in tree-shaking. Defaults to `true`. Disable this when building a dynamically linked library. */
  treeShaking?: boolean;
  /** Specifies the target architecture. Defaults to {@link CompilerTarget.WASM32}. */
  target?: CompilerTarget | "wasm32" | "wasm64";
  /** Specifies the memory model to use. Defaults to {@link CompilerMemoryModel.MALLOC}. */
  memoryModel?: CompilerMemoryModel | "malloc" | "exportmalloc" | "importmalloc" | "bare";
}

/** Compiler target. */
export enum CompilerTarget {
  /** 32-bit WebAssembly target using uint pointers. */
  WASM32,
  /** 64-bit WebAssembly target using ulong pointers. */
  WASM64
}

/** Compiler memory model. */
export enum CompilerMemoryModel {
  /** Does not bundle any memory management routines. */
  BARE,
  /** Bundles malloc, free, etc. */
  MALLOC,
  /** Bundles malloc, free, etc. and exports it to the embedder. */
  EXPORT_MALLOC,
  /** Imports malloc, free, etc. as provided by the embedder. */
  IMPORT_MALLOC
  // TODO: GC, once natively supported
}

/** A static memory segment. */
export interface CompilerMemorySegment {
  /** Offset in linear memory. */
  offset: number;
  /** Data in linear memory. */
  buffer: Uint8Array;
}

/**
 * The AssemblyScript compiler.
 *
 * Common usage is covered by the static methods {@link Compiler.compileFile} and {@link Compiler.compileString}
 * for convenience. Their diagnostics go to {@link Compiler.lastDiagnostics}.
 */
export class Compiler {

  /** Diagnostic messages produced by the last invocation of {@link Compiler.compileFile} or {@link Compiler.compileString}. */
  static lastDiagnostics: typescript.Diagnostic[];

  options: CompilerOptions;

  // TypeScript-related
  program: typescript.Program;
  checker: typescript.TypeChecker;
  entryFile: typescript.SourceFile;
  libraryFile: typescript.SourceFile;
  diagnostics: typescript.DiagnosticCollection;

  // Binaryen-related
  module: binaryen.Module;
  signatures: { [key: string]: binaryen.Signature } = {};
  globalInitializers: binaryen.Expression[] = [];
  userStartFunction?: binaryen.Function;
  memoryBase: number;
  memorySegments: CompilerMemorySegment[] = [];

  // Codegen
  target: CompilerTarget;
  memoryModel: CompilerMemoryModel;
  profiler = new Profiler();
  currentFunction: reflection.Function;
  stringPool: { [key: string]: CompilerMemorySegment } = {};

  // Reflection
  uintptrType: reflection.Type;
  functionTemplates: { [key: string]: reflection.FunctionTemplate } = {};
  classTemplates: { [key: string]: reflection.ClassTemplate } = {};
  globals: { [key: string]: reflection.Variable } = {};
  functions: { [key: string]: reflection.Function } = {};
  classes: { [key: string]: reflection.Class } = {};
  enums: { [key: string]: reflection.Enum } = {};
  startFunction: reflection.Function;
  pendingImplementations: { [key: string]: reflection.ClassTemplate } = {};

  /**
   * Compiles an AssemblyScript file to WebAssembly.
   * @param filename Entry file name
   * @param options Compiler options
   * @returns Compiled module or `null` if compilation failed. In case of failure, diagnostics are stored in {@link Compiler#diagnostics}.
   */
  static compileFile(filename: string, options?: CompilerOptions): binaryen.Module | null {
    return Compiler.compileProgram(
      typescript.createProgram(
        Object.keys(library.files).concat(filename),
        typescript.defaultCompilerOptions,
        typescript.createCompilerHost([ process.cwd() ])
      ),
      options
    );
  }

  /**
   * Compiles an AssemblyScript string to WebAssembly.
   * @param source Source string
   * @param options Compiler options
   * @param fileName File to use for the entry file
   * @returns Compiled module or `null` if compilation failed. In case of failure, diagnostics are stored in {@link Compiler#diagnostics}.
   */
  static compileString(source: string, options?: CompilerOptions, fileName: string = "module.ts"): binaryen.Module | null {
    return Compiler.compileProgram(
      typescript.createProgram(
        Object.keys(library.files).concat(fileName),
        typescript.defaultCompilerOptions,
        typescript.createCompilerHost([], source, fileName)
      ), options
    );
  }

  /**
   * Compiles a TypeScript program using AssemblyScript syntax to WebAssembly.
   * @param program TypeScript program
   * @param options Compiler options
   * @returns Compiled module or `null` if compilation failed. In case of failure, diagnostics are stored in {@link Compiler#diagnostics}.
   */
  static compileProgram(program: typescript.Program, options?: CompilerOptions): binaryen.Module | null {
    const compiler = new Compiler(program, options);
    const silent = !!(options && options.silent);
    let hasErrors = false;

    Compiler.lastDiagnostics = [];

    // bail out if there were 'pre emit' errors
    let diagnostics = typescript.getPreEmitDiagnostics(compiler.program);
    for (let i = 0, k = diagnostics.length; i < k; ++i) {
      if (!silent)
        typescript.printDiagnostic(diagnostics[i]);
      Compiler.lastDiagnostics.push(diagnostics[i]);
      if (diagnostics[i].category === typescript.DiagnosticCategory.Error)
        hasErrors = true;
    }
    if (hasErrors) return null;

    if (!silent)
      compiler.profiler.start("initialize");
    compiler.initialize();
    if (!silent)
      (console.error || console.log)("initialization took " + compiler.profiler.end("initialize").toFixed(3) + " ms");

    // bail out if there were initialization errors
    diagnostics = compiler.diagnostics.getDiagnostics();
    for (let i = 0, k = diagnostics.length; i < k; ++i) {
      Compiler.lastDiagnostics.push(diagnostics[i]);
      if (diagnostics[i].category === typescript.DiagnosticCategory.Error)
        hasErrors = true;
    }
    if (hasErrors) return null;

    compiler.diagnostics = typescript.createDiagnosticCollection();

    if (!silent)
      compiler.profiler.start("compile");
    compiler.compile();
    if (!silent)
      (console.error || console.log)("compilation took " + compiler.profiler.end("compile").toFixed(3) + " ms\n");

    // bail out if there were compilation errors
    diagnostics = compiler.diagnostics.getDiagnostics();
    for (let i = 0, k = diagnostics.length; i < k; ++i) {
      Compiler.lastDiagnostics.push(diagnostics[i]);
      if (diagnostics[i].category === typescript.DiagnosticCategory.Error)
        hasErrors = true;
    }
    if (hasErrors) return null;

    return compiler.module;
  }

  /** Gets the configured byte size of a pointer. `4` when compiling for 32-bit WebAssembly, `8` when compiling for 64-bit WebAssembly. */
  get uintptrSize(): number { return this.uintptrType.size; }

  /**
   * Constructs a new AssemblyScript compiler.
   * @param program TypeScript program
   * @param options Compiler options
   */
  constructor(program: typescript.Program, options?: CompilerOptions) {
    this.options = options || {};
    this.program = program;
    this.checker = program.getDiagnosticsProducingTypeChecker();
    this.diagnostics = typescript.createDiagnosticCollection();

    if (typeof this.options.target === "string") {
      if (this.options.target.toLowerCase() === "wasm64")
        this.target = CompilerTarget.WASM64;
      else
        this.target = CompilerTarget.WASM32;
    } else if (typeof this.options.target === "number" && CompilerTarget[this.options.target])
      this.target = this.options.target;
    else
      this.target = CompilerTarget.WASM32;

    if (typeof this.options.memoryModel === "string") {
      const memoryModelLower = this.options.memoryModel.toLowerCase().replace(/_/g, "");
      if (memoryModelLower === "exportmalloc")
        this.memoryModel = CompilerMemoryModel.EXPORT_MALLOC;
      else if (memoryModelLower === "importmalloc")
        this.memoryModel = CompilerMemoryModel.IMPORT_MALLOC;
      else if (memoryModelLower === "bare")
        this.memoryModel = CompilerMemoryModel.BARE;
      else
        this.memoryModel = CompilerMemoryModel.MALLOC;
    } else if (typeof this.options.memoryModel === "number" && CompilerMemoryModel[this.options.memoryModel])
      this.memoryModel = this.options.memoryModel;
    else
      this.memoryModel = CompilerMemoryModel.MALLOC;

    if (
      this.memoryModel === CompilerMemoryModel.MALLOC ||
      this.memoryModel === CompilerMemoryModel.EXPORT_MALLOC
    ) {
      if (!mallocWasm)
        base64.decode(library.malloc, mallocWasm = new Uint8Array(base64.length(library.malloc)), 0);
      this.module = binaryen.readBinary(mallocWasm);
    } else
      this.module = new binaryen.Module();

    this.uintptrType = this.target === CompilerTarget.WASM64 ? reflection.uintptrType64 : reflection.uintptrType32;
    this.memoryBase = this.uintptrSize; // leave space for NULL

    const sourceFiles = program.getSourceFiles();
    for (let i = sourceFiles.length - 1; i >= 0; --i) {

      // the first declaration file is assumed to be the library file
      if (sourceFiles[i].isDeclarationFile)
          this.libraryFile = sourceFiles[i];

      // the last non-declaration file is assumed to be the entry file
      else if (!this.entryFile)
        this.entryFile = sourceFiles[i];
    }
  }

  /** Adds an informative diagnostic to {@link Compiler#diagnostics} and prints it. */
  info(node: typescript.Node, message: string, arg1?: string): void {
    const diagnostic = typescript.createDiagnosticForNode(node, typescript.DiagnosticCategory.Message, message, arg1);
    this.diagnostics.add(diagnostic);
    if (!(this.options && this.options.silent))
      typescript.printDiagnostic(diagnostic);
  }

  /** Adds a warning diagnostic to {@link Compiler#diagnostics} and prints it. */
  warn(node: typescript.Node, message: string, arg1?: string): void {
    const diagnostic = typescript.createDiagnosticForNode(node, typescript.DiagnosticCategory.Warning, message, arg1);
    this.diagnostics.add(diagnostic);
    if (!(this.options && this.options.silent))
      typescript.printDiagnostic(diagnostic);
  }

  /** Adds an error diagnostic to {@link Compiler#diagnostics} and prints it. */
  error(node: typescript.Node, message: string, arg1?: string): void {
    const diagnostic = typescript.createDiagnosticForNode(node, typescript.DiagnosticCategory.Error, message, arg1);
    this.diagnostics.add(diagnostic);
    if (!(this.options && this.options.silent))
      typescript.printDiagnostic(diagnostic);
  }

  /** Mangles a global name (of a function, a class, ...) for use with binaryen. */
  mangleGlobalName(name: string, sourceFile: typescript.SourceFile) {
    if (sourceFile === this.libraryFile) {
      name = "assembly.d.ts/" + name;
    } else if (sourceFile !== this.entryFile) {
      name = sourceFile.fileName
      .replace(/\\/g, "/")
      .replace(/[^a-zA-Z0-9\.\/$]/g, "") + "/" + name;
    }
    return name;
  }

  /** Scans over the sources and initializes the reflection structure. */
  initialize(): void {
    const sourceFiles = this.program.getSourceFiles();

    for (let i = 0, k = sourceFiles.length, file; i < k; ++i) {
      file = sourceFiles[i];

      for (let j = 0, l = file.statements.length, statement; j < l; ++j) {
        switch ((statement = file.statements[j]).kind) {

          case typescript.SyntaxKind.EndOfFileToken:
          case typescript.SyntaxKind.InterfaceDeclaration:
          case typescript.SyntaxKind.TypeAliasDeclaration:
          case typescript.SyntaxKind.ImportDeclaration:
            break; // already handled by TypeScript

          case typescript.SyntaxKind.VariableStatement:
            this.initializeGlobal(<typescript.VariableStatement>statement);
            break;

          case typescript.SyntaxKind.FunctionDeclaration:
            this.initializeFunction(<typescript.FunctionDeclaration>statement);
            break;

          case typescript.SyntaxKind.ClassDeclaration:
            this.initializeClass(<typescript.ClassDeclaration>statement);
            break;

          case typescript.SyntaxKind.EnumDeclaration:
            this.initializeEnum(<typescript.EnumDeclaration>statement);
            break;

          default:
            this.error(statement, "Unsupported top-level statement"/*, typescript.SyntaxKind[statement.kind]*/);
            break;
        }
      }
    }

    if (
      this.memoryModel === CompilerMemoryModel.MALLOC ||
      this.memoryModel === CompilerMemoryModel.EXPORT_MALLOC ||
      this.memoryModel === CompilerMemoryModel.IMPORT_MALLOC
    ) {
      this.initializeMalloc();
    }
  }

  /** Gets an existing signature if it exists and otherwise creates it. */
  getOrAddSignature(argumentTypes: reflection.Type[], returnType: reflection.Type): binaryen.Signature {
    const identifiers: string[] = [];
    argumentTypes.forEach(type => identifiers.push(binaryen.identifierOf(type, this.uintptrSize)));
    identifiers.push(binaryen.identifierOf(returnType, this.uintptrSize));
    const identifier = identifiers.join("");
    let signature = this.signatures[identifier];
    if (!signature) {
      const binaryenArgumentTypes: binaryen.Type[] = argumentTypes.map(type => binaryen.typeOf(type, this.uintptrSize));
      const binaryenReturnType = binaryen.typeOf(returnType, this.uintptrSize);
      signature = this.signatures[identifier] = this.module.getFunctionTypeBySignature(binaryenReturnType, binaryenArgumentTypes)
        || this.module.addFunctionType(identifier, binaryenReturnType, binaryenArgumentTypes);
    }
    return signature;
  }

  /** Initializes the statically linked or imported malloc implementation. */
  initializeMalloc(): void {
    const op = this.module;
    const binaryenPtrType = binaryen.typeOf(this.uintptrType, this.uintptrSize);

    // these are required in any case
    const mallocSignature = this.getOrAddSignature([this.uintptrType], this.uintptrType); // void *malloc(size_t)
    const freeSignature   = this.getOrAddSignature([this.uintptrType], reflection.voidType); // void free(void *)
    const memsetSignature = this.getOrAddSignature([this.uintptrType, reflection.intType, this.uintptrType], this.uintptrType); // void *memset(void *, int, size_t)
    const memcpySignature = this.getOrAddSignature([this.uintptrType, this.uintptrType, this.uintptrType], this.uintptrType); // void *memcpy(void *, void *, size_t)
    const memcmpSignature = this.getOrAddSignature([this.uintptrType, this.uintptrType, this.uintptrType], reflection.intType); // void *memcmp(void *, void *, size_t)

    if (this.memoryModel === CompilerMemoryModel.IMPORT_MALLOC) {

      const initSignature = this.getOrAddSignature([this.uintptrType], reflection.voidType); // void init(void *)

      op.addImport("malloc_init", "env", "malloc_init", initSignature);
      op.addImport("malloc", "env", "malloc", mallocSignature);
      op.addImport("free", "env", "free", freeSignature);
      op.addImport("memcpy", "env", "memcpy", memcpySignature);
      op.addImport("memset", "env", "memset", memsetSignature);
      op.addImport("memcmp", "env", "memcmp", memcmpSignature);

    } else {

      // initialize mspace'd malloc on start and remember the mspace within `.msp`:
      op.addGlobal(".msp", binaryenPtrType, true, binaryen.valueOf(this.uintptrType, op, 0));
      this.globalInitializers.unshift( // must be initialized before other global initializers use 'new'
        op.setGlobal(".msp", op.call("mspace_init", [
          binaryen.valueOf(this.uintptrType, op, this.uintptrSize) // Leave space for null
        ], binaryenPtrType))
      );

      // now, instead of exposing mspace'd functions ...
      this.module.removeExport("mspace_init");
      this.module.removeExport("mspace_malloc");
      this.module.removeExport("mspace_free");

      // ... wrap each in a non-mspace'd version
      this.module.addFunction("malloc", mallocSignature, [], op.block("", [
        op.return(
          op.call("mspace_malloc", [ op.getGlobal(".msp", binaryenPtrType), op.getLocal(0, binaryenPtrType) ], binaryenPtrType)
        )
      ]));
      this.module.addFunction("free", freeSignature, [], op.block("", [
        op.call("mspace_free", [ op.getGlobal(".msp", binaryenPtrType), op.getLocal(0, binaryenPtrType) ], binaryen.none)
      ]));

      if (this.memoryModel === CompilerMemoryModel.MALLOC) {

        this.module.removeExport("memset");
        this.module.removeExport("memcpy");
        this.module.removeExport("memcmp");

      } else /* CompilerMemoryModel.MALLOC_EXPORT */ {

        this.module.addExport("malloc", "malloc");
        this.module.addExport("free", "free");
      }
    }
  }

  /** Initializes a global variable. */
  initializeGlobal(node: typescript.VariableStatement): void {
    for (let i = 0, k = node.declarationList.declarations.length; i < k; ++i) {
      const declaration = node.declarationList.declarations[i];
      const initializerNode = declaration.initializer;

      if (declaration.type && declaration.symbol) {
        const name = this.mangleGlobalName(declaration.symbol.name, typescript.getSourceFileOfNode(declaration));
        const type = this.resolveType(declaration.type);

        if (type)
          this.addGlobal(name, type, !typescript.isConst(node.declarationList), initializerNode);
        else
          this.error(declaration.type, "Unresolvable type");

      } else
        this.error(declaration.name, "Type expected");
    }
  }

  /** Adds a global variable. */
  addGlobal(name: string, type: reflection.Type, mutable: boolean, initializerNode?: typescript.Expression): void {
    const op = this.module;
    let flags: reflection.VariableFlags = reflection.VariableFlags.global;
    if (!mutable)
      flags |= reflection.VariableFlags.constant;

    const global = this.globals[name] = new reflection.Variable(name, type, flags, 0);

    if (initializerNode) {

      if (initializerNode.kind === typescript.SyntaxKind.NumericLiteral) {
        op.addGlobal(name, binaryen.typeOf(type, this.uintptrSize), mutable, expressions.compileLiteral(this, <typescript.LiteralExpression>initializerNode, type));

      } else if (mutable) {
        op.addGlobal(name, binaryen.typeOf(type, this.uintptrSize), mutable, binaryen.valueOf(type, op, 0));

        if (!this.startFunction)
          (this.startFunction = new reflection.Function(".start", <typescript.FunctionLikeDeclaration>{}, {}, [], reflection.voidType))
            .initialize(this);

        const previousFunction = this.currentFunction;
        this.currentFunction = this.startFunction;

        this.globalInitializers.push(
          op.setGlobal(name,
            this.maybeConvertValue(
              initializerNode,
              this.compileExpression(initializerNode, type),
              typescript.getReflectedType(initializerNode), type, false
            )
          )
        );

        this.currentFunction = previousFunction;
      } else
        this.error(initializerNode, "Unsupported global constant initializer");

    } else {
      let value: number = 0;
      switch (name) {
        case "assembly.d.ts/NaN":
        case "assembly.d.ts/NaNf":
          value = NaN;
          break;
        case "assembly.d.ts/Infinity":
        case "assembly.d.ts/Infinityf":
          value = Infinity;
          break;
      }
      if (global.isConstant) // enable inlining so these globals can be eliminated by the optimizer
        global.value = value;
      op.addGlobal(name, binaryen.typeOf(type, this.uintptrSize), mutable, binaryen.valueOf(type, op, value));
    }
  }

  /** Creates or, if it already exists, looks up a static string and returns its offset in linear memory. */
  createStaticString(value: string): number {
    let pooled = this.stringPool[value];
    if (!pooled) {
      if (this.memoryBase & 3) this.memoryBase = (this.memoryBase | 3) + 1; // align to 4 bytes (length is an int)
      const length = value.length;
      const buffer = new Uint8Array(4 + 2 * length);
      if (length < 0 || length > 0x7fffffff)
        throw Error("string length exceeds INTMAX");

      // Prepend length
      let offset = 0;
      buffer[offset++] =  length         & 0xff;
      buffer[offset++] = (length >>>  8) & 0xff;
      buffer[offset++] = (length >>> 16) & 0xff;
      buffer[offset++] = (length >>> 24) & 0xff;

      // Append UTF-16LE chars
      for (let i = 0; i < length; ++i) {
        const charCode = value.charCodeAt(i);
        buffer[offset++] =  charCode        & 0xff;
        buffer[offset++] = (charCode >>> 8) & 0xff;
      }

      const memorySegment = <CompilerMemorySegment>{
        offset: this.memoryBase,
        buffer: buffer
      };
      this.memorySegments.push(memorySegment);

      pooled = this.stringPool[value] = memorySegment;
      this.memoryBase += offset;
    }
    return pooled.offset;
  }

  /** Initializes a function or class method. */
  initializeFunction(node: typescript.FunctionLikeDeclaration): { template: reflection.FunctionTemplate, instance?: reflection.Function } {
    let name: string;
    let parent: reflection.Class | undefined;
    if (node.kind === typescript.SyntaxKind.FunctionDeclaration) {
      name = this.mangleGlobalName(typescript.getTextOfNode(<typescript.Identifier>node.name), typescript.getSourceFileOfNode(node));
    } else {
      parent = typescript.getReflectedClass(<typescript.ClassDeclaration>node.parent);
      if (node.kind === typescript.SyntaxKind.Constructor)
        name = parent.name;
      else if (typescript.isStatic(node))
        name = parent.name + "." + typescript.getTextOfNode(<typescript.Identifier>node.name);
      else
        name = parent.name + "#" + typescript.getTextOfNode(<typescript.Identifier>node.name);
    }

    let template = this.functionTemplates[name];
    let instance: reflection.Function | undefined;
    if (!template) { // not already initialized
      template = this.functionTemplates[name] = new reflection.FunctionTemplate(name, node);
      if (template.isGeneric) {
        if (builtins.isBuiltin(name)) // generic builtins evaluate type parameters dynamically and have a known return type
          typescript.setReflectedFunction(node, new reflection.Function(name, node, {}, [], this.resolveType(<typescript.TypeNode>template.declaration.type, true)));
      } else {
        instance = this.functions[name] = template.resolve(this, [], parent);
        instance.initialize(this);
      }
    }
    return { template, instance };
  }

  /** Initializes a class. */
  initializeClass(node: typescript.ClassDeclaration): void {
    const simpleName = typescript.getTextOfNode(<typescript.Identifier>node.name);
    const name = this.mangleGlobalName(simpleName, typescript.getSourceFileOfNode(node));

    if (this.classTemplates[name])
      return; // already initialized

    const sourceFile = typescript.getSourceFileOfNode(node);

    if (sourceFile === this.entryFile && typescript.isExport(node))
      this.warn(<typescript.Identifier>node.name, "Exporting entire classes is not supported yet");

    let base: reflection.ClassTemplate | undefined;
    let baseTypeArguments: typescript.TypeNode[] | undefined;
    if (node.heritageClauses) {
      for (let i = 0, k = node.heritageClauses.length; i < k; ++i) {
        const clause = node.heritageClauses[i];
        if (clause.token === typescript.SyntaxKind.ExtendsKeyword) {
          const extendsNode = clause.types[0];
          if (extendsNode.expression.kind === typescript.SyntaxKind.Identifier) {
            const reference = this.resolveReference(<typescript.Identifier>extendsNode.expression, true);
            if (reference instanceof reflection.ClassTemplate) {
              base = reference;
              baseTypeArguments = extendsNode.typeArguments || [];
            } else
              this.error(clause, "No such base class");
          } else
            this.error(clause, "Unsupported extension");
        } else if (clause.token === typescript.SyntaxKind.ImplementsKeyword) {
          // TODO
        } else
          this.error(clause, "Unsupported extension");
      }
    }

    const template = this.classTemplates[name] = new reflection.ClassTemplate(name, node, base, baseTypeArguments);
    let instance: reflection.Class | undefined;
    if (!template.isGeneric) {
      instance = this.classes[name] = template.resolve(this, []);
      instance.initialize(this);
    }

    // Remember that this is a declaration that needs to be implemented. The way this works is by
    // patching in the first class matching this declaration's name as the super class later on.
    if (sourceFile === this.libraryFile)
      this.pendingImplementations[simpleName] = template;

    // Replace the declaration with the implementation later on
    else if (this.pendingImplementations[simpleName])
      reflection.patchClassImplementation(this, this.pendingImplementations[simpleName], template);
  }

  /** Initializes an enum. */
  initializeEnum(node: typescript.EnumDeclaration): void {
    const name = this.mangleGlobalName(typescript.getTextOfNode(node.name), typescript.getSourceFileOfNode(node));

    if (this.enums[name])
      return; // already initialized

    if (typescript.getSourceFileOfNode(node) === this.entryFile && typescript.isExport(node))
      this.warn(node.name, "Exporting enums is not supported yet");

    const instance = this.enums[name] = new reflection.Enum(name, node);
    instance.initialize(this);
  }

  /** Compiles the module and its components. */
  compile(): void {

    const sourceFiles = this.program.getSourceFiles();
    for (let i = 0, k = sourceFiles.length; i < k; ++i) {

      if (sourceFiles[i].isDeclarationFile)
        continue;

      const statements = sourceFiles[i].statements;
      for (let j = 0, l = statements.length, statement; j < l; ++j) {
        switch ((statement = statements[j]).kind) {

          case typescript.SyntaxKind.FunctionDeclaration:
          {
            const declaration = <typescript.FunctionDeclaration>statement;
            if (typescript.isExport(declaration) || typescript.isStartFunction(declaration) || this.options.treeShaking === false) {
              const instance = typescript.getReflectedFunction(declaration);
              if (instance) // otherwise generic: compiled once type arguments are known
                this.compileFunction(instance);
            }
            break;
          }

          case typescript.SyntaxKind.ClassDeclaration:
          {
            const declaration = <typescript.ClassDeclaration>statement;
            const instance = typescript.getReflectedClass(declaration);
            if (instance) // otherwise generic: compiled once type arguments are known
              this.compileClass(instance);
            break;
          }

          // otherwise already handled or reported by initialize
        }
      }
    }

    // setup static memory
    const binaryenSegments: binaryen.MemorySegment[] = [];
    this.memorySegments.forEach(segment => {
      binaryenSegments.push({
        offset: binaryen.valueOf(reflection.uintType, this.module, segment.offset),
        data: segment.buffer
      });
    });
    if (this.memoryBase & 7) this.memoryBase = (this.memoryBase | 7) + 1; // align to 8 bytes
    const initialSize = Math.floor((this.memoryBase - 1) / 65536) + 1;
    this.module.setMemory(initialSize, 0xffff, undefined, binaryenSegments);

    // compile start function (initializes malloc mspaces)
    this.maybeCompileStartFunction();
  }

  /** Compiles the start function if either a user-provided start function is or global initializes are present. */
  maybeCompileStartFunction(): void {

    // just use the user start function, if declared, if there is no other initialization to perform
    if (this.globalInitializers.length === 0 && !(this.memoryModel === CompilerMemoryModel.IMPORT_MALLOC)) {
      if (this.userStartFunction)
        this.module.setStart(this.userStartFunction);
      return;
    }

    const op = this.module;

    // if malloc is bundled, override malloc initializer with actual static offset
    if (
      this.memoryModel === CompilerMemoryModel.MALLOC ||
      this.memoryModel === CompilerMemoryModel.EXPORT_MALLOC
    ) {
      this.globalInitializers[0] = op.setGlobal(".msp", op.call("mspace_init", [
        binaryen.valueOf(this.uintptrType, op, this.memoryBase) // memoryBase is aligned at this point
      ], binaryen.typeOf(this.uintptrType, this.uintptrSize)));
    }

    // create a blank start function if there isn't one yet
    if (!this.startFunction)
      (this.startFunction = new reflection.Function(".start", <typescript.FunctionLikeDeclaration>{}, {}, [], reflection.voidType))
        .initialize(this);
    const previousFunction = this.currentFunction;
    this.currentFunction = this.startFunction;

    const body: binaryen.Statement[] = [];

    // first of all, call imported malloc_init with memoryBase if applicable
    if (
      this.memoryModel === CompilerMemoryModel.IMPORT_MALLOC
    ) {
      body.push(op.call("malloc_init", [
        binaryen.valueOf(this.uintptrType, op, this.memoryBase)
      ], binaryen.none));
    }

    // include global initializes
    let i = 0;
    for (const k = this.globalInitializers.length; i < k; ++i)
      body.push(this.globalInitializers[i]); // usually a setGlobal

    // call the user's start function, if applicable
    if (this.userStartFunction)
      body.push(op.call("start", [], binaryen.none));

    // make sure to check for additional locals
    const additionalLocals: binaryen.Type[] = [];
    for (i = 0; i < this.startFunction.locals.length; ++i)
      additionalLocals.push(binaryen.typeOf(this.startFunction.locals[i].type, this.uintptrSize));

    // and finally add the function
    const startSignature = this.getOrAddSignature([], reflection.voidType);
    this.module.setStart(
      this.module.addFunction(this.startFunction.name, startSignature, additionalLocals, op.block("", body))
    );

    this.currentFunction = previousFunction;
  }

  /** Splits an import name possibly separated with a `$` character to a module name and a name. Defaults to `env` as the module name. */
  static splitImportName(name: string): { moduleName: string, name: string } {
    let moduleName;
    const idx = name.indexOf("$");
    if (idx > 0) {
      moduleName = name.substring(0, idx);
      name = name.substring(idx + 1);
    } else
      moduleName = "env";
    return {
      moduleName,
      name
    };
  }

  /** Compiles a function. */
  compileFunction(instance: reflection.Function): binaryen.Function | null {
    const op = this.module;

    // Handle imports
    if (instance.isImport) {
      const importName = Compiler.splitImportName(instance.simpleName);
      this.module.addImport(instance.name, importName.moduleName, importName.name, instance.binaryenSignature);
      instance.imported = true;
      return null;
    }

    // Otherwise compile
    if (!instance.body)
      throw Error("cannot compile a function without a body: " + instance.name);

    instance.compiled = true;

    const body: binaryen.Statement[] = [];
    const previousFunction = this.currentFunction;
    this.currentFunction = instance;
    const initialLocalsIndex = instance.locals.length;

    for (let i = 1; i < instance.parameters.length; ++i) {
      const param = instance.parameters[i];
      if (param.isAlsoProperty) {
        const property = (<reflection.Class>instance.parent).properties[param.name];
        if (property)
          body.push(
            compileStore(this, /* solely used for diagnostics anyway */ <typescript.Expression>param.node, property.type, op.getLocal(0, binaryen.typeOf(this.uintptrType, this.uintptrSize)), op.getLocal(i + 1, binaryen.typeOf(param.type, this.uintptrSize)), property.offset)
          );
        else
          this.error(param.node, "Property initializer parameter without a property");
      }
    }

    if (instance.body.kind === typescript.SyntaxKind.Block) {
      const blockNode = <typescript.Block>instance.body;
      for (let i = 0, k = blockNode.statements.length; i < k; ++i) {
        const statementNode = blockNode.statements[i];
        body.push(this.compileStatement(statementNode));
      }
    } else {
      const expressionNode = <typescript.Expression>instance.body;
      body.push(op.return(
        this.compileExpression(expressionNode, instance.returnType)
      ));
    }

    if (instance.isConstructor) // Constructors return 'this' internally
      body.push(op.return(op.getLocal(0, binaryen.typeOf(this.uintptrType, this.uintptrSize))));

    const additionalLocals = instance.locals.slice(initialLocalsIndex).map(local => binaryen.typeOf(local.type, this.uintptrSize));
    const binaryenFunction = instance.binaryenFunction = this.module.addFunction(instance.name, instance.binaryenSignature, additionalLocals, op.block("", body));

    if (instance.isExport)
      this.module.addExport(instance.name, instance.name);

    if (!instance.parent && instance.body && typescript.isStartFunction(instance.declaration)) {
      if (this.userStartFunction)
        this.error(<typescript.Identifier>instance.declaration.name, "Duplicate start function");
      else
        this.userStartFunction = binaryenFunction;
    }

    this.currentFunction = previousFunction;
    return binaryenFunction;
  }

  /** Compiles a class. */
  compileClass(instance: reflection.Class): void {
    for (let i = 0, k = instance.declaration.members.length; i < k; ++i) {
      const member = instance.declaration.members[i];
      switch (member.kind) {

        case typescript.SyntaxKind.Constructor:
        case typescript.SyntaxKind.MethodDeclaration:
        {
          const methodDeclaration = <typescript.ConstructorDeclaration | typescript.MethodDeclaration>member;
          if (typescript.isExport(methodDeclaration) || this.options.treeShaking === false) {
            const functionInstance = typescript.getReflectedFunction(methodDeclaration);
            if (functionInstance) // otherwise generic: compiled once type arguments are known
              this.compileFunction(functionInstance);
          }
          break;
        }

        // otherwise already reported by initialize
      }
    }
  }

  /** Amends the current break context when entering a loop, switch or similar. */
  enterBreakContext(): string {
    if (this.currentFunction.breakDepth === 0)
      ++this.currentFunction.breakNumber;
    ++this.currentFunction.breakDepth;
    return this.currentFunction.breakLabel;
  }

  /** Amends the current break context when leaving a loop, switch or similar. */
  leaveBreakContext(): void {
    if (this.currentFunction.breakDepth < 1)
      throw Error("unbalanced break context");
    --this.currentFunction.breakDepth;
  }

  /** Textual break label according to the current break context state. */
  get currentBreakLabel(): string { return this.currentFunction.breakLabel; }

  /** Compiles a statement. */
  compileStatement(node: typescript.Statement): binaryen.Statement {
    return statements.compile(this, node);
  }

  /** Compiles an expression. */
  compileExpression(node: typescript.Expression, contextualType: reflection.Type): binaryen.Expression {
    return expressions.compile(this, node, contextualType);
  }

  /** Wraps an expression with a conversion where necessary. */
  maybeConvertValue(node: typescript.Expression, expr: binaryen.Expression, fromType: reflection.Type, toType: reflection.Type, explicit: boolean): binaryen.Expression {
    if (fromType.kind === toType.kind)
      return expr;

    const compiler = this;
    const op = this.module;

    function illegalImplicitConversion() {
      compiler.error(node, "Illegal implicit conversion", "'" + fromType + "' to '" + toType + "'");
      explicit = true; // report this only once for the topmost node
    }

    if (!explicit) {

      if (this.uintptrSize === 4 && fromType.kind === reflection.TypeKind.uintptr && toType.isInt)
        this.warn(node, "Non-portable conversion", "Implicit conversion from 'uintptr' to 'uint' will fail when targeting WASM64");

      if (this.uintptrSize === 8 && fromType.isLong && toType.kind === reflection.TypeKind.uintptr)
        this.warn(node, "Non-portable conversion", "Implicit conversion from 'ulong' to 'uintptr' will fail when targeting WASM32");
    }

    typescript.setReflectedType(node, toType);

    if (fromType === reflection.floatType) {

      if (!explicit && toType !== reflection.doubleType)
        illegalImplicitConversion();

      switch (toType) {

        case reflection.byteType:
        case reflection.ushortType:
        case reflection.uintType:
        case reflection.uintptrType32:
        case reflection.boolType:
          return this.maybeConvertValue(node, op.i32.trunc_u.f32(expr), reflection.intType, toType, explicit);

        case reflection.sbyteType:
        case reflection.shortType:
        case reflection.intType:
          return this.maybeConvertValue(node, op.i32.trunc_s.f32(expr), reflection.intType, toType, explicit);

        case reflection.uintptrType64:
        case reflection.ulongType:
          return op.i64.trunc_u.f32(expr);

        case reflection.longType:
          return op.i64.trunc_s.f32(expr);

        // floatType == floatType

        case reflection.doubleType:
          return op.f64.promote(expr);

      }

    } else if (fromType === reflection.doubleType) {

      if (!explicit) illegalImplicitConversion();

      switch (toType) {

        case reflection.byteType:
        case reflection.ushortType:
        case reflection.uintType:
        case reflection.uintptrType32:
        case reflection.boolType:
          return this.maybeConvertValue(node, op.i32.trunc_u.f64(expr), reflection.intType, toType, explicit);

        case reflection.sbyteType:
        case reflection.shortType:
        case reflection.intType:
          return this.maybeConvertValue(node, op.i32.trunc_s.f64(expr), reflection.intType, toType, explicit);

        case reflection.ulongType:
        case reflection.uintptrType64:
          return op.i64.trunc_u.f64(expr);

        case reflection.longType:
          return op.i64.trunc_s.f64(expr);

        case reflection.floatType:
          return op.f32.demote(expr);

        // doubleType == doubleType

      }

    } else if (toType === reflection.floatType) { // int to float

      switch (fromType) {

        case reflection.uintType:
        case reflection.uintptrType32:
          if (!explicit) illegalImplicitConversion();

        case reflection.byteType:
        case reflection.ushortType:
        case reflection.boolType:
          return op.f32.convert_u.i32(expr);

        case reflection.intType:
          if (!explicit) illegalImplicitConversion();

        case reflection.sbyteType:
        case reflection.shortType:
          return op.f32.convert_s.i32(expr);

        case reflection.ulongType:
        case reflection.uintptrType64:
          if (!explicit) illegalImplicitConversion();
          return op.f32.convert_u.i64(expr);

        case reflection.longType:
          if (!explicit) illegalImplicitConversion();
          return op.f32.convert_s.i64(expr);

      }

    } else if (toType === reflection.doubleType) { // int to double

      switch (fromType) {

        case reflection.uintType:
        case reflection.uintptrType32:
        case reflection.byteType:
        case reflection.ushortType:
        case reflection.boolType:
          return op.f64.convert_u.i32(expr);

        case reflection.intType:
        case reflection.sbyteType:
        case reflection.shortType:
          return op.f64.convert_s.i32(expr);

        case reflection.ulongType:
        case reflection.uintptrType64:
          if (!explicit) illegalImplicitConversion();
          return op.f64.convert_u.i64(expr);

        case reflection.longType:
          if (!explicit) illegalImplicitConversion();
          return op.f64.convert_s.i64(expr);

      }

    } else if (fromType.isInt && toType.isLong) {

      if (toType.isSigned)
        return op.i64.extend_s(expr);
      else
        return op.i64.extend_u(expr);

    } else if (fromType.isLong && toType.isInt) {

      if (!explicit) illegalImplicitConversion();

      expr = op.i32.wrap(expr);
      fromType = fromType.isSigned ? reflection.intType : reflection.uintType;

      // fallthrough
    }

    // int to other int

    if (fromType.size < toType.size || toType.isInt)
      return expr;

    if (!explicit) illegalImplicitConversion();

    if (toType.isSigned) { // sign-extend

      return op.i32.shr_s(
        op.i32.shl(
          expr,
          op.i32.const(<number>toType.shift32)
        ),
        op.i32.const(<number>toType.shift32)
      );

    } else { // mask

      return op.i32.and(
        expr,
        op.i32.const(<number>toType.mask32)
      );

    }
  }

  /** Resolves a TypeScript type alias to the root AssemblyScript type where applicable, by symbol. */
  maybeResolveAlias(symbol: typescript.Symbol): typescript.Symbol {

    // Exit early (before hitting 'number') if it's a built in type
    switch (symbol.name) {
      case "byte":
      case "sbyte":
      case "short":
      case "ushort":
      case "int":
      case "uint":
      case "long":
      case "ulong":
      case "bool":
      case "float":
      case "double":
      case "uintptr":
      case "string":
        return symbol;
    }

    // Otherwise follow any aliases to the original type
    if (symbol.declarations)
      for (let i = 0, k = symbol.declarations.length; i < k; ++i) {
        const declaration = symbol.declarations[i];
        if (declaration.kind === typescript.SyntaxKind.TypeAliasDeclaration) {
          const aliasDeclaration = <typescript.TypeAliasDeclaration>declaration;
          if (aliasDeclaration.type.kind === typescript.SyntaxKind.TypeReference) {
            const symbolAtLocation = this.checker.getSymbolAtLocation((<typescript.TypeReferenceNode>aliasDeclaration.type).typeName);
            if (symbolAtLocation)
              return this.maybeResolveAlias(symbolAtLocation);
          }
        }
      }

    return symbol;
  }

  /** Resolves a TypeScript type to a AssemblyScript type. */
  resolveType(type: typescript.TypeNode, acceptVoid: boolean = false): reflection.Type {

    switch (type.kind) {

      case typescript.SyntaxKind.VoidKeyword:
        if (!acceptVoid)
          this.error(type, "Illegal type", "void");
        return reflection.voidType;

      case typescript.SyntaxKind.BooleanKeyword:
        this.warn(type, "Assuming 'bool'");
        return reflection.boolType;

      case typescript.SyntaxKind.NumberKeyword:
        this.warn(type, "Assuming 'double'");
        return reflection.doubleType;

      case typescript.SyntaxKind.TypeReference:
      {
        const referenceNode = <typescript.TypeReferenceNode>type;
        const symbolAtLocation = this.checker.getSymbolAtLocation(referenceNode.typeName);
        if (symbolAtLocation) {
          const symbol = this.maybeResolveAlias(symbolAtLocation);
          if (symbol) {

            // Exit early if it's a basic type
            switch (symbol.name) {
              case "byte": return reflection.byteType;
              case "sbyte": return reflection.sbyteType;
              case "short": return reflection.shortType;
              case "ushort": return reflection.ushortType;
              case "int": return reflection.intType;
              case "uint": return reflection.uintType;
              case "long": return reflection.longType;
              case "ulong": return reflection.ulongType;
              case "bool": return reflection.boolType;
              case "float": return reflection.floatType;
              case "double": return reflection.doubleType;
              case "uintptr": return this.uintptrType;
              case "string": return this.classes["assembly.d.ts/String"].type;
            }

            const reference = this.resolveReference(referenceNode.typeName);

            if (reference instanceof reflection.Class)
              return (<reflection.Class>reference).type;

            if (reference instanceof reflection.ClassTemplate && referenceNode.typeArguments) {
              const template = <reflection.ClassTemplate>reference;
              const instance = template.resolve(this, referenceNode.typeArguments);
              if (!this.classes[instance.name]) {
                this.classes[instance.name] = instance;
                instance.initialize(this);
              }
              return instance.type;
            }
          }
        }
        break;
      }

      case typescript.SyntaxKind.StringKeyword:
        return this.classes["assembly.d.ts/String"].type;

      case typescript.SyntaxKind.ArrayType:
      {
        const arrayTypeNode = <typescript.ArrayTypeNode>type;
        const template = this.classTemplates["assembly.d.ts/Array"];
        const instance = template.resolve(this, [ arrayTypeNode.elementType ]);
        if (!this.classes[instance.name]) {
          this.classes[instance.name] = instance;
          instance.initialize(this);
        }
        return instance.type;
      }
    }

    this.error(type, "Unsupported type");
    return reflection.voidType;
  }

  /** Resolves an identifier or name to the corresponding reflection object. */
  resolveReference(node: typescript.Identifier | typescript.EntityName, preferTemplate: boolean = false): reflection.Variable | reflection.Enum | reflection.Class | reflection.ClassTemplate | null {

    // Locals including 'this'
    const localName = typescript.getTextOfNode(node);
    if (this.currentFunction && this.currentFunction.localsByName[localName])
      return this.currentFunction.localsByName[localName];

    // Globals
    const symbol = this.checker.getSymbolAtLocation(node);
    if (symbol && symbol.declarations) { // Determine declaration site

      for (let i = 0, k = symbol.declarations.length; i < k; ++i) {
        const declaration = symbol.declarations[i];
        const globalName = this.mangleGlobalName(symbol.name, typescript.getSourceFileOfNode(declaration));

        if (this.globals[globalName])
          return this.globals[globalName];

        if (this.enums[globalName])
          return this.enums[globalName];

        if (this.classes[globalName] && !preferTemplate)
          return this.classes[globalName];

        if (this.classTemplates[globalName])
          return this.classTemplates[globalName];
      }
    }
    return null;
  }
}

export { Compiler as default };
