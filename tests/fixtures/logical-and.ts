//! { "memoryModel": "bare" }

export function test(a: int, b: float, c: ulong, d: bool): bool {
  if (a && b && c && d)
    return true;
  return false;
}
