 (export "test" (func $test))
 (func $A#a (type $iv) (param $0 i32)
 )
 (func $test (type $iv) (param $0 i32)
  (call $A#a
   (get_local $0)
  )
 )
