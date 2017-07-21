let a: int[][] = new Array(3);

function start () {
    for(let i: number = 0; i < 3; i++)
        a[i] = new Array(3);
}

export function init(): int{
    start();
    for (let i: number = 0; i<3; i++){
        for(let j: number = 0; j<3; j++){
            a[i][j] = 0;
        }
    }
    return a[1][1];
}