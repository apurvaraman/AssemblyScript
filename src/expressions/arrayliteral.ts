/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as expressions from "../expressions";
import * as type from "../reflection/type";
import * as util from "../util";

export function compileArrayLiteral(compiler: Compiler, node: typescript.ArrayLiteralExpression, contextualType: reflection.Type): binaryen.Expression {
    util.setReflectedType(node, contextualType);
    const arrayLength = node.elements.length;
    const clazz = <reflection.Class>contextualType.underlyingClass;
    const elementType = Object.keys(clazz.typeArguments).map(key => clazz.typeArguments[key].type);
    return compileArrayWithType(compiler, arrayLength, elementType[0]);
}

export function compileArrayWithType(compiler: Compiler, arrayLength: number, elementType: type.Type): binaryen.Expression {
    const newsize = compiler.currentFunction.localsByName[".newsize"] || compiler.currentFunction.addLocal(".newsize", compiler.uintptrType);
    const newptr = compiler.currentFunction.localsByName[".newptr"] || compiler.currentFunction.addLocal(".newptr", compiler.uintptrType);
    const binaryenPtrType = compiler.typeOf(compiler.uintptrType);
    const op = compiler.module;
    const headersize = reflection.uintType.size * 2; // capacity
    const arraysize = (elementType.size * arrayLength) + headersize;
    return op.block("", [
      op.i32.store(
        0,
        reflection.uintType.size,
        compiler.compileMallocInvocation(arraysize),
        compiler.uintptrType === reflection.uintptrType64
          ? op.i32.wrap(op.getLocal(newsize.index, binaryenPtrType))
          : op.getLocal(newsize.index, binaryenPtrType)
      ),
      op.getLocal(newptr.index, binaryenPtrType)
    ], binaryenPtrType);
}

export function initializeElementsOfArray(compiler: Compiler, node: typescript.ArrayLiteralExpression, contextualType: reflection.Type, arrayName: string, initializers: binaryen.Expression[]) {
  const op = compiler.module;

  util.setReflectedType(node, contextualType);

  const clazz = <reflection.Class>contextualType.underlyingClass;
  const elementTypeSize = (Object.keys(clazz.typeArguments).map(key => clazz.typeArguments[key].type))[0].size;
  const elementType = (Object.keys(clazz.typeArguments).map(key => clazz.typeArguments[key].type))[0];

  for (let i = 0; i < node.elements.length; i++) {
      const offset: number = compiler.uintptrSize * 2; // capacity
      const element = node.elements[i];

      switch (elementType.kind) {
          case(type.TypeKind.sbyte):
          case(type.TypeKind.short):
          case(type.TypeKind.ushort):
          case(type.TypeKind.uint):
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
        // throw Error("unexpected type");
      }
}

export function getMemoryIndexOfElementArray(compiler: Compiler, elementTypeSize: number, elementIndex: number, nameOfArray: string): binaryen.I32Expression {
  const op = compiler.module;
  const binaryenPtrType = compiler.typeOf(compiler.uintptrType);

     return op.i32.add(
              op.i32.mul(
                op.i32.const(elementIndex),
                op.i32.const(elementTypeSize)
              ),
              compiler.currentFunction === compiler.startFunction ? op.getGlobal(nameOfArray, binaryenPtrType) : op.getLocal(compiler.currentFunction.localsByName[nameOfArray].index, binaryenPtrType)
            );
}
