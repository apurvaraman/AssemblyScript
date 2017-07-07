/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import compileLoadOrStore from "./helpers/loadorstore";
import * as Long from "long";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles an element access expression. Sets the element's value to `valueNode` if specified, otherwise gets it. */
export function compileElementAccess(compiler: Compiler, node: typescript.ElementAccessExpression, contextualType: reflection.Type, valueNode?: typescript.Expression): binaryen.Expression {
  const op = compiler.module;

  // fall back to contextual type on error
  typescript.setReflectedType(node, contextualType);

  // compile the index argument
  const argumentNode = <typescript.Expression>node.argumentExpression;
  const argument = compiler.compileExpression(argumentNode, reflection.intType, reflection.intType, false);

  // compile the expression and verify that it references an array
  const expression = compiler.compileExpression(node.expression, compiler.uintptrType);
  const expressionType = typescript.getReflectedType(node.expression);

  if (!(expressionType && expressionType.underlyingClass && expressionType.underlyingClass.isArray)) {
    compiler.error(node, "Array access used on non-array object");
    return op.unreachable();
  }

  // obtain the reflected element type
  const arrayClass = expressionType.underlyingClass;
  const elementType = arrayClass.typeArguments.T.type;
  const uintptrCategory = <binaryen.I32Operations | binaryen.I64Operations>binaryen.categoryOf(compiler.uintptrType, op, compiler.uintptrSize);
  typescript.setReflectedType(node, elementType);

  // if this is a store instead of a load, compile the value expression
  let valueExpression: binaryen.Expression | undefined;
  if (valueNode)
    valueExpression = compiler.compileExpression(valueNode, elementType, elementType, false);

  // simplify / precalculate access to a constant index
  if (argumentNode.kind === typescript.SyntaxKind.NumericLiteral) {
    const literalNode = <typescript.LiteralExpression>argumentNode;
    const literalText = literalNode.text; // (usually) preprocessed by TypeScript to a base10 string

    if (literalText === "0")
      return compileLoadOrStore(compiler, node, elementType, expression, arrayClass.size, valueExpression, contextualType);

    if (/^[1-9][0-9]*$/.test(literalText)) {
      const value = Long.fromString(literalText, true, 10);
      return compileLoadOrStore(compiler, node, elementType,
        uintptrCategory.add(
          expression,
          binaryen.valueOf(compiler.uintptrType, op, value.mul(elementType.size))
        ), arrayClass.size, valueExpression, contextualType
      );
    }
  }

  // otherwise evaluate at runtime
  return compileLoadOrStore(compiler, node, elementType,
    uintptrCategory.add(
      expression,
      uintptrCategory.mul(
        argument,
        binaryen.valueOf(compiler.uintptrType, op, elementType.size)
      )
    ), arrayClass.size, valueExpression, contextualType
  );
}

export { compileElementAccess as default };
