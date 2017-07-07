//! { "memoryModel": "importmalloc" }

export function test(): void {
  let s8: Int8Array = new Int8Array(1);
  let u8: Uint8Array = new Uint8Array(2);
  let s16: Int16Array = new Int16Array(3);
  let u16: Uint16Array= new Uint16Array(4);
  let s32: Int32Array = new Int32Array(5);
  let u32: Uint32Array = new Uint32Array(6);
  let s64: Int64Array = new Int64Array(7);
  let u64: Uint64Array = new Uint64Array(8);
  let f32: Float32Array = new Float32Array(9);
  let f64: Float64Array = new Float64Array(10);

  let s8_sub: Array<sbyte> = new Int8Array(11);
}
