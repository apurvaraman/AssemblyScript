//! { "memoryModel": "exportmalloc" }

let a: string = "abc";

export function getString(): String {
  return a;
}

export function setString(b: string): void {
  a = b;
}

export function length(): int {
  return a.length;
}