 (export "test" (func $test))
 (func $fn (type $iiv) (param $0 i32) (param $1 i32)
 )
 (func $test (type $v)
  (call $fn
   (i32.const 1)
   (i32.const 2)
  )
  (call $fn
   (i32.const 3)
   (i32.const 2)
  )
  (call $fn
   (i32.const 3)
   (i32.const 4)
  )
 )
