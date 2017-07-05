/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles an identifier expression. */
export function compileIdentifier(compiler: Compiler, node: typescript.Identifier, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  const reference = compiler.resolveReference(node);
  if (reference) {

    if (reference instanceof reflection.Variable) {
      const variable = <reflection.Variable>reference;
      typescript.setReflectedType(node, variable.type);

      if (variable.isConstant && variable.value != null) // inline
        return binaryen.valueOf(variable.type, op, variable.value);

      return variable.isGlobal
        ? op.getGlobal(variable.name, binaryen.typeOf(variable.type, compiler.uintptrSize))
        : op.getLocal(variable.index, binaryen.typeOf(variable.type, compiler.uintptrSize));
    }

  }
  compiler.error(node, "Unresolvable identifier", node.text);
  typescript.setReflectedType(node, contextualType);
  return op.unreachable();
}

export { compileIdentifier as default };
