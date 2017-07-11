/**
 * Utility functions.
 * @module assemblyscript/util
 */ /** */

import * as typescript from "./typescript";
import * as reflection from "./reflection";
import * as wabt from "wabt";

/** Tests if the specified node, or optionally its parent, has an 'export' modifier. */
export function isExport(node: typescript.Node, checkParent: boolean = false): boolean {
  if (node && node.modifiers)
    for (let i = 0, k = node.modifiers.length; i < k; ++i)
      if (node.modifiers[i].kind === typescript.SyntaxKind.ExportKeyword)
        return true;
  if (checkParent && node.parent && node.parent.kind === typescript.SyntaxKind.ClassDeclaration)
    return isExport(node.parent);
  return false;
}

/** Tests if the specified node, or optionally its parent, has a 'declare' modifier. */
export function isDeclare(node: typescript.Node, checkParent: boolean = false): boolean {
  if (node && node.modifiers)
    for (let i = 0, k = node.modifiers.length; i < k; ++i)
      if (node.modifiers[i].kind === typescript.SyntaxKind.DeclareKeyword)
        return true;
  if (checkParent && node.parent && node.parent.kind === typescript.SyntaxKind.ClassDeclaration)
    return isDeclare(node.parent);
  return false;
}

/** Tests if the specified node has a 'static' modifier or is otherwise part of a static context. */
export function isStatic(node: typescript.Node): boolean {
  return (<typescript.ModifierFlags>node.modifierFlagsCache & typescript.ModifierFlags.Static) !== 0;
}

/** Tests if the specified node has an 'abstract' modifier. */
export function isAbstract(node: typescript.Node): boolean {
  return (<typescript.ModifierFlags>node.modifierFlagsCache & typescript.ModifierFlags.Abstract) !== 0;
}

/** Tests if the specified node is flagged 'const'. */
export function isConst(node: typescript.Node): boolean {
  return (node.flags & typescript.NodeFlags.Const) !== 0;
}

/** Tests if a function fulfills the requirements to become a start function. */
export function isStartFunction(node: typescript.FunctionLikeDeclaration): boolean {
  return !!(
    node.name &&
    typescript.getTextOfNode(node.name) === "start" &&
    !node.typeParameters &&
    node.parameters.length === 0 &&
    node.type &&
    typescript.getTextOfNode(node.type) === "void"
  );
}

/** Gets the reflected type of an expression. */
export function getReflectedType(node: typescript.Expression): reflection.Type {
  return <reflection.Type>(<any>node).reflectedType || null;
}

/** Sets the reflected type of an expression. */
export function setReflectedType(node: typescript.Expression, type: reflection.Type): void {
  if (!type) throw Error("type cannot be null");
  (<any>node).reflectedType = type;
}

/** Gets the reflected function instance (describing a function with generic types resolved) of a function declaration. */
export function getReflectedFunction(node: typescript.FunctionLikeDeclaration): reflection.Function {
  return <reflection.Function>(<any>node).reflectedFunction || null;
}

/** Sets the reflected function instance (describing a function with generic types resolved) of a function declaration. */
export function setReflectedFunction(node: typescript.FunctionLikeDeclaration, instance: reflection.Function): void {
  if (!instance)
    throw Error("instance cannot be null");
  (<any>node).reflectedFunction = instance;
}

/** Gets the reflected function template (describing a function with unresolved generic types) of a function declaration. */
export function getReflectedFunctionTemplate(node: typescript.FunctionLikeDeclaration): reflection.FunctionTemplate {
  return <reflection.FunctionTemplate>(<any>node).reflectedFunctionTemplate || null;
}

/** Sets the reflected function template (describing a function with unresolved generic types) of a function declaration. */
export function setReflectedFunctionTemplate(node: typescript.FunctionLikeDeclaration, template: reflection.FunctionTemplate): void {
  if (!template)
    throw Error("template cannot be null");
  (<any>node).reflectedFunctionTemplate = template;
}

/** Gets the reflected class instance (describing a class with generic types resolved) of a class declaration. */
export function getReflectedClass(node: typescript.ClassDeclaration): reflection.Class {
  return <reflection.Class>(<any>node).reflectedClass || null;
}

/** Sets the reflected class instance (describing a class with generic types resolved) of a class declaration. */
export function setReflectedClass(node: typescript.ClassDeclaration, instance: reflection.Class): void {
  if (!instance)
    throw Error("instance cannot be null");
  (<any>node).reflectedClass = instance;
}

/** Gets the reflected class template (describing a class with unresolved generic types) of a class declaration. */
export function getReflectedClassTemplate(node: typescript.ClassDeclaration): reflection.ClassTemplate {
  return <reflection.ClassTemplate>(<any>node).reflectedClass || null;
}

/** Sets the reflected class template (describing a class with unresolved generic types) of a class declaration. */
export function setReflectedClassTemplate(node: typescript.ClassDeclaration, template: reflection.ClassTemplate): void {
  if (!template)
    throw Error("template cannot be null");
  (<any>node).reflectedClassTemplate = template;
}

/** wabt.js, if available. */
export import wabt = wabt;

/** Options for {@link wasmToWast}. */
export interface WasmToWastOptions {
  readDebugNames?: boolean;
  foldExprs?: boolean;
  inlineExport?: boolean;
  generateNames?: boolean;
}

/** Converts a WebAssembly binary to text format using linear syntax. Requires wabt.js to be present. */
export function wasmToWast(buffer: Uint8Array, options?: WasmToWastOptions): string {
  if (!wabt)
    throw Error("wabt.js not found");

  if (!options) options = {};
  const module = wabt.readWasm(buffer, { readDebugNames: !!options.readDebugNames });
  if (options.generateNames)
    module.generateNames();
  if (options.generateNames || options.readDebugNames)
    module.applyNames();
  const wast = module.toText({ foldExprs: !!options.foldExprs, inlineExport: !!options.inlineExport });
  module.destroy();
  return wast;
}

/** Options for {@link wastToWasm}. */
export interface WastToWasmOptions {
  filename?: string;
  canonicalizeLebs?: boolean;
  relocatable?: boolean;
  writeDebugNames?: boolean;
}

/** Converts WebAssembly text format using linear syntax to a binary. Requires wabt.js to be present. */
export function wastToWasm(text: string, options?: WastToWasmOptions): Uint8Array {
  if (!wabt)
    throw Error("wabt.js not found");

  if (!options) options = {};
  const module = wabt.parseWast(options.filename || "module.wast", text);
  const wasm = module.toBinary({ canonicalize_lebs: !!options.canonicalizeLebs, relocatable: !!options.relocatable, write_debug_names: !!options.writeDebugNames }).buffer;
  module.destroy();
  return wasm;
}
