/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles a unary postfix expression. */
export function compilePostfixUnary(compiler: Compiler, node: typescript.PostfixUnaryExpression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  if (node.operand.kind === typescript.SyntaxKind.Identifier) {

    const local = compiler.currentFunction.localsByName[(<typescript.Identifier>node.operand).text];
    if (local) {

      switch (node.operator) {

        case typescript.SyntaxKind.PlusPlusToken:
        case typescript.SyntaxKind.MinusMinusToken:
        {
          const cat = binaryen.categoryOf(local.type, op, compiler.uintptrSize);
          const one = binaryen.valueOf(local.type, compiler.module, 1);
          const isIncrement = node.operator === typescript.SyntaxKind.PlusPlusToken;

          let calculate = (isIncrement ? cat.add : cat.sub).call(cat,
            op.getLocal(
              local.index,
              binaryen.typeOf(local.type, compiler.uintptrSize)
            ),
            one
          );

          if (local.type.isByte || local.type.isShort)
            calculate = compiler.maybeConvertValue(node, calculate, reflection.intType, local.type, true);

          if (contextualType === reflection.voidType) {
            typescript.setReflectedType(node, reflection.voidType);
            return op.setLocal(local.index, calculate);
          } else {
            typescript.setReflectedType(node, local.type);
            return (isIncrement ? cat.sub : cat.add).call(cat, op.teeLocal(local.index, calculate), one);
          }
        }
      }
    }
  }

  compiler.error(node, "Unsupported unary postfix operator");
  typescript.setReflectedType(node, contextualType);
  return op.unreachable();
}

export { compilePostfixUnary as default };
