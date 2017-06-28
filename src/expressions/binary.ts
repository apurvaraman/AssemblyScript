/** @module assemblyscript/expressions */ /** */

import * as binaryen from "../binaryen";
import Compiler from "../compiler";
import compileLoad from "./helpers/load";
import compileStore from "./helpers/store";
import * as reflection from "../reflection";
import * as typescript from "../typescript";

/** Compiles a binary expression. Covers addition, multiplication and so on. */
export function compileBinary(compiler: Compiler, node: typescript.BinaryExpression, contextualType: reflection.Type): binaryen.Expression {

  if (node.operatorToken.kind === typescript.SyntaxKind.EqualsToken)
    return compileAssignment(compiler, node, contextualType);

  let left: binaryen.Expression = compiler.compileExpression(node.left, contextualType);
  let leftType: reflection.Type = typescript.getReflectedType(node.left);

  let right: binaryen.Expression;
  let rightType: reflection.Type;
  let commonType: reflection.Type | undefined;
  let resultType: reflection.Type;

  // TODO: This is most likely incorrect
  switch (node.operatorToken.kind) {

    // **, *, /, %, +, -
    // prefer float over int, otherwise select the larger type
    case typescript.SyntaxKind.AsteriskAsteriskToken:
    case typescript.SyntaxKind.AsteriskToken:
    case typescript.SyntaxKind.SlashToken:
    case typescript.SyntaxKind.PercentToken:
    case typescript.SyntaxKind.PlusToken:
    case typescript.SyntaxKind.MinusToken:
      right = compiler.compileExpression(node.right, leftType);
      rightType = typescript.getReflectedType(node.right);

      if (leftType.isAnyFloat) {
        if (rightType.isAnyFloat)
          commonType = leftType.size >= rightType.size ? leftType : rightType;
        else
          commonType = leftType;
      } else if (rightType.isAnyFloat)
        commonType = rightType;
      else
        commonType = leftType.size >= rightType.size ? leftType : rightType;

      left = compiler.maybeConvertValue(node.left, left, leftType, commonType, false);
      right = compiler.maybeConvertValue(node.right, right, rightType, commonType, false);
      leftType = rightType = commonType;

      resultType = commonType;
      break;

    // <<, <<=, >>, >>=
    // use left type, derive right type to compatible int
    case typescript.SyntaxKind.LessThanLessThanToken:
    case typescript.SyntaxKind.LessThanLessThanEqualsToken:
    case typescript.SyntaxKind.GreaterThanGreaterThanToken:
    case typescript.SyntaxKind.GreaterThanGreaterThanEqualsToken:
      if (leftType.isAnyFloat) { // will actually generate an implicit conversion error but it's here for completeness
        left = compiler.compileExpression(node.left, reflection.longType);
        left = compiler.maybeConvertValue(node.left, left, typescript.getReflectedType(node.left), reflection.longType, false);
        leftType = reflection.longType;
        right = compiler.compileExpression(node.right, reflection.longType);
        right = compiler.maybeConvertValue(node.right, right, typescript.getReflectedType(node.right), reflection.longType, false);
        rightType = reflection.longType;
        commonType = reflection.longType;
      } else if (leftType.isLong) {
        right = compiler.compileExpression(node.right, reflection.longType);
        right = compiler.maybeConvertValue(node.right, right, typescript.getReflectedType(node.right), reflection.longType, false);
        rightType = reflection.longType;
        // has no common type (left might be unsigned)
      } else { // i.e. int, ushort etc.
        left = compiler.compileExpression(node.left, reflection.intType);
        left = compiler.maybeConvertValue(node.left, left, typescript.getReflectedType(node.left), reflection.intType, false);
        leftType = reflection.intType;
        right = compiler.compileExpression(node.right, reflection.intType);
        right = compiler.maybeConvertValue(node.right, right, typescript.getReflectedType(node.right), reflection.intType, false);
        rightType = reflection.intType;
        // has no common type (left might be unsigned)
      }
      resultType = leftType;
      break;

    // <, <=, >, >=, ==, !=
    // prefer float over int, otherwise select the larger type, result is bool
    case typescript.SyntaxKind.LessThanToken:
    case typescript.SyntaxKind.LessThanEqualsToken:
    case typescript.SyntaxKind.GreaterThanToken:
    case typescript.SyntaxKind.GreaterThanEqualsToken:
    case typescript.SyntaxKind.EqualsEqualsToken:
    case typescript.SyntaxKind.EqualsEqualsEqualsToken:
    case typescript.SyntaxKind.ExclamationEqualsToken:
    case typescript.SyntaxKind.ExclamationEqualsEqualsToken:
      right = compiler.compileExpression(node.right, leftType);
      rightType = typescript.getReflectedType(node.right);

      if (leftType.isAnyFloat) {
        if (rightType.isAnyFloat)
          commonType = leftType.size >= rightType.size ? leftType : rightType;
        else
          commonType = leftType;
      } else if (rightType.isAnyFloat)
        commonType = rightType;
      else
        commonType = leftType.size > rightType.size
          ? leftType
          : rightType.size > leftType.size
            ? rightType
            : leftType.isSigned === rightType.isSigned
              ? leftType
              : leftType.isSigned === contextualType.isSigned
                ? leftType
                : rightType;

      left = compiler.maybeConvertValue(node.left, left, leftType, commonType, false);
      right = compiler.maybeConvertValue(node.right, right, rightType, commonType, false);
      leftType = rightType = commonType;

      resultType = reflection.boolType;
      break;

    // &, |, ^
    // prefer long over int and common signage, otherwise select the larger int type with contextual signage
    case typescript.SyntaxKind.AmpersandToken:
    case typescript.SyntaxKind.BarToken:
    case typescript.SyntaxKind.CaretToken:
      right = compiler.compileExpression(node.right, leftType);
      rightType = typescript.getReflectedType(node.right);
      if (leftType.isLong) {
        if (rightType.isLong) {
          commonType = leftType.isSigned === rightType.isSigned
            ? leftType
            : contextualType.isSigned
              ? reflection.longType
              : reflection.ulongType;
        } else
          commonType = leftType;
      } else if (rightType.isLong)
        commonType = rightType;
      else
        commonType = leftType.size > rightType.size
          ? leftType
          : rightType.size > leftType.size
            ? rightType
            : leftType.isSigned === rightType.isSigned
              ? leftType
              : leftType.isSigned === contextualType.isSigned
                ? leftType
                : rightType;

      left = compiler.maybeConvertValue(node.left, left, leftType, commonType, false);
      right = compiler.maybeConvertValue(node.right, right, rightType, commonType, false);
      leftType = rightType = commonType;

      resultType = commonType;
      break;

    // &&, ||
    // TODO: decide how to handle these
    // case typescript.SyntaxKind.AmpersandAmpersandToken:
    // case typescript.SyntaxKind.BarBarToken:

    // +=, -=, **=, *=, /=, %=, &=, |=, ^=
    // prioritize left type, result is left type
    default:
    // case typescript.SyntaxKind.PlusEqualsToken:
    // case typescript.SyntaxKind.MinusEqualsToken:
    // case typescript.SyntaxKind.AsteriskAsteriskEqualsToken:
    // case typescript.SyntaxKind.AsteriskEqualsToken:
    // case typescript.SyntaxKind.SlashEqualsToken:
    // case typescript.SyntaxKind.PercentEqualsToken:
    // case typescript.SyntaxKind.AmpersandEqualsToken:
    // case typescript.SyntaxKind.BarEqualsToken:
    // case typescript.SyntaxKind.CaretEqualsToken:
      right = compiler.compileExpression(node.right, leftType);
      right = compiler.maybeConvertValue(node.right, right, typescript.getReflectedType(node.right), leftType, false);
      rightType = leftType;

      resultType = leftType;
      break;
  }

  const isCompound = node.operatorToken.kind >= typescript.SyntaxKind.FirstCompoundAssignment && node.operatorToken.kind <= typescript.SyntaxKind.LastCompoundAssignment;
  const op = compiler.module;

  typescript.setReflectedType(node, resultType);

  let result: binaryen.Expression | null = null;

  const operandType = commonType || leftType;
  const operandCategory = binaryen.categoryOf(operandType, op, compiler.uintptrSize);
  // const resultCategory = binaryen.categoryOf(resultType, op, compiler.uintptrSize);

  if (operandType.isAnyFloat) {

    const category = <binaryen.F32Operations | binaryen.F64Operations>operandCategory;

    switch (node.operatorToken.kind) {

      // Arithmetic
      case typescript.SyntaxKind.PlusToken:
      case typescript.SyntaxKind.PlusEqualsToken:
        result = category.add(left, right);
        break;

      case typescript.SyntaxKind.MinusToken:
      case typescript.SyntaxKind.MinusEqualsToken:
        result = category.sub(left, right);
        break;

      case typescript.SyntaxKind.AsteriskToken:
      case typescript.SyntaxKind.AsteriskEqualsToken:
        result = category.mul(left, right);
        break;

      case typescript.SyntaxKind.SlashToken:
      case typescript.SyntaxKind.SlashEqualsToken:
        result = category.div(left, right);
        break;

      case typescript.SyntaxKind.PercentToken:
      case typescript.SyntaxKind.PercentEqualsToken:
        // TODO: maybe emulate, not a built-in operation
        break;

      // Logical
      case typescript.SyntaxKind.EqualsEqualsEqualsToken:
        compiler.warn(node.operatorToken, "Assuming '=='");
      case typescript.SyntaxKind.EqualsEqualsToken:
        result = category.eq(left, right);
        break;

      case typescript.SyntaxKind.ExclamationEqualsEqualsToken:
        compiler.warn(node.operatorToken, "Assuming '!='");
      case typescript.SyntaxKind.ExclamationEqualsToken:
        result = category.ne(left, right);
        break;

      case typescript.SyntaxKind.GreaterThanToken:
        result = category.gt(left, right);
        break;

      case typescript.SyntaxKind.GreaterThanEqualsToken:
        result = category.ge(left, right);
        break;

      case typescript.SyntaxKind.LessThanToken:
        result = category.lt(left, right);
        break;

      case typescript.SyntaxKind.LessThanEqualsToken:
        result = category.le(left, right);
        break;

    }

  } else if (operandType.isAnyInteger) {

    const category = <binaryen.I32Operations | binaryen.I64Operations>operandCategory;

    switch (node.operatorToken.kind) {

      // Arithmetic
      case typescript.SyntaxKind.PlusToken:
      case typescript.SyntaxKind.PlusEqualsToken:
        result = category.add(left, right);
        break;

      case typescript.SyntaxKind.MinusToken:
      case typescript.SyntaxKind.MinusEqualsToken:
        result = category.sub(left, right);
        break;

      case typescript.SyntaxKind.AsteriskToken:
      case typescript.SyntaxKind.AsteriskEqualsToken:
        result = category.mul(left, right);
        break;

      case typescript.SyntaxKind.SlashToken:
      case typescript.SyntaxKind.SlashEqualsToken:
        if (resultType.isSigned)
          result = category.div_s(left, right);
        else
          result = category.div_u(left, right);
        break;

      case typescript.SyntaxKind.PercentToken:
      case typescript.SyntaxKind.PercentEqualsToken:
        if (resultType.isSigned)
          result = category.rem_s(left, right);
        else
          result = category.rem_u(left, right);
        break;

      case typescript.SyntaxKind.AmpersandToken:
      case typescript.SyntaxKind.AmpersandEqualsToken:
        result = category.and(left, right);
        break;

      case typescript.SyntaxKind.BarToken:
      case typescript.SyntaxKind.BarEqualsToken:
        result = category.or(left, right);
        break;

      case typescript.SyntaxKind.CaretToken:
      case typescript.SyntaxKind.CaretEqualsToken:
        result = category.xor(left, right);
        break;

      case typescript.SyntaxKind.LessThanLessThanToken:
      case typescript.SyntaxKind.LessThanLessThanEqualsToken:
        result = category.shl(left, right);
        break;

      case typescript.SyntaxKind.GreaterThanGreaterThanToken:
      case typescript.SyntaxKind.GreaterThanGreaterThanEqualsToken:
        if (resultType.isSigned)
          result = category.shr_s(left, right);
        else
          result = category.shr_u(left, right);
        break;

      // Logical
      case typescript.SyntaxKind.EqualsEqualsEqualsToken:
        compiler.warn(node.operatorToken, "Assuming '=='");
      case typescript.SyntaxKind.EqualsEqualsToken:
        result = category.eq(left, right);
        break;

      case typescript.SyntaxKind.ExclamationEqualsToken:
        result = category.ne(left, right);
        break;

      case typescript.SyntaxKind.GreaterThanToken:
        if (resultType.isSigned)
          result = category.gt_s(left, right);
        else
          result = category.gt_u(left, right);
        break;

      case typescript.SyntaxKind.GreaterThanEqualsToken:
        if (resultType.isSigned)
          result = category.ge_s(left, right);
        else
          result = category.ge_u(left, right);
        break;

      case typescript.SyntaxKind.LessThanToken:
        if (resultType.isSigned)
          result = category.lt_s(left, right);
        else
          result = category.lt_u(left, right);
        break;

      case typescript.SyntaxKind.LessThanEqualsToken:
        if (resultType.isSigned)
          result = category.le_s(left, right);
        else
          result = category.le_u(left, right);
        break;

    }

    // sign-extend respectively mask small integer results
    if (result && (resultType.isByte || resultType.isShort))
      result = compiler.maybeConvertValue(node, result, reflection.intType, resultType, true);
  }

  if (result)
    return isCompound
      ? compileAssignmentWithValue(compiler, node, result, contextualType)
      : result;

  compiler.error(node.operatorToken, "Unsupported binary operator");
  return op.unreachable();
}

