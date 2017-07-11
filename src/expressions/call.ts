/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import * as builtins from "../builtins";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as util from "../util";

/** Compiles a function call expression. */
export function compileCall(compiler: Compiler, node: typescript.CallExpression/*, contextualType: reflection.Type*/): binaryen.Expression {
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
    const classType = util.getReflectedType(accessNode.expression);
    let method: reflection.ClassMethod;
    if (!classType || !classType.underlyingClass || !(method = classType.underlyingClass.methods[methodName])) {
      compiler.report(accessNode.name, typescript.DiagnosticsEx.Unresolvable_identifier_0, methodName);
      return op.unreachable();
    }
    declaration = method.template.declaration;

  // Super constructor call
  } else if (node.expression.kind === typescript.SyntaxKind.SuperKeyword) {
    const currentClass = compiler.currentFunction.parent;

    if (!(currentClass && currentClass.base))
      throw Error("missing base class"); // handled by typescript

    const superClass = currentClass.base;
    let ctor = superClass.ctor;
    while (!(ctor && ctor.body) && superClass.base) {
      ctor = superClass.base.ctor;
    }

    if (!(ctor && ctor.body))
      return op.nop(); // no explicit parent constructor

    declaration = ctor.declaration;
    thisArg = op.getLocal(compiler.currentFunction.localsByName.this.index, compiler.typeOf(compiler.uintptrType));

  } else {
    compiler.report(node, typescript.DiagnosticsEx.Unsupported_node_kind_0_in_1, node.expression.kind, "expressions.compileCall/1");
    return op.unreachable();
  }

  if (!declaration) {
    compiler.report(node.expression, typescript.DiagnosticsEx.Unresolvable_identifier_0, typescript.getTextOfNode(node.expression));
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
  let instance = util.getReflectedFunction(declaration);
  if (!instance) {
    const template = util.getReflectedFunctionTemplate(declaration);
    if (template) {
      instance = template.resolve(compiler, node.typeArguments || [], typeArgumentsMap);
      instance.initialize(compiler);
      if (!template.isGeneric)
        util.setReflectedFunction(declaration, instance);
    } else
      throw Error("missing declaration"); // handled by typescript
  }

  util.setReflectedType(node, instance.returnType);

  // Compile built-in call to inline assembly
  if (builtins.isBuiltin(instance.name, true)) {

    // Validate type arguments
    let typeArguments: reflection.Type[] = [];
    if (declaration.typeParameters) {

      if (!node.typeArguments || node.typeArguments.length !== declaration.typeParameters.length)
        throw Error("invalid number of type arguments"); // handled by typescript

      typeArguments = new Array(node.typeArguments.length);
      for (let i = 0, k = declaration.typeParameters.length; i < k; ++i) {
        const argument = node.typeArguments[i];
        const resolvedType = compiler.resolveType(argument, false, typeArgumentsMap);
        if (resolvedType)
          typeArguments[i] = resolvedType;
        else // otherwise reported by resolveType
          return op.unreachable();
      }
    }

    // Validate arguments
    if (node.arguments.length !== instance.parameters.length)
      throw Error("invalid number of arguments"); // handled by typescript

    const argumentExpressions: binaryen.Expression[] = new Array(instance.parameters.length);
    for (let i = 0, k = instance.parameters.length; i < k; ++i)
      argumentExpressions[i] = compiler.compileExpression(node.arguments[i], instance.parameters[i].type, instance.parameters[i].type, false);

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

  // Call implementation or import (compile if not yet compiled)
  if (!instance.compiled && instance.body)
    compiler.compileFunction(instance); // sets instance.compiled = true

  const argumentNodes: typescript.Expression[] = [];

  // account for the case where TypeScript was able to resolve the function signature above, in
  // which case 'this' hasn't been handled yet
  if (thisArg === undefined && instance.isInstance) {
    if (node.expression.kind === typescript.SyntaxKind.PropertyAccessExpression)
      argumentNodes.push((<typescript.PropertyAccessExpression>node.expression).expression);
    else if (node.expression.kind === typescript.SyntaxKind.SuperKeyword)
      thisArg = op.getLocal(0, compiler.typeOf(compiler.uintptrType));
    else {
      compiler.report(node.expression, typescript.DiagnosticsEx.Unsupported_node_kind_0_in_1, node.expression.kind, "expressions.compileCall/2");
      return op.unreachable();
    }
  }

  Array.prototype.push.apply(argumentNodes, node.arguments);

  return instance.makeCall(compiler, argumentNodes, thisArg);
}

export { compileCall as default };
