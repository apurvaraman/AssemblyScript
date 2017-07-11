/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as util from "../util";

/** Compiles a 'new' expression. */
export function compileNew(compiler: Compiler, node: typescript.NewExpression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  util.setReflectedType(node, contextualType);

  if (node.expression.kind !== typescript.SyntaxKind.Identifier) {
    compiler.report(node.expression, typescript.DiagnosticsEx.Unsupported_node_kind_0_in_1, node.expression.kind, "expressions.compileNew");
    return op.unreachable();
  }

  const identifierNode = <typescript.Identifier>node.expression;
  if (contextualType !== reflection.voidType && !contextualType.underlyingClass)
    throw Error("new used in non-class context"); // handled by typescript

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
    compiler.report(identifierNode, typescript.DiagnosticsEx.Unresolvable_identifier_0, typescript.getTextOfNode(identifierNode));
    return op.unreachable();
  }

  if (contextualType.underlyingClass && !instance.isAssignableTo(contextualType.underlyingClass))
    compiler.report(node.expression, typescript.DiagnosticsEx.Types_0_and_1_are_incompatible, instance.type.toString(), contextualType.underlyingClass.toString());

  // Find the first implemented constructor
  let current: reflection.Class = instance;
  let ctor: reflection.Function | undefined = instance.ctor;
  while (!(ctor && ctor.body) && current.base) {
    current = current.base;
    ctor = current.ctor;
  }

  const allocate = instance.implicitMalloc
    ? compiler.compileMallocInvocation(instance.size) // implicit allocation
    : compiler.valueOf(compiler.uintptrType, 0);  // allocates on its own (this=null)

  // If there is no constructor defined, just allocate memory
  if (!(ctor && ctor.body))
    return allocate;

  // Otherwise compile the constructor if it hasn't been already
  if (!ctor.compiled && ctor.body)
    compiler.compileFunction(ctor);

  // And call it (inserts 'this')
  return ctor.makeCall(compiler, node.arguments || [], allocate);
}

export { compileNew as default };
