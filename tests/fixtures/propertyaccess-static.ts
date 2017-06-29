//! { "memoryModel": "bare" }

class A {
  static a: int;
}

export function test(): void {
  A.a;
}
