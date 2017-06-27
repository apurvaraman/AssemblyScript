//basic function to test malloc functionality

export function check() : int {
    let a: uintptr = malloc(20);

    return a;
}