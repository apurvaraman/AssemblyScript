/** @module assemblyscript/reflection */ /** */

import * as binaryen from "../binaryen";
import { Class, TypeArgument } from "./class";
import Compiler from "../compiler";
import { Type, voidType } from "./type";
import { Variable, VariableFlags } from "./variable";
import * as typescript from "../typescript";

/** Common base class of {@link Function} and {@link FunctionTemplate}. */
export abstract class FunctionBase {

  /** Global name. */
  name: string;
  /** Declaration reference. */
  declaration: typescript.FunctionLikeDeclaration;

  protected constructor(name: string, declaration: typescript.FunctionLikeDeclaration) {
    this.name = name;
    this.declaration = declaration;
  }

  /** Simple name. */
  get simpleName(): string { return typescript.getTextOfNode(<typescript.Identifier>this.declaration.name); }
  /** Tests if this function is imported (just a declaration). */
  get isImport(): boolean { return typescript.isDeclare(this.declaration); }
  /** Tests if this function is exported to the embedder. */
  get isExport(): boolean { return typescript.isExport(this.declaration); }
  /** Tests if this function is an instance member / not static. */
  get isInstance(): boolean { return !typescript.isStatic(this.declaration) && (this.declaration.kind === typescript.SyntaxKind.Constructor || this.declaration.kind === typescript.SyntaxKind.MethodDeclaration); }
  /** Tests if this function is the constructor of a class. */
  get isConstructor(): boolean { return this.declaration.kind === typescript.SyntaxKind.Constructor; }

  toString(): string { return this.name; }
}

/** Interface describing a reflected function parameter. */
export interface FunctionParameter {
  /** Simple name. */
  name: string;
  /** Resolved type. */
  type: Type;
  /** Parameter node reference. */
  node: typescript.Node;
  /** Whether this parameter also introduces a property (like when used with the `public` keyword). */
  isAlsoProperty?: boolean;
}

/** A function instance with generic parameters resolved. */
export class Function extends FunctionBase {

  /** Resolved type arguments. */
  typeArguments: { [key: string]: TypeArgument };
  /** Function parameters including `this`. */
  parameters: FunctionParameter[];
  /** Resolved return type. */
  returnType: Type;
  /** Parent class, if any. */
  parent?: Class;
  /** Body reference, if not just a declaration. */
  body?: typescript.Block | typescript.Expression;

  // Set on initialization

  /** Local variables. */
  locals: Variable[];
  /** Local variables by name for lookups. */
  localsByName: { [key: string]: Variable };
  /** Resolved binaryen parameter types. */
  binaryenParameterTypes: binaryen.Type[];
  /** Resolved binaryen return type. */
  binaryenReturnType: binaryen.Type;
  /** Binaryen signature id, for example "iiv". */
  binaryenSignatureId: string;
  /** Binaryen signature reference. */
  binaryenSignature: binaryen.Signature;

  // Set on compilation

  /** Whether this function has already been compiled. */
  compiled: boolean = false;
  /** Whether this function has been imported. */
  imported: boolean = false;
  /** Number of the current break context. */
  breakNumber: number = 0;
  /** Depth within the current break context. */
  breakDepth: number = 0;
  /** Binaryen function reference. */
  binaryenFunction: binaryen.Function;

  /** Constructs a new reflected function instance and binds it to its TypeScript declaration. */
  constructor(name: string, declaration: typescript.FunctionLikeDeclaration, typeArguments: { [key: string]: TypeArgument }, parameters: FunctionParameter[], returnType: Type, parent?: Class, body?: typescript.Block | typescript.Expression) {
    super(name, declaration);
    this.typeArguments = typeArguments;
    this.parameters = parameters;
    this.returnType = returnType;
    this.parent = parent;
    this.body = body;
    typescript.setReflectedFunction(declaration, this);
  }

  /** Gets the current break label for use with binaryen loops and blocks. */
  get breakLabel(): string { return this.breakNumber + "." + this.breakDepth; }

  /** Initializes this function. Does not compile it, yet. */
  initialize(compiler: Compiler): void {
    this.binaryenParameterTypes = [];
    this.locals = [];
    this.localsByName = {};
    const ids: string[] = [];

    for (let i = 0, k = this.parameters.length; i < k; ++i) {
      const variable = new Variable(this.parameters[i].name, this.parameters[i].type, VariableFlags.none, this.locals.length);
      this.binaryenParameterTypes.push(binaryen.typeOf(this.parameters[i].type, compiler.uintptrSize));
      this.locals.push(variable);
      this.localsByName[variable.name] = variable;
      ids.push(binaryen.identifierOf(this.parameters[i].type, compiler.uintptrSize));
    }

    this.binaryenReturnType = binaryen.typeOf(this.returnType, compiler.uintptrSize);
    ids.push(binaryen.identifierOf(this.returnType, compiler.uintptrSize));

    this.binaryenSignatureId = ids.join("");
    this.binaryenSignature = compiler.module.getFunctionTypeBySignature(this.binaryenReturnType, this.binaryenParameterTypes);
    if (!this.binaryenSignature)
      this.binaryenSignature = compiler.module.addFunctionType(this.binaryenSignatureId, this.binaryenReturnType, this.binaryenParameterTypes);
  }

