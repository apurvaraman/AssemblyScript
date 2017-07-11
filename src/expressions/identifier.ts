/** @module assemblyscript/expressions */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as util from "../util";

/** Compiles an identifier expression. */
export function compileIdentifier(compiler: Compiler, node: typescript.Identifier, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  util.setReflectedType(node, contextualType);

  const reference = compiler.resolveReference(node);
  if (reference) {

    if (reference instanceof reflection.Variable) {
      const variable = <reflection.Variable>reference;
      util.setReflectedType(node, variable.type);

      if (variable.isConstant && variable.value != null) // inline
        return compiler.valueOf(variable.type, variable.value);

      return variable.isGlobal
        ? op.getGlobal(variable.name, compiler.typeOf(variable.type))
        : op.getLocal(variable.index, compiler.typeOf(variable.type));
    }
  }
  compiler.report(node, typescript.DiagnosticsEx.Unresolvable_identifier_0, typescript.getTextOfNode(node));
  return op.unreachable();
}

export { compileIdentifier as default };
