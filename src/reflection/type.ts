/** @module assemblyscript/reflection */ /** */

import Class from "./class";

/** Core type kinds including range aliases. */
export enum TypeKind {
  /** First integer of any size and signage. */
  FirstInteger = 0,
  /** First unsigned integer of any size. */
  FirstUnsigned = 0,
  /** Unsigned 8-bit integer type. */
  byte = 0,
  /** Unsigned 16-bit integer type. */
  ushort = 1,
  /** Unsigned 32-bit integer type. */
  uint = 2,
  /** Unsigned 64-bit integer type. */
  ulong = 3,
  /** Last unsigned integer of any size. */
  LastUnsigned = 4,
  /** Unsigned 32-/64-bit pointer type. */
  uintptr = 4,
  /** First signed integer of any size. */
  FirstSigned = 5,
  /** Signed 8-bit integer type. */
  sbyte = 5,
  /** Signed 16-bit integer type. */
  short = 6,
  /** Signed 32-bit integer type. */
  int = 7,
  /** Last signed integer of any size. */
  LastSigned = 8,
  /** Last integer of any size and signage. */
  LastInteger = 8,
  /** Signed 64-bit integer type. */
  long = 8,
  /** First float of any size. */
  FirstFloat = 9,
  /** 32-bit float type. */
  float = 9,
  /** Last float of any size. */
  LastFloat = 10,
  /** 64-bit float type. */
  double = 10,
  /** Bool type. */
  bool = 11,
  /** Void type. */
  void = 12
}

/** A reflected type. */
export class Type {

  /** Type kind. */
  kind: TypeKind;
  /** Size in linear memory. */
  size: number;
  /** The underlying class, if a pointer. */
  underlyingClass?: Class;

  /** Constructs a new reflected type. Not meant to introduce any types other than the core types. */
  constructor(kind: TypeKind, size: number, underlyingClass?: Class) {
    this.kind = kind;
    this.size = size;
    this.underlyingClass = underlyingClass;
  }

  /** Tests if this is an integer type of any size. */
  get isAnyInteger(): boolean { return this.kind >= TypeKind.FirstInteger && this.kind <= TypeKind.LastInteger; }
  /** Tests if this is a float type of any size. */
  get isAnyFloat(): boolean { return this.kind >= TypeKind.FirstFloat && this.kind <= TypeKind.LastFloat; }
  /** Tests if this is a signed integer type of any size. */
  get isSigned(): boolean { return this.kind >= TypeKind.FirstSigned && this.kind <= TypeKind.LastSigned; }
  /** Tests if this is an 8-bit integer type of any signage. */
  get isByte(): boolean { return this.kind === TypeKind.byte || this.kind === TypeKind.sbyte; }
  /** Tests if this is a 16-bit integer type of any signage. */
  get isShort(): boolean { return this.kind === TypeKind.short || this.kind === TypeKind.ushort; }
  /** Tests if this is a 32-bit integer type of any signage. */
  get isInt(): boolean { return this.kind === TypeKind.int || this.kind === TypeKind.uint || (this.kind === TypeKind.uintptr && this.size === 4); }
  /** Tests if this is a 64-bit integer type of any signage. */
  get isLong(): boolean { return this.kind === TypeKind.long || this.kind === TypeKind.ulong || (this.kind === TypeKind.uintptr && this.size === 8); }
  /** Tests if this is a pointer with an underlying class. */
  get isClass(): boolean { return this.kind === TypeKind.uintptr && !!this.underlyingClass; }
  /** Tests if this is a pointer with an underlying array-like class. */
  get isArray(): boolean { return this.isClass && (<Class>this.underlyingClass).isArray; }
  /** Tests if this is a pointer with an underlying string-like class. */
  get isString(): boolean { return this.isClass && (<Class>this.underlyingClass).isString; }
  /** Gets the common name of a temporary variable of this type. */
  get tempName(): string { return "." + TypeKind[this.kind]; }

  /** Amends a pointer to reference the specified underlying class. */
  withUnderlyingClass(underlyingClass: Class): Type {
    const type = new Type(this.kind, this.size);
    type.underlyingClass = underlyingClass;
    return type;
  }

  toString(): string {
    const str = TypeKind[this.kind];
    return this.underlyingClass ? this.underlyingClass.name : str;
  }
}

export { Type as default };

/** Reflected signed 8-bit integer type. */
export const sbyteType = new Type(TypeKind.sbyte, 1);
/** Reflected unsigned 8-bit integer type. */
export const byteType = new Type(TypeKind.byte, 1);
/** Reflected signed 16-bit integer type. */
export const shortType = new Type(TypeKind.short, 2);
/** Reflected unsigned 16-bit integer type. */
export const ushortType = new Type(TypeKind.ushort, 2);
/** Reflected signed 32-bit integer type. */
export const intType = new Type(TypeKind.int, 4);
/** Reflected unsigned 32-bit integer type. */
export const uintType = new Type(TypeKind.uint, 4);
/** Reflected signed 64-bit integer type. */
export const longType = new Type(TypeKind.long, 8);
/** Reflected unsigned 64-bit integer type. */
export const ulongType = new Type(TypeKind.ulong, 8);
/** Reflected 32-bit float type. */
export const floatType = new Type(TypeKind.float, 4);
/** Reflected 64-bit float type. */
export const doubleType = new Type(TypeKind.double, 8);
/** Reflected 32-bit pointer type. Relevant only when compiling for 32-bit WebAssembly. */
export const uintptrType32 = new Type(TypeKind.uintptr, 4);
/** Reflected 64-bit pointer type. Relevant only when compiling for 64-bit WebAssembly. */
export const uintptrType64 = new Type(TypeKind.uintptr, 8);
/** Reflected bool type. */
export const boolType = new Type(TypeKind.bool, 1);
/** Reflected void type. */
export const voidType = new Type(TypeKind.void, 0);
