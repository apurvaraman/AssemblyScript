 (export "testSbyte" (func $testSbyte))
 (export "testByte" (func $testByte))
 (export "testShort" (func $testShort))
 (export "testUshort" (func $testUshort))
 (export "testInt" (func $testInt))
 (export "testUint" (func $testUint))
 (export "testLong" (func $testLong))
 (export "testUlong" (func $testUlong))
 (func $testSbyte (type $i) (result i32)
  (return
   (i32.shr_s
    (i32.shl
     (i32.add
      (i32.const -1)
      (i32.const 1)
     )
     (i32.const 24)
    )
    (i32.const 24)
   )
  )
 )
 (func $testByte (type $i) (result i32)
  (return
   (i32.and
    (i32.add
     (i32.const 255)
     (i32.const 1)
    )
    (i32.const 255)
   )
  )
 )
 (func $testShort (type $i) (result i32)
  (return
   (i32.shr_s
    (i32.shl
     (i32.add
      (i32.const -1)
      (i32.const 1)
     )
     (i32.const 16)
    )
    (i32.const 16)
   )
  )
 )
 (func $testUshort (type $i) (result i32)
  (return
   (i32.and
    (i32.add
     (i32.const 65535)
     (i32.const 1)
    )
    (i32.const 65535)
   )
  )
 )
 (func $testInt (type $i) (result i32)
  (return
   (i32.add
    (i32.const -1)
    (i32.const 1)
   )
  )
 )
 (func $testUint (type $i) (result i32)
  (return
   (i32.add
    (i32.const -1)
    (i32.const 1)
   )
  )
 )
 (func $testLong (type $I) (result i64)
  (return
   (i64.add
    (i64.const -1)
    (i64.const 1)
   )
  )
 )
 (func $testUlong (type $I) (result i64)
  (return
   (i64.add
    (i64.const -1)
    (i64.const 1)
   )
  )
 )
