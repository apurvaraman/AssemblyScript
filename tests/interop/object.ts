class Foo {
    age: int;    
    constructor(a: int){
        this.age = a;
    }
}

function test2(o: Array<Foo>): int {
    return o[0].age;
}

export function test(): int {
     const y: Array<Foo> = new Array<Foo>(3);
     y[0] = new Foo(19);
     return y[0].age;
 }
