import * as tape from "tape";
import { hexdump, IModule, arrayHeaderSize } from "../util";

export function test(test: tape.Test, module: IModule) {

  const exports = module.exports;

  // getArray(): int[] -> pointer
  let ptr = exports.getArray() >>> 0;

  // verify initial contents set within start()
  console.log(hexdump(module.buffer, ptr, arrayHeaderSize + 12));
  test.strictEqual(exports.getArrayCapacity(), 3, "should have initialized an array of capacity 3");
  test.strictEqual(exports.getArrayLength(), 3, "should have initialized an array of size 3");
  test.strictEqual(exports.getArrayElement(0), 1, "should have initialized a[0] = 1");
  test.strictEqual(exports.getArrayElement(1), 2, "should have initialized a[1] = 2");
  test.strictEqual(exports.getArrayElement(2), 3, "should have initialized a[2] = 3");

  // create a new array (this calls malloc) of size 3 with 4-byte (int) elements
  let array = module.array.create(3, 4);

  // set values to 4, 5, 6
  for (let i = 0; i < 3; ++i)
    module.int.set(array.base + i * 4, i + 4);

  // set the entire array by reference (its pointer value)
  exports.setArray(array.ptr);

  // verify that 'a' now references the new array
  console.log(hexdump(module.buffer, array.ptr, arrayHeaderSize + 12));
  test.strictEqual(exports.getArray(), array.ptr, "should now reference the temporary array");
  test.strictEqual(exports.getArrayElement(0), 4, "should return a[0] = 4");
  test.strictEqual(exports.getArrayElement(1), 5, "should return a[1] = 5");
  test.strictEqual(exports.getArrayElement(2), 6, "should return a[2] = 6");

  // set new element values through a[i] = ...
  exports.setArrayElement(0, 7);
  exports.setArrayElement(1, 8);
  exports.setArrayElement(2, 9);

  // verify that the values have been changed
  console.log(hexdump(module.buffer, array.ptr, arrayHeaderSize + 12));
  test.strictEqual(exports.getArray(), array.ptr, "should still reference the temporary array");
  test.strictEqual(exports.getArrayElement(0), 7, "should return a[0] = 7");
  test.strictEqual(exports.getArrayElement(1), 8, "should return a[1] = 8");
  test.strictEqual(exports.getArrayElement(2), 9, "should return a[2] = 9");

  // set new element values by providing a reference to the initial array
  exports.setArrayFrom(ptr);

  // verify that the values have been changed
  console.log(hexdump(module.buffer, array.ptr, arrayHeaderSize + 12));
  test.strictEqual(exports.getArray(), array.ptr, "should still reference the temporary array");
  test.strictEqual(exports.getArrayElement(0), 1, "should return a[0] = 1");
  test.strictEqual(exports.getArrayElement(1), 2, "should return a[1] = 2");
  test.strictEqual(exports.getArrayElement(2), 3, "should return a[2] = 3");

  // reset to the initial reference and free the temporary array
  exports.setArray(ptr);
  exports.free(array.ptr);

  // verify that the reference has been changed
  console.log(hexdump(module.buffer, ptr, arrayHeaderSize + 12));
  test.strictEqual(exports.getArray(), ptr, "should now reference the initial array again");
  test.strictEqual(exports.getArrayElement(0), 1, "should return a[0] = 1");
  test.strictEqual(exports.getArrayElement(1), 2, "should return a[1] = 2");
  test.strictEqual(exports.getArrayElement(2), 3, "should return a[2] = 3");

  // verify that 'free' above worked
  const reusedPtr = exports.malloc(1);
  test.strictEqual(reusedPtr, array.ptr, "should reuse memory of the free'd temporary array");

  test.end();
}