//! { "memoryModel": "exportmalloc" }

let a: int[] = new Array(3);
function start(): void {

let c: int[] = new Array(2);
c[0] = 12;
c[1] = 24;


  a[0] = 1;
  a[1] = 2;
  a[2] = 3;
}

let b: int[] = new Array(20);
export function start2(): void{
  for(let i: int = 0; i< 20; i++){
    b[i] = i*100;
  }
  b[0] = 123;
}

export function getArray2(): int[]{
  return b;
}

export function getArray(): int[] {
  return a;
}

export function getArrayElement(i: uint): int {
  return a[i];
}

export function getArrayElement2(i: uint): int {
  return b[i];
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
