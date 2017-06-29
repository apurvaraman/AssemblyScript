//! { "memoryModel": "bare" }

export function test(a: int[]): void {
  a[0];
  a[0x1];
  a[ 2 ];
  a[ 0x03 ];
  let i: int = 4;
  a[i];
  a[i + 1];
}
