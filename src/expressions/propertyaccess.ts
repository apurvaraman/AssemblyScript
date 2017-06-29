/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import compileLoad from "./helpers/load";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

export function compilePropertyAccess(compiler: Compiler, node: typescript.PropertyAccessExpression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  typescript.setReflectedType(node, contextualType);

  const propertyName = typescript.getTextOfNode(node.name);

  // handle special cases
  if (node.expression.kind === typescript.SyntaxKind.Identifier) {
    const reference = compiler.resolveReference(<typescript.Identifier>node.expression);

    // enum values are constants
    if (reference instanceof reflection.Enum) {
      const enm = <reflection.Enum>reference;
      const property = enm.values[propertyName];

      typescript.setReflectedType(node, reflection.intType);

      if (property && property.isConstant) {
        typescript.setReflectedType(node, property.type);
        return binaryen.valueOf(property.type, op, property.constantValue);
      }

      compiler.error(node, "No such enum value", "'" + propertyName + "' on " + enm.name);
      return op.unreachable();

    // static class properties are globals
    } else if (reference instanceof reflection.Class) {
      const clazz = <reflection.Class>reference;
      const property = clazz.properties[propertyName];

      if (property && !property.isInstance) {

        if (property.isConstant) { // TODO: currently unused
          typescript.setReflectedType(node, property.type);
          return binaryen.valueOf(property.type, op, property.constantValue);
        }

        const global = compiler.globals[clazz.name + "." + propertyName];
        if (global) {
          typescript.setReflectedType(node, global.type);
          return op.getGlobal(global.name, binaryen.typeOf(global.type, compiler.uintptrSize));
        } else
          throw Error("unexpected uninitialized global");

      } else {
        compiler.error(node, "No such static property", "'" + propertyName + "' on " + clazz.name);
        typescript.setReflectedType(node, contextualType);
        return op.unreachable();
      }
    }
  }

  const expression = compiler.compileExpression(node.expression, compiler.uintptrType);
  const expressionType = typescript.getReflectedType(node.expression);

  if (!(expressionType && expressionType.underlyingClass)) {
    compiler.error(node, "Property access used on non-object");
    return op.unreachable();
  }

  const clazz = expressionType.underlyingClass;
  const property = clazz.properties[propertyName];
  if (property) {
    typescript.setReflectedType(node, property.type);
    return compileLoad(compiler, node, property.type, expression, property.offset);
  }

  compiler.error(node, "Unsupported property access", "SyntaxKind " + node.expression.kind);
  typescript.setReflectedType(node, contextualType);
  return op.unreachable();
}
