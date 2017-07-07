/** @module assemblyscript/statements */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

import { compileVariableDeclarationList } from "./variable";

/*
block {
  initializer
  loop $continue {
    if (condition) {
      statement
      incrementor
      goto $continue
    }
  }
} $break
*/

/** Compiles a for loop statement. */
export function compileFor(compiler: Compiler, node: typescript.ForStatement): binaryen.Statement {
  const op = compiler.module;

  const context: binaryen.Statement[] = [];
  const ifTrue: binaryen.Statement[] = [];
  const label = compiler.enterBreakContext();

  if (node.initializer) {
    if (node.initializer.kind === typescript.SyntaxKind.VariableDeclarationList) {

      context.push(compileVariableDeclarationList(compiler, <typescript.VariableDeclarationList>node.initializer));

    } else /* typescript.Expression */ {

      const expr = compiler.compileExpression(<typescript.Expression>node.initializer, reflection.voidType);
      if (typescript.getReflectedType(node.initializer) === reflection.voidType)
        context.push(expr);
      else
        context.push(op.drop(expr));
    }
  }

  if (node.statement)
    ifTrue.push(compiler.compileStatement(node.statement));

  if (node.incrementor) {
    const expr = compiler.compileExpression(node.incrementor, reflection.voidType);
    if (typescript.getReflectedType(node.incrementor) === reflection.voidType)
      ifTrue.push(expr);
    else
      ifTrue.push(op.drop(expr));
  }

  ifTrue.push(op.break("continue$" + label));

  if (node.condition) {

    context.push(
      op.loop("continue$" + label,
        op.if(
          compiler.compileExpression(node.condition, reflection.intType, reflection.intType, false),
          ifTrue.length === 1 ? ifTrue[0] : op.block("", ifTrue)
        )
      )
    );

  } else {

    if (ifTrue.length === 1) // binaryen errors here
      compiler.error(node, "Illegal endless loop");

    context.push(
      op.loop("continue$" + label,
        ifTrue.length === 1 ? ifTrue[0] : op.block("", ifTrue)
      )
    );

  }

  compiler.leaveBreakContext();
  return op.block("break$" + label, context);
}

export { compileFor as default };
