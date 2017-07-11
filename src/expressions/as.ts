/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as util from "../util";

/** Compiles an 'as' expression explicitly converting from one type to another. */
export function compileAs(compiler: Compiler, node: typescript.AsExpression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;
  const toType = compiler.resolveType(node.type, false, compiler.currentFunction.typeArguments);

  if (toType) {

    util.setReflectedType(node, toType);
    return compiler.compileExpression(node.expression, contextualType, toType, true);

  } else {

    util.setReflectedType(node, contextualType);
    return op.unreachable();
  }
}

export { compileAs as default };
