/** @module assemblyscript/statements */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles an if statement. */
export function compileIf(compiler: Compiler, node: typescript.IfStatement): binaryen.Statement {
  const op = compiler.module;

  return op.if(
    compiler.compileExpression(node.expression, reflection.intType, reflection.intType, true),
    compiler.compileStatement(node.thenStatement),
    node.elseStatement ? compiler.compileStatement(node.elseStatement) : undefined
  );
}

export { compileIf as default };
