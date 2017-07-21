let a: int[] = new Array(5);

//export function init(){
a[0] = 1;
a[1] = 2;
a[2] = 3;
a[3] = 4;
a[4] = 5;
//}

export function checkError(): int{
    let val: int = 0;
    for(let i:int = 0; i< 6; i++){
        val = a[i];
    }
    return val;
}