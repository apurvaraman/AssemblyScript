/** @module assemblyscript/reflection */ /** */

import Type from "./type";
import * as typescript from "../typescript";
import * as util from "../util";

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
  /** Initializer expression, if applicable. */
  initializer: typescript.Expression | undefined;

  /** Constructs a new reflected property. */
  constructor(name: string, declaration: typescript.PropertyDeclaration | typescript.EnumMember, type: Type, offset: number, initializer?: typescript.Expression) {
    this.name = name;
    this.declaration = declaration;
    this.type = type;
    this.offset = offset;
    this.initializer = initializer;
  }

  /** Tests if this property is an instance member / not static. */
  get isInstance(): boolean { return this.declaration.kind !== typescript.SyntaxKind.EnumMember && !util.isStatic(this.declaration); }

  toString(): string { return this.name; }
}

export { Property as default };
