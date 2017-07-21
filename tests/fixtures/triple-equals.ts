export function checkTripleEqualDoubleInt(): bool{
    let a: int = 4;
    let b: double = 4;
    return (a === b) as bool;
}

export function checkTripleEqualDoubleFloat(): bool{
    let a: float = 4;
    let b: double = 4;
    return (a === b) as bool;
}
export function checkTripleEqualLongInt(): bool{
    let a: int = 4;
    let b: long = 4;
    return (a === b) as bool;
}
export function checkEquals(): bool{
    let a: int = 4;
    let b: int = 4;
    return (a == b) as bool;
}