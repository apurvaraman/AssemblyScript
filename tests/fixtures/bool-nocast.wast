 (export "test" (func $test))
 (func $test (type $ifii) (param $0 i32) (param $1 f32) (param $2 i32) (result i32)
  (return
   (select
    (i32.const 1)
    (i32.ne
     (get_local $2)
     (i32.const 0)
    )
    (i32.ne
     (select
      (f32.ne
       (get_local $1)
       (f32.const 0)
      )
      (i32.const 0)
      (i32.ne
       (get_local $0)
       (i32.const 0)
      )
     )
     (i32.const 0)
    )
   )
  )
 )
