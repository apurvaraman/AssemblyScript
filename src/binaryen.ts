/**
 * A re-exporting wrapper around binaryen.js providing additional functionality.
 *
 * Note that the API documentation does not reference any re-exports because this isn't supported
 * by the documentation generator.
 *
 * For additional exports, see: https://github.com/dcodeIO/binaryen.js/blob/master/README.md#api
 *
 * @module assemblyscript/binaryen
 */ /** */

import * as binaryen from "binaryen";
import * as Long from "long";
import * as reflection from "./reflection";

export import none = binaryen.none;
export import i32 = binaryen.i32;
export import i64 = binaryen.i64;
export import f32 = binaryen.f32;
export import f64 = binaryen.f64;
export import Type = binaryen.Type;
export import Signature = binaryen.Signature;
export import Function = binaryen.Function;
export import Expression = binaryen.Expression;
export import Statement = binaryen.Statement;
export import MemorySegment = binaryen.MemorySegment;
export import Module = binaryen.Module;
export import I32Expression = binaryen.I32Expression;
export import I64Expression = binaryen.I64Expression;
export import F32Expression = binaryen.F32Expression;
export import F64Expression = binaryen.F64Expression;
export import I32Operations = binaryen.I32Operations;
export import I64Operations = binaryen.I64Operations;
export import F32Operations = binaryen.F32Operations;
export import F64Operations = binaryen.F64Operations;
export import readBinary = binaryen.readBinary;

/** Computes the signature identifier of a reflected type. */
export function identifierOf(type: reflection.Type, uintptrSize: number): string {
  switch (type.kind) {

    case reflection.TypeKind.sbyte:
    case reflection.TypeKind.byte:
    case reflection.TypeKind.short:
    case reflection.TypeKind.ushort:
    case reflection.TypeKind.int:
    case reflection.TypeKind.uint:
    case reflection.TypeKind.bool:
      return "i";

    case reflection.TypeKind.long:
    case reflection.TypeKind.ulong:
      return "I";

    case reflection.TypeKind.float:
      return "f";

    case reflection.TypeKind.double:
      return "F";

    case reflection.TypeKind.uintptr:
      return uintptrSize === 4 ? "i" : "I";

    case reflection.TypeKind.void:
      return "v";
  }
  throw Error("unexpected type");
}

/** Computes the binaryen type of a reflected type. */
export function typeOf(type: reflection.Type, uintptrSize: number): Type {
  switch (type.kind) {

    case reflection.TypeKind.sbyte:
    case reflection.TypeKind.byte:
    case reflection.TypeKind.short:
    case reflection.TypeKind.ushort:
    case reflection.TypeKind.int:
    case reflection.TypeKind.uint:
    case reflection.TypeKind.bool:
      return i32;

    case reflection.TypeKind.long:
    case reflection.TypeKind.ulong:
      return i64;

    case reflection.TypeKind.float:
      return f32;

    case reflection.TypeKind.double:
      return f64;

    case reflection.TypeKind.uintptr:
      return uintptrSize === 4 ? i32 : i64;

    case reflection.TypeKind.void:
      return none;
  }
  throw Error("unexpected type");
}

/** Computes the binaryen opcode category (i32, i64, f32, f64) of a reflected type. */
export function categoryOf(type: reflection.Type, module: Module, uintptrSize: number): I32Operations | I64Operations | F32Operations | F64Operations {
  switch (type.kind) {

    case reflection.TypeKind.sbyte:
    case reflection.TypeKind.byte:
    case reflection.TypeKind.short:
    case reflection.TypeKind.ushort:
    case reflection.TypeKind.int:
    case reflection.TypeKind.uint:
    case reflection.TypeKind.bool:
      return module.i32;

    case reflection.TypeKind.long:
    case reflection.TypeKind.ulong:
      return module.i64;

    case reflection.TypeKind.float:
      return module.f32;

    case reflection.TypeKind.double:
      return module.f64;

    case reflection.TypeKind.uintptr:
      return uintptrSize === 4 ? module.i32 : module.i64;
  }
  throw Error("unexpected type");
}

/** Computes the constant value expression of the specified reflected type. */
export function valueOf(type: reflection.Type, module: Module, value: number | Long) {
  const op = module;

  if (type.isLong) {
    const long = Long.fromValue(value);
    return module.i64.const(long.low, long.high);
  } else if (Long.isLong(value))
    value = Long.fromValue(value).toNumber();

  value = <number>value;

  switch (type.kind) {

    case reflection.TypeKind.byte:
      return op.i32.const(value & 0xff);

    case reflection.TypeKind.sbyte:
      return op.i32.const((value << 24) >> 24);

    case reflection.TypeKind.short:
      return op.i32.const((value << 16) >> 16);

    case reflection.TypeKind.ushort:
      return op.i32.const(value & 0xffff);

    case reflection.TypeKind.int:
    case reflection.TypeKind.uint:
    case reflection.TypeKind.uintptr: // long already handled
      return op.i32.const(value);

    case reflection.TypeKind.bool:
      return op.i32.const(value ? 1 : 0);

    case reflection.TypeKind.float:
      return op.f32.const(value);

    case reflection.TypeKind.double:
      return op.f64.const(value);
  }
  throw Error("unexpected type");
}
