/** @module assemblyscript/expressions */ /** */

import Compiler from "../compiler";
import * as type from "../reflection/type";
import * as binaryen from "../binaryen";
import * as reflection from "../reflection";

export function compileVoidAsArrayElement(compiler: Compiler, elementType: reflection.Type): binaryen.Expression {
  const op = compiler.module;
  switch (elementType) {
    case(type.sbyteType):
    case(type.byteType):
    case(type.shortType):
    case(type.ushortType):
    case(type.uintType):
    case(type.uintptrType32):
    case(type.intType):
      return op.i32.const(0);
    case(type.uintptrType64):
    case(type.ulongType):
    case(type.longType):
      return op.i64.const(0, 0);
    case(type.doubleType):
      return op.f64.const(0);
    case(type.floatType):
      return op.f32.const(0);
  }
  throw Error("unexpected type");
}
