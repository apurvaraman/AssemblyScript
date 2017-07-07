//! { "memoryModel": "importmalloc" }

class A {
  constructor(a: int, b: int = 2) {
  }
}

class B extends A {
  constructor() {
    super(1);
  }
}

export function test(): void {
  let a: A = new B();
}
