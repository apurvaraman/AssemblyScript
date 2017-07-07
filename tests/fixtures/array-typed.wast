 (export "test" (func $test))
 (start $.start)
 (func $std/array.ts/Array<sbyte> (type $iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (nop)
  (if
   (i32.lt_u
    (get_local $1)
    (i32.const 0)
   )
   (unreachable)
  )
  (set_local $2
   (i32.mul
    (get_local $1)
    (i32.const 1)
   )
  )
  (set_local $3
   (call $malloc
    (i32.add
     (i32.const 8)
     (get_local $2)
    )
   )
  )
  (set_local $4
   (get_local $3)
  )
  (i32.store
   (get_local $4)
   (get_local $1)
  )
  (i32.store offset=4
   (get_local $4)
   (get_local $1)
  )
  (drop
   (call $memset
    (i32.add
     (get_local $3)
     (i32.const 8)
    )
    (i32.const 0)
    (get_local $2)
   )
  )
  (return
   (get_local $3)
  )
 )
 (func $std/array.ts/Array<byte> (type $iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (nop)
  (if
   (i32.lt_u
    (get_local $1)
    (i32.const 0)
   )
   (unreachable)
  )
  (set_local $2
   (i32.mul
    (get_local $1)
    (i32.const 1)
   )
  )
  (set_local $3
   (call $malloc
    (i32.add
     (i32.const 8)
     (get_local $2)
    )
   )
  )
  (set_local $4
   (get_local $3)
  )
  (i32.store
   (get_local $4)
   (get_local $1)
  )
  (i32.store offset=4
   (get_local $4)
   (get_local $1)
  )
  (drop
   (call $memset
    (i32.add
     (get_local $3)
     (i32.const 8)
    )
    (i32.const 0)
    (get_local $2)
   )
  )
  (return
   (get_local $3)
  )
 )
 (func $std/array.ts/Array<short> (type $iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (nop)
  (if
   (i32.lt_u
    (get_local $1)
    (i32.const 0)
   )
   (unreachable)
  )
  (set_local $2
   (i32.mul
    (get_local $1)
    (i32.const 2)
   )
  )
  (set_local $3
   (call $malloc
    (i32.add
     (i32.const 8)
     (get_local $2)
    )
   )
  )
  (set_local $4
   (get_local $3)
  )
  (i32.store
   (get_local $4)
   (get_local $1)
  )
  (i32.store offset=4
   (get_local $4)
   (get_local $1)
  )
  (drop
   (call $memset
    (i32.add
     (get_local $3)
     (i32.const 8)
    )
    (i32.const 0)
    (get_local $2)
   )
  )
  (return
   (get_local $3)
  )
 )
 (func $std/array.ts/Array<ushort> (type $iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (nop)
  (if
   (i32.lt_u
    (get_local $1)
    (i32.const 0)
   )
   (unreachable)
  )
  (set_local $2
   (i32.mul
    (get_local $1)
    (i32.const 2)
   )
  )
  (set_local $3
   (call $malloc
    (i32.add
     (i32.const 8)
     (get_local $2)
    )
   )
  )
  (set_local $4
   (get_local $3)
  )
  (i32.store
   (get_local $4)
   (get_local $1)
  )
  (i32.store offset=4
   (get_local $4)
   (get_local $1)
  )
  (drop
   (call $memset
    (i32.add
     (get_local $3)
     (i32.const 8)
    )
    (i32.const 0)
    (get_local $2)
   )
  )
  (return
   (get_local $3)
  )
 )
 (func $std/array.ts/Array<int> (type $iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (nop)
  (if
   (i32.lt_u
    (get_local $1)
    (i32.const 0)
   )
   (unreachable)
  )
  (set_local $2
   (i32.mul
    (get_local $1)
    (i32.const 4)
   )
  )
  (set_local $3
   (call $malloc
    (i32.add
     (i32.const 8)
     (get_local $2)
    )
   )
  )
  (set_local $4
   (get_local $3)
  )
  (i32.store
   (get_local $4)
   (get_local $1)
  )
  (i32.store offset=4
   (get_local $4)
   (get_local $1)
  )
  (drop
   (call $memset
    (i32.add
     (get_local $3)
     (i32.const 8)
    )
    (i32.const 0)
    (get_local $2)
   )
  )
  (return
   (get_local $3)
  )
 )
 (func $std/array.ts/Array<uint> (type $iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (nop)
  (if
   (i32.lt_u
    (get_local $1)
    (i32.const 0)
   )
   (unreachable)
  )
  (set_local $2
   (i32.mul
    (get_local $1)
    (i32.const 4)
   )
  )
  (set_local $3
   (call $malloc
    (i32.add
     (i32.const 8)
     (get_local $2)
    )
   )
  )
  (set_local $4
   (get_local $3)
  )
  (i32.store
   (get_local $4)
   (get_local $1)
  )
  (i32.store offset=4
   (get_local $4)
   (get_local $1)
  )
  (drop
   (call $memset
    (i32.add
     (get_local $3)
     (i32.const 8)
    )
    (i32.const 0)
    (get_local $2)
   )
  )
  (return
   (get_local $3)
  )
 )
 (func $std/array.ts/Array<long> (type $iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (nop)
  (if
   (i32.lt_u
    (get_local $1)
    (i32.const 0)
   )
   (unreachable)
  )
  (set_local $2
   (i32.mul
    (get_local $1)
    (i32.const 8)
   )
  )
  (set_local $3
   (call $malloc
    (i32.add
     (i32.const 8)
     (get_local $2)
    )
   )
  )
  (set_local $4
   (get_local $3)
  )
  (i32.store
   (get_local $4)
   (get_local $1)
  )
  (i32.store offset=4
   (get_local $4)
   (get_local $1)
  )
  (drop
   (call $memset
    (i32.add
     (get_local $3)
     (i32.const 8)
    )
    (i32.const 0)
    (get_local $2)
   )
  )
  (return
   (get_local $3)
  )
 )
 (func $std/array.ts/Array<ulong> (type $iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (nop)
  (if
   (i32.lt_u
    (get_local $1)
    (i32.const 0)
   )
   (unreachable)
  )
  (set_local $2
   (i32.mul
    (get_local $1)
    (i32.const 8)
   )
  )
  (set_local $3
   (call $malloc
    (i32.add
     (i32.const 8)
     (get_local $2)
    )
   )
  )
  (set_local $4
   (get_local $3)
  )
  (i32.store
   (get_local $4)
   (get_local $1)
  )
  (i32.store offset=4
   (get_local $4)
   (get_local $1)
  )
  (drop
   (call $memset
    (i32.add
     (get_local $3)
     (i32.const 8)
    )
    (i32.const 0)
    (get_local $2)
   )
  )
  (return
   (get_local $3)
  )
 )
 (func $std/array.ts/Array<float> (type $iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (nop)
  (if
   (i32.lt_u
    (get_local $1)
    (i32.const 0)
   )
   (unreachable)
  )
  (set_local $2
   (i32.mul
    (get_local $1)
    (i32.const 4)
   )
  )
  (set_local $3
   (call $malloc
    (i32.add
     (i32.const 8)
     (get_local $2)
    )
   )
  )
  (set_local $4
   (get_local $3)
  )
  (i32.store
   (get_local $4)
   (get_local $1)
  )
  (i32.store offset=4
   (get_local $4)
   (get_local $1)
  )
  (drop
   (call $memset
    (i32.add
     (get_local $3)
     (i32.const 8)
    )
    (i32.const 0)
    (get_local $2)
   )
  )
  (return
   (get_local $3)
  )
 )
 (func $std/array.ts/Array<double> (type $iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (nop)
  (if
   (i32.lt_u
    (get_local $1)
    (i32.const 0)
   )
   (unreachable)
  )
  (set_local $2
   (i32.mul
    (get_local $1)
    (i32.const 8)
   )
  )
  (set_local $3
   (call $malloc
    (i32.add
     (i32.const 8)
     (get_local $2)
    )
   )
  )
  (set_local $4
   (get_local $3)
  )
  (i32.store
   (get_local $4)
   (get_local $1)
  )
  (i32.store offset=4
   (get_local $4)
   (get_local $1)
  )
  (drop
   (call $memset
    (i32.add
     (get_local $3)
     (i32.const 8)
    )
    (i32.const 0)
    (get_local $2)
   )
  )
  (return
   (get_local $3)
  )
 )
 (func $test (type $v)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (set_local $0
   (call $std/array.ts/Array<sbyte>
    (call $memset
     (call $malloc
      (i32.const 8)
     )
     (i32.const 0)
     (i32.const 8)
    )
    (i32.const 1)
   )
  )
  (set_local $1
   (call $std/array.ts/Array<byte>
    (call $memset
     (call $malloc
      (i32.const 8)
     )
     (i32.const 0)
     (i32.const 8)
    )
    (i32.const 2)
   )
  )
  (set_local $2
   (call $std/array.ts/Array<short>
    (call $memset
     (call $malloc
      (i32.const 8)
     )
     (i32.const 0)
     (i32.const 8)
    )
    (i32.const 3)
   )
  )
  (set_local $3
   (call $std/array.ts/Array<ushort>
    (call $memset
     (call $malloc
      (i32.const 8)
     )
     (i32.const 0)
     (i32.const 8)
    )
    (i32.const 4)
   )
  )
  (set_local $4
   (call $std/array.ts/Array<int>
    (call $memset
     (call $malloc
      (i32.const 8)
     )
     (i32.const 0)
     (i32.const 8)
    )
    (i32.const 5)
   )
  )
  (set_local $5
   (call $std/array.ts/Array<uint>
    (call $memset
     (call $malloc
      (i32.const 8)
     )
     (i32.const 0)
     (i32.const 8)
    )
    (i32.const 6)
   )
  )
  (set_local $6
   (call $std/array.ts/Array<long>
    (call $memset
     (call $malloc
      (i32.const 8)
     )
     (i32.const 0)
     (i32.const 8)
    )
    (i32.const 7)
   )
  )
  (set_local $7
   (call $std/array.ts/Array<ulong>
    (call $memset
     (call $malloc
      (i32.const 8)
     )
     (i32.const 0)
     (i32.const 8)
    )
    (i32.const 8)
   )
  )
  (set_local $8
   (call $std/array.ts/Array<float>
    (call $memset
     (call $malloc
      (i32.const 8)
     )
     (i32.const 0)
     (i32.const 8)
    )
    (i32.const 9)
   )
  )
  (set_local $9
   (call $std/array.ts/Array<double>
    (call $memset
     (call $malloc
      (i32.const 8)
     )
     (i32.const 0)
     (i32.const 8)
    )
    (i32.const 10)
   )
  )
  (set_local $10
   (call $std/array.ts/Array<sbyte>
    (call $memset
     (call $malloc
      (i32.const 8)
     )
     (i32.const 0)
     (i32.const 8)
    )
    (i32.const 11)
   )
  )
 )
 (func $.start (type $v)
  (call $malloc_init
   (i32.const 8)
  )
 )
