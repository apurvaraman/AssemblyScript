//! { "memoryModel": "bare" }

class A {
  static a(): void {}
}

export function test(): void {
  A.a();
}
