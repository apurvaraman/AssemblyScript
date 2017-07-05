let a : number = 5;
let b: double = 7;

export function add(): double  {
    return a + b;
}

// //! { "memoryModel": "exportmalloc" }

// let a: int[] = new Array<int>(3);
// let b: String[] = new Array<String>(3); 
// let c: float[] = new Array<float>(3);
// let d: double[] = new Array(3); //does it automatically recognize

// export function initIntArr(){
//     a[0] = 1.0;
//     a[1] = 2;
// }

// export function getIntArrayElem(val: uint): int{
//     return a[val];
// }
// export function initStringArr(){
//     b[0] = "hi";
//     b[1] = "we are messing";
//     b[2] = "around with types";
// }

// export function getStringArrElem(val: uint): String{
//     return b[val];
// }

// export function initFloatArr(){
//     c[0] = 12.5;
//     c[1] = 23.2;
//     c[2] = 1234;
// }

// export function getFloatArrElem(val: uint): float{
//     return c[val];
// }

// export function initDoubleArr(){
//     d[0] = 1212.5;
//     d[1] = 2311.2;
//     d[2] = 123.34;
// }

// export function getDoubleArrElem(val: uint): double{
//     return d[val];
// }