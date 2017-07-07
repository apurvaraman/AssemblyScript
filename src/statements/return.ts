/** @module assemblyscript/statements */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles a return statement. */
export function compileReturn(compiler: Compiler, node: typescript.ReturnStatement): binaryen.Statement {
  const op = compiler.module;

  if (compiler.currentFunction.returnType === reflection.voidType) {

    if (node.expression)
      compiler.error(node, "Function cannot return a value", "Return type is 'void'");

    return op.return();
  }

  if (node.expression)
    return op.return(
      compiler.compileExpression(<typescript.Expression>node.expression, compiler.currentFunction.returnType, compiler.currentFunction.returnType, false)
    );

  compiler.error(node, "Function must return a value", "Return type is '" + compiler.currentFunction.returnType + "'");
  return op.unreachable();
}

export { compileReturn as default };
