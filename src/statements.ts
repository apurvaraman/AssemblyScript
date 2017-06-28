/**
 * Compiler components dealing with TypeScript statements.
 * @module assemblyscript/statements
 * @preferred
 */ /** */

export * from "./statements/block";
export * from "./statements/break";
export * from "./statements/do";
export * from "./statements/empty";
export * from "./statements/expression";
export * from "./statements/for";
export * from "./statements/if";
export * from "./statements/return";
export * from "./statements/switch";
export * from "./statements/variable";
export * from "./statements/while";

import * as binaryen from "./binaryen";
import Compiler from "./compiler";
import * as typescript from "./typescript";
import {
  compileBlock,
  compileBreak,
  compileDo,
  compileEmpty,
  compileExpression,
  compileFor,
  compileIf,
  compileReturn,
  compileSwitch,
  compileVariable,
  compileWhile
} from "./statements";

/** Compiles a statement. */
export function compile(compiler: Compiler, node: typescript.Statement): binaryen.Statement {
  const op = compiler.module;

  switch (node.kind) {

    case typescript.SyntaxKind.TypeAliasDeclaration:
      return op.nop(); // already handled by TypeScript

    case typescript.SyntaxKind.EmptyStatement:
      return compileEmpty(compiler/*, <typescript.EmptyStatement>node*/);

    case typescript.SyntaxKind.VariableStatement:
      return compileVariable(compiler, <typescript.VariableStatement>node);

    case typescript.SyntaxKind.IfStatement:
      return compileIf(compiler, <typescript.IfStatement>node);

    case typescript.SyntaxKind.SwitchStatement:
      return compileSwitch(compiler, <typescript.SwitchStatement>node);

    case typescript.SyntaxKind.WhileStatement:
      return compileWhile(compiler, <typescript.WhileStatement>node);

    case typescript.SyntaxKind.DoStatement:
      return compileDo(compiler, <typescript.DoStatement>node);

    case typescript.SyntaxKind.ForStatement:
      return compileFor(compiler, <typescript.ForStatement>node);

    case typescript.SyntaxKind.Block:
      return compileBlock(compiler, <typescript.Block>node);

    case typescript.SyntaxKind.BreakStatement:
    case typescript.SyntaxKind.ContinueStatement:
      return compileBreak(compiler, <typescript.BreakStatement | typescript.ContinueStatement>node);

    case typescript.SyntaxKind.ExpressionStatement:
      return compileExpression(compiler, <typescript.ExpressionStatement>node);

    case typescript.SyntaxKind.ReturnStatement:
      return compileReturn(compiler, <typescript.ReturnStatement>node);
  }

  compiler.error(node, "Unsupported statement node", "SyntaxKind " + node.kind);
  return op.unreachable();
}
