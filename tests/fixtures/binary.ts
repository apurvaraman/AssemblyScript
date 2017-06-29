export function add2(a: int): int {
  let list: int[] = [1, 2, 3];
  list[0] = 1;
  return list[0];
}


// //! { "memoryModel": "bare" }

// export function testInt(a: int, b: int): void {
//   a + b;
//   a - b;
//   a * b;
//   a / b;
//   a == b;
//   a != b;
//   a > b;
//   a >= b;
//   a < b;
//   a <= b;

//   // int only
//   a % b;
//   a & b;
//   a | b;
//   a ^ b;
//   a << b;
//   a >> b;
// }

// export function testFloat(a: float, b: float): void {
//   a + b;
//   a - b;
//   a * b;
//   a / b;
//   a == b;
//   a != b;
//   a > b;
//   a >= b;
//   a < b;
//   a <= b;

//   // todo: emulate?
//   // a % b;
// }

// export function testDouble(a: double, b: double): void {
//   a + b;
//   a - b;
//   a * b;
//   a / b;
//   a == b;
//   a != b;
//   a > b;
//   a >= b;
//   a < b;
//   a <= b;

//   // todo: emulate?
//   // a % b;
// }
