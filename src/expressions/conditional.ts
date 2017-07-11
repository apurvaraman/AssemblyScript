/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as util from "../util";

/** Compiles a conditional (ternary) expression. */
export function compileConditional(compiler: Compiler, node: typescript.ConditionalExpression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  const condition = compiler.compileExpression(node.condition, reflection.intType, reflection.intType, true);
  const ifTrue    = compiler.compileExpression(node.whenTrue, contextualType, contextualType, false);
  const ifFalse   = compiler.compileExpression(node.whenFalse, contextualType, contextualType, false);

  util.setReflectedType(node, contextualType);
  return op.select(condition, ifTrue, ifFalse);
}

export { compileConditional as default };
