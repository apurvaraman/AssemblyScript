/**
 * Compiler components dealing with built-in functions.
 *
 * Functions exported by this module correspond to the respective built-in functions. Each takes
 * TypeScript AST-objects and compiles them to opcodes directly.
 *
 * @module assemblyscript/builtins
 */ /** */

import * as binaryen from "./binaryen";
import Compiler from "./compiler";
import * as reflection from "./reflection";
import * as typescript from "./typescript";

/** Tests if the specified function name corresponds to a built-in function. */
export function isBuiltin(name: string, isGlobalName: boolean = true): boolean {
  if (isGlobalName) {
    // Builtins are declared in assembly.d.ts exclusively
    if (name.substring(0, 14) !== "assembly.d.ts/") return false;
    name = name.substring(14);
    const p = name.indexOf("<");
    if (p > -1)
      name = name.substring(0, p);
  }
  switch (name) {
    case "rotl":
    case "rotll":
    case "rotr":
    case "rotrl":
    case "clz":
    case "clzl":
    case "ctz":
    case "ctzl":
    case "popcnt":
    case "popcntl":
    case "abs":
    case "absf":
    case "ceil":
    case "ceilf":
    case "floor":
    case "floorf":
    case "sqrt":
    case "sqrtf":
    case "trunc":
    case "truncf":
    case "nearest":
    case "nearestf":
    case "min":
    case "minf":
    case "max":
    case "maxf":
    case "copysign":
    case "copysignf":
    case "reinterpreti":
    case "reinterpretl":
    case "reinterpretf":
    case "reinterpretd":
    case "current_memory":
    case "grow_memory":
    case "unreachable":
    case "sizeof":
    case "unsafe_cast":
    case "isNaN":
    case "isNaNf":
    case "isFinite":
    case "isFinitef":
      return true;
  }
  return false;
}

/** Tests if the specified function name corresponds to a linked library function. */
export function isLibrary(name: string, isGlobalName: boolean = true): boolean {
  if (isGlobalName) {
    // Builtins are declared in assembly.d.ts exclusively
    if (name.substring(0, 14) !== "assembly.d.ts/") return false;
    name = name.substring(14);
    const p = name.indexOf("<");
    if (p > -1)
      name = name.substring(0, p);
  }
  switch (name) {
    case "malloc_init":
    case "malloc":
    case "memset":
    case "memcpy":
    case "memcmp":
    case "free":
      return true;
  }
  return false;
}

/** A pair of TypeScript expressions. */
export interface TypeScriptExpressionPair {
  0: typescript.Expression;
  1: typescript.Expression;
}

/** A pair of Binaryen expressions. */
export interface BinaryenExpressionPair {
  0: binaryen.Expression;
  1: binaryen.Expression;
}

/** Compiles a sign-agnostic rotate left operation. */
export function rotl(compiler: Compiler, node: TypeScriptExpressionPair, expr: BinaryenExpressionPair): binaryen.Expression {
  const op = compiler.module;
  const leftType = typescript.getReflectedType(node[0]);
  const rightType = typescript.getReflectedType(node[1]);

  if (leftType === rightType) {

    switch (leftType) {

      case reflection.intType:
      case reflection.uintType:
      case reflection.uintptrType32:
        return op.i32.rotl(expr[0], expr[1]);

      case reflection.longType:
      case reflection.ulongType:
      case reflection.uintptrType64:
        return op.i64.rotl(expr[0], expr[1]);
    }
  }
  throw Error("unsupported operation");
}

/** Compiles a sign-agnostic rotate right operation. */
export function rotr(compiler: Compiler, node: TypeScriptExpressionPair, expr: BinaryenExpressionPair): binaryen.Expression {
  const op = compiler.module;

  const leftType = typescript.getReflectedType(node[0]);
  const rightType = typescript.getReflectedType(node[1]);

  if (leftType === rightType) {
    switch (leftType) {

      case reflection.intType:
      case reflection.uintType:
      case reflection.uintptrType32:
        return op.i32.rotr(expr[0], expr[1]);

      case reflection.longType:
      case reflection.ulongType:
      case reflection.uintptrType64:
        return op.i64.rotr(expr[0], expr[1]);
    }
  }
  throw Error("unsupported operation");
}

