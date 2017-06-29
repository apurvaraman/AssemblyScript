//! { "memoryModel": "bare" }

class B {
  c: int;
}

class A {
  a: int;
  b: B;
}

export function test(a: A): void {
  a.a;
  a.b;
  a.b.c;
}
