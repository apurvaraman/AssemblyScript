//! { "memoryModel": "importmalloc" }

/* class A {
  a: int = 1;
  b: int = this.a + 2;

  // doesn't work, yet
} */

class B {
  a: int = 1;
  b: int = this.a + 2;

  constructor() {
  }
}

export function test(): void {
  // let a: A = new A();
  let b: B = new B();
}
