/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as Long from "long";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as util from "../util";

/** Compiles a literal expression. */
export function compileLiteral(compiler: Compiler, node: typescript.LiteralExpression, contextualType: reflection.Type, negate: boolean = false): binaryen.Expression {
  const op = compiler.module;

  util.setReflectedType(node, contextualType);

  switch (node.kind) {
    case typescript.SyntaxKind.TrueKeyword:
      negate = !negate;

    case typescript.SyntaxKind.FalseKeyword:
      util.setReflectedType(node, reflection.boolType);
      return negate
        ? contextualType.isLong ? op.i64.const(1, 0) : op.i32.const(1)
        : contextualType.isLong ? op.i64.const(0, 0) : op.i32.const(0);

    case typescript.SyntaxKind.NullKeyword:
      util.setReflectedType(node, compiler.uintptrType);
      return compiler.uintptrSize === 4 ? op.i32.const(0) : op.i64.const(0, 0);

    case typescript.SyntaxKind.NumericLiteral:
    {
      let text = typescript.getTextOfNode(node); // cannot use 'node.text' because it is preprocessed (breaks longs)
      let intValue: number;
      let intRadix: number = 10;

      if (/^(?:0|[1-9][0-9]*)$/.test(text))
        intValue = parseInt(text, intRadix = 10);
      else if (/^0[xX][0-9A-Fa-f]+$/.test(text))
        intValue = parseInt(text = text.substring(2), intRadix = 16);
      else {
        let floatValue: number;

        if (/^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/.test(text)) {
          floatValue = parseFloat(text);
          if (negate)
            floatValue = -floatValue;
          if (contextualType === reflection.floatType)
            return op.f32.const(floatValue);
          else {
            util.setReflectedType(node, reflection.doubleType);
            return op.f64.const(floatValue);
          }
        } else {
          compiler.report(node, typescript.DiagnosticsEx.Unsupported_literal_0, typescript.getTextOfNode(node));
          return op.unreachable();
        }
      }

      if (negate)
        intValue = -intValue;

      switch (contextualType) {

        case reflection.sbyteType:
          if (intValue > 127 || intValue < -128)
            compiler.report(node, typescript.DiagnosticsEx.Literal_overflow_Compiling_to_a_value_in_range_0_to_1_instead, -128, 127);
          return op.i32.const(intValue << 24 >> 24);

        case reflection.byteType:
          if (intValue > 255 || intValue < 0)
            compiler.report(node, typescript.DiagnosticsEx.Literal_overflow_Compiling_to_a_value_in_range_0_to_1_instead, 0, 255);
          return op.i32.const(intValue & 0xff);

        case reflection.shortType:
          if (intValue > 32767 || intValue < -32768)
            compiler.report(node, typescript.DiagnosticsEx.Literal_overflow_Compiling_to_a_value_in_range_0_to_1_instead, -32768, 32767);
          return op.i32.const(intValue << 16 >> 16);

        case reflection.ushortType:
          if (intValue > 65535 || intValue < 0)
            compiler.report(node, typescript.DiagnosticsEx.Literal_overflow_Compiling_to_a_value_in_range_0_to_1_instead, 0, 65535);
          return op.i32.const(intValue & 0xffff);

        case reflection.intType:
          if (intValue > 2147483647 || intValue < -2147483648)
            compiler.report(node, typescript.DiagnosticsEx.Literal_overflow_Compiling_to_a_value_in_range_0_to_1_instead, -2147483648, 2147483647);
          return op.i32.const(intValue | 0);

        case reflection.uintType:
        case reflection.uintptrType32:
          if (intValue > 4294967295 || intValue < 0)
            compiler.report(node, typescript.DiagnosticsEx.Literal_overflow_Compiling_to_a_value_in_range_0_to_1_instead, 0, 4294967295);
          return op.i32.const(intValue | 0);

        case reflection.boolType:
          if (intValue > 1 || intValue < 0)
            compiler.report(node, typescript.DiagnosticsEx.Literal_overflow_Compiling_to_a_value_in_range_0_to_1_instead, 0, 1);
          return op.i32.const(intValue ? 1 : 0);

        case reflection.longType:
        case reflection.ulongType:
        case reflection.uintptrType64:
          let long = Long.fromString(text, !contextualType.isSigned, intRadix); // TODO: check overflow?
          if (negate)
            long = long.negate();
          return op.i64.const(long.low, long.high);

        case reflection.floatType:
          return op.f32.const(intValue);

        case reflection.doubleType:
          return op.f64.const(intValue);
      }
      throw Error("unexpected type: " + contextualType); // should have handled all possible types above
    }

    case typescript.SyntaxKind.StringLiteral:
    {
      const text = node.text;
      const offset = compiler.createStaticString(text);
      return compiler.valueOf(compiler.uintptrType, offset);
    }
  }

  compiler.report(node, typescript.DiagnosticsEx.Unsupported_literal_0, typescript.getTextOfNode(node));
  return op.unreachable();
}

export { compileLiteral as default };
