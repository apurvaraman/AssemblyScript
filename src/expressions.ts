/**
 * Compiler components dealing with TypeScript expressions.
 * @module assemblyscript/expressions
 * @preferred
 */ /** */

export * from "./expressions/as";
export * from "./expressions/binary";
export * from "./expressions/call";
export * from "./expressions/conditional";
export * from "./expressions/elementaccess";
export * from "./expressions/helpers/load";
export * from "./expressions/helpers/store";
export * from "./expressions/identifier";
export * from "./expressions/literal";
export * from "./expressions/new";
export * from "./expressions/parenthesized";
export * from "./expressions/postfixunary";
export * from "./expressions/prefixunary";
export * from "./expressions/propertyaccess";

import * as binaryen from "./binaryen";
import Compiler from "./compiler";
import * as reflection from "./reflection";
import * as typescript from "./typescript";
import {
  compileAs,
  compileBinary,
  compileCall,
  compileConditional,
  compileElementAccess,
  compileIdentifier,
  compileLiteral,
  compileNew,
  compileParenthesized,
  compilePostfixUnary,
  compilePrefixUnary,
  compilePropertyAccess
} from "./expressions";

/** Compiles an expression. */
export function compile(compiler: Compiler, node: typescript.Expression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  typescript.setReflectedType(node, contextualType);

  switch (node.kind) {

    case typescript.SyntaxKind.ParenthesizedExpression:
      return compileParenthesized(compiler, <typescript.ParenthesizedExpression>node, contextualType);

    case typescript.SyntaxKind.AsExpression:
      return compileAs(compiler, <typescript.AsExpression>node, contextualType);

    case typescript.SyntaxKind.BinaryExpression:
      return compileBinary(compiler, <typescript.BinaryExpression>node, contextualType);

    case typescript.SyntaxKind.PrefixUnaryExpression:
      return compilePrefixUnary(compiler, <typescript.PrefixUnaryExpression>node, contextualType);

    case typescript.SyntaxKind.PostfixUnaryExpression:
      return compilePostfixUnary(compiler, <typescript.PostfixUnaryExpression>node, contextualType);

    case typescript.SyntaxKind.Identifier:
      return compileIdentifier(compiler, <typescript.Identifier>node, contextualType);

    case typescript.SyntaxKind.PropertyAccessExpression:
      return compilePropertyAccess(compiler, <typescript.PropertyAccessExpression>node, contextualType);

    case typescript.SyntaxKind.ElementAccessExpression:
      return compileElementAccess(compiler, <typescript.ElementAccessExpression>node, contextualType);

    case typescript.SyntaxKind.ConditionalExpression:
      return compileConditional(compiler, <typescript.ConditionalExpression>node, contextualType);

    case typescript.SyntaxKind.CallExpression:
      return compileCall(compiler, <typescript.CallExpression>node, contextualType);

    case typescript.SyntaxKind.NewExpression:
      return compileNew(compiler, <typescript.NewExpression>node, contextualType);

    case typescript.SyntaxKind.ThisKeyword:
      if (!compiler.currentFunction.isInstance)
        compiler.error(node, "'this' used in non-instance context");
      return op.getLocal(0, binaryen.typeOf(compiler.uintptrType, compiler.uintptrSize));

    case typescript.SyntaxKind.TrueKeyword:
    case typescript.SyntaxKind.FalseKeyword:
    case typescript.SyntaxKind.NullKeyword:
    case typescript.SyntaxKind.NumericLiteral:
    case typescript.SyntaxKind.StringLiteral:
      return compileLiteral(compiler, <typescript.LiteralExpression>node, contextualType);
  }

  compiler.error(node, "Unsupported expression node", "SyntaxKind " + node.kind);
  typescript.setReflectedType(node, contextualType);
  return op.unreachable();
}
