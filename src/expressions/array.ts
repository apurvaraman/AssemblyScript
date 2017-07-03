/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as expressions from "../expressions";
import * as type from "../reflection/type";

export function compileArrayLiteral(compiler: Compiler, node: typescript.ArrayLiteralExpression, contextualType: reflection.Type): binaryen.Expression {
    const op = compiler.module;

    typescript.setReflectedType(node, contextualType);
    const sizeArgument = op.i32.const(node.elements.length);
    const clazz = <reflection.Class>contextualType.underlyingClass;
    const elementType = Object.keys(clazz.typeArguments).map(key => clazz.typeArguments[key].type);
    const uintptrCategory = binaryen.categoryOf(compiler.uintptrType, compiler.module, compiler.uintptrSize);
    const newsize = compiler.currentFunction.localsByName[".newsize"] || compiler.currentFunction.addLocal(".newsize", compiler.uintptrType);
    const newptr = compiler.currentFunction.localsByName[".newptr"] || compiler.currentFunction.addLocal(".newptr", compiler.uintptrType);
    const binaryenPtrType = binaryen.typeOf(compiler.uintptrType, compiler.uintptrSize);

    return op.block("", [
     op.i32.store(
      0,
      reflection.uintType.size,
      op.teeLocal(newptr.index,
        op.call("memset", [
          op.call("malloc", [ // use wrapped malloc here so mspace_malloc can be inlined
            uintptrCategory.add(
              binaryen.valueOf(compiler.uintptrType, op, reflection.uintType.size), // length as an (u)int
              uintptrCategory.mul(
                binaryen.valueOf(compiler.uintptrType, op, elementType[0].size),
                op.teeLocal(newsize.index, sizeArgument)
              )
            )
          ], binaryenPtrType),
          op.i32.const(0), // 2nd memset argument is int
          op.getLocal(newsize.index, binaryenPtrType)
        ], binaryenPtrType)
      ),
      compiler.uintptrType === reflection.uintptrType64
        ? op.i32.wrap(op.getLocal(newsize.index, binaryenPtrType))
        : op.getLocal(newsize.index, binaryenPtrType)
    ),
    op.getLocal(newptr.index, binaryenPtrType)
  ], binaryenPtrType);
}

export function initializeElementsOfArray(compiler: Compiler, node: typescript.ArrayLiteralExpression, contextualType: reflection.Type, arrayName: string, initializers: binaryen.Expression[]) {
  const op = compiler.module;

  typescript.setReflectedType(node, contextualType);

  const clazz = <reflection.Class>contextualType.underlyingClass;
  const elementTypeSize = (Object.keys(clazz.typeArguments).map(key => clazz.typeArguments[key].type))[0].size;
  const elementType = (Object.keys(clazz.typeArguments).map(key => clazz.typeArguments[key].type))[0];

  for (let i = 0; i < node.elements.length; i++) {
      const offset: number = compiler.uintptrSize;
      const element = node.elements[i];
      switch (elementType.kind) {
          case(type.TypeKind.sbyte):
          case(type.TypeKind.short):
          case(type.TypeKind.ushort):
          case(type.TypeKind.uint):
          case(type.TypeKind.uintptr):
          case(type.TypeKind.int):
          case(type.TypeKind.sbyte):
          case(type.TypeKind.sbyte):
            initializers.push(
              op.i32.store(
                offset,
                elementTypeSize,
                getMemoryIndexOfElementArray(compiler, elementTypeSize, i, arrayName),
                expressions.compile(compiler, element, elementType)
              )
            );
            break;
          case(type.TypeKind.double):
            initializers.push(
              op.f64.store(
                offset,
                elementTypeSize,
                getMemoryIndexOfElementArray(compiler, elementTypeSize, i, arrayName),
                expressions.compile(compiler, element, elementType)
              )
            );
            break;
          case(type.TypeKind.float):
            initializers.push(
              op.f32.store(
                offset,
                elementTypeSize,
                getMemoryIndexOfElementArray(compiler, elementTypeSize, i, arrayName),
                expressions.compile(compiler, element, elementType)
              )
            );
            break;
          case(type.TypeKind.ulong):
          case(type.TypeKind.long):
            initializers.push(
              op.i64.store(
                offset,
                elementTypeSize,
                getMemoryIndexOfElementArray(compiler, elementTypeSize, i, arrayName),
                expressions.compile(compiler, element, elementType)
              )
            );
            break;
        }
      }
}

export function getMemoryIndexOfElementArray(compiler: Compiler, elementTypeSize: number, elementIndex: number, nameOfArray: string): binaryen.I32Expression {
  const op = compiler.module;
  const binaryenPtrType = binaryen.typeOf(compiler.uintptrType, compiler.uintptrSize);

     return op.i32.add(
              op.i32.mul(
                op.i32.const(elementIndex),
                op.i32.const(elementTypeSize)
              ),
              compiler.currentFunction === compiler.startFunction ? op.getGlobal(nameOfArray, binaryenPtrType) : op.getLocal(compiler.currentFunction.localsByName[nameOfArray].index, binaryenPtrType)
            );
}

export function compileVoidAsArrayElement(compiler: Compiler, elementType: reflection.Type): binaryen.Expression {
  const op = compiler.module;
  switch (elementType) {
    case(type.sbyteType):
    case(type.byteType):
    case(type.shortType):
    case(type.ushortType):
    case(type.uintType):
    case(type.uintptrType32):
    case(type.uintptrType64):
    case(type.intType):
      return op.i32.const(0);
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
