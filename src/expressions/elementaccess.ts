/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import compileLoad from "./helpers/load";
import * as Long from "long";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

export function compileElementAccess(compiler: Compiler, node: typescript.ElementAccessExpression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  typescript.setReflectedType(node, contextualType);

  const argumentNode = <typescript.Expression>node.argumentExpression;
  const argument = compiler.maybeConvertValue(argumentNode, compiler.compileExpression(argumentNode, compiler.uintptrType), typescript.getReflectedType(argumentNode), compiler.uintptrType, false);

  const expression = compiler.compileExpression(node.expression, compiler.uintptrType);
  const expressionType = typescript.getReflectedType(node.expression);

  if (!(expressionType && expressionType.underlyingClass && expressionType.underlyingClass.isArray)) {
    compiler.error(node, "Array access used on non-array object");
    return op.unreachable();
  }

  const elementType = (<reflection.Class>expressionType.underlyingClass).typeArguments.T.type;
  const uintptrCategory = <binaryen.I32Operations | binaryen.I64Operations>binaryen.categoryOf(compiler.uintptrType, op, compiler.uintptrSize);

  typescript.setReflectedType(node, elementType);

  // simplyfy / precalculate access to a constant index
  if (argumentNode.kind === typescript.SyntaxKind.NumericLiteral) {
    const literalNode = <typescript.LiteralExpression>argumentNode;
    const literalText = literalNode.text; // (usually) preprocessed by TypeScript to a base10 string

    if (literalText === "0")
      return compileLoad(compiler, node, elementType, expression, compiler.uintptrSize);

    if (/^[1-9][0-9]*$/.test(literalText)) {
      const value = Long.fromString(literalText, true, 10);
      return compileLoad(compiler, node, elementType,
        uintptrCategory.add(
          expression,
          binaryen.valueOf(compiler.uintptrType, op, value.mul(elementType.size))
        ), compiler.uintptrSize
      );
    }
  }

  // otherwise evaluate at runtime
  return compileLoad(compiler, node, elementType,
    uintptrCategory.add(
      expression,
      uintptrCategory.mul(
        argument,
        binaryen.valueOf(compiler.uintptrType, op, elementType.size)
      )
    ), compiler.uintptrSize
  );
}
