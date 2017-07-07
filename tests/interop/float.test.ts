import * as tape from "tape";
import { hexdump, IModule, arrayHeaderSize } from "../util";

export function test(test: tape.Test, module: IModule) {

  const exports = module.exports;

  let floatPtr = exports.getFloatArray();
  let doublePtr = exports.getDoubleArray();

  // check float return values and memory accessor
  console.log(hexdump(module.buffer, floatPtr, arrayHeaderSize + 4));
  test.strictEqual(exports.getFloatValue(), 0.125, "should have initialized a = 0.125");
  test.strictEqual(module.f32.get(floatPtr + arrayHeaderSize), 0.125, "should f32.get the same value");

  // check double return values and memory accessor
  console.log(hexdump(module.buffer, doublePtr, arrayHeaderSize + 8));
  test.strictEqual(exports.getDoubleValue(), 1.25, "should have initialized b = 1.25");
  test.strictEqual(module.f64.get(doublePtr + arrayHeaderSize), 1.25, "should f64.get the same value");

  // check float setter
  exports.setFloatValue(0.25);
  console.log(hexdump(module.buffer, floatPtr, arrayHeaderSize + 4));
  test.strictEqual(exports.getFloatValue(), 0.25, "should have set a = 0.25");

  // check double setter
  exports.setDoubleValue(2.5);
  console.log(hexdump(module.buffer, doublePtr, arrayHeaderSize + 8));
  test.strictEqual(exports.getDoubleValue(), 2.5, "should have set b = 2.5");

  // check setting float in memory
  module.f32.set(floatPtr + arrayHeaderSize, 0.5);
  console.log(hexdump(module.buffer, floatPtr, arrayHeaderSize + 4));
  test.strictEqual(exports.getFloatValue(), 0.5, "should have f32.set a = 0.5");

  // check setting double in memory
  module.f64.set(doublePtr + arrayHeaderSize, 5.5);
  console.log(hexdump(module.buffer, floatPtr, arrayHeaderSize + 8));
  test.strictEqual(exports.getDoubleValue(), 5.5, "should have f64.set b = 5.5");

  test.end();
}