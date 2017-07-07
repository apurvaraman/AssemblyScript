/** @module assemblyscript/statements */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/*
block {
  loop $continue {
    statement
    goto $continue if condition
  }
} $break
*/

/** Compiles a do loop statement. */
export function compileDo(compiler: Compiler, node: typescript.DoStatement): binaryen.Statement {
  const op = compiler.module;

  const context: binaryen.Statement[] = [];
  const loop: binaryen.Statement[] = [];
  const label = compiler.enterBreakContext();

  if (node.statement)
    loop.push(compiler.compileStatement(node.statement));

  loop.push(
    op.break("continue$" + label,
      compiler.compileExpression(node.expression, reflection.intType, reflection.intType, false)
    )
  );

  context.push(op.loop("continue$" + label, op.block("", loop)));
  compiler.leaveBreakContext();
  return op.block("break$" + label, context);
}

export { compileDo as default };
