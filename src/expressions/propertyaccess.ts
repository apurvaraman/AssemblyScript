/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import compileLoadOrStore from "./helpers/loadorstore";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as util from "../util";

/** Compiles a property access expression. Sets the property's value to `valueNode` if specified, otherwise gets it. */
export function compilePropertyAccess(compiler: Compiler, node: typescript.PropertyAccessExpression, contextualType: reflection.Type, valueNode?: typescript.Expression): binaryen.Expression {
  const op = compiler.module;

  // fall back to contextual type on error
  util.setReflectedType(node, contextualType);

  // obtain the property's name
  const propertyName = typescript.getTextOfNode(node.name);

  // handle special cases
  if (node.expression.kind === typescript.SyntaxKind.Identifier) {
    const reference = compiler.resolveReference(<typescript.Identifier>node.expression);

    // enum values are constants
    if (reference instanceof reflection.Enum) {
      if (valueNode)
        throw Error("trying to assign to enum value"); // handled by typescript

      util.setReflectedType(node, reflection.intType);

      const enm = <reflection.Enum>reference;
      const property = enm.values[propertyName];

      if (!property)
        throw Error("no such enum property"); // handled by typescript

      const value = compiler.checker.getConstantValue(<typescript.EnumMember>property.declaration);
      if (typeof value === "number") {
        util.setReflectedType(node, property.type);
        return compiler.valueOf(property.type, value);
      }

      compiler.report(node.expression, typescript.DiagnosticsEx.Unsupported_literal_0, value);
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

            util.setReflectedType(node, global.type);
            const binaryenType = compiler.typeOf(global.type);
            return op.block("", [ // emulate tee_global
              op.setGlobal(global.name, valueExpression),
              op.getGlobal(global.name, binaryenType)
            ], binaryenType);

          } else {
            util.setReflectedType(node, global.type);
            return op.getGlobal(global.name, compiler.typeOf(global.type));
          }
        } else
          throw Error("unexpected uninitialized global");

      } else
        throw Error("no such static property '" + propertyName + "' on " + clazz.name); // handled by typescript
    }
  }

  const expression = compiler.compileExpression(node.expression, compiler.uintptrType);
  const expressionType = util.getReflectedType(node.expression);

  if (!(expressionType && expressionType.underlyingClass))
    throw Error("property access used on non-object"); // handled by typescript

  const clazz = expressionType.underlyingClass;
  const property = clazz.properties[propertyName];
  if (property) {
    util.setReflectedType(node, property.type);

    let valueExpression: binaryen.Expression | undefined;
    if (valueNode)
      valueExpression = compiler.maybeConvertValue(valueNode, compiler.compileExpression(valueNode, property.type), util.getReflectedType(valueNode), property.type, false);

    return compileLoadOrStore(compiler, node, property.type, expression, property.offset, valueExpression, contextualType);
  } else {
    const method = clazz.methods[propertyName];
    if (method) {
      // TODO
      if (method.template.isGetter) {
        compiler.report(node, typescript.DiagnosticsEx.Unsupported_modifier_0, "get");
      } else if (method.template.isSetter) {
        compiler.report(node, typescript.DiagnosticsEx.Unsupported_modifier_0, "set");
      } else
        throw Error("trying to use a method as a property"); // handled by typescript
      return op.unreachable();
    } else
      throw Error("no such property"); // handled by typescript
  }
}

export { compilePropertyAccess as default };
