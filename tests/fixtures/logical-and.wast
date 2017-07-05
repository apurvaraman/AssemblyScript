 (export "test" (func $test))
 (func $test (type $ifIii) (param $0 i32) (param $1 f32) (param $2 i64) (param $3 i32) (result i32)
  (if
   (select
    (i32.ne
     (get_local $3)
     (i32.const 0)
    )
    (i32.const 0)
    (i32.ne
     (select
      (i64.ne
       (get_local $2)
       (i64.const 0)
      )
      (i32.const 0)
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
     (i32.const 0)
    )
   )
   (return
    (i32.const 1)
   )
  )
  (return
   (i32.const 0)
  )
 )
