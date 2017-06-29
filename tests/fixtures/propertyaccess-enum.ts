//! { "memoryModel": "bare" }

enum A {
  ZERO,
  ONE,
  FOUR = 4
}

export function test(): void {
  A.ZERO;
  A.ONE;
  A.FOUR;
}
