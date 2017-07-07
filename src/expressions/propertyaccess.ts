/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import compileLoadOrStore from "./helpers/loadorstore";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles a property access expression. Sets the property's value to `valueNode` if specified, otherwise gets it. */
export function compilePropertyAccess(compiler: Compiler, node: typescript.PropertyAccessExpression, contextualType: reflection.Type, valueNode?: typescript.Expression): binaryen.Expression {
  const op = compiler.module;

  // fall back to contextual type on error
  typescript.setReflectedType(node, contextualType);

  // obtain the property's name
  const propertyName = typescript.getTextOfNode(node.name);

  // handle special cases
  if (node.expression.kind === typescript.SyntaxKind.Identifier) {
    const reference = compiler.resolveReference(<typescript.Identifier>node.expression);

    // enum values are constants
    if (reference instanceof reflection.Enum) {
      if (valueNode)
        compiler.error(valueNode, "Cannot assign to a constant");

      typescript.setReflectedType(node, reflection.intType);

      const enm = <reflection.Enum>reference;
      const property = enm.values[propertyName];

      if (property) {
        const value = compiler.checker.getConstantValue(<typescript.EnumMember>property.declaration);
        if (typeof value === "number") {
          typescript.setReflectedType(node, property.type);
          return binaryen.valueOf(property.type, op, value);
        }
        compiler.error(node, "Unsupported enum value", value);
        return op.unreachable();
      }
      compiler.error(node, "No such enum value", propertyName);
      return op.unreachable();

    // static class properties are globals
    } else if (reference instanceof reflection.Class) {
      const clazz = <reflection.Class>reference;
      const property = clazz.properties[propertyName];

      if (property && !property.isInstance) {

        const global = compiler.globals[clazz.name + "." + propertyName];
        if (global) {

          if (valueNode) {
            const valueExpression = compiler.compileExpression(valueNode, global.type, global.type, false);

            if (contextualType === reflection.voidType)
              return op.setGlobal(global.name, valueExpression);

            typescript.setReflectedType(node, global.type);
            const binaryenType = binaryen.typeOf(global.type, compiler.uintptrSize);
            return op.block("", [ // emulate tee_global
              op.setGlobal(global.name, valueExpression),
              op.getGlobal(global.name, binaryenType)
            ], binaryenType);

          } else {
            typescript.setReflectedType(node, global.type);
            return op.getGlobal(global.name, binaryen.typeOf(global.type, compiler.uintptrSize));
          }
        } else
          throw Error("unexpected uninitialized global");

      } else {
        compiler.error(node, "No such static property", "'" + propertyName + "' on " + clazz.name);
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

    let valueExpression: binaryen.Expression | undefined;
    if (valueNode)
      valueExpression = compiler.maybeConvertValue(valueNode, compiler.compileExpression(valueNode, property.type), typescript.getReflectedType(valueNode), property.type, false);

    return compileLoadOrStore(compiler, node, property.type, expression, property.offset, valueExpression, contextualType);
  } else {
    const method = clazz.methods[propertyName];
    if (method) {
      // TODO
      if (method.template.isGetter) {
        compiler.error(node, "Using getters as properties is not supported yet");
      } else if (method.template.isSetter) {
        compiler.error(node, "Using setters as properties is not supported yet");
      } else
        compiler.error(node, "Cannot use a method as a property");
      return op.unreachable();
    } else {
      compiler.error(node, "No such property");
      return op.unreachable();
    }
  }
}

export { compilePropertyAccess as default };
