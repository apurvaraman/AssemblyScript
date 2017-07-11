/** @module assemblyscript/statements */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";

/** Compiles an empty statement. */
export function compileEmpty(compiler: Compiler/*, node: typescript.EmptyStatement*/): binaryen.Statement {
  const op = compiler.module;

  return op.nop();
}

export { compileEmpty as default };
