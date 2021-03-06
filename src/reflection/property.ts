/** @module assemblyscript/reflection */ /** */

import Type from "./type";
import * as typescript from "../typescript";

/** A reflected property. Also used to describe enum values. */
export class Property {

  /** Global name. */
  name: string;
  /** Declaration reference. */
  declaration: typescript.PropertyDeclaration | typescript.EnumMember;
  /** Resolved type. */
  type: Type;
  /** Offset in memory, if applicable. */
  offset: number;
  /** Constant value, if applicable. */
  constantValue?: any;

  /** Constructs a new reflected property. */
  constructor(name: string, declaration: typescript.PropertyDeclaration | typescript.EnumMember, type: Type, offset: number, constantValue?: any) {
    this.name = name;
    this.declaration = declaration;
    this.type = type;
    this.offset = offset;
    this.constantValue = constantValue;
  }

  /** Tests if this property has a constant value. */
  get isConstant(): boolean { return this.constantValue !== undefined;}
  /** Tests if this property is an instance member / not static. */
  get isInstance(): boolean { return this.declaration.kind !== typescript.SyntaxKind.EnumMember && !typescript.isStatic(this.declaration); }

  toString(): string { return this.name; }
}

export { Property as default };
