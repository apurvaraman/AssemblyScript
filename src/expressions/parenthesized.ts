/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as util from "../util";

/** Compiles a parenthesized expression. */
export function compileParenthesized(compiler: Compiler, node: typescript.ParenthesizedExpression, contextualType: reflection.Type): binaryen.Expression {
  const expression = compiler.compileExpression(node.expression, contextualType);

  util.setReflectedType(node, util.getReflectedType(node.expression));
  return expression;
}

export { compileParenthesized as default };
