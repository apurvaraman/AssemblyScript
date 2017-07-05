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
  a.a = 1;
  a.b;
  a.b.c;
  a.b.c = 2;
}