  /** Introduces an additional local variable. */
  addLocal(name: string, type: Type): Variable {
    const variable = new Variable(name, type, VariableFlags.none, this.locals.length);
    this.locals.push(variable);
    this.localsByName[variable.name] = variable;
    return variable;
  }
}

export { Function as default };

/** A function template with possibly unresolved generic parameters. */
export class FunctionTemplate extends FunctionBase {

  /** Declaration reference. */
  declaration: typescript.FunctionLikeDeclaration;
  /** So far resolved instances by global name. */
  instances: { [key: string]: Function };

  /** Constructs a new reflected function template and binds it to its TypeScript declaration. */
  constructor(name: string, declaration: typescript.FunctionLikeDeclaration) {
    super(name, declaration);
    this.declaration = declaration;
    this.instances = {};
    typescript.setReflectedFunctionTemplate(declaration, this);
  }

  /** Tests if this function requires type arguments. */
  get isGeneric(): boolean { return !!(this.declaration.typeParameters && this.declaration.typeParameters.length); }

  /** Resolves this possibly generic function against the provided type arguments. */
  resolve(compiler: Compiler, typeArgumentNodes: typescript.TypeNode[], parent?: Class): Function {
    const typeParametersCount = this.declaration.typeParameters && this.declaration.typeParameters.length || 0;
    if (typeArgumentNodes.length !== typeParametersCount)
      throw Error("type parameter count mismatch");

    let name = this.name;

    const typeArguments: { [key: string]: TypeArgument } = {};

    // Inherit class type arguments
    if (parent)
      Object.keys(parent.typeArguments).forEach(key => typeArguments[key] = parent.typeArguments[key]);

    // Handle function type arguments
    if (typeParametersCount) {
      const typeNames: string[] = new Array(typeParametersCount);
      for (let i = 0; i < typeParametersCount; ++i) {
        const parameterDeclaration = (<typescript.NodeArray<typescript.TypeParameterDeclaration>>this.declaration.typeParameters)[i];
        const typeName = typescript.getTextOfNode(<typescript.Identifier>parameterDeclaration.name);
        const type = compiler.resolveType(typeArgumentNodes[i]);
        typeArguments[typeName] = {
          type: type,
          node: <typescript.TypeNode><any>parameterDeclaration
        };
        typeNames[i] = type.toString();
      }
      name += "<" + typeNames.join(",") + ">";
    }

    if (this.instances[name])
      return this.instances[name];

    // Resolve function parameters
    const parameters: FunctionParameter[] = new Array(this.declaration.parameters.length);
    for (let i = 0, k = this.declaration.parameters.length; i < k; ++i) {
      const parameter = this.declaration.parameters[i];
      const parameterTypeName = typescript.getTextOfNode(<typescript.TypeNode>parameter.type);
      parameters[i] = {
        node: parameter,
        name: typescript.getTextOfNode(parameter.name),
        type: parameter.type
          ? typeArguments[parameterTypeName] && typeArguments[parameterTypeName].type || compiler.resolveType(parameter.type)
          : voidType
      };
      if (!parameter.type && typescript.getSourceFileOfNode(this.declaration) !== compiler.libraryFile) // library may use 'any'
        compiler.error(parameter, "Type expected");
    }
    if (this.isInstance) {
      parameters.unshift({
        node: this.declaration,
        name: "this",
        type: compiler.uintptrType
      });
    }

    let returnType: Type;
    if (this.isConstructor)
      returnType = compiler.uintptrType;
    else if (this.declaration.type) {
      const returnTypeName = typescript.getTextOfNode(this.declaration.type);
      returnType = typeArguments[returnTypeName] && typeArguments[returnTypeName].type || compiler.resolveType(this.declaration.type, true);
    } else {
      returnType = voidType;
      if (typescript.getSourceFileOfNode(this.declaration) !== compiler.libraryFile) // library may use 'any'
        compiler.warn(<typescript.Identifier>this.declaration.name, "Assuming return type 'void'");
    }

    return this.instances[name] = new Function(name, this.declaration, typeArguments, parameters, returnType, parent, this.declaration.body);
  }
}
