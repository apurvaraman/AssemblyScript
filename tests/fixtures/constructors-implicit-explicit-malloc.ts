//! { "memoryModel": "importmalloc" }

class TestImplicit {
  constructor() {
  }
}

@no_implicit_malloc()
class TestExplicit {
  readonly prop: byte; // let's pretend...
  constructor() {
    let ptr: uintptr = malloc(1);
    return unsafe_cast<uintptr,this>(ptr);
  }
}

export function test(): void {
  let implicit: TestImplicit = new TestImplicit();
  let explicit: TestExplicit = new TestExplicit();
}
