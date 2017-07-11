/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import compileLiteral from "./literal";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as util from "../util";

/** Compiles a unary prefix expression. */
export function compilePrefixUnary(compiler: Compiler, node: typescript.PrefixUnaryExpression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  const operand = compiler.compileExpression(node.operand, contextualType);
  const operandType = util.getReflectedType(node.operand);

  switch (node.operator) {

    case typescript.SyntaxKind.ExclamationToken:
    {
      util.setReflectedType(node, reflection.boolType);

      if (operandType === reflection.floatType)
        return op.f32.eq(operand, op.f32.const(0));

      else if (operandType === reflection.doubleType)
        return op.f64.eq(operand, op.f64.const(0));

      else if (operandType.isLong)
        return op.i64.eqz(operand);

      else
        return op.i32.eqz(operand);
    }

    case typescript.SyntaxKind.PlusToken: // noop
    {
      util.setReflectedType(node, operandType);
      return operand;
    }

    case typescript.SyntaxKind.MinusToken:
    {
      util.setReflectedType(node, operandType);

      if (node.operand.kind === typescript.SyntaxKind.NumericLiteral)
        return compileLiteral(compiler, <typescript.LiteralExpression>node.operand, operandType, true);

      if (operandType === reflection.floatType)
        return op.f32.neg(operand);

      else if (operandType === reflection.doubleType)
        return op.f64.neg(operand);

      else if (operandType.isLong)
        return op.i64.sub(op.i64.const(0, 0), operand);

      else
        return compiler.maybeConvertValue(node, op.i32.sub(op.i32.const(0), operand), reflection.intType, operandType, true);
    }

    case typescript.SyntaxKind.TildeToken:
    {
      if (operandType.isLong) {

        util.setReflectedType(node, operandType);
        return op.i64.xor(operand, op.i64.const(-1, -1));

      } else if (operandType.isInt) {

        util.setReflectedType(node, operandType);
        return op.i32.xor(operand, op.i32.const(-1));

      } else if (contextualType.isLong) { // TODO: is the following correct / doesn't generate useless ops?

        util.setReflectedType(node, contextualType);
        return op.i64.xor(compiler.maybeConvertValue(node.operand, operand, operandType, contextualType, true), op.i64.const(-1, -1));

      } else {

        util.setReflectedType(node, reflection.intType);
        return op.i32.xor(compiler.maybeConvertValue(node.operand, operand, operandType, reflection.intType, true), op.i32.const(-1));

      }
    }

    case typescript.SyntaxKind.PlusPlusToken:
    case typescript.SyntaxKind.MinusMinusToken:
    {
      if (node.operand.kind === typescript.SyntaxKind.Identifier) {

        const local = compiler.currentFunction.localsByName[(<typescript.Identifier>node.operand).text];
        if (local) {

          const cat = compiler.categoryOf(local.type);
          const isIncrement = node.operator === typescript.SyntaxKind.PlusPlusToken;

          const calculate = (isIncrement ? cat.add : cat.sub).call(cat,
            op.getLocal(
              local.index,
              compiler.typeOf(local.type)
            ),
            compiler.valueOf(local.type, 1)
          );

          if (contextualType === reflection.voidType) {
            util.setReflectedType(node, reflection.voidType);
            return op.setLocal(local.index, calculate);
          } else {
            util.setReflectedType(node, local.type);
            return op.teeLocal(local.index, calculate);
          }
        }
      }
    }
  }

  compiler.report(node, typescript.DiagnosticsEx.Unsupported_node_kind_0_in_1, node.operator, "expressions.compilePrefixUnary");
  return op.unreachable();
}

export { compilePrefixUnary as default };
