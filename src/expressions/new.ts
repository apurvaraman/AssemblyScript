/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles a 'new' expression. */
export function compileNew(compiler: Compiler, node: typescript.NewExpression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  typescript.setReflectedType(node, contextualType);

  if (node.expression.kind !== typescript.SyntaxKind.Identifier) {
    compiler.error(node.expression, "Unsupported use of 'new'", "Identifier expected");
    return op.unreachable();
  }

  const identifierNode = <typescript.Identifier>node.expression;
  if (contextualType !== reflection.voidType && !contextualType.underlyingClass) {
    compiler.error(node, "Unsupported use of 'new'", "Not a void or class context");
    return op.unreachable();
  }

  const reference = compiler.resolveReference(identifierNode);
  let instance: reflection.Class;

  if (reference instanceof reflection.ClassTemplate) {
    const template = <reflection.ClassTemplate>reference;
    let typeArguments: typescript.TypeNode[] | undefined = node.typeArguments;
    if (!typeArguments && contextualType.underlyingClass) { // inherit from contextual class
      const clazz = contextualType.underlyingClass;
      typeArguments = Object.keys(clazz.typeArguments).map(key => clazz.typeArguments[key].node);
    }
    instance = template.resolve(compiler, typeArguments || []);
    instance.initialize(compiler);

  } else if (reference instanceof reflection.Class) {
    instance = <reflection.Class>reference;

  } else {
    compiler.error(node, "Unresolvable call target", typescript.getTextOfNode(identifierNode));
    return op.unreachable();
  }

  if (contextualType.underlyingClass && !instance.isAssignableTo(contextualType.underlyingClass))
    compiler.error(node.expression, "Incompatible types", "Expected " + contextualType.underlyingClass.simpleName + " or a compatible subclass");

  // Find the first implemented constructor
  let current: reflection.Class = instance;
  let ctor: reflection.Function | undefined = instance.ctor;
  while (!(ctor && ctor.body) && current.base) {
    current = current.base;
    ctor = current.ctor;
  }

  // If there is no constructor defined, just allocate memory
  if (!(ctor && ctor.body))
    return compiler.compileMallocInvocation(instance.size);

  // Otherwise compile the constructor if it hasn't been already
  if (!ctor.compiled && ctor.body)
    compiler.compileFunction(ctor);

  // And call it
  return ctor.makeCall(compiler, node, node.arguments || []);
}

export { compileNew as default };
