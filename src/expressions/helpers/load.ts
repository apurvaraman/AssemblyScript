/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../../binaryen";
import Compiler from "../../compiler";
import * as reflection from "../../reflection";
import * as typescript from "../../typescript";

/** Helper compiling a load operation. */
export function compileLoad(compiler: Compiler, node: typescript.Expression, type: reflection.Type, ptr: binaryen.Expression, offset: number): binaryen.Expression {
  const op = compiler.module;

  typescript.setReflectedType(node, type);

  switch (type.kind) {

    case reflection.TypeKind.byte:
      return op.i32.load8_u(offset, type.size, ptr);

    case reflection.TypeKind.sbyte:
      return op.i32.load8_s(offset, type.size, ptr);

    case reflection.TypeKind.short:
      return op.i32.load16_s(offset, type.size, ptr);

    case reflection.TypeKind.ushort:
      return op.i32.load16_u(offset, type.size, ptr);

    case reflection.TypeKind.int:
    case reflection.TypeKind.uint:
    case reflection.TypeKind.bool:
      return op.i32.load(offset, type.size, ptr);

    case reflection.TypeKind.long:
    case reflection.TypeKind.ulong:
      return op.i64.load(offset, type.size, ptr);

    case reflection.TypeKind.uintptr:
      if (type.size === 4)
        return op.i32.load(offset, type.size, ptr);
      else
        return op.i64.load(offset, type.size, ptr);

    case reflection.TypeKind.float:
      return op.f32.load(offset, type.size, ptr);

    case reflection.TypeKind.double:
      return op.f64.load(offset, type.size, ptr);
  }
  throw Error("unexpected type");
}

export { compileLoad as default };
