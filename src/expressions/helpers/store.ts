/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../../binaryen";
import Compiler from "../../compiler";
import * as reflection from "../../reflection";
import * as typescript from "../../typescript";

/** Helper compiling a store operation. */
export function compileStore(compiler: Compiler, node: typescript.Expression, type: reflection.Type, ptr: binaryen.Expression, value: binaryen.Expression, offset: number): binaryen.Expression {
  const op = compiler.module;

  typescript.setReflectedType(node, type);

  switch (type.kind) {

    case reflection.TypeKind.byte:
    case reflection.TypeKind.sbyte:
      return op.i32.store8(offset, type.size, ptr, value);

    case reflection.TypeKind.short:
    case reflection.TypeKind.ushort:
      return op.i32.store16(offset, type.size, ptr, value);

    case reflection.TypeKind.int:
    case reflection.TypeKind.uint:
    case reflection.TypeKind.bool:
      return op.i32.store(offset, type.size, ptr, value);

    case reflection.TypeKind.long:
    case reflection.TypeKind.ulong:
      return op.i64.store(offset, type.size, ptr, value);

    case reflection.TypeKind.uintptr:
      if (type.size === 4)
        return op.i32.store(offset, type.size, ptr, value);
      else
        return op.i64.store(offset, type.size, ptr, value);

    case reflection.TypeKind.float:
      return op.f32.store(offset, type.size, ptr, value);

    case reflection.TypeKind.double:
      return op.f64.store(offset, type.size, ptr, value);
  }
  throw Error("unexpected type");
}

export { compileStore as default };
