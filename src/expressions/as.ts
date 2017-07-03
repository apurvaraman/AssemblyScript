/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles an 'as' expression explicitly converting from one type to another. */
export function compileAs(compiler: Compiler, node: typescript.AsExpression, contextualType: reflection.Type): binaryen.Expression {

  // resolve the target type (might be a generic parameter reference)
  const toTypeName = typescript.getTextOfNode(node.type);
  const toType = compiler.currentFunction && compiler.currentFunction.typeArguments[toTypeName] && compiler.currentFunction.typeArguments[toTypeName].type || compiler.resolveType(node.type);
  typescript.setReflectedType(node, toType);

  // and emit an explicit conversion
  return compiler.maybeConvertValue(node, compiler.compileExpression(node.expression, contextualType), typescript.getReflectedType(node.expression), toType, true);
}

export { compileAs as default };
