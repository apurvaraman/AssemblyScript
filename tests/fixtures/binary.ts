export function arrayTest1(a: int): int {
  let list: int[] = [a, a+1, a+2, 4, 5]
  return list[2];
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
