/** @module assemblyscript/statements */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles a return statement. */
export function compileReturn(compiler: Compiler, node: typescript.ReturnStatement): binaryen.Statement {
  const op = compiler.module;

  if (compiler.currentFunction.returnType === reflection.voidType) {

    if (node.expression)
      compiler.report(node, typescript.DiagnosticsEx.Function_without_a_return_type_cannot_return_a_value);

    return op.return();
  }

  if (node.expression)
    return op.return(
      compiler.compileExpression(<typescript.Expression>node.expression, compiler.currentFunction.returnType, compiler.currentFunction.returnType, false)
    );

  compiler.report(node, typescript.DiagnosticsEx.Function_with_a_return_type_must_return_a_value);
  return op.unreachable();
}

export { compileReturn as default };
