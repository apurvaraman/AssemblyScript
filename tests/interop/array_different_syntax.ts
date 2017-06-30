
//! { "memoryModel": "exportmalloc" }

let a: int[] = [-1, 2, 3]; 
let c: float[] = [0.5, , 6.0, 7.2, -8.54];
let d: double[] = [4.3, 4, -8, 0.000009];
let e: long[] = [];

export function initIntArr(){
    a[0] = 1;
}

export function getIntArrayElem(val: uint): int{
    return a[val];
}

export function initFloatArr(){
    c[0] = 12.5;
}

export function getFloatArrElem(val: uint): float{
    return c[val];
}

export function initDoubleArr(){
    d[0] = 1212.5;
}

export function getDoubleArrElem(val: uint): double{
    return d[val];
}

export function getLongArrElem(val: uint): long{
    return e[val]; //Should give an error
}