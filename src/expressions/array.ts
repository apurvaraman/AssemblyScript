/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

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
