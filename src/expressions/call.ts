/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import * as builtins from "../builtins";
import Compiler from "../compiler";
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
    // FunctionLikeDeclaration extends SignatureDeclaration

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

  // Inherit type arguments from current class and function
  const typeArgumentsMap: reflection.TypeArgumentsMap = {};
  const currentFunction = compiler.currentFunction;
  if (currentFunction) {
    if (currentFunction.parent)
      Object.keys(currentFunction.parent.typeArguments).forEach(key => typeArgumentsMap[key] = (<reflection.Class>currentFunction.parent).typeArguments[key]);
    Object.keys(currentFunction.typeArguments).forEach(key => typeArgumentsMap[key] = currentFunction.typeArguments[key]);
  }

  // Initialize generic function from type arguments
  let instance = typescript.getReflectedFunction(declaration);
  if (!instance) {
    const template = typescript.getReflectedFunctionTemplate(declaration);
    if (template) {
      instance = template.resolve(compiler, node.typeArguments || [], typeArgumentsMap);
      instance.initialize(compiler);
      if (!template.isGeneric)
        typescript.setReflectedFunction(declaration, instance);
    } else {
      compiler.error(node, "Unresolvable call target", typescript.getTextOfNode(<typescript.Identifier>declaration.name));
      typescript.setReflectedType(node, contextualType);
      return op.unreachable();
    }
  }

  typescript.setReflectedType(node, instance.returnType);

  // Compile built-in call to inline assembly
  if (builtins.isBuiltin(instance.name, true)) {

    // Validate type arguments
    let typeArguments: reflection.Type[] = [];
    if (declaration.typeParameters) {
      if (!node.typeArguments || node.typeArguments.length !== declaration.typeParameters.length) {
        compiler.error(node, "Invalid number of type arguments");
        return op.unreachable();
      }
      typeArguments = new Array(node.typeArguments.length);
      for (let i = 0, k = declaration.typeParameters.length; i < k; ++i) {
        const argument = node.typeArguments[i];
        const resolvedType = compiler.resolveType(argument, false, typeArgumentsMap);
        if (!resolvedType) {
          compiler.error(node.typeArguments[i], "Unresolvable type");
          return op.unreachable();
        }
        typeArguments[i] = resolvedType;
      }
    }

    // Validate arguments
    if (node.arguments.length !== instance.parameters.length) {
      compiler.error(node, "Invalid number of arguments", "Expected " + instance.parameters.length + " but saw " + node.arguments.length);
      return op.unreachable();
    }
    const argumentExpressions: binaryen.Expression[] = new Array(instance.parameters.length);
    for (let i = 0, k = instance.parameters.length; i < k; ++i) {
      argumentExpressions[i] = compiler.maybeConvertValue(
        node.arguments[i],
        compiler.compileExpression(node.arguments[i], instance.parameters[i].type),
        typescript.getReflectedType(node.arguments[i]), instance.parameters[i].type,
        false
      );
    }

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

      case "unreachable":
        return builtins.unreachable(compiler);

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
  }

  // Call implementation or import
  if (!instance.compiled && instance.body)
    compiler.compileFunction(instance); // sets instance.compiled = true

  const argumentNodes: typescript.Expression[] = [];
  if (instance.isInstance) { // include 'this'
    if (node.expression.kind !== typescript.SyntaxKind.PropertyAccessExpression) {
      compiler.error(node.expression, "Cannot call instance method as static method");
      return op.unreachable();
    }
    argumentNodes.push((<typescript.PropertyAccessExpression>node.expression).expression);
  }
  Array.prototype.push.apply(argumentNodes, node.arguments);

  return instance.makeCall(compiler, node, argumentNodes);
}

export { compileCall as default };
