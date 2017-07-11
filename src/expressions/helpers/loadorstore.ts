/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import Compiler from "../../compiler";
import * as reflection from "../../reflection";
import * as typescript from "../../typescript";

import compileLoad from "./load";
import compileStore from "./store";

/** Helper compiling a load operation if `valueToSet` has been omitted, otherwise a store operation. */
export function compileLoadOrStore(compiler: Compiler, node: typescript.Expression, type: reflection.Type, ptr: binaryen.Expression, offset: number, valueToSet?: binaryen.Expression, valueToSetContextualType?: reflection.Type): binaryen.Expression {

  // load expression
  if (valueToSet === undefined)
    return compileLoad(compiler, node, type, ptr, offset);

  // store statement
  if (valueToSetContextualType === reflection.voidType)
    return compileStore(compiler, node, type, ptr, offset, valueToSet);

  // store expression
  const op = compiler.module;
  const binaryenType = compiler.typeOf(type);

  // TODO: this uses a temporary local because the 'ptr' expression might exhibit side-effects,
  // i.e. if it includes a postfix unary expression or similar. but: if 'ptr' is just a get_local,
  // this is actually unnecessary, though this function does not have the information to decide that.
  // note: binaryen's optimizer seems to be able to eliminate the temp. local in this case, for now.
  const tempVar = compiler.currentFunction.localsByName[type.tempName] || compiler.currentFunction.addLocal(type.tempName, type);

  return op.block("", [
    op.setLocal(tempVar.index, ptr),
    compileStore(compiler, node, type, op.getLocal(tempVar.index, binaryenType), offset, valueToSet),
    compileLoad(compiler, node, type, op.getLocal(tempVar.index, binaryenType), offset)
  ], binaryenType);
}

export { compileLoadOrStore as default };
