//! { "memoryModel": "bare" }

export function test(a: int, b: float, c: string): bool {
  return a && b || c;
}
