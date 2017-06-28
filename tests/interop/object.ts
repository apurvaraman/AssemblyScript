class Foo {
    public bar(): number {
        return 42;
    }
}

function test2(o: Array<Foo>): number {
    return o[0].bar();
}

export function test(): number {
     const y: Array<Foo> = new Array<Foo>(3);
     y[0] = new Foo();
     return test2(y);
 }