/** Compiles a sign-agnostic count leading zero bits operation. */
export function clz(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  switch (type) {

    case reflection.intType:
    case reflection.uintType:
    case reflection.uintptrType32:
      return op.i32.clz(expr);

    case reflection.longType:
    case reflection.ulongType:
    case reflection.uintptrType64:
      return op.i64.clz(expr);
  }
  throw Error("unsupported operation");
}

/** Compiles a sign-agnostic count tailing zero bits operation. */
export function ctz(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  switch (type) {

    case reflection.intType:
    case reflection.uintType:
    case reflection.uintptrType32:
      return op.i32.ctz(expr);

    case reflection.longType:
    case reflection.ulongType:
    case reflection.uintptrType64:
      return op.i64.ctz(expr);
  }
  throw Error("unsupported operation");
}

/** Compiles a sign-agnostic count number of one bits operation. */
export function popcnt(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  switch (type) {

    case reflection.intType:
    case reflection.uintType:
    case reflection.uintptrType32:
      return op.i32.popcnt(expr);

    case reflection.longType:
    case reflection.ulongType:
    case reflection.uintptrType64:
      return op.i64.popcnt(expr);
  }
  throw Error("unsupported operation");
}

/** Compiles an absolute value operation. */
export function abs(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  switch (type) {

    case reflection.floatType:
      return op.f32.abs(expr);

    case reflection.doubleType:
      return op.f64.abs(expr);
  }
  throw Error("unsupported operation");
}

/** Compiles a ceiling operation. */
export function ceil(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  switch (type) {

    case reflection.floatType:
      return op.f32.ceil(expr);

    case reflection.doubleType:
      return op.f64.ceil(expr);
  }
  throw Error("unsupported operation");
}

/** Compiles a floor operation. */
export function floor(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  switch (type) {

    case reflection.floatType:
      return op.f32.floor(expr);

    case reflection.doubleType:
      return op.f64.floor(expr);
  }
  throw Error("unsupported operation");
}

/** Compiles a square root operation. */
export function sqrt(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  switch (type) {

    case reflection.floatType:
      return op.f32.sqrt(expr);

    case reflection.doubleType:
      return op.f64.sqrt(expr);
  }
  throw Error("unsupported operation");
}

/** Compiles a round to the nearest integer towards zero operation. */
export function trunc(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  switch (type) {

    case reflection.floatType:
      return op.f32.trunc(expr);

    case reflection.doubleType:
      return op.f64.trunc(expr);
  }
  throw Error("unsupported operation");
}

/** Compiles a round to the nearest integer tied to even operation. */
export function nearest(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  switch (type) {

    case reflection.floatType:
      return op.f32.nearest(expr);

    case reflection.doubleType:
      return op.f64.nearest(expr);
  }
  throw Error("unsupported operation");
}

/** Compiles a minimum of two floats operation. */
export function min(compiler: Compiler, node: TypeScriptExpressionPair, expr: BinaryenExpressionPair): binaryen.Expression {
  const op = compiler.module;

  const leftType = typescript.getReflectedType(node[0]);
  const rightType = typescript.getReflectedType(node[1]);

  if (leftType === rightType) {
    switch (leftType) {

      case reflection.floatType:
        return op.f32.min(expr[0], expr[1]);

      case reflection.doubleType:
        return op.f64.min(expr[0], expr[1]);
    }
  }
  throw Error("unsupported operation");
}

/** Compiles a maximum of two floats operation. */
export function max(compiler: Compiler, node: TypeScriptExpressionPair, expr: BinaryenExpressionPair): binaryen.Expression {
  const op = compiler.module;

  const leftType = typescript.getReflectedType(node[0]);
  const rightType = typescript.getReflectedType(node[1]);

  if (leftType === rightType) {
    switch (leftType) {

      case reflection.floatType:
        return op.f32.max(expr[0], expr[1]);

      case reflection.doubleType:
        return op.f64.max(expr[0], expr[1]);
    }
  }
  throw Error("unsupported operation");
}

/** Compiles a copysign operation that composes a float from the magnitude of `x` and the sign of `y`. */
export function copysign(compiler: Compiler, node: TypeScriptExpressionPair, expr: BinaryenExpressionPair): binaryen.Expression {
  const op = compiler.module;

  const leftType = typescript.getReflectedType(node[0]);
  const rightType = typescript.getReflectedType(node[1]);

  if (leftType === rightType) {
    switch (leftType) {

      case reflection.floatType:
        return op.f32.copysign(expr[0], expr[1]);

      case reflection.doubleType:
        return op.f64.copysign(expr[0], expr[1]);
    }
  }
  throw Error("unsupported operation");
}

