 (export "test" (func $test))
 (func $test (type $iv) (param $0 i32)
  (drop
   (i32.load
    (get_local $0)
   )
  )
  (drop
   (i32.load offset=4
    (get_local $0)
   )
  )
  (drop
   (i32.load
    (i32.load offset=4
     (get_local $0)
    )
   )
  )
 )
