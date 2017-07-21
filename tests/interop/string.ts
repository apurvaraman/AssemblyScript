//! { "memoryModel": "exportmalloc" }

let a: string = "abc";

export function getString(): int {
  let v: int[] = new Array(10);
  v[0] = 1;
  v[1] = 17;
  v[2] = 15;
  v[3] = 71;
  v[4] = 17;
  v[5] = 16;
  v[6] = 14;
  v[7] = 32;
  v[8] = 12;
  
  return v.length;
//  return a;
}

export function getElem(c: int): int {
  let v: int[] = new Array(10);
  for(let i: int = 0;i<10;i++){
    v[i] = i;
  }
  return v[c];
}
export function setString(b: string): void {
  a = b;
}

// export function length() {
//   let b = a.getLength();
// }