/** Compiles a reinterpretation of a float as an int respectively of an int as a float. */
export function reinterpret(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  switch (type) {

    case reflection.intType:
    case reflection.uintType:
    case reflection.uintptrType32:
      return op.f32.reinterpret(expr);

    case reflection.longType:
    case reflection.ulongType:
    case reflection.uintptrType64:
      return op.f64.reinterpret(expr);

    case reflection.floatType:
      return op.i32.reinterpret(expr);

    case reflection.doubleType:
      return op.i64.reinterpret(expr);

  }
  throw Error("unsupported operation");
}

/** Compiles a current memory operation. */
export function current_memory(compiler: Compiler): binaryen.Expression {
  const op = compiler.module;
  return op.currentMemory();
}

/** Compiles a grow memory operation. */
export function grow_memory(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  if (type.isInt)
    return op.growMemory(expr);

  throw Error("unsupported operation");
}

/** Compiles an unreachable operation. */
export function unreachable(compiler: Compiler): binaryen.Expression {
  const op = compiler.module;
  return op.unreachable();
}

/** Compiles a sizeof operation determining the byte size of a type. */
export function sizeof(compiler: Compiler, type: reflection.Type): binaryen.Expression {
  const op = compiler.module;
  const size = type.underlyingClass ? type.underlyingClass.size : type.size;

  return compiler.uintptrType === reflection.uintptrType32
    ? op.i32.const(size)
    : op.i64.const(size, 0); // TODO: long?
}

/** Compiles an unsafe cast operation casting a value from one type to another. */
export function unsafe_cast(expr: binaryen.Expression): binaryen.Expression {
  return expr;
}

/** Compiles a check for NaN operation. */
export function isNaN(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  if (!type.isAnyFloat)
    throw Error("unsupported operation");

  const category = <binaryen.F32Operations | binaryen.F64Operations>binaryen.categoryOf(type, op, compiler.uintptrSize);

  // value != value

  // Simplify if the argument is a single identifier or literal
  if (node.kind === typescript.SyntaxKind.Identifier || node.kind === typescript.SyntaxKind.NumericLiteral)
    return category.ne(expr, expr);

  // Otherwise evaluate the compound expression exactly once through introducing a temporary local
  const tempName = type.tempName;
  const temp = compiler.currentFunction.localsByName[tempName] || compiler.currentFunction.addLocal(tempName, type);
  const tempBinaryenType = binaryen.typeOf(type, compiler.uintptrSize);

  return category.ne(
    op.teeLocal(temp.index, expr),
    op.getLocal(temp.index, tempBinaryenType)
  );
}

/** Compiles a check for a finite number operation. */
export function isFinite(compiler: Compiler, node: typescript.Expression, expr: binaryen.Expression): binaryen.Expression {
  const op = compiler.module;

  const type = typescript.getReflectedType(node);
  if (!type.isAnyFloat)
    throw Error("unsupported operation");

  const category = <binaryen.F32Operations | binaryen.F64Operations>binaryen.categoryOf(type, op, compiler.uintptrSize);

  // !(value != value) && abs(value) != Infinity

  // Simplify if the argument is a single identifier or literal
  if (node.kind === typescript.SyntaxKind.Identifier || node.kind === typescript.SyntaxKind.NumericLiteral)
    return op.select(
      category.ne(expr, expr),
      op.i32.const(0),
      category.ne(
        category.abs(expr),
        binaryen.valueOf(type, op, Infinity)
      )
    );

  // Otherwise evaluate the compound expression exactly once through introducing a temporary local
  const tempName = type.tempName;
  const temp = compiler.currentFunction.localsByName[tempName] || compiler.currentFunction.addLocal(tempName, type);
  const tempBinaryenType = binaryen.typeOf(type, compiler.uintptrSize);

  return op.select(
    category.ne(
      op.teeLocal(temp.index, expr),
      op.getLocal(temp.index, tempBinaryenType)
    ),
    op.i32.const(0),
    category.ne(
      category.abs(
        op.getLocal(temp.index, tempBinaryenType)
      ),
      binaryen.valueOf(type, op, Infinity)
    )
  );
}
