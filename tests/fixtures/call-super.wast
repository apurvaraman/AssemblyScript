 (export "test" (func $test))
 (start $.start)
 (func $A (type $iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (return
   (get_local $0)
  )
 )
 (func $B (type $ii) (param $0 i32) (result i32)
  (drop
   (call $A
    (get_local $0)
    (i32.const 1)
    (i32.const 2)
   )
  )
  (return
   (get_local $0)
  )
 )
 (func $test (type $v)
  (local $0 i32)
  (set_local $0
   (call $B
    (call $malloc
     (i32.const 0)
    )
   )
  )
 )
 (func $.start (type $v)
  (call $malloc_init
   (i32.const 8)
  )
 )
