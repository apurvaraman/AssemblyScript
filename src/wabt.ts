/**
 * A wrapper around WABT.
 *
 * The WABT dependency is optional and the functions below will throw if it is not present.
 *
 * @module assemblyscript/wabt
 */ /** */

import * as wabt from "wabt";

/** Indicates whether WABT-specific functionality is available. */
export const available: boolean = !!wabt;

/** A reusable error message in case wabt.js is not available. */
export const ENOTAVAILABLE: string = "wabt.js could not be found. While it is an optional dependency, using WABT-specific functionality requires it.";

/** Options for {@link wasmToWast}. */
export interface WasmToWastOptions {
  readDebugNames?: boolean;
  foldExprs?: boolean;
  inlineExport?: boolean;
  generateNames?: boolean;
}

/** Converts a WebAssembly binary to text format using stack syntax. */
export function wasmToWast(buffer: Uint8Array, options?: WasmToWastOptions): string {
  if (!available)
    throw Error(ENOTAVAILABLE);

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

/** Converts WebAssembly text format using stack syntax to a binary. */
export function wastToWasm(text: string, options?: WastToWasmOptions): Uint8Array {
  if (!available)
    throw Error(ENOTAVAILABLE);

  if (!options) options = {};
  const module = wabt.parseWast(options.filename || "module.wast", text);
  const wasm = module.toBinary({ canonicalize_lebs: !!options.canonicalizeLebs, relocatable: !!options.relocatable, write_debug_names: !!options.writeDebugNames }).buffer;
  module.destroy();
  return wasm;
}
