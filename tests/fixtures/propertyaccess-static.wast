 (export "test" (func $test))
 (func $test (type $v)
  (drop
   (get_global $A.a)
  )
  (set_global $A.a
   (i32.const 1)
  )
 )
