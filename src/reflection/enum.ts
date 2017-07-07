/** @module assemblyscript/reflection */ /** */

// import Compiler from "../compiler";
import Property from "./property";
import { intType } from "./type";
import * as typescript from "../typescript";

/** A reflected enum instance. */
export class Enum {

  /** Global name. */
  name: string;
  /** Declaration reference. */
  declaration: typescript.EnumDeclaration;
  /** Enum values. */
  values: { [key: string]: Property };

  /** Constructs a new reflected enum and binds it to its TypeScript declaration. */
  constructor(name: string, declaration: typescript.EnumDeclaration) {
    this.name = name;
    this.declaration = declaration;
    this.values = {};
  }

  /** Initializes the enum and its values. */
  initialize(/* compiler: Compiler */): void {
    for (let i = 0, k = this.declaration.members.length; i < k; ++i) {
      const member = this.declaration.members[i];
      const name = typescript.getTextOfNode(member.name);
      this.values[name] = new Property(name, member, intType, 0, /* for completeness: */ member.initializer);
    }
  }

  toString(): string { return this.name; }
}

export { Enum as default };
