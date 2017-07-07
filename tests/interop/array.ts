//! { "memoryModel": "exportmalloc" }

let a: int[] = new Array(3);

function start(): void {
  a[0] = 1;
  a[1] = 2;
  a[2] = 3;
}

export function getArray(): int[] {
  return a;
}

export function getArrayCapacity(): int {
  return a.capacity;
}

export function getArrayLength(): int {
  return a.length;
}

export function getArrayElement(i: uint): int {
  return a[i];
}

export function setArray(b: int[]): void {
  a = b;
}

export function setArrayElement(i: uint, value: int): void {
  a[i] = value;
}

export function setArrayFrom(b: int[]): void {
  for (let i: uint = 0; i < b.length; ++i)
    a[i] = b[i];
}
