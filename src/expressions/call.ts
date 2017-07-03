/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import * as builtins from "../builtins";
import { Compiler, CompilerMemoryModel } from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles a function call expression. */
export function compileCall(compiler: Compiler, node: typescript.CallExpression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  let declaration: typescript.FunctionLikeDeclaration;
  let thisArg: binaryen.Expression | undefined;

  // Try to resolve the signature of the node: works if it's a call to a global or static function
  const signature = compiler.checker.getResolvedSignature(node);
  if (signature && (declaration = <typescript.FunctionLikeDeclaration>signature.declaration)) {
    //                             ^ FunctionLikeDeclaration extends SignatureDeclaration

  // Instance method call consisting of thisExpression.methodName
  } else if (node.expression.kind === typescript.SyntaxKind.PropertyAccessExpression) {
    const accessNode = <typescript.PropertyAccessExpression>node.expression;
    const methodName = typescript.getTextOfNode(accessNode.name);
    thisArg = compiler.compileExpression(accessNode.expression, compiler.uintptrType);
    const classType = typescript.getReflectedType(accessNode.expression);
    let method: reflection.ClassMethod;
    if (!classType || !classType.underlyingClass || !(method = classType.underlyingClass.methods[methodName])) {
      compiler.error(node, "Unresolvable call target");
      return op.unreachable();
    }
    declaration = method.template.declaration;

  } else {
    compiler.error(node, "Unsupported call expression", "SyntaxKind " + node.expression.kind);
    return op.unreachable();
  }

  if (!declaration) {
    compiler.error(node, "Unresolvable call target");
    return op.unreachable();
  }

  // Initialize generic function from type arguments
  let instance = typescript.getReflectedFunction(declaration);
  if (!instance) {
    const template = typescript.getReflectedFunctionTemplate(declaration);
    if (template) {
      instance = template.resolve(compiler, node.typeArguments || []);
      instance.initialize(compiler);
      if (!template.isGeneric)
        typescript.setReflectedFunction(declaration, instance);
    } else {
      compiler.error(node, "Unresolvable call target", typescript.getTextOfNode(<typescript.Identifier>declaration.name));
      typescript.setReflectedType(node, contextualType);
      return op.unreachable();
    }
  }

  // Compile function if not yet compiled
  if (!instance.compiled && instance.body)
    compiler.compileFunction(instance); // sets instance.compiled = true

  let argumentCount = instance.parameters.length;
  const argumentExpressions: binaryen.Expression[] = new Array(argumentCount);

  typescript.setReflectedType(node, instance.returnType);

  let i = 0;

  if (instance.isInstance) {
    if (thisArg === undefined) {
      thisArg = op.getLocal(0, binaryen.typeOf(instance.parameters[0].type, compiler.uintptrSize));
      // thisArg = op.unreachable();
      // compiler.error(node, "Cannot call instance method as static method");
    }
    argumentExpressions[i++] = thisArg; // op.getLocal(0, binaryen.typeOf(instance.parameters[0].type, compiler.uintptrSize));
    argumentCount -= 1;
  } else if (thisArg !== undefined)
    compiler.error(node, "Cannot call static method as instance method");

  for (let j = 0; j < argumentCount; ++j) {
    const argumentNode = node.arguments[j];
    argumentExpressions[i] = compiler.maybeConvertValue(argumentNode, compiler.compileExpression(argumentNode, instance.parameters[i].type), typescript.getReflectedType(argumentNode), instance.parameters[i].type, false);
    ++i;
  }

  if (i !== argumentExpressions.length) { // TODO: pull default value initializers from declaration
    compiler.error(node, "Invalid number of arguments", "Expected " + declaration.parameters.length + " but saw " + node.arguments.length);
    return op.unreachable();
  }

  let typeArguments: reflection.Type[] = [];

  if (declaration.typeParameters) {
    if (!node.typeArguments || node.typeArguments.length !== declaration.typeParameters.length) {
      compiler.error(node, "Invalid number of type arguments");
      return op.unreachable();
    }
    i = 0;
    typeArguments = new Array(node.typeArguments.length);
    for (const k = declaration.typeParameters.length; i < k; ++i) {
      const argument = node.typeArguments[i];
      const argumentName = typescript.getTextOfNode(argument);
      const resolvedType = compiler.currentFunction && compiler.currentFunction.typeArguments[argumentName] && compiler.currentFunction.typeArguments[argumentName].type || compiler.resolveType(argument);
      if (!resolvedType) {
        compiler.error(node.typeArguments[i], "Unresolvable type");
        return op.unreachable();
      }
      // TODO: check if type is valid
      typeArguments[i] = resolvedType;
    }
  }

  // user function
  if (!typescript.isDeclare(declaration))
    return op.call(instance.name, argumentExpressions, binaryen.typeOf(instance.returnType, compiler.uintptrSize));

  // builtin
  switch (instance.simpleName) {

    case "rotl":
    case "rotll":
      return builtins.rotl(compiler, [ node.arguments[0], node.arguments[1] ], [ argumentExpressions[0], argumentExpressions[1] ]);

    case "rotr":
    case "rotrl":
      return builtins.rotr(compiler, [ node.arguments[0], node.arguments[1] ], [ argumentExpressions[0], argumentExpressions[1] ]);

    case "clz":
    case "clzl":
      return builtins.clz(compiler, node.arguments[0], argumentExpressions[0]);

    case "ctz":
    case "ctzl":
      return builtins.ctz(compiler, node.arguments[0], argumentExpressions[0]);

    case "popcnt":
    case "popcntl":
      return builtins.popcnt(compiler, node.arguments[0], argumentExpressions[0]);

    case "abs":
    case "absf":
      return builtins.abs(compiler, node.arguments[0], argumentExpressions[0]);

    case "ceil":
    case "ceilf":
      return builtins.ceil(compiler, node.arguments[0], argumentExpressions[0]);

    case "floor":
    case "floorf":
      return builtins.floor(compiler, node.arguments[0], argumentExpressions[0]);

    case "sqrt":
    case "sqrtf":
      return builtins.sqrt(compiler, node.arguments[0], argumentExpressions[0]);

    case "trunc":
    case "truncf":
      return builtins.trunc(compiler, node.arguments[0], argumentExpressions[0]);

    case "nearest":
    case "nearestf":
      return builtins.nearest(compiler, node.arguments[0], argumentExpressions[0]);

    case "min":
    case "minf":
      return builtins.min(compiler, [ node.arguments[0], node.arguments[1] ], [ argumentExpressions[0], argumentExpressions[1] ]);

    case "max":
    case "maxf":
      return builtins.max(compiler, [ node.arguments[0], node.arguments[1] ], [ argumentExpressions[0], argumentExpressions[1] ]);

    case "copysign":
    case "copysignf":
      return builtins.copysign(compiler, [ node.arguments[0], node.arguments[1] ], [ argumentExpressions[0], argumentExpressions[1] ]);

    case "reinterpreti":
    case "reinterpretl":
    case "reinterpretf":
    case "reinterpretd":
      return builtins.reinterpret(compiler, node.arguments[0], argumentExpressions[0]);

    case "current_memory":
      return builtins.current_memory(compiler);

    case "grow_memory":
      return builtins.grow_memory(compiler, node.arguments[0], argumentExpressions[0]);

    case "sizeof":
      return builtins.sizeof(compiler, typeArguments[0]);

    case "unsafe_cast":
      return builtins.unsafe_cast(argumentExpressions[0]);

    case "isNaN":
    case "isNaNf":
      return builtins.isNaN(compiler, node.arguments[0], argumentExpressions[0]);

    case "isFinite":
    case "isFinitef":
      return builtins.isFinite(compiler, node.arguments[0], argumentExpressions[0]);
  }

  // Rewire internal library calls
  if (
    compiler.memoryModel === CompilerMemoryModel.MALLOC ||
    compiler.memoryModel === CompilerMemoryModel.EXPORT_MALLOC ||
    compiler.memoryModel === CompilerMemoryModel.IMPORT_MALLOC
  ) {
    switch (instance.name) {
      case "assembly.d.ts/malloc":
      case "assembly.d.ts/free":
      case "assembly.d.ts/memcpy":
      case "assembly.d.ts/memset":
      case "assembly.d.ts/memcmp":
         return op.call(instance.simpleName, argumentExpressions, binaryen.typeOf(instance.returnType, compiler.uintptrSize));
    }
  }

  if (!instance.imported) {
    instance.imported = true;
    const importName = Compiler.splitImportName(instance.simpleName);
    compiler.module.addImport(instance.name, importName.moduleName, importName.name, instance.binaryenSignature);
  }
  return op.call(instance.name, argumentExpressions, binaryen.typeOf(instance.returnType, compiler.uintptrSize));
}

export { compileCall as default };
