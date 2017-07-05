//! { "memoryModel": "bare" }

function fn(a: int = 1, b: int = 2): void {
}

export function test(): void {
  fn();
  fn(3);
  fn(3, 4);
}