export function compileAssignment(compiler: Compiler, node: typescript.BinaryExpression, contextualType: reflection.Type): binaryen.Expression {
  compiler.compileExpression(node.left, contextualType); // determines left type (usually an identifier anyway)
  return compileAssignmentWithValue(compiler, node, compiler.compileExpression(node.right, typescript.getReflectedType(node.left)), contextualType);
}

export function compileAssignmentWithValue(compiler: Compiler, node: typescript.BinaryExpression, value: binaryen.Expression, contextualType: reflection.Type): binaryen.Expression {
  const op = compiler.module;

  typescript.setReflectedType(node, contextualType);

  // identifier = expression
  if (node.left.kind === typescript.SyntaxKind.Identifier) {
    const reference = compiler.resolveReference(<typescript.Identifier>node.left);
    if (reference) {

      if (reference instanceof reflection.Variable) {
        const variable = <reflection.Variable>reference;
        const expression = compiler.maybeConvertValue(node.right, value, typescript.getReflectedType(node.right), variable.type, false);

        if (contextualType === reflection.voidType)
          return variable.isGlobal
            ? op.setGlobal(variable.name, expression)
            : op.setLocal(variable.index, expression);

        typescript.setReflectedType(node, variable.type);
        return variable.isGlobal
          ? op.block("", [ // emulates teeGlobal
              op.setGlobal(variable.name, expression),
              op.getGlobal(variable.name, binaryen.typeOf(variable.type, compiler.uintptrSize))
            ], binaryen.typeOf(variable.type, compiler.uintptrSize))
          : op.teeLocal(variable.index, expression);
      }

    }

  } else if (node.left.kind === typescript.SyntaxKind.ElementAccessExpression) {
    const accessNode = <typescript.ElementAccessExpression>node.left;
    const reference = compiler.resolveReference(<typescript.Identifier>accessNode.expression);
    const binaryenPtrType = binaryen.typeOf(compiler.uintptrType, compiler.uintptrSize);
    const uintptrCategory = <binaryen.I32Operations | binaryen.I64Operations>binaryen.categoryOf(compiler.uintptrType, op, compiler.uintptrSize);
    const argumentNode = <typescript.Expression>accessNode.argumentExpression;
    const argument = compiler.maybeConvertValue(argumentNode, compiler.compileExpression(argumentNode, compiler.uintptrType), typescript.getReflectedType(argumentNode), compiler.uintptrType, false);

    // this[argument] = expression
    if (accessNode.expression.kind === typescript.SyntaxKind.ThisKeyword) {
      const clazz = compiler.currentFunction && compiler.currentFunction.parent || null;
      if (clazz && compiler.currentFunction.isInstance) {
        if (clazz.type.isArray) {
          const underlyingType = (<reflection.Class>clazz.type.underlyingClass).typeArguments.T.type;
          const storeOp = compileStore(compiler, accessNode, underlyingType,
            uintptrCategory.add(
              op.getLocal(0, binaryenPtrType),
              uintptrCategory.mul(
                argument,
                binaryen.valueOf(compiler.uintptrType, op, underlyingType.size)
              )
            ), value, compiler.uintptrSize
          );

          if (contextualType === reflection.voidType)
            return storeOp;

          typescript.setReflectedType(node, underlyingType);
          // TODO

        } else {
          compiler.error(accessNode, "Array access used on non-array object");
          return op.unreachable();
        }
      } else {
        compiler.error(accessNode.expression, "'this' keyword used in non-instance context");
        return op.unreachable();
      }

    // identifier[argument] = expression
    } else if (accessNode.expression.kind === typescript.SyntaxKind.Identifier) {

      if (reference instanceof reflection.Variable) {
        const variable = <reflection.Variable>reference;
        if (variable.type.isArray) {
          const underlyingType = (<reflection.Class>variable.type.underlyingClass).typeArguments.T.type;
          const storeOp = compileStore(compiler, accessNode, underlyingType,
            uintptrCategory.add(
              compiler.compileExpression(accessNode.expression, compiler.uintptrType),
              uintptrCategory.mul(
                argument,
                binaryen.valueOf(compiler.uintptrType, op, underlyingType.size)
              )
            ), value, compiler.uintptrSize
          );

          if (contextualType === reflection.voidType)
            return storeOp;

          typescript.setReflectedType(node, variable.type);
          // TODO

        } else {
          compiler.error(accessNode, "Array access used on non-array object");
          return op.unreachable();
        }
      }
    }

  } else if (node.left.kind === typescript.SyntaxKind.PropertyAccessExpression) {
    const accessNode = <typescript.PropertyAccessExpression>node.left;
    const propertyName = typescript.getTextOfNode(accessNode.name);

    // this.identifier = expression
    if (accessNode.expression.kind === typescript.SyntaxKind.ThisKeyword) {
      const clazz = compiler.currentFunction && compiler.currentFunction.parent || null;
      if (clazz) {
        const property = clazz.properties[propertyName];
        if (property) {
          const storeOp = compileStore(compiler, accessNode, property.type,
            op.getLocal(0, binaryen.typeOf(compiler.uintptrType, compiler.uintptrSize)), // ^= this
            compiler.maybeConvertValue(node.right, value, typescript.getReflectedType(node.right), property.type, false),
            property.offset
          );

          if (contextualType === reflection.voidType)
            return storeOp;

          typescript.setReflectedType(node, property.type);
          return op.block("", [
            storeOp,
            compileLoad(compiler, accessNode, property.type, op.getLocal(0, binaryen.typeOf(compiler.uintptrType, compiler.uintptrSize)), property.offset)
          ], binaryen.typeOf(property.type, compiler.uintptrSize));
        } else {
          compiler.error(node, "No such instance property", "'" + propertyName + "' on " + clazz.name);
          return op.unreachable();
        }
      } else {
        compiler.error(accessNode, "'this' keyword used in non-instance context");
        return op.unreachable();
      }

    // identifier.identifier = expression
    } else if (accessNode.expression.kind === typescript.SyntaxKind.Identifier) {
      const reference = compiler.resolveReference(<typescript.Identifier>accessNode.expression);

      if (reference instanceof reflection.Class) {
        const clazz = <reflection.Class>reference;
        const property = clazz.properties[propertyName];
        if (property && !property.isInstance) {
          if (property.isConstant) {
            compiler.error(node, "Cannot assign to constant static property", "'" + propertyName + "' on " + clazz.name);
            return op.unreachable();
          } else {
            // const global = compiler.globals[clazz.name + "." + propertyName];
            // TODO: a static property is a global
          }
        } else {
          compiler.error(node, "No such static property", "'" + propertyName + "' on " + clazz.name);
          return op.unreachable();
        }

      } else if (reference instanceof reflection.Variable) {
        const variable = <reflection.Variable>reference;

        if (variable.type.isClass) {
          const clazz = <reflection.Class>variable.type.underlyingClass;
          const property = clazz.properties[propertyName];
          if (property && property.isInstance) {
            const storeOp = compileStore(compiler, accessNode, property.type,
              op.getLocal(variable.index, binaryen.typeOf(compiler.uintptrType, compiler.uintptrSize)), // ^= this
              compiler.maybeConvertValue(node.right, value, typescript.getReflectedType(node.right), property.type, false),
              property.offset
            );

            if (contextualType === reflection.voidType)
              return storeOp;

            typescript.setReflectedType(node, property.type);
            return op.block("", [
              storeOp,
              compileLoad(compiler, accessNode, property.type, op.getLocal(variable.index, binaryen.typeOf(compiler.uintptrType, compiler.uintptrSize)), property.offset)
            ], binaryen.typeOf(property.type, compiler.uintptrSize));
          } else {
            compiler.error(node, "No such instance property", "'" + propertyName + "' on " + clazz.name);
            return op.unreachable();
          }
        }
      }
    }
  }

  compiler.error(node.operatorToken, "Unsupported assignment");
  return op.unreachable();
}
