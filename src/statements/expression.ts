/** @module assemblyscript/statements */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles an expression statement. */
export function compileExpression(compiler: Compiler, node: typescript.ExpressionStatement): binaryen.Statement {
  const op = compiler.module;

  const expressionNode = node.expression;
  const expression = compiler.compileExpression(expressionNode, reflection.voidType);

  return typescript.getReflectedType(expressionNode) === reflection.voidType
    ? expression
    : op.drop(expression);
}
