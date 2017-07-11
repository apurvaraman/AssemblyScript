/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as util from "../util";

/** Compiles a unary postfix expression. */
export function compilePostfixUnary(compiler: Compiler, node: typescript.PostfixUnaryExpression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  util.setReflectedType(node, contextualType);

  if (node.operand.kind === typescript.SyntaxKind.Identifier) {

    const local = compiler.currentFunction.localsByName[(<typescript.Identifier>node.operand).text];
    if (local) {

      switch (node.operator) {

        case typescript.SyntaxKind.PlusPlusToken:
        case typescript.SyntaxKind.MinusMinusToken:
        {
          const cat = compiler.categoryOf(local.type);
          const one = compiler.valueOf(local.type, 1);
          const isIncrement = node.operator === typescript.SyntaxKind.PlusPlusToken;

          let calculate = (isIncrement ? cat.add : cat.sub).call(cat,
            op.getLocal(
              local.index,
              compiler.typeOf(local.type)
            ),
            one
          );

          if (local.type.isByte || local.type.isShort)
            calculate = compiler.maybeConvertValue(node, calculate, reflection.intType, local.type, true); // mask or sign-extend

          if (contextualType === reflection.voidType) {
            util.setReflectedType(node, reflection.voidType);
            return op.setLocal(local.index, calculate);
          } else {
            util.setReflectedType(node, local.type);
            return (isIncrement ? cat.sub : cat.add).call(cat, op.teeLocal(local.index, calculate), one);
          }
        }
        default:
          compiler.report(node, typescript.DiagnosticsEx.Unsupported_node_kind_0_in_1, node.operator, "expressions.compilePostfixUnary/1");
          return op.unreachable();
      }
    }
  }

  compiler.report(node, typescript.DiagnosticsEx.Unsupported_node_kind_0_in_1, node.operand.kind, "expressions.compilePostfixUnary/2");
  return op.unreachable();
}

export { compilePostfixUnary as default };
