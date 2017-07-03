/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles a conditional (ternary) expression. */
export function compileConditional(compiler: Compiler, node: typescript.ConditionalExpression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  const condition = compiler.maybeConvertValue(
    node.condition,
    compiler.compileExpression(node.condition, reflection.intType),
    typescript.getReflectedType(node.condition),
    reflection.intType,
    true
  );
  const ifTrue  = compiler.compileExpression(node.whenTrue, contextualType);
  const ifFalse = compiler.compileExpression(node.whenFalse, contextualType);

  typescript.setReflectedType(node, contextualType);
  return op.select(condition, ifTrue, ifFalse);
}

export { compileConditional as default };
