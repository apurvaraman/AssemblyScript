/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles an 'as' expression converting from one type to another. */
export function compileAs(compiler: Compiler, node: typescript.AsExpression, contextualType: reflection.Type): binaryen.Expression {
  const toTypeName = typescript.getTextOfNode(node.type);
  const toType = compiler.currentFunction && compiler.currentFunction.typeArguments[toTypeName] && compiler.currentFunction.typeArguments[toTypeName].type || compiler.resolveType(node.type);

  typescript.setReflectedType(node, toType);
  return compiler.maybeConvertValue(node, compiler.compileExpression(node.expression, contextualType), typescript.getReflectedType(node.expression), toType, true);
}
