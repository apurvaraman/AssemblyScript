//! { "memoryModel": "bare" }

export function testInt(a: int, b: int): void {
  a + b;
  a - b;
  a * b;
  a / b;
  a == b;
  a != b;
  a > b;
  a >= b;
  a < b;
  a <= b;

  // int only
  a % b;
  a & b;
  a | b;
  a ^ b;
  a << b;
  a >> b;
}

export function testFloat(a: float, b: float): void {
  a + b;
  a - b;
  a * b;
  a / b;
  a == b;
  a != b;
  a > b;
  a >= b;
  a < b;
  a <= b;

  // todo: emulate?
  // a % b;
}

export function testDouble(a: double, b: double): void {
  a + b;
  a - b;
  a * b;
  a / b;
  a == b;
  a != b;
  a > b;
  a >= b;
  a < b;
  a <= b;

  // todo: emulate?
  // a % b;
}
