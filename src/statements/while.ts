/** @module assemblyscript/statements */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/*
block {
  loop $continue {
    if (condition) {
      statement
      goto $continue
    }
  }
} $break
*/

/** Compiles a while loop statement. */
export function compileWhile(compiler: Compiler, node: typescript.WhileStatement): binaryen.Statement {
  const op = compiler.module;

  const context: binaryen.Statement[] = [];
  const ifTrue: binaryen.Statement[] = [];
  const label = compiler.enterBreakContext();

  if (node.statement)
    ifTrue.push(compiler.compileStatement(node.statement));

  ifTrue.push(op.break("continue$" + label));

  context.push(
    op.loop("continue$" + label,
      op.if(
        compiler.compileExpression(node.expression, reflection.intType, reflection.intType, true),
        ifTrue.length === 1 ? ifTrue[0] : op.block("", ifTrue)
      )
    )
  );

  compiler.leaveBreakContext();
  return op.block("break$" + label, context);
}

export { compileWhile as default };
