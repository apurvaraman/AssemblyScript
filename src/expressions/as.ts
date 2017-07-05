/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles an 'as' expression explicitly converting from one type to another. */
export function compileAs(compiler: Compiler, node: typescript.AsExpression, contextualType: reflection.Type): binaryen.Expression {
  const toType = compiler.resolveType(node.type, false, compiler.currentFunction.typeArguments);

  typescript.setReflectedType(node, toType);

  return compiler.maybeConvertValue(
    node,
    compiler.compileExpression(node.expression, contextualType),
    typescript.getReflectedType(node.expression),
    toType,
    true // explicit
  );
}

export { compileAs as default };
