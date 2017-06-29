 (export "test" (func $test))
 (func $test (type $v)
  (drop
   (get_global $A.a)
  )
 )
