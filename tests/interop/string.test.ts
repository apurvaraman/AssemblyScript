import * as tape from "tape";
import { hexdump, IModule, arrayHeaderSize } from "../util";

export function test(test: tape.Test, module: IModule) {

  const exports = module.exports;

  let ptr = exports.getString();

  // check initialization in static memory
  console.log(hexdump(module.buffer, ptr, arrayHeaderSize + 6));
  test.strictEqual(module.string.get(ptr), "abc", "should have initialized a = 'abc'");

  // create a new string and set it by reference
  let stringPtr = module.string.create("def");
  exports.setString(stringPtr);

  // verify that 'a' now references the temporary string
  console.log(hexdump(module.buffer, stringPtr, arrayHeaderSize + 6));
  test.strictEqual(exports.getString(), stringPtr, "should now reference the temporary string");
  test.strictEqual(module.string.get(stringPtr), "def", "should have set a = 'def'");

  // replace a character in memory
  module.u16.set(stringPtr + arrayHeaderSize + 2, 103); // middle char = 'g'

  // verify that the character has been replaced
  console.log(hexdump(module.buffer, stringPtr, arrayHeaderSize + 6));
  test.strictEqual(exports.getString(), stringPtr, "should still reference the temporary string");
  test.strictEqual(module.string.get(stringPtr), "dgf", "should have replaced a[1] with 'g'");

  // reset to the initial string, by reference
  exports.setString(ptr);
  exports.free(stringPtr);

  // verify that 'a' now references the initial string
  console.log(hexdump(module.buffer, ptr, arrayHeaderSize + 6));
  test.strictEqual(exports.getString(), ptr, "should now reference the initial string again");
  test.strictEqual(module.string.get(ptr), "abc", "should return a = 'abc'");

  // verify that 'free' above worked
  const reusedPtr = exports.malloc(1);
  test.strictEqual(reusedPtr, stringPtr, "should reuse memory of the free'd temporary string");

  test.end();
}