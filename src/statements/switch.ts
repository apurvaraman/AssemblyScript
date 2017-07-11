/** @module assemblyscript/statements */ /** */

import * as binaryen from "binaryen";
import Compiler from "../compiler";
import * as reflection from "../reflection";
import * as typescript from "../typescript";
import * as util from "../util";

/*
block {
  block {
    block {
      block {
        br_table -> block index
      } $case0
      case[0] statements
    } $case1
    case[1] statements
  } $default
  default statements
} $break
*/

/** Compiles a switch statement. */
export function compileSwitch(compiler: Compiler, node: typescript.SwitchStatement): binaryen.Statement {
  const op = compiler.module;

  if (node.caseBlock.clauses && node.caseBlock.clauses.length) {
    const switchExpression = compiler.compileExpression(node.expression, reflection.intType, reflection.intType, true);
    const label = compiler.enterBreakContext();

    // create a temporary variable holding the switch expression's result
    const conditionLocal = compiler.currentFunction.addLocal("condition$" + label, reflection.intType);

    interface SwitchCase {
      label: string;
      index: number;
      statements: binaryen.Statement[];
      expression?: binaryen.I32Expression;
    }

    const cases: SwitchCase[] = new Array(node.caseBlock.clauses.length);
    let defaultCase: SwitchCase | null = null;
    const labels: string[] = [];

    // scan through cases and also determine default case
    for (let i = 0, k = node.caseBlock.clauses.length; i < k; ++i) {
      const clause = node.caseBlock.clauses[i];
      const statements: binaryen.Statement[] = new Array(clause.statements.length);
      for (let j = 0, l = clause.statements.length; j < l; ++j)
        statements[j] = compiler.compileStatement(clause.statements[j]);
      if (clause.kind === typescript.SyntaxKind.DefaultClause) {
        defaultCase = cases[i] = {
          label: "default$" + label,
          index: i,
          statements: statements
        };
      } else /* typescript.CaseClause */ {
        cases[i] = {
          label:  "case" + i + "$" + label,
          index: i,
          statements: statements,
          expression: compiler.maybeConvertValue(clause.expression, compiler.compileExpression(clause.expression, reflection.intType), util.getReflectedType(clause.expression), reflection.intType, true)
        };
        labels.push(cases[i].label);
      }
    }

    // build the condition as a nested select, starting at its tail
    // TODO: doesn't have to use select for sequential expressions (-O doesn't catch this)
    let condition = op.i32.const(-1);
    for (let i = cases.length - 1; i >= 0; --i)
      if (cases[i] !== defaultCase)
        condition = op.select(op.i32.eq(op.getLocal(conditionLocal.index, compiler.typeOf(reflection.intType)), <binaryen.I32Expression>cases[i].expression), op.i32.const(i), condition);

    // create the innermost br_table block using the first case's label
    let currentBlock = op.block(cases[0].label, [
      op.setLocal(conditionLocal.index, switchExpression),
      op.switch(labels, defaultCase ? defaultCase.label : "break$" + label, condition)
    ]);

    // keep wrapping the last case's block within the current case's block using the next case's label
    for (let i = 0, k = cases.length; i < k; ++i) {
      if (i + 1 < k)
        currentBlock = op.block(cases[i + 1].label, [ currentBlock ].concat(cases[i].statements));
      else // last block is the common outer 'break' target (-O unwraps this if there's no 'break')
        currentBlock = op.block("break$" + label, [ currentBlock ].concat(cases[i].statements));
    }

    compiler.leaveBreakContext();
    return currentBlock;

  } else { // just emit the condition for the case that it includes compound assignments (-O eliminates this otherwise)

    const voidCondition = compiler.compileExpression(node.expression, reflection.voidType);
    if (util.getReflectedType(node.expression) === reflection.voidType)
      return voidCondition;
    else
      return op.drop(voidCondition);
  }
}

export { compileSwitch as default };
