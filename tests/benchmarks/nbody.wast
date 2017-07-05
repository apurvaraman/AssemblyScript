(module
 (type $0 (func (param i32 i32 i32) (result i32)))
 (type $1 (func (param i32 i32) (result i32)))
 (type $2 (func (param i32) (result i32)))
 (type $i (func (result i32)))
 (type $v (func))
 (type $iFFFFFFFi (func (param i32 f64 f64 f64 f64 f64 f64 f64) (result i32)))
 (type $iFFFi (func (param i32 f64 f64 f64) (result i32)))
 (type $iFv (func (param i32 f64)))
 (type $iF (func (param i32) (result f64)))
 (global $PI f64 (f64.const 3.141592653589793))
 (global $SOLAR_MASS (mut f64) (f64.const 0))
 (global $DAYS_PER_YEAR f64 (f64.const 365.24))
 (global $.msp (mut i32) (i32.const 0))
 (table 0 anyfunc)
 (memory $0 1)
 (export "memory" (memory $0))
 (export "test" (func $test))
 (start $.start)
 (func $memset (type $0) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i64)
  (block $label$1
   (br_if $label$1
    (i32.eqz
     (get_local $2)
    )
   )
   (i32.store8
    (i32.add
     (tee_local $3
      (i32.add
       (get_local $0)
       (get_local $2)
      )
     )
     (i32.const -1)
    )
    (get_local $1)
   )
   (i32.store8
    (get_local $0)
    (get_local $1)
   )
   (br_if $label$1
    (i32.lt_u
     (get_local $2)
     (i32.const 3)
    )
   )
   (i32.store8
    (i32.add
     (get_local $3)
     (i32.const -2)
    )
    (get_local $1)
   )
   (i32.store8 offset=1
    (get_local $0)
    (get_local $1)
   )
   (i32.store8
    (i32.add
     (get_local $3)
     (i32.const -3)
    )
    (get_local $1)
   )
   (i32.store8 offset=2
    (get_local $0)
    (get_local $1)
   )
   (br_if $label$1
    (i32.lt_u
     (get_local $2)
     (i32.const 7)
    )
   )
   (i32.store8
    (i32.add
     (get_local $3)
     (i32.const -4)
    )
    (get_local $1)
   )
   (i32.store8 offset=3
    (get_local $0)
    (get_local $1)
   )
   (br_if $label$1
    (i32.lt_u
     (get_local $2)
     (i32.const 9)
    )
   )
   (i32.store
    (tee_local $3
     (i32.add
      (get_local $0)
      (tee_local $4
       (i32.and
        (i32.sub
         (i32.const 0)
         (get_local $0)
        )
        (i32.const 3)
       )
      )
     )
    )
    (tee_local $1
     (i32.mul
      (i32.and
       (get_local $1)
       (i32.const 255)
      )
      (i32.const 16843009)
     )
    )
   )
   (i32.store
    (i32.add
     (tee_local $2
      (i32.add
       (get_local $3)
       (tee_local $4
        (i32.and
         (i32.sub
          (get_local $2)
          (get_local $4)
         )
         (i32.const -4)
        )
       )
      )
     )
     (i32.const -4)
    )
    (get_local $1)
   )
   (br_if $label$1
    (i32.lt_u
     (get_local $4)
     (i32.const 9)
    )
   )
   (i32.store offset=8
    (get_local $3)
    (get_local $1)
   )
   (i32.store offset=4
    (get_local $3)
    (get_local $1)
   )
   (i32.store
    (i32.add
     (get_local $2)
     (i32.const -8)
    )
    (get_local $1)
   )
   (i32.store
    (i32.add
     (get_local $2)
     (i32.const -12)
    )
    (get_local $1)
   )
   (br_if $label$1
    (i32.lt_u
     (get_local $4)
     (i32.const 25)
    )
   )
   (i32.store offset=16
    (get_local $3)
    (get_local $1)
   )
   (i32.store offset=12
    (get_local $3)
    (get_local $1)
   )
   (i32.store offset=20
    (get_local $3)
    (get_local $1)
   )
   (i32.store offset=24
    (get_local $3)
    (get_local $1)
   )
   (i32.store
    (i32.add
     (get_local $2)
     (i32.const -24)
    )
    (get_local $1)
   )
   (i32.store
    (i32.add
     (get_local $2)
     (i32.const -28)
    )
    (get_local $1)
   )
   (i32.store
    (i32.add
     (get_local $2)
     (i32.const -20)
    )
    (get_local $1)
   )
   (i32.store
    (i32.add
     (get_local $2)
     (i32.const -16)
    )
    (get_local $1)
   )
   (br_if $label$1
    (i32.lt_u
     (tee_local $2
      (i32.sub
       (get_local $4)
       (tee_local $4
        (i32.or
         (i32.and
          (get_local $3)
          (i32.const 4)
         )
         (i32.const 24)
        )
       )
      )
     )
     (i32.const 32)
    )
   )
   (set_local $5
    (i64.or
     (i64.shl
      (tee_local $5
       (i64.extend_u/i32
        (get_local $1)
       )
      )
      (i64.const 32)
     )
     (get_local $5)
    )
   )
   (set_local $1
    (i32.add
     (get_local $3)
     (get_local $4)
    )
   )
   (loop $label$2
    (i64.store
     (get_local $1)
     (get_local $5)
    )
    (i64.store
     (i32.add
      (get_local $1)
      (i32.const 8)
     )
     (get_local $5)
    )
    (i64.store
     (i32.add
      (get_local $1)
      (i32.const 16)
     )
     (get_local $5)
    )
    (i64.store
     (i32.add
      (get_local $1)
      (i32.const 24)
     )
     (get_local $5)
    )
    (set_local $1
     (i32.add
      (get_local $1)
      (i32.const 32)
     )
    )
    (br_if $label$2
     (i32.gt_u
      (tee_local $2
       (i32.add
        (get_local $2)
        (i32.const -32)
       )
      )
      (i32.const 31)
     )
    )
   )
  )
  (get_local $0)
 )
 (func $mspace_malloc (type $1) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (set_local $7
   (i32.sub
    (i32.load
     (i32.const 64)
    )
    (i32.const 16)
   )
  )
  (block $label$1
   (block $label$2
    (block $label$3
     (block $label$4
      (block $label$5
       (block $label$6
        (block $label$7
         (block $label$8
          (block $label$9
           (block $label$10
            (block $label$11
             (block $label$12
              (block $label$13
               (block $label$14
                (block $label$15
                 (block $label$16
                  (block $label$17
                   (block $label$18
                    (block $label$19
                     (block $label$20
                      (block $label$21
                       (block $label$22
                        (block $label$23
                         (block $label$24
                          (block $label$25
                           (block $label$26
                            (block $label$27
                             (block $label$28
                              (block $label$29
                               (block $label$30
                                (block $label$31
                                 (block $label$32
                                  (block $label$33
                                   (block $label$34
                                    (block $label$36
                                     (block $label$37
                                      (block $label$38
                                       (if
                                        (i32.le_u
                                         (get_local $1)
                                         (i32.const 244)
                                        )
                                        (block
                                         (br_if $label$38
                                          (i32.eqz
                                           (i32.and
                                            (tee_local $1
                                             (i32.shr_u
                                              (tee_local $4
                                               (i32.load
                                                (get_local $0)
                                               )
                                              )
                                              (tee_local $2
                                               (i32.shr_u
                                                (tee_local $6
                                                 (select
                                                  (i32.const 16)
                                                  (i32.and
                                                   (i32.add
                                                    (get_local $1)
                                                    (i32.const 11)
                                                   )
                                                   (i32.const -8)
                                                  )
                                                  (i32.lt_u
                                                   (get_local $1)
                                                   (i32.const 11)
                                                  )
                                                 )
                                                )
                                                (i32.const 3)
                                               )
                                              )
                                             )
                                            )
                                            (i32.const 3)
                                           )
                                          )
                                         )
                                         (set_local $5
                                          (i32.add
                                           (tee_local $1
                                            (i32.load
                                             (i32.add
                                              (tee_local $6
                                               (i32.add
                                                (get_local $0)
                                                (i32.shl
                                                 (tee_local $2
                                                  (i32.add
                                                   (i32.and
                                                    (i32.xor
                                                     (get_local $1)
                                                     (i32.const -1)
                                                    )
                                                    (i32.const 1)
                                                   )
                                                   (get_local $2)
                                                  )
                                                 )
                                                 (i32.const 3)
                                                )
                                               )
                                              )
                                              (i32.const 48)
                                             )
                                            )
                                           )
                                           (i32.const 8)
                                          )
                                         )
                                         (br_if $label$37
                                          (i32.eq
                                           (tee_local $3
                                            (i32.load offset=8
                                             (get_local $1)
                                            )
                                           )
                                           (tee_local $6
                                            (i32.add
                                             (get_local $6)
                                             (i32.const 40)
                                            )
                                           )
                                          )
                                         )
                                         (i32.store offset=12
                                          (get_local $3)
                                          (get_local $6)
                                         )
                                         (i32.store
                                          (i32.add
                                           (get_local $6)
                                           (i32.const 8)
                                          )
                                          (get_local $3)
                                         )
                                         (br $label$36)
                                        )
                                       )
                                       (set_local $6
                                        (i32.const -1)
                                       )
                                       (br_if $label$23
                                        (i32.gt_u
                                         (get_local $1)
                                         (i32.const -65)
                                        )
                                       )
                                       (set_local $6
                                        (i32.and
                                         (tee_local $2
                                          (i32.add
                                           (get_local $1)
                                           (i32.const 11)
                                          )
                                         )
                                         (i32.const -8)
                                        )
                                       )
                                       (br_if $label$23
                                        (i32.eqz
                                         (tee_local $10
                                          (i32.load offset=4
                                           (get_local $0)
                                          )
                                         )
                                        )
                                       )
                                       (set_local $8
                                        (block $label$40 (result i32)
                                         (drop
                                          (br_if $label$40
                                           (i32.const 0)
                                           (i32.eqz
                                            (tee_local $2
                                             (i32.shr_u
                                              (get_local $2)
                                              (i32.const 8)
                                             )
                                            )
                                           )
                                          )
                                         )
                                         (drop
                                          (br_if $label$40
                                           (i32.const 31)
                                           (i32.gt_u
                                            (get_local $6)
                                            (i32.const 16777215)
                                           )
                                          )
                                         )
                                         (i32.or
                                          (i32.and
                                           (i32.shr_u
                                            (get_local $6)
                                            (i32.add
                                             (tee_local $2
                                              (i32.add
                                               (i32.sub
                                                (i32.const 14)
                                                (i32.or
                                                 (i32.or
                                                  (tee_local $4
                                                   (i32.and
                                                    (i32.shr_u
                                                     (i32.add
                                                      (tee_local $2
                                                       (i32.shl
                                                        (get_local $2)
                                                        (tee_local $3
                                                         (i32.and
                                                          (i32.shr_u
                                                           (i32.add
                                                            (get_local $2)
                                                            (i32.const 1048320)
                                                           )
                                                           (i32.const 16)
                                                          )
                                                          (i32.const 8)
                                                         )
                                                        )
                                                       )
                                                      )
                                                      (i32.const 520192)
                                                     )
                                                     (i32.const 16)
                                                    )
                                                    (i32.const 4)
                                                   )
                                                  )
                                                  (get_local $3)
                                                 )
                                                 (tee_local $3
                                                  (i32.and
                                                   (i32.shr_u
                                                    (i32.add
                                                     (tee_local $2
                                                      (i32.shl
                                                       (get_local $2)
                                                       (get_local $4)
                                                      )
                                                     )
                                                     (i32.const 245760)
                                                    )
                                                    (i32.const 16)
                                                   )
                                                   (i32.const 2)
                                                  )
                                                 )
                                                )
                                               )
                                               (i32.shr_u
                                                (i32.shl
                                                 (get_local $2)
                                                 (get_local $3)
                                                )
                                                (i32.const 15)
                                               )
                                              )
                                             )
                                             (i32.const 7)
                                            )
                                           )
                                           (i32.const 1)
                                          )
                                          (i32.shl
                                           (get_local $2)
                                           (i32.const 1)
                                          )
                                         )
                                        )
                                       )
                                       (set_local $3
                                        (i32.sub
                                         (i32.const 0)
                                         (get_local $6)
                                        )
                                       )
                                       (br_if $label$34
                                        (i32.eqz
                                         (tee_local $2
                                          (i32.load
                                           (i32.add
                                            (i32.add
                                             (get_local $0)
                                             (i32.shl
                                              (get_local $8)
                                              (i32.const 2)
                                             )
                                            )
                                            (i32.const 304)
                                           )
                                          )
                                         )
                                        )
                                       )
                                       (set_local $5
                                        (i32.shl
                                         (get_local $6)
                                         (select
                                          (i32.const 0)
                                          (i32.sub
                                           (i32.const 25)
                                           (i32.shr_u
                                            (get_local $8)
                                            (i32.const 1)
                                           )
                                          )
                                          (i32.eq
                                           (get_local $8)
                                           (i32.const 31)
                                          )
                                         )
                                        )
                                       )
                                       (set_local $1
                                        (i32.const 0)
                                       )
                                       (set_local $4
                                        (i32.const 0)
                                       )
                                       (loop $label$41
                                        (if
                                         (i32.lt_u
                                          (tee_local $9
                                           (i32.sub
                                            (i32.and
                                             (i32.load offset=4
                                              (get_local $2)
                                             )
                                             (i32.const -8)
                                            )
                                            (get_local $6)
                                           )
                                          )
                                          (get_local $3)
                                         )
                                         (block
                                          (set_local $3
                                           (get_local $9)
                                          )
                                          (set_local $4
                                           (get_local $2)
                                          )
                                          (br_if $label$32
                                           (i32.eqz
                                            (get_local $9)
                                           )
                                          )
                                         )
                                        )
                                        (set_local $1
                                         (select
                                          (select
                                           (get_local $1)
                                           (tee_local $9
                                            (i32.load
                                             (i32.add
                                              (get_local $2)
                                              (i32.const 20)
                                             )
                                            )
                                           )
                                           (i32.eq
                                            (get_local $9)
                                            (tee_local $2
                                             (i32.load
                                              (i32.add
                                               (i32.add
                                                (get_local $2)
                                                (i32.and
                                                 (i32.shr_u
                                                  (get_local $5)
                                                  (i32.const 29)
                                                 )
                                                 (i32.const 4)
                                                )
                                               )
                                               (i32.const 16)
                                              )
                                             )
                                            )
                                           )
                                          )
                                          (get_local $1)
                                          (get_local $9)
                                         )
                                        )
                                        (set_local $5
                                         (i32.shl
                                          (get_local $5)
                                          (i32.ne
                                           (get_local $2)
                                           (i32.const 0)
                                          )
                                         )
                                        )
                                        (br_if $label$41
                                         (get_local $2)
                                        )
                                       )
                                       (br_if $label$34
                                        (i32.eqz
                                         (i32.or
                                          (get_local $1)
                                          (get_local $4)
                                         )
                                        )
                                       )
                                       (br $label$26)
                                      )
                                      (br_if $label$23
                                       (i32.le_u
                                        (get_local $6)
                                        (tee_local $3
                                         (i32.load offset=8
                                          (get_local $0)
                                         )
                                        )
                                       )
                                      )
                                      (br_if $label$33
                                       (i32.eqz
                                        (get_local $1)
                                       )
                                      )
                                      (br_if $label$31
                                       (i32.eq
                                        (tee_local $9
                                         (i32.load offset=8
                                          (tee_local $1
                                           (i32.load offset=8
                                            (tee_local $2
                                             (i32.add
                                              (tee_local $7
                                               (i32.add
                                                (get_local $0)
                                                (i32.const 40)
                                               )
                                              )
                                              (i32.shl
                                               (tee_local $5
                                                (i32.add
                                                 (i32.or
                                                  (i32.or
                                                   (i32.or
                                                    (i32.or
                                                     (tee_local $5
                                                      (i32.and
                                                       (i32.shr_u
                                                        (tee_local $2
                                                         (i32.shr_u
                                                          (tee_local $1
                                                           (i32.add
                                                            (i32.and
                                                             (tee_local $1
                                                              (i32.and
                                                               (i32.shl
                                                                (get_local $1)
                                                                (get_local $2)
                                                               )
                                                               (i32.or
                                                                (tee_local $1
                                                                 (i32.shl
                                                                  (i32.const 2)
                                                                  (get_local $2)
                                                                 )
                                                                )
                                                                (i32.sub
                                                                 (i32.const 0)
                                                                 (get_local $1)
                                                                )
                                                               )
                                                              )
                                                             )
                                                             (i32.sub
                                                              (i32.const 0)
                                                              (get_local $1)
                                                             )
                                                            )
                                                            (i32.const -1)
                                                           )
                                                          )
                                                          (tee_local $1
                                                           (i32.and
                                                            (i32.shr_u
                                                             (get_local $1)
                                                             (i32.const 12)
                                                            )
                                                            (i32.const 16)
                                                           )
                                                          )
                                                         )
                                                        )
                                                        (i32.const 5)
                                                       )
                                                       (i32.const 8)
                                                      )
                                                     )
                                                     (get_local $1)
                                                    )
                                                    (tee_local $2
                                                     (i32.and
                                                      (i32.shr_u
                                                       (tee_local $1
                                                        (i32.shr_u
                                                         (get_local $2)
                                                         (get_local $5)
                                                        )
                                                       )
                                                       (i32.const 2)
                                                      )
                                                      (i32.const 4)
                                                     )
                                                    )
                                                   )
                                                   (tee_local $2
                                                    (i32.and
                                                     (i32.shr_u
                                                      (tee_local $1
                                                       (i32.shr_u
                                                        (get_local $1)
                                                        (get_local $2)
                                                       )
                                                      )
                                                      (i32.const 1)
                                                     )
                                                     (i32.const 2)
                                                    )
                                                   )
                                                  )
                                                  (tee_local $2
                                                   (i32.and
                                                    (i32.shr_u
                                                     (tee_local $1
                                                      (i32.shr_u
                                                       (get_local $1)
                                                       (get_local $2)
                                                      )
                                                     )
                                                     (i32.const 1)
                                                    )
                                                    (i32.const 1)
                                                   )
                                                  )
                                                 )
                                                 (i32.shr_u
                                                  (get_local $1)
                                                  (get_local $2)
                                                 )
                                                )
                                               )
                                               (i32.const 3)
                                              )
                                             )
                                            )
                                           )
                                          )
                                         )
                                        )
                                        (get_local $2)
                                       )
                                      )
                                      (i32.store
                                       (i32.add
                                        (get_local $2)
                                        (i32.const 8)
                                       )
                                       (get_local $9)
                                      )
                                      (i32.store offset=12
                                       (get_local $9)
                                       (get_local $2)
                                      )
                                      (set_local $3
                                       (i32.load
                                        (i32.add
                                         (get_local $0)
                                         (i32.const 8)
                                        )
                                       )
                                      )
                                      (br $label$30)
                                     )
                                     (i32.store
                                      (get_local $0)
                                      (i32.and
                                       (get_local $4)
                                       (i32.rotl
                                        (i32.const -2)
                                        (get_local $2)
                                       )
                                      )
                                     )
                                    )
                                    (i32.store offset=4
                                     (get_local $1)
                                     (i32.or
                                      (tee_local $2
                                       (i32.shl
                                        (get_local $2)
                                        (i32.const 3)
                                       )
                                      )
                                      (i32.const 3)
                                     )
                                    )
                                    (i32.store offset=4
                                     (tee_local $1
                                      (i32.add
                                       (get_local $1)
                                       (get_local $2)
                                      )
                                     )
                                     (i32.or
                                      (i32.load offset=4
                                       (get_local $1)
                                      )
                                      (i32.const 1)
                                     )
                                    )
                                    (return
                                     (get_local $5)
                                    )
                                   )
                                   (set_local $4
                                    (i32.const 0)
                                   )
                                   (br_if $label$23
                                    (i32.eqz
                                     (tee_local $1
                                      (i32.and
                                       (get_local $10)
                                       (i32.or
                                        (tee_local $1
                                         (i32.shl
                                          (i32.const 2)
                                          (get_local $8)
                                         )
                                        )
                                        (i32.sub
                                         (i32.const 0)
                                         (get_local $1)
                                        )
                                       )
                                      )
                                     )
                                    )
                                   )
                                   (br_if $label$25
                                    (tee_local $1
                                     (i32.load
                                      (i32.add
                                       (i32.add
                                        (get_local $0)
                                        (i32.shl
                                         (i32.add
                                          (i32.or
                                           (i32.or
                                            (i32.or
                                             (i32.or
                                              (tee_local $5
                                               (i32.and
                                                (i32.shr_u
                                                 (tee_local $2
                                                  (i32.shr_u
                                                   (tee_local $1
                                                    (i32.add
                                                     (i32.and
                                                      (get_local $1)
                                                      (i32.sub
                                                       (i32.const 0)
                                                       (get_local $1)
                                                      )
                                                     )
                                                     (i32.const -1)
                                                    )
                                                   )
                                                   (tee_local $1
                                                    (i32.and
                                                     (i32.shr_u
                                                      (get_local $1)
                                                      (i32.const 12)
                                                     )
                                                     (i32.const 16)
                                                    )
                                                   )
                                                  )
                                                 )
                                                 (i32.const 5)
                                                )
                                                (i32.const 8)
                                               )
                                              )
                                              (get_local $1)
                                             )
                                             (tee_local $2
                                              (i32.and
                                               (i32.shr_u
                                                (tee_local $1
                                                 (i32.shr_u
                                                  (get_local $2)
                                                  (get_local $5)
                                                 )
                                                )
                                                (i32.const 2)
                                               )
                                               (i32.const 4)
                                              )
                                             )
                                            )
                                            (tee_local $2
                                             (i32.and
                                              (i32.shr_u
                                               (tee_local $1
                                                (i32.shr_u
                                                 (get_local $1)
                                                 (get_local $2)
                                                )
                                               )
                                               (i32.const 1)
                                              )
                                              (i32.const 2)
                                             )
                                            )
                                           )
                                           (tee_local $2
                                            (i32.and
                                             (i32.shr_u
                                              (tee_local $1
                                               (i32.shr_u
                                                (get_local $1)
                                                (get_local $2)
                                               )
                                              )
                                              (i32.const 1)
                                             )
                                             (i32.const 1)
                                            )
                                           )
                                          )
                                          (i32.shr_u
                                           (get_local $1)
                                           (get_local $2)
                                          )
                                         )
                                         (i32.const 2)
                                        )
                                       )
                                       (i32.const 304)
                                      )
                                     )
                                    )
                                   )
                                   (br $label$24)
                                  )
                                  (br_if $label$23
                                   (i32.eqz
                                    (tee_local $1
                                     (i32.load offset=4
                                      (get_local $0)
                                     )
                                    )
                                   )
                                  )
                                  (set_local $2
                                   (i32.sub
                                    (i32.and
                                     (i32.load offset=4
                                      (tee_local $3
                                       (i32.load
                                        (i32.add
                                         (i32.add
                                          (get_local $0)
                                          (i32.shl
                                           (i32.add
                                            (i32.or
                                             (i32.or
                                              (i32.or
                                               (i32.or
                                                (tee_local $3
                                                 (i32.and
                                                  (i32.shr_u
                                                   (tee_local $2
                                                    (i32.shr_u
                                                     (tee_local $1
                                                      (i32.add
                                                       (i32.and
                                                        (get_local $1)
                                                        (i32.sub
                                                         (i32.const 0)
                                                         (get_local $1)
                                                        )
                                                       )
                                                       (i32.const -1)
                                                      )
                                                     )
                                                     (tee_local $1
                                                      (i32.and
                                                       (i32.shr_u
                                                        (get_local $1)
                                                        (i32.const 12)
                                                       )
                                                       (i32.const 16)
                                                      )
                                                     )
                                                    )
                                                   )
                                                   (i32.const 5)
                                                  )
                                                  (i32.const 8)
                                                 )
                                                )
                                                (get_local $1)
                                               )
                                               (tee_local $2
                                                (i32.and
                                                 (i32.shr_u
                                                  (tee_local $1
                                                   (i32.shr_u
                                                    (get_local $2)
                                                    (get_local $3)
                                                   )
                                                  )
                                                  (i32.const 2)
                                                 )
                                                 (i32.const 4)
                                                )
                                               )
                                              )
                                              (tee_local $2
                                               (i32.and
                                                (i32.shr_u
                                                 (tee_local $1
                                                  (i32.shr_u
                                                   (get_local $1)
                                                   (get_local $2)
                                                  )
                                                 )
                                                 (i32.const 1)
                                                )
                                                (i32.const 2)
                                               )
                                              )
                                             )
                                             (tee_local $2
                                              (i32.and
                                               (i32.shr_u
                                                (tee_local $1
                                                 (i32.shr_u
                                                  (get_local $1)
                                                  (get_local $2)
                                                 )
                                                )
                                                (i32.const 1)
                                               )
                                               (i32.const 1)
                                              )
                                             )
                                            )
                                            (i32.shr_u
                                             (get_local $1)
                                             (get_local $2)
                                            )
                                           )
                                           (i32.const 2)
                                          )
                                         )
                                         (i32.const 304)
                                        )
                                       )
                                      )
                                     )
                                     (i32.const -8)
                                    )
                                    (get_local $6)
                                   )
                                  )
                                  (if
                                   (tee_local $1
                                    (i32.load
                                     (i32.add
                                      (i32.add
                                       (get_local $3)
                                       (i32.const 16)
                                      )
                                      (i32.shl
                                       (i32.eqz
                                        (i32.load offset=16
                                         (get_local $3)
                                        )
                                       )
                                       (i32.const 2)
                                      )
                                     )
                                    )
                                   )
                                   (loop $label$44
                                    (set_local $2
                                     (select
                                      (tee_local $4
                                       (i32.sub
                                        (i32.and
                                         (i32.load offset=4
                                          (get_local $1)
                                         )
                                         (i32.const -8)
                                        )
                                        (get_local $6)
                                       )
                                      )
                                      (get_local $2)
                                      (tee_local $4
                                       (i32.lt_u
                                        (get_local $4)
                                        (get_local $2)
                                       )
                                      )
                                     )
                                    )
                                    (set_local $3
                                     (select
                                      (get_local $1)
                                      (get_local $3)
                                      (get_local $4)
                                     )
                                    )
                                    (set_local $1
                                     (tee_local $4
                                      (i32.load
                                       (i32.add
                                        (i32.add
                                         (get_local $1)
                                         (i32.const 16)
                                        )
                                        (i32.shl
                                         (i32.eqz
                                          (i32.load offset=16
                                           (get_local $1)
                                          )
                                         )
                                         (i32.const 2)
                                        )
                                       )
                                      )
                                     )
                                    )
                                    (br_if $label$44
                                     (get_local $4)
                                    )
                                   )
                                  )
                                  (br_if $label$23
                                   (i32.le_u
                                    (tee_local $8
                                     (i32.add
                                      (get_local $3)
                                      (get_local $6)
                                     )
                                    )
                                    (get_local $3)
                                   )
                                  )
                                  (set_local $7
                                   (i32.load offset=24
                                    (get_local $3)
                                   )
                                  )
                                  (br_if $label$29
                                   (i32.eq
                                    (tee_local $5
                                     (i32.load offset=12
                                      (get_local $3)
                                     )
                                    )
                                    (get_local $3)
                                   )
                                  )
                                  (i32.store offset=12
                                   (tee_local $1
                                    (i32.load offset=8
                                     (get_local $3)
                                    )
                                   )
                                   (get_local $5)
                                  )
                                  (i32.store offset=8
                                   (get_local $5)
                                   (get_local $1)
                                  )
                                  (br_if $label$28
                                   (get_local $7)
                                  )
                                  (br $label$27)
                                 )
                                 (set_local $3
                                  (i32.const 0)
                                 )
                                 (set_local $4
                                  (get_local $2)
                                 )
                                 (set_local $1
                                  (get_local $2)
                                 )
                                 (br $label$25)
                                )
                                (i32.store
                                 (get_local $0)
                                 (i32.and
                                  (get_local $4)
                                  (i32.rotl
                                   (i32.const -2)
                                   (get_local $5)
                                  )
                                 )
                                )
                               )
                               (set_local $4
                                (i32.add
                                 (get_local $1)
                                 (i32.const 8)
                                )
                               )
                               (i32.store offset=4
                                (get_local $1)
                                (i32.or
                                 (get_local $6)
                                 (i32.const 3)
                                )
                               )
                               (i32.store offset=4
                                (tee_local $9
                                 (i32.add
                                  (get_local $1)
                                  (get_local $6)
                                 )
                                )
                                (i32.or
                                 (tee_local $2
                                  (i32.sub
                                   (tee_local $5
                                    (i32.shl
                                     (get_local $5)
                                     (i32.const 3)
                                    )
                                   )
                                   (get_local $6)
                                  )
                                 )
                                 (i32.const 1)
                                )
                               )
                               (i32.store
                                (i32.add
                                 (get_local $1)
                                 (get_local $5)
                                )
                                (get_local $2)
                               )
                               (if
                                (get_local $3)
                                (block
                                 (set_local $1
                                  (i32.load
                                   (i32.add
                                    (get_local $0)
                                    (i32.const 20)
                                   )
                                  )
                                 )
                                 (i32.store offset=12
                                  (tee_local $6
                                   (block $label$46 (result i32)
                                    (drop
                                     (br_if $label$46
                                      (i32.load offset=8
                                       (tee_local $3
                                        (i32.add
                                         (get_local $7)
                                         (i32.shl
                                          (tee_local $6
                                           (i32.shr_u
                                            (get_local $3)
                                            (i32.const 3)
                                           )
                                          )
                                          (i32.const 3)
                                         )
                                        )
                                       )
                                      )
                                      (i32.and
                                       (tee_local $5
                                        (i32.load
                                         (get_local $0)
                                        )
                                       )
                                       (tee_local $6
                                        (i32.shl
                                         (i32.const 1)
                                         (get_local $6)
                                        )
                                       )
                                      )
                                     )
                                    )
                                    (i32.store
                                     (get_local $0)
                                     (i32.or
                                      (get_local $5)
                                      (get_local $6)
                                     )
                                    )
                                    (get_local $3)
                                   )
                                  )
                                  (get_local $1)
                                 )
                                 (i32.store
                                  (i32.add
                                   (get_local $3)
                                   (i32.const 8)
                                  )
                                  (get_local $1)
                                 )
                                 (i32.store offset=12
                                  (get_local $1)
                                  (get_local $3)
                                 )
                                 (i32.store offset=8
                                  (get_local $1)
                                  (get_local $6)
                                 )
                                )
                               )
                               (i32.store
                                (i32.add
                                 (get_local $0)
                                 (i32.const 20)
                                )
                                (get_local $9)
                               )
                               (i32.store
                                (i32.add
                                 (get_local $0)
                                 (i32.const 8)
                                )
                                (get_local $2)
                               )
                               (return
                                (get_local $4)
                               )
                              )
                              (block $label$47
                               (if
                                (i32.eqz
                                 (tee_local $1
                                  (i32.load
                                   (tee_local $4
                                    (i32.add
                                     (get_local $3)
                                     (i32.const 20)
                                    )
                                   )
                                  )
                                 )
                                )
                                (block
                                 (br_if $label$47
                                  (i32.eqz
                                   (tee_local $1
                                    (i32.load offset=16
                                     (get_local $3)
                                    )
                                   )
                                  )
                                 )
                                 (set_local $4
                                  (i32.add
                                   (get_local $3)
                                   (i32.const 16)
                                  )
                                 )
                                )
                               )
                               (loop $label$49
                                (set_local $9
                                 (get_local $4)
                                )
                                (br_if $label$49
                                 (tee_local $1
                                  (i32.load
                                   (tee_local $4
                                    (i32.add
                                     (tee_local $5
                                      (get_local $1)
                                     )
                                     (i32.const 20)
                                    )
                                   )
                                  )
                                 )
                                )
                                (set_local $4
                                 (i32.add
                                  (get_local $5)
                                  (i32.const 16)
                                 )
                                )
                                (br_if $label$49
                                 (tee_local $1
                                  (i32.load offset=16
                                   (get_local $5)
                                  )
                                 )
                                )
                               )
                               (i32.store
                                (get_local $9)
                                (i32.const 0)
                               )
                               (br_if $label$27
                                (i32.eqz
                                 (get_local $7)
                                )
                               )
                               (br $label$28)
                              )
                              (set_local $5
                               (i32.const 0)
                              )
                              (br_if $label$27
                               (i32.eqz
                                (get_local $7)
                               )
                              )
                             )
                             (block $label$50
                              (block $label$51
                               (if
                                (i32.ne
                                 (get_local $3)
                                 (i32.load
                                  (tee_local $1
                                   (i32.add
                                    (i32.add
                                     (get_local $0)
                                     (i32.shl
                                      (tee_local $4
                                       (i32.load offset=28
                                        (get_local $3)
                                       )
                                      )
                                      (i32.const 2)
                                     )
                                    )
                                    (i32.const 304)
                                   )
                                  )
                                 )
                                )
                                (block
                                 (i32.store
                                  (i32.add
                                   (i32.add
                                    (get_local $7)
                                    (i32.const 16)
                                   )
                                   (i32.shl
                                    (i32.ne
                                     (i32.load offset=16
                                      (get_local $7)
                                     )
                                     (get_local $3)
                                    )
                                    (i32.const 2)
                                   )
                                  )
                                  (get_local $5)
                                 )
                                 (br_if $label$51
                                  (get_local $5)
                                 )
                                 (br $label$27)
                                )
                               )
                               (i32.store
                                (get_local $1)
                                (get_local $5)
                               )
                               (br_if $label$50
                                (i32.eqz
                                 (get_local $5)
                                )
                               )
                              )
                              (i32.store offset=24
                               (get_local $5)
                               (get_local $7)
                              )
                              (if
                               (tee_local $1
                                (i32.load offset=16
                                 (get_local $3)
                                )
                               )
                               (block
                                (i32.store offset=16
                                 (get_local $5)
                                 (get_local $1)
                                )
                                (i32.store offset=24
                                 (get_local $1)
                                 (get_local $5)
                                )
                               )
                              )
                              (br_if $label$27
                               (i32.eqz
                                (tee_local $1
                                 (i32.load
                                  (i32.add
                                   (get_local $3)
                                   (i32.const 20)
                                  )
                                 )
                                )
                               )
                              )
                              (i32.store
                               (i32.add
                                (get_local $5)
                                (i32.const 20)
                               )
                               (get_local $1)
                              )
                              (i32.store offset=24
                               (get_local $1)
                               (get_local $5)
                              )
                              (br $label$27)
                             )
                             (i32.store
                              (tee_local $1
                               (i32.add
                                (get_local $0)
                                (i32.const 4)
                               )
                              )
                              (i32.and
                               (i32.load
                                (get_local $1)
                               )
                               (i32.rotl
                                (i32.const -2)
                                (get_local $4)
                               )
                              )
                             )
                            )
                            (block $label$54
                             (if
                              (i32.le_u
                               (get_local $2)
                               (i32.const 15)
                              )
                              (block
                               (i32.store offset=4
                                (get_local $3)
                                (i32.or
                                 (tee_local $1
                                  (i32.add
                                   (get_local $2)
                                   (get_local $6)
                                  )
                                 )
                                 (i32.const 3)
                                )
                               )
                               (i32.store offset=4
                                (tee_local $1
                                 (i32.add
                                  (get_local $3)
                                  (get_local $1)
                                 )
                                )
                                (i32.or
                                 (i32.load offset=4
                                  (get_local $1)
                                 )
                                 (i32.const 1)
                                )
                               )
                               (br $label$54)
                              )
                             )
                             (i32.store offset=4
                              (get_local $3)
                              (i32.or
                               (get_local $6)
                               (i32.const 3)
                              )
                             )
                             (i32.store offset=4
                              (get_local $8)
                              (i32.or
                               (get_local $2)
                               (i32.const 1)
                              )
                             )
                             (i32.store
                              (i32.add
                               (get_local $8)
                               (get_local $2)
                              )
                              (get_local $2)
                             )
                             (if
                              (tee_local $1
                               (i32.load
                                (tee_local $4
                                 (i32.add
                                  (get_local $0)
                                  (i32.const 8)
                                 )
                                )
                               )
                              )
                              (block
                               (set_local $6
                                (i32.add
                                 (i32.add
                                  (get_local $0)
                                  (i32.shl
                                   (tee_local $5
                                    (i32.shr_u
                                     (get_local $1)
                                     (i32.const 3)
                                    )
                                   )
                                   (i32.const 3)
                                  )
                                 )
                                 (i32.const 40)
                                )
                               )
                               (set_local $1
                                (i32.load
                                 (i32.add
                                  (get_local $0)
                                  (i32.const 20)
                                 )
                                )
                               )
                               (i32.store offset=12
                                (tee_local $5
                                 (block $label$57 (result i32)
                                  (drop
                                   (br_if $label$57
                                    (i32.load offset=8
                                     (get_local $6)
                                    )
                                    (i32.and
                                     (tee_local $9
                                      (i32.load
                                       (get_local $0)
                                      )
                                     )
                                     (tee_local $5
                                      (i32.shl
                                       (i32.const 1)
                                       (get_local $5)
                                      )
                                     )
                                    )
                                   )
                                  )
                                  (i32.store
                                   (get_local $0)
                                   (i32.or
                                    (get_local $9)
                                    (get_local $5)
                                   )
                                  )
                                  (get_local $6)
                                 )
                                )
                                (get_local $1)
                               )
                               (i32.store
                                (i32.add
                                 (get_local $6)
                                 (i32.const 8)
                                )
                                (get_local $1)
                               )
                               (i32.store offset=12
                                (get_local $1)
                                (get_local $6)
                               )
                               (i32.store offset=8
                                (get_local $1)
                                (get_local $5)
                               )
                              )
                             )
                             (i32.store
                              (i32.add
                               (get_local $0)
                               (i32.const 20)
                              )
                              (get_local $8)
                             )
                             (i32.store
                              (get_local $4)
                              (get_local $2)
                             )
                            )
                            (return
                             (i32.add
                              (get_local $3)
                              (i32.const 8)
                             )
                            )
                           )
                           (br_if $label$24
                            (i32.eqz
                             (get_local $1)
                            )
                           )
                          )
                          (loop $label$58
                           (set_local $3
                            (select
                             (tee_local $2
                              (i32.sub
                               (i32.and
                                (i32.load offset=4
                                 (get_local $1)
                                )
                                (i32.const -8)
                               )
                               (get_local $6)
                              )
                             )
                             (get_local $3)
                             (tee_local $2
                              (i32.lt_u
                               (get_local $2)
                               (get_local $3)
                              )
                             )
                            )
                           )
                           (set_local $4
                            (select
                             (get_local $1)
                             (get_local $4)
                             (get_local $2)
                            )
                           )
                           (set_local $1
                            (tee_local $2
                             (i32.load
                              (i32.add
                               (i32.add
                                (get_local $1)
                                (i32.const 16)
                               )
                               (i32.shl
                                (i32.eqz
                                 (i32.load offset=16
                                  (get_local $1)
                                 )
                                )
                                (i32.const 2)
                               )
                              )
                             )
                            )
                           )
                           (br_if $label$58
                            (get_local $2)
                           )
                          )
                         )
                         (br_if $label$23
                          (i32.or
                           (i32.eqz
                            (get_local $4)
                           )
                           (i32.ge_u
                            (get_local $3)
                            (i32.sub
                             (i32.load offset=8
                              (get_local $0)
                             )
                             (get_local $6)
                            )
                           )
                          )
                         )
                         (br_if $label$8
                          (i32.le_u
                           (tee_local $7
                            (i32.add
                             (get_local $4)
                             (get_local $6)
                            )
                           )
                           (get_local $4)
                          )
                         )
                         (set_local $8
                          (i32.load offset=24
                           (get_local $4)
                          )
                         )
                         (br_if $label$22
                          (i32.eq
                           (tee_local $5
                            (i32.load offset=12
                             (get_local $4)
                            )
                           )
                           (get_local $4)
                          )
                         )
                         (i32.store offset=12
                          (tee_local $1
                           (i32.load offset=8
                            (get_local $4)
                           )
                          )
                          (get_local $5)
                         )
                         (i32.store offset=8
                          (get_local $5)
                          (get_local $1)
                         )
                         (br_if $label$2
                          (get_local $8)
                         )
                         (br $label$1)
                        )
                        (set_local $1
                         (block $label$59 (result i32)
                          (block $label$60
                           (block $label$61
                            (block $label$62
                             (block $label$63
                              (if
                               (i32.lt_u
                                (tee_local $1
                                 (i32.load offset=8
                                  (get_local $0)
                                 )
                                )
                                (get_local $6)
                               )
                               (block
                                (br_if $label$63
                                 (i32.le_u
                                  (tee_local $4
                                   (i32.load offset=12
                                    (get_local $0)
                                   )
                                  )
                                  (get_local $6)
                                 )
                                )
                                (i32.store offset=4
                                 (tee_local $2
                                  (i32.add
                                   (tee_local $1
                                    (i32.load offset=24
                                     (get_local $0)
                                    )
                                   )
                                   (get_local $6)
                                  )
                                 )
                                 (i32.or
                                  (tee_local $3
                                   (i32.sub
                                    (get_local $4)
                                    (get_local $6)
                                   )
                                  )
                                  (i32.const 1)
                                 )
                                )
                                (i32.store
                                 (i32.add
                                  (get_local $0)
                                  (i32.const 12)
                                 )
                                 (get_local $3)
                                )
                                (i32.store offset=24
                                 (get_local $0)
                                 (get_local $2)
                                )
                                (i32.store offset=4
                                 (get_local $1)
                                 (i32.or
                                  (get_local $6)
                                  (i32.const 3)
                                 )
                                )
                                (return
                                 (i32.add
                                  (get_local $1)
                                  (i32.const 8)
                                 )
                                )
                               )
                              )
                              (set_local $2
                               (i32.load offset=20
                                (get_local $0)
                               )
                              )
                              (br_if $label$62
                               (i32.lt_u
                                (tee_local $3
                                 (i32.sub
                                  (get_local $1)
                                  (get_local $6)
                                 )
                                )
                                (i32.const 16)
                               )
                              )
                              (i32.store offset=4
                               (tee_local $4
                                (i32.add
                                 (get_local $2)
                                 (get_local $6)
                                )
                               )
                               (i32.or
                                (get_local $3)
                                (i32.const 1)
                               )
                              )
                              (i32.store
                               (i32.add
                                (get_local $2)
                                (get_local $1)
                               )
                               (get_local $3)
                              )
                              (i32.store
                               (i32.add
                                (get_local $0)
                                (i32.const 8)
                               )
                               (get_local $3)
                              )
                              (i32.store
                               (i32.add
                                (get_local $0)
                                (i32.const 20)
                               )
                               (get_local $4)
                              )
                              (i32.store offset=4
                               (get_local $2)
                               (i32.or
                                (get_local $6)
                                (i32.const 3)
                               )
                              )
                              (br $label$61)
                             )
                             (br_if $label$60
                              (i32.eqz
                               (i32.load
                                (i32.const 72)
                               )
                              )
                             )
                             (br $label$59
                              (i32.load
                               (i32.const 80)
                              )
                             )
                            )
                            (i32.store offset=4
                             (get_local $2)
                             (i32.or
                              (get_local $1)
                              (i32.const 3)
                             )
                            )
                            (i32.store
                             (i32.add
                              (get_local $0)
                              (i32.const 20)
                             )
                             (i32.const 0)
                            )
                            (i32.store
                             (i32.add
                              (get_local $0)
                              (i32.const 8)
                             )
                             (i32.const 0)
                            )
                            (i32.store offset=4
                             (tee_local $1
                              (i32.add
                               (get_local $2)
                               (get_local $1)
                              )
                             )
                             (i32.or
                              (i32.load offset=4
                               (get_local $1)
                              )
                              (i32.const 1)
                             )
                            )
                           )
                           (return
                            (i32.add
                             (get_local $2)
                             (i32.const 8)
                            )
                           )
                          )
                          (i64.store align=4
                           (i32.const 76)
                           (i64.const 281474976776192)
                          )
                          (i64.store align=4
                           (i32.const 84)
                           (i64.const -1)
                          )
                          (i32.store
                           (i32.const 72)
                           (i32.xor
                            (i32.and
                             (i32.add
                              (get_local $7)
                              (i32.const 12)
                             )
                             (i32.const -16)
                            )
                            (i32.const 1431655768)
                           )
                          )
                          (i32.store
                           (i32.const 92)
                           (i32.const 0)
                          )
                          (i32.const 65536)
                         )
                        )
                        (set_local $9
                         (i32.const 0)
                        )
                        (br_if $label$13
                         (i32.le_u
                          (tee_local $5
                           (i32.and
                            (tee_local $7
                             (i32.add
                              (get_local $1)
                              (tee_local $10
                               (i32.add
                                (get_local $6)
                                (i32.const 47)
                               )
                              )
                             )
                            )
                            (tee_local $8
                             (i32.sub
                              (i32.const 0)
                              (get_local $1)
                             )
                            )
                           )
                          )
                          (get_local $6)
                         )
                        )
                        (if
                         (tee_local $11
                          (i32.load offset=440
                           (get_local $0)
                          )
                         )
                         (br_if $label$13
                          (i32.or
                           (i32.le_u
                            (tee_local $2
                             (i32.add
                              (tee_local $1
                               (i32.load offset=432
                                (get_local $0)
                               )
                              )
                              (get_local $5)
                             )
                            )
                            (get_local $1)
                           )
                           (i32.gt_u
                            (get_local $2)
                            (get_local $11)
                           )
                          )
                         )
                        )
                        (br_if $label$15
                         (i32.and
                          (i32.load8_u
                           (i32.add
                            (get_local $0)
                            (i32.const 444)
                           )
                          )
                          (i32.const 4)
                         )
                        )
                        (if
                         (tee_local $2
                          (i32.load offset=24
                           (get_local $0)
                          )
                         )
                         (block
                          (set_local $1
                           (i32.add
                            (get_local $0)
                            (i32.const 448)
                           )
                          )
                          (loop $label$67
                           (if
                            (i32.le_u
                             (tee_local $3
                              (i32.load
                               (get_local $1)
                              )
                             )
                             (get_local $2)
                            )
                            (br_if $label$21
                             (i32.gt_u
                              (i32.add
                               (get_local $3)
                               (i32.load offset=4
                                (get_local $1)
                               )
                              )
                              (get_local $2)
                             )
                            )
                           )
                           (br_if $label$67
                            (tee_local $1
                             (i32.load offset=8
                              (get_local $1)
                             )
                            )
                           )
                          )
                         )
                        )
                        (set_local $1
                         (current_memory)
                        )
                        (set_local $7
                         (get_local $5)
                        )
                        (if
                         (i32.and
                          (tee_local $3
                           (i32.add
                            (tee_local $2
                             (i32.load
                              (i32.const 76)
                             )
                            )
                            (i32.const -1)
                           )
                          )
                          (tee_local $4
                           (i32.shl
                            (get_local $1)
                            (i32.const 16)
                           )
                          )
                         )
                         (set_local $7
                          (i32.add
                           (i32.sub
                            (get_local $5)
                            (get_local $4)
                           )
                           (i32.and
                            (i32.add
                             (get_local $3)
                             (get_local $4)
                            )
                            (i32.sub
                             (i32.const 0)
                             (get_local $2)
                            )
                           )
                          )
                         )
                        )
                        (br_if $label$16
                         (i32.or
                          (i32.le_u
                           (get_local $7)
                           (get_local $6)
                          )
                          (i32.gt_u
                           (get_local $7)
                           (i32.const 2147483646)
                          )
                         )
                        )
                        (if
                         (get_local $11)
                         (br_if $label$16
                          (i32.or
                           (i32.le_u
                            (tee_local $2
                             (i32.add
                              (tee_local $1
                               (i32.load offset=432
                                (get_local $0)
                               )
                              )
                              (get_local $7)
                             )
                            )
                            (get_local $1)
                           )
                           (i32.gt_u
                            (get_local $2)
                            (get_local $11)
                           )
                          )
                         )
                        )
                        (br_if $label$14
                         (i32.eq
                          (tee_local $1
                           (select
                            (i32.shl
                             (current_memory)
                             (i32.const 16)
                            )
                            (i32.const -1)
                            (grow_memory
                             (i32.add
                              (i32.shr_s
                               (i32.add
                                (get_local $7)
                                (i32.const -1)
                               )
                               (i32.const 16)
                              )
                              (i32.const 1)
                             )
                            )
                           )
                          )
                          (get_local $4)
                         )
                        )
                        (set_local $4
                         (get_local $1)
                        )
                        (br $label$20)
                       )
                       (if
                        (i32.eqz
                         (tee_local $1
                          (i32.load
                           (tee_local $2
                            (i32.add
                             (get_local $4)
                             (i32.const 20)
                            )
                           )
                          )
                         )
                        )
                        (block
                         (br_if $label$19
                          (i32.eqz
                           (tee_local $1
                            (i32.load offset=16
                             (get_local $4)
                            )
                           )
                          )
                         )
                         (set_local $2
                          (i32.add
                           (get_local $4)
                           (i32.const 16)
                          )
                         )
                        )
                       )
                       (loop $label$72
                        (set_local $9
                         (get_local $2)
                        )
                        (br_if $label$72
                         (tee_local $1
                          (i32.load
                           (tee_local $2
                            (i32.add
                             (tee_local $5
                              (get_local $1)
                             )
                             (i32.const 20)
                            )
                           )
                          )
                         )
                        )
                        (set_local $2
                         (i32.add
                          (get_local $5)
                          (i32.const 16)
                         )
                        )
                        (br_if $label$72
                         (tee_local $1
                          (i32.load offset=16
                           (get_local $5)
                          )
                         )
                        )
                       )
                       (i32.store
                        (get_local $9)
                        (i32.const 0)
                       )
                       (br_if $label$1
                        (i32.eqz
                         (get_local $8)
                        )
                       )
                       (br $label$2)
                      )
                      (br_if $label$16
                       (i32.gt_u
                        (tee_local $7
                         (i32.and
                          (i32.sub
                           (get_local $7)
                           (get_local $4)
                          )
                          (get_local $8)
                         )
                        )
                        (i32.const 2147483646)
                       )
                      )
                      (set_local $2
                       (current_memory)
                      )
                      (br_if $label$18
                       (i32.eq
                        (tee_local $4
                         (block $label$73 (result i32)
                          (if
                           (get_local $7)
                           (drop
                            (br_if $label$73
                             (i32.const -1)
                             (i32.eqz
                              (grow_memory
                               (i32.add
                                (i32.shr_s
                                 (i32.add
                                  (get_local $7)
                                  (i32.const -1)
                                 )
                                 (i32.const 16)
                                )
                                (i32.const 1)
                               )
                              )
                             )
                            )
                           )
                          )
                          (i32.shl
                           (get_local $2)
                           (i32.const 16)
                          )
                         )
                        )
                        (i32.add
                         (i32.load
                          (get_local $1)
                         )
                         (i32.load
                          (i32.add
                           (get_local $1)
                           (i32.const 4)
                          )
                         )
                        )
                       )
                      )
                     )
                     (if
                      (i32.eqz
                       (i32.or
                        (i32.or
                         (i32.le_u
                          (i32.add
                           (get_local $6)
                           (i32.const 48)
                          )
                          (get_local $7)
                         )
                         (i32.gt_u
                          (get_local $7)
                          (i32.const 2147483646)
                         )
                        )
                        (i32.eq
                         (get_local $4)
                         (i32.const -1)
                        )
                       )
                      )
                      (block
                       (br_if $label$14
                        (i32.gt_u
                         (tee_local $1
                          (i32.and
                           (i32.add
                            (i32.sub
                             (get_local $10)
                             (get_local $7)
                            )
                            (tee_local $1
                             (i32.load
                              (i32.const 80)
                             )
                            )
                           )
                           (i32.sub
                            (i32.const 0)
                            (get_local $1)
                           )
                          )
                         )
                         (i32.const 2147483646)
                        )
                       )
                       (if
                        (get_local $1)
                        (br_if $label$17
                         (i32.eqz
                          (grow_memory
                           (i32.add
                            (i32.shr_s
                             (i32.add
                              (get_local $1)
                              (i32.const -1)
                             )
                             (i32.const 16)
                            )
                            (i32.const 1)
                           )
                          )
                         )
                        )
                       )
                       (set_local $7
                        (i32.add
                         (get_local $1)
                         (get_local $7)
                        )
                       )
                       (br $label$14)
                      )
                     )
                     (br_if $label$14
                      (i32.ne
                       (get_local $4)
                       (i32.const -1)
                      )
                     )
                     (br $label$16)
                    )
                    (set_local $5
                     (i32.const 0)
                    )
                    (br_if $label$2
                     (get_local $8)
                    )
                    (br $label$1)
                   )
                   (br_if $label$14
                    (i32.ne
                     (get_local $4)
                     (i32.const -1)
                    )
                   )
                   (br $label$16)
                  )
                  (br_if $label$16
                   (i32.lt_s
                    (i32.sub
                     (i32.const 0)
                     (get_local $7)
                    )
                    (i32.const 1)
                   )
                  )
                  (drop
                   (grow_memory
                    (i32.add
                     (i32.shr_s
                      (i32.xor
                       (get_local $7)
                       (i32.const -1)
                      )
                      (i32.const 16)
                     )
                     (i32.const 1)
                    )
                   )
                  )
                 )
                 (i32.store
                  (tee_local $1
                   (i32.add
                    (get_local $0)
                    (i32.const 444)
                   )
                  )
                  (i32.or
                   (i32.load
                    (get_local $1)
                   )
                   (i32.const 4)
                  )
                 )
                )
                (br_if $label$13
                 (i32.gt_u
                  (get_local $5)
                  (i32.const 2147483646)
                 )
                )
                (set_local $1
                 (current_memory)
                )
                (set_local $4
                 (block $label$77 (result i32)
                  (if
                   (get_local $5)
                   (drop
                    (br_if $label$77
                     (i32.const -1)
                     (i32.eqz
                      (grow_memory
                       (i32.add
                        (i32.shr_s
                         (i32.add
                          (get_local $5)
                          (i32.const -1)
                         )
                         (i32.const 16)
                        )
                        (i32.const 1)
                       )
                      )
                     )
                    )
                   )
                  )
                  (i32.shl
                   (get_local $1)
                   (i32.const 16)
                  )
                 )
                )
                (set_local $1
                 (current_memory)
                )
                (br_if $label$13
                 (i32.eq
                  (get_local $4)
                  (i32.const -1)
                 )
                )
                (br_if $label$13
                 (i32.ge_u
                  (get_local $4)
                  (tee_local $1
                   (i32.shl
                    (get_local $1)
                    (i32.const 16)
                   )
                  )
                 )
                )
                (br_if $label$13
                 (i32.le_u
                  (tee_local $7
                   (i32.sub
                    (get_local $1)
                    (get_local $4)
                   )
                  )
                  (i32.add
                   (get_local $6)
                   (i32.const 40)
                  )
                 )
                )
               )
               (i32.store offset=432
                (get_local $0)
                (tee_local $1
                 (i32.add
                  (i32.load offset=432
                   (get_local $0)
                  )
                  (get_local $7)
                 )
                )
               )
               (if
                (i32.gt_u
                 (get_local $1)
                 (i32.load offset=436
                  (get_local $0)
                 )
                )
                (i32.store
                 (i32.add
                  (get_local $0)
                  (i32.const 436)
                 )
                 (get_local $1)
                )
               )
               (block $label$80
                (block $label$81
                 (block $label$82
                  (if
                   (tee_local $2
                    (i32.load offset=24
                     (get_local $0)
                    )
                   )
                   (block
                    (set_local $1
                     (tee_local $8
                      (i32.add
                       (get_local $0)
                       (i32.const 448)
                      )
                     )
                    )
                    (loop $label$84
                     (br_if $label$82
                      (i32.eq
                       (get_local $4)
                       (i32.add
                        (tee_local $3
                         (i32.load
                          (get_local $1)
                         )
                        )
                        (tee_local $5
                         (i32.load offset=4
                          (get_local $1)
                         )
                        )
                       )
                      )
                     )
                     (br_if $label$84
                      (tee_local $1
                       (i32.load offset=8
                        (get_local $1)
                       )
                      )
                     )
                     (br $label$81)
                    )
                   )
                  )
                  (block $label$85
                   (if
                    (tee_local $1
                     (i32.load offset=16
                      (get_local $0)
                     )
                    )
                    (br_if $label$85
                     (i32.ge_u
                      (get_local $4)
                      (get_local $1)
                     )
                    )
                   )
                   (i32.store
                    (i32.add
                     (get_local $0)
                     (i32.const 16)
                    )
                    (get_local $4)
                   )
                  )
                  (i32.store offset=452
                   (get_local $0)
                   (get_local $7)
                  )
                  (i32.store offset=448
                   (get_local $0)
                   (get_local $4)
                  )
                  (set_local $1
                   (i32.const 0)
                  )
                  (i32.store offset=460
                   (get_local $0)
                   (i32.const 0)
                  )
                  (i32.store offset=32
                   (get_local $0)
                   (i32.const -1)
                  )
                  (i32.store offset=36
                   (get_local $0)
                   (i32.load
                    (i32.const 72)
                   )
                  )
                  (loop $label$87
                   (i32.store
                    (i32.add
                     (tee_local $2
                      (i32.add
                       (get_local $0)
                       (get_local $1)
                      )
                     )
                     (i32.const 48)
                    )
                    (tee_local $3
                     (i32.add
                      (get_local $2)
                      (i32.const 40)
                     )
                    )
                   )
                   (i32.store
                    (i32.add
                     (get_local $2)
                     (i32.const 52)
                    )
                    (get_local $3)
                   )
                   (br_if $label$87
                    (i32.ne
                     (tee_local $1
                      (i32.add
                       (get_local $1)
                       (i32.const 8)
                      )
                     )
                     (i32.const 256)
                    )
                   )
                  )
                  (i32.store
                   (i32.add
                    (get_local $0)
                    (i32.const 24)
                   )
                   (tee_local $3
                    (i32.add
                     (tee_local $2
                      (i32.add
                       (tee_local $1
                        (i32.add
                         (get_local $0)
                         (i32.and
                          (i32.load
                           (i32.add
                            (get_local $0)
                            (i32.const -4)
                           )
                          )
                          (i32.const -8)
                         )
                        )
                       )
                       (i32.const -8)
                      )
                     )
                     (tee_local $1
                      (select
                       (i32.and
                        (i32.sub
                         (i32.const 0)
                         (get_local $1)
                        )
                        (i32.const 7)
                       )
                       (i32.const 0)
                       (i32.and
                        (get_local $1)
                        (i32.const 7)
                       )
                      )
                     )
                    )
                   )
                  )
                  (i32.store
                   (i32.add
                    (get_local $0)
                    (i32.const 12)
                   )
                   (tee_local $1
                    (i32.sub
                     (i32.add
                      (i32.sub
                       (tee_local $4
                        (i32.add
                         (get_local $4)
                         (get_local $7)
                        )
                       )
                       (get_local $2)
                      )
                      (i32.const -40)
                     )
                     (get_local $1)
                    )
                   )
                  )
                  (i32.store offset=4
                   (get_local $3)
                   (i32.or
                    (get_local $1)
                    (i32.const 1)
                   )
                  )
                  (i32.store
                   (i32.add
                    (get_local $4)
                    (i32.const -36)
                   )
                   (i32.const 40)
                  )
                  (i32.store offset=28
                   (get_local $0)
                   (i32.load
                    (i32.const 88)
                   )
                  )
                  (br $label$80)
                 )
                 (br_if $label$81
                  (i32.or
                   (i32.or
                    (i32.and
                     (i32.load8_u offset=12
                      (get_local $1)
                     )
                     (i32.const 8)
                    )
                    (i32.le_u
                     (get_local $4)
                     (get_local $2)
                    )
                   )
                   (i32.gt_u
                    (get_local $3)
                    (get_local $2)
                   )
                  )
                 )
                 (i32.store offset=4
                  (tee_local $4
                   (i32.add
                    (get_local $2)
                    (tee_local $3
                     (select
                      (i32.and
                       (i32.sub
                        (i32.const -8)
                        (get_local $2)
                       )
                       (i32.const 7)
                      )
                      (i32.const 0)
                      (i32.and
                       (i32.add
                        (get_local $2)
                        (i32.const 8)
                       )
                       (i32.const 7)
                      )
                     )
                    )
                   )
                  )
                  (i32.or
                   (tee_local $3
                    (i32.sub
                     (tee_local $10
                      (i32.add
                       (i32.load
                        (tee_local $8
                         (i32.add
                          (get_local $0)
                          (i32.const 12)
                         )
                        )
                       )
                       (get_local $7)
                      )
                     )
                     (get_local $3)
                    )
                   )
                   (i32.const 1)
                  )
                 )
                 (i32.store
                  (i32.add
                   (get_local $1)
                   (i32.const 4)
                  )
                  (i32.add
                   (get_local $5)
                   (get_local $7)
                  )
                 )
                 (i32.store offset=28
                  (get_local $0)
                  (i32.load
                   (i32.const 88)
                  )
                 )
                 (i32.store
                  (get_local $8)
                  (get_local $3)
                 )
                 (i32.store
                  (i32.add
                   (get_local $0)
                   (i32.const 24)
                  )
                  (get_local $4)
                 )
                 (i32.store offset=4
                  (i32.add
                   (get_local $2)
                   (get_local $10)
                  )
                  (i32.const 40)
                 )
                 (br $label$80)
                )
                (if
                 (i32.lt_u
                  (get_local $4)
                  (i32.load offset=16
                   (get_local $0)
                  )
                 )
                 (i32.store
                  (i32.add
                   (get_local $0)
                   (i32.const 16)
                  )
                  (get_local $4)
                 )
                )
                (set_local $3
                 (i32.add
                  (get_local $4)
                  (get_local $7)
                 )
                )
                (set_local $1
                 (get_local $8)
                )
                (set_local $1
                 (block $label$89 (result i32)
                  (block $label$90
                   (i32.store offset=12
                    (tee_local $3
                     (block $label$91 (result i32)
                      (block $label$92
                       (block $label$93
                        (block $label$94
                         (block $label$95
                          (loop $label$96
                           (br_if $label$95
                            (i32.eq
                             (i32.load
                              (get_local $1)
                             )
                             (get_local $3)
                            )
                           )
                           (br_if $label$96
                            (tee_local $1
                             (i32.load offset=8
                              (get_local $1)
                             )
                            )
                           )
                           (br $label$94)
                          )
                         )
                         (br_if $label$94
                          (i32.and
                           (i32.load8_u offset=12
                            (get_local $1)
                           )
                           (i32.const 8)
                          )
                         )
                         (i32.store
                          (get_local $1)
                          (get_local $4)
                         )
                         (i32.store offset=4
                          (get_local $1)
                          (i32.add
                           (i32.load offset=4
                            (get_local $1)
                           )
                           (get_local $7)
                          )
                         )
                         (i32.store offset=4
                          (tee_local $9
                           (i32.add
                            (get_local $4)
                            (select
                             (i32.and
                              (i32.sub
                               (i32.const -8)
                               (get_local $4)
                              )
                              (i32.const 7)
                             )
                             (i32.const 0)
                             (i32.and
                              (i32.add
                               (get_local $4)
                               (i32.const 8)
                              )
                              (i32.const 7)
                             )
                            )
                           )
                          )
                          (i32.or
                           (get_local $6)
                           (i32.const 3)
                          )
                         )
                         (set_local $1
                          (i32.sub
                           (i32.sub
                            (tee_local $4
                             (i32.add
                              (get_local $3)
                              (select
                               (i32.and
                                (i32.sub
                                 (i32.const -8)
                                 (get_local $3)
                                )
                                (i32.const 7)
                               )
                               (i32.const 0)
                               (i32.and
                                (i32.add
                                 (get_local $3)
                                 (i32.const 8)
                                )
                                (i32.const 7)
                               )
                              )
                             )
                            )
                            (get_local $9)
                           )
                           (get_local $6)
                          )
                         )
                         (set_local $3
                          (i32.add
                           (get_local $9)
                           (get_local $6)
                          )
                         )
                         (br_if $label$93
                          (i32.eq
                           (get_local $2)
                           (get_local $4)
                          )
                         )
                         (br_if $label$12
                          (i32.eq
                           (i32.load offset=20
                            (get_local $0)
                           )
                           (get_local $4)
                          )
                         )
                         (br_if $label$4
                          (i32.ne
                           (i32.and
                            (tee_local $2
                             (i32.load offset=4
                              (get_local $4)
                             )
                            )
                            (i32.const 3)
                           )
                           (i32.const 1)
                          )
                         )
                         (set_local $8
                          (i32.and
                           (get_local $2)
                           (i32.const -8)
                          )
                         )
                         (br_if $label$11
                          (i32.gt_u
                           (get_local $2)
                           (i32.const 255)
                          )
                         )
                         (br_if $label$10
                          (i32.eq
                           (tee_local $6
                            (i32.load offset=12
                             (get_local $4)
                            )
                           )
                           (tee_local $5
                            (i32.load offset=8
                             (get_local $4)
                            )
                           )
                          )
                         )
                         (i32.store offset=8
                          (get_local $6)
                          (get_local $5)
                         )
                         (i32.store offset=12
                          (get_local $5)
                          (get_local $6)
                         )
                         (br $label$5)
                        )
                        (set_local $1
                         (get_local $8)
                        )
                        (block $label$97
                         (loop $label$98
                          (if
                           (i32.le_u
                            (tee_local $3
                             (i32.load
                              (get_local $1)
                             )
                            )
                            (get_local $2)
                           )
                           (br_if $label$97
                            (i32.gt_u
                             (tee_local $3
                              (i32.add
                               (get_local $3)
                               (i32.load offset=4
                                (get_local $1)
                               )
                              )
                             )
                             (get_local $2)
                            )
                           )
                          )
                          (set_local $1
                           (i32.load offset=8
                            (get_local $1)
                           )
                          )
                          (br $label$98)
                         )
                        )
                        (i32.store offset=4
                         (tee_local $10
                          (i32.add
                           (get_local $4)
                           (tee_local $1
                            (select
                             (i32.and
                              (i32.sub
                               (i32.const -8)
                               (get_local $4)
                              )
                              (i32.const 7)
                             )
                             (i32.const 0)
                             (i32.and
                              (i32.add
                               (get_local $4)
                               (i32.const 8)
                              )
                              (i32.const 7)
                             )
                            )
                           )
                          )
                         )
                         (i32.or
                          (tee_local $1
                           (i32.sub
                            (tee_local $5
                             (i32.add
                              (get_local $7)
                              (i32.const -40)
                             )
                            )
                            (get_local $1)
                           )
                          )
                          (i32.const 1)
                         )
                        )
                        (i32.store offset=4
                         (i32.add
                          (get_local $4)
                          (get_local $5)
                         )
                         (i32.const 40)
                        )
                        (i32.store offset=4
                         (tee_local $5
                          (select
                           (get_local $2)
                           (tee_local $5
                            (i32.add
                             (i32.add
                              (get_local $3)
                              (select
                               (i32.and
                                (i32.sub
                                 (i32.const 39)
                                 (get_local $3)
                                )
                                (i32.const 7)
                               )
                               (i32.const 0)
                               (i32.and
                                (i32.add
                                 (get_local $3)
                                 (i32.const -39)
                                )
                                (i32.const 7)
                               )
                              )
                             )
                             (i32.const -47)
                            )
                           )
                           (i32.lt_u
                            (get_local $5)
                            (i32.add
                             (get_local $2)
                             (i32.const 16)
                            )
                           )
                          )
                         )
                         (i32.const 27)
                        )
                        (i32.store offset=28
                         (get_local $0)
                         (i32.load
                          (i32.const 88)
                         )
                        )
                        (i32.store
                         (i32.add
                          (get_local $0)
                          (i32.const 12)
                         )
                         (get_local $1)
                        )
                        (i32.store
                         (i32.add
                          (get_local $0)
                          (i32.const 24)
                         )
                         (get_local $10)
                        )
                        (i32.store offset=8
                         (get_local $5)
                         (i32.load
                          (get_local $8)
                         )
                        )
                        (i32.store
                         (i32.add
                          (get_local $5)
                          (i32.const 20)
                         )
                         (i32.load
                          (i32.add
                           (get_local $8)
                           (i32.const 12)
                          )
                         )
                        )
                        (i32.store
                         (i32.add
                          (get_local $5)
                          (i32.const 16)
                         )
                         (i32.load
                          (i32.add
                           (get_local $8)
                           (i32.const 8)
                          )
                         )
                        )
                        (i32.store
                         (i32.add
                          (get_local $5)
                          (i32.const 12)
                         )
                         (i32.load
                          (i32.add
                           (get_local $8)
                           (i32.const 4)
                          )
                         )
                        )
                        (i32.store offset=452
                         (get_local $0)
                         (get_local $7)
                        )
                        (i32.store
                         (i32.add
                          (get_local $0)
                          (i32.const 448)
                         )
                         (get_local $4)
                        )
                        (i32.store offset=460
                         (get_local $0)
                         (i32.const 0)
                        )
                        (i32.store offset=456
                         (get_local $0)
                         (i32.add
                          (get_local $5)
                          (i32.const 8)
                         )
                        )
                        (set_local $1
                         (i32.add
                          (get_local $5)
                          (i32.const 28)
                         )
                        )
                        (loop $label$100
                         (i32.store
                          (get_local $1)
                          (i32.const 7)
                         )
                         (br_if $label$100
                          (i32.lt_u
                           (tee_local $1
                            (i32.add
                             (get_local $1)
                             (i32.const 4)
                            )
                           )
                           (get_local $3)
                          )
                         )
                        )
                        (br_if $label$80
                         (i32.eq
                          (get_local $5)
                          (get_local $2)
                         )
                        )
                        (i32.store
                         (tee_local $1
                          (i32.add
                           (get_local $5)
                           (i32.const 4)
                          )
                         )
                         (i32.and
                          (i32.load
                           (get_local $1)
                          )
                          (i32.const -2)
                         )
                        )
                        (i32.store
                         (get_local $5)
                         (tee_local $7
                          (i32.sub
                           (get_local $5)
                           (get_local $2)
                          )
                         )
                        )
                        (i32.store offset=4
                         (get_local $2)
                         (i32.or
                          (get_local $7)
                          (i32.const 1)
                         )
                        )
                        (if
                         (i32.le_u
                          (get_local $7)
                          (i32.const 255)
                         )
                         (block
                          (set_local $1
                           (i32.add
                            (i32.add
                             (get_local $0)
                             (i32.shl
                              (tee_local $3
                               (i32.shr_u
                                (get_local $7)
                                (i32.const 3)
                               )
                              )
                              (i32.const 3)
                             )
                            )
                            (i32.const 40)
                           )
                          )
                          (br_if $label$92
                           (i32.eqz
                            (i32.and
                             (tee_local $4
                              (i32.load
                               (get_local $0)
                              )
                             )
                             (tee_local $3
                              (i32.shl
                               (i32.const 1)
                               (get_local $3)
                              )
                             )
                            )
                           )
                          )
                          (br $label$91
                           (i32.load offset=8
                            (get_local $1)
                           )
                          )
                         )
                        )
                        (br_if $label$90
                         (i32.eqz
                          (tee_local $3
                           (i32.shr_u
                            (get_local $7)
                            (i32.const 8)
                           )
                          )
                         )
                        )
                        (drop
                         (br_if $label$89
                          (i32.const 31)
                          (i32.gt_u
                           (get_local $7)
                           (i32.const 16777215)
                          )
                         )
                        )
                        (br $label$89
                         (i32.or
                          (i32.and
                           (i32.shr_u
                            (get_local $7)
                            (i32.add
                             (tee_local $1
                              (i32.add
                               (i32.sub
                                (i32.const 14)
                                (i32.or
                                 (i32.or
                                  (tee_local $4
                                   (i32.and
                                    (i32.shr_u
                                     (i32.add
                                      (tee_local $3
                                       (i32.shl
                                        (get_local $3)
                                        (tee_local $1
                                         (i32.and
                                          (i32.shr_u
                                           (i32.add
                                            (get_local $3)
                                            (i32.const 1048320)
                                           )
                                           (i32.const 16)
                                          )
                                          (i32.const 8)
                                         )
                                        )
                                       )
                                      )
                                      (i32.const 520192)
                                     )
                                     (i32.const 16)
                                    )
                                    (i32.const 4)
                                   )
                                  )
                                  (get_local $1)
                                 )
                                 (tee_local $3
                                  (i32.and
                                   (i32.shr_u
                                    (i32.add
                                     (tee_local $1
                                      (i32.shl
                                       (get_local $3)
                                       (get_local $4)
                                      )
                                     )
                                     (i32.const 245760)
                                    )
                                    (i32.const 16)
                                   )
                                   (i32.const 2)
                                  )
                                 )
                                )
                               )
                               (i32.shr_u
                                (i32.shl
                                 (get_local $1)
                                 (get_local $3)
                                )
                                (i32.const 15)
                               )
                              )
                             )
                             (i32.const 7)
                            )
                           )
                           (i32.const 1)
                          )
                          (i32.shl
                           (get_local $1)
                           (i32.const 1)
                          )
                         )
                        )
                       )
                       (i32.store
                        (i32.add
                         (get_local $0)
                         (i32.const 24)
                        )
                        (get_local $3)
                       )
                       (i32.store
                        (tee_local $2
                         (i32.add
                          (get_local $0)
                          (i32.const 12)
                         )
                        )
                        (tee_local $1
                         (i32.add
                          (i32.load
                           (get_local $2)
                          )
                          (get_local $1)
                         )
                        )
                       )
                       (i32.store offset=4
                        (get_local $3)
                        (i32.or
                         (get_local $1)
                         (i32.const 1)
                        )
                       )
                       (br $label$3)
                      )
                      (i32.store
                       (get_local $0)
                       (i32.or
                        (get_local $4)
                        (get_local $3)
                       )
                      )
                      (get_local $1)
                     )
                    )
                    (get_local $2)
                   )
                   (i32.store
                    (i32.add
                     (get_local $1)
                     (i32.const 8)
                    )
                    (get_local $2)
                   )
                   (i32.store offset=12
                    (get_local $2)
                    (get_local $1)
                   )
                   (i32.store offset=8
                    (get_local $2)
                    (get_local $3)
                   )
                   (br $label$80)
                  )
                  (i32.const 0)
                 )
                )
                (i64.store offset=16 align=4
                 (get_local $2)
                 (i64.const 0)
                )
                (i32.store
                 (i32.add
                  (get_local $2)
                  (i32.const 28)
                 )
                 (get_local $1)
                )
                (set_local $3
                 (i32.add
                  (i32.add
                   (get_local $0)
                   (i32.shl
                    (get_local $1)
                    (i32.const 2)
                   )
                  )
                  (i32.const 304)
                 )
                )
                (block $label$102
                 (block $label$103
                  (if
                   (i32.and
                    (tee_local $4
                     (i32.load offset=4
                      (get_local $0)
                     )
                    )
                    (tee_local $5
                     (i32.shl
                      (i32.const 1)
                      (get_local $1)
                     )
                    )
                   )
                   (block
                    (set_local $1
                     (i32.shl
                      (get_local $7)
                      (select
                       (i32.const 0)
                       (i32.sub
                        (i32.const 25)
                        (i32.shr_u
                         (get_local $1)
                         (i32.const 1)
                        )
                       )
                       (i32.eq
                        (get_local $1)
                        (i32.const 31)
                       )
                      )
                     )
                    )
                    (set_local $4
                     (i32.load
                      (get_local $3)
                     )
                    )
                    (loop $label$105
                     (br_if $label$102
                      (i32.eq
                       (i32.and
                        (i32.load offset=4
                         (tee_local $3
                          (get_local $4)
                         )
                        )
                        (i32.const -8)
                       )
                       (get_local $7)
                      )
                     )
                     (set_local $4
                      (i32.shr_u
                       (get_local $1)
                       (i32.const 29)
                      )
                     )
                     (set_local $1
                      (i32.shl
                       (get_local $1)
                       (i32.const 1)
                      )
                     )
                     (br_if $label$105
                      (tee_local $4
                       (i32.load
                        (tee_local $5
                         (i32.add
                          (i32.add
                           (get_local $3)
                           (i32.and
                            (get_local $4)
                            (i32.const 4)
                           )
                          )
                          (i32.const 16)
                         )
                        )
                       )
                      )
                     )
                    )
                    (i32.store
                     (get_local $5)
                     (get_local $2)
                    )
                    (i32.store
                     (i32.add
                      (get_local $2)
                      (i32.const 24)
                     )
                     (get_local $3)
                    )
                    (br $label$103)
                   )
                  )
                  (i32.store
                   (i32.add
                    (get_local $0)
                    (i32.const 4)
                   )
                   (i32.or
                    (get_local $4)
                    (get_local $5)
                   )
                  )
                  (i32.store
                   (get_local $3)
                   (get_local $2)
                  )
                  (i32.store
                   (i32.add
                    (get_local $2)
                    (i32.const 24)
                   )
                   (get_local $3)
                  )
                 )
                 (i32.store offset=12
                  (get_local $2)
                  (get_local $2)
                 )
                 (i32.store offset=8
                  (get_local $2)
                  (get_local $2)
                 )
                 (br $label$80)
                )
                (i32.store offset=12
                 (tee_local $1
                  (i32.load offset=8
                   (get_local $3)
                  )
                 )
                 (get_local $2)
                )
                (i32.store offset=8
                 (get_local $3)
                 (get_local $2)
                )
                (i32.store
                 (i32.add
                  (get_local $2)
                  (i32.const 24)
                 )
                 (i32.const 0)
                )
                (i32.store offset=12
                 (get_local $2)
                 (get_local $3)
                )
                (i32.store offset=8
                 (get_local $2)
                 (get_local $1)
                )
               )
               (br_if $label$13
                (i32.le_u
                 (tee_local $2
                  (i32.load
                   (tee_local $1
                    (i32.add
                     (get_local $0)
                     (i32.const 12)
                    )
                   )
                  )
                 )
                 (get_local $6)
                )
               )
               (i32.store offset=4
                (tee_local $5
                 (i32.add
                  (tee_local $3
                   (i32.load
                    (tee_local $4
                     (i32.add
                      (get_local $0)
                      (i32.const 24)
                     )
                    )
                   )
                  )
                  (get_local $6)
                 )
                )
                (i32.or
                 (tee_local $2
                  (i32.sub
                   (get_local $2)
                   (get_local $6)
                  )
                 )
                 (i32.const 1)
                )
               )
               (i32.store
                (get_local $1)
                (get_local $2)
               )
               (i32.store
                (get_local $4)
                (get_local $5)
               )
               (i32.store offset=4
                (get_local $3)
                (i32.or
                 (get_local $6)
                 (i32.const 3)
                )
               )
               (set_local $9
                (i32.add
                 (get_local $3)
                 (i32.const 8)
                )
               )
              )
              (return
               (get_local $9)
              )
             )
             (i32.store offset=4
              (get_local $3)
              (i32.or
               (tee_local $1
                (i32.add
                 (i32.load
                  (tee_local $2
                   (i32.add
                    (get_local $0)
                    (i32.const 8)
                   )
                  )
                 )
                 (get_local $1)
                )
               )
               (i32.const 1)
              )
             )
             (i32.store
              (i32.add
               (get_local $0)
               (i32.const 20)
              )
              (get_local $3)
             )
             (i32.store
              (get_local $2)
              (get_local $1)
             )
             (i32.store
              (i32.add
               (get_local $3)
               (get_local $1)
              )
              (get_local $1)
             )
             (br $label$3)
            )
            (set_local $10
             (i32.load offset=24
              (get_local $4)
             )
            )
            (br_if $label$9
             (i32.eq
              (tee_local $5
               (i32.load offset=12
                (get_local $4)
               )
              )
              (get_local $4)
             )
            )
            (i32.store offset=12
             (tee_local $2
              (i32.load offset=8
               (get_local $4)
              )
             )
             (get_local $5)
            )
            (i32.store offset=8
             (get_local $5)
             (get_local $2)
            )
            (br_if $label$6
             (get_local $10)
            )
            (br $label$5)
           )
           (i32.store
            (get_local $0)
            (i32.and
             (i32.load
              (get_local $0)
             )
             (i32.rotl
              (i32.const -2)
              (i32.shr_u
               (get_local $2)
               (i32.const 3)
              )
             )
            )
           )
           (br $label$5)
          )
          (if
           (i32.eqz
            (tee_local $6
             (i32.load
              (tee_local $2
               (i32.add
                (get_local $4)
                (i32.const 20)
               )
              )
             )
            )
           )
           (br_if $label$7
            (i32.eqz
             (tee_local $6
              (i32.load
               (tee_local $2
                (i32.add
                 (get_local $4)
                 (i32.const 16)
                )
               )
              )
             )
            )
           )
          )
          (loop $label$107
           (set_local $7
            (get_local $2)
           )
           (br_if $label$107
            (tee_local $6
             (i32.load
              (tee_local $2
               (i32.add
                (tee_local $5
                 (get_local $6)
                )
                (i32.const 20)
               )
              )
             )
            )
           )
           (set_local $2
            (i32.add
             (get_local $5)
             (i32.const 16)
            )
           )
           (br_if $label$107
            (tee_local $6
             (i32.load offset=16
              (get_local $5)
             )
            )
           )
          )
          (i32.store
           (get_local $7)
           (i32.const 0)
          )
          (br_if $label$5
           (i32.eqz
            (get_local $10)
           )
          )
          (br $label$6)
         )
         (return
          (i32.const 0)
         )
        )
        (set_local $5
         (i32.const 0)
        )
        (br_if $label$5
         (i32.eqz
          (get_local $10)
         )
        )
       )
       (block $label$108
        (block $label$109
         (if
          (i32.ne
           (i32.load
            (tee_local $2
             (i32.add
              (i32.add
               (get_local $0)
               (i32.shl
                (tee_local $6
                 (i32.load offset=28
                  (get_local $4)
                 )
                )
                (i32.const 2)
               )
              )
              (i32.const 304)
             )
            )
           )
           (get_local $4)
          )
          (block
           (i32.store
            (i32.add
             (i32.add
              (get_local $10)
              (i32.const 16)
             )
             (i32.shl
              (i32.ne
               (i32.load offset=16
                (get_local $10)
               )
               (get_local $4)
              )
              (i32.const 2)
             )
            )
            (get_local $5)
           )
           (br_if $label$109
            (get_local $5)
           )
           (br $label$5)
          )
         )
         (i32.store
          (get_local $2)
          (get_local $5)
         )
         (br_if $label$108
          (i32.eqz
           (get_local $5)
          )
         )
        )
        (i32.store offset=24
         (get_local $5)
         (get_local $10)
        )
        (if
         (tee_local $2
          (i32.load offset=16
           (get_local $4)
          )
         )
         (block
          (i32.store offset=16
           (get_local $5)
           (get_local $2)
          )
          (i32.store offset=24
           (get_local $2)
           (get_local $5)
          )
         )
        )
        (br_if $label$5
         (i32.eqz
          (tee_local $2
           (i32.load
            (i32.add
             (get_local $4)
             (i32.const 20)
            )
           )
          )
         )
        )
        (i32.store
         (i32.add
          (get_local $5)
          (i32.const 20)
         )
         (get_local $2)
        )
        (i32.store offset=24
         (get_local $2)
         (get_local $5)
        )
        (br $label$5)
       )
       (i32.store offset=4
        (get_local $0)
        (i32.and
         (i32.load offset=4
          (get_local $0)
         )
         (i32.rotl
          (i32.const -2)
          (get_local $6)
         )
        )
       )
      )
      (set_local $1
       (i32.add
        (get_local $8)
        (get_local $1)
       )
      )
      (set_local $4
       (i32.add
        (get_local $4)
        (get_local $8)
       )
      )
     )
     (i32.store offset=4
      (get_local $4)
      (i32.and
       (i32.load offset=4
        (get_local $4)
       )
       (i32.const -2)
      )
     )
     (i32.store offset=4
      (get_local $3)
      (i32.or
       (get_local $1)
       (i32.const 1)
      )
     )
     (i32.store
      (i32.add
       (get_local $3)
       (get_local $1)
      )
      (get_local $1)
     )
     (set_local $2
      (block $label$112 (result i32)
       (block $label$113
        (i32.store offset=12
         (tee_local $2
          (block $label$114 (result i32)
           (block $label$115
            (if
             (i32.le_u
              (get_local $1)
              (i32.const 255)
             )
             (block
              (set_local $1
               (i32.add
                (i32.add
                 (get_local $0)
                 (i32.shl
                  (tee_local $2
                   (i32.shr_u
                    (get_local $1)
                    (i32.const 3)
                   )
                  )
                  (i32.const 3)
                 )
                )
                (i32.const 40)
               )
              )
              (br_if $label$115
               (i32.eqz
                (i32.and
                 (tee_local $6
                  (i32.load
                   (get_local $0)
                  )
                 )
                 (tee_local $2
                  (i32.shl
                   (i32.const 1)
                   (get_local $2)
                  )
                 )
                )
               )
              )
              (set_local $6
               (i32.add
                (get_local $1)
                (i32.const 8)
               )
              )
              (br $label$114
               (i32.load offset=8
                (get_local $1)
               )
              )
             )
            )
            (br_if $label$113
             (i32.eqz
              (tee_local $6
               (i32.shr_u
                (get_local $1)
                (i32.const 8)
               )
              )
             )
            )
            (drop
             (br_if $label$112
              (i32.const 31)
              (i32.gt_u
               (get_local $1)
               (i32.const 16777215)
              )
             )
            )
            (br $label$112
             (i32.or
              (i32.and
               (i32.shr_u
                (get_local $1)
                (i32.add
                 (tee_local $2
                  (i32.add
                   (i32.sub
                    (i32.const 14)
                    (i32.or
                     (i32.or
                      (tee_local $4
                       (i32.and
                        (i32.shr_u
                         (i32.add
                          (tee_local $6
                           (i32.shl
                            (get_local $6)
                            (tee_local $2
                             (i32.and
                              (i32.shr_u
                               (i32.add
                                (get_local $6)
                                (i32.const 1048320)
                               )
                               (i32.const 16)
                              )
                              (i32.const 8)
                             )
                            )
                           )
                          )
                          (i32.const 520192)
                         )
                         (i32.const 16)
                        )
                        (i32.const 4)
                       )
                      )
                      (get_local $2)
                     )
                     (tee_local $6
                      (i32.and
                       (i32.shr_u
                        (i32.add
                         (tee_local $2
                          (i32.shl
                           (get_local $6)
                           (get_local $4)
                          )
                         )
                         (i32.const 245760)
                        )
                        (i32.const 16)
                       )
                       (i32.const 2)
                      )
                     )
                    )
                   )
                   (i32.shr_u
                    (i32.shl
                     (get_local $2)
                     (get_local $6)
                    )
                    (i32.const 15)
                   )
                  )
                 )
                 (i32.const 7)
                )
               )
               (i32.const 1)
              )
              (i32.shl
               (get_local $2)
               (i32.const 1)
              )
             )
            )
           )
           (i32.store
            (get_local $0)
            (i32.or
             (get_local $6)
             (get_local $2)
            )
           )
           (set_local $6
            (i32.add
             (get_local $1)
             (i32.const 8)
            )
           )
           (get_local $1)
          )
         )
         (get_local $3)
        )
        (i32.store
         (get_local $6)
         (get_local $3)
        )
        (i32.store offset=12
         (get_local $3)
         (get_local $1)
        )
        (i32.store offset=8
         (get_local $3)
         (get_local $2)
        )
        (br $label$3)
       )
       (i32.const 0)
      )
     )
     (i32.store offset=28
      (get_local $3)
      (get_local $2)
     )
     (i64.store offset=16 align=4
      (get_local $3)
      (i64.const 0)
     )
     (set_local $6
      (i32.add
       (i32.add
        (get_local $0)
        (i32.shl
         (get_local $2)
         (i32.const 2)
        )
       )
       (i32.const 304)
      )
     )
     (block $label$117
      (block $label$118
       (if
        (i32.and
         (tee_local $4
          (i32.load offset=4
           (get_local $0)
          )
         )
         (tee_local $5
          (i32.shl
           (i32.const 1)
           (get_local $2)
          )
         )
        )
        (block
         (set_local $2
          (i32.shl
           (get_local $1)
           (select
            (i32.const 0)
            (i32.sub
             (i32.const 25)
             (i32.shr_u
              (get_local $2)
              (i32.const 1)
             )
            )
            (i32.eq
             (get_local $2)
             (i32.const 31)
            )
           )
          )
         )
         (set_local $4
          (i32.load
           (get_local $6)
          )
         )
         (loop $label$120
          (br_if $label$117
           (i32.eq
            (i32.and
             (i32.load offset=4
              (tee_local $6
               (get_local $4)
              )
             )
             (i32.const -8)
            )
            (get_local $1)
           )
          )
          (set_local $4
           (i32.shr_u
            (get_local $2)
            (i32.const 29)
           )
          )
          (set_local $2
           (i32.shl
            (get_local $2)
            (i32.const 1)
           )
          )
          (br_if $label$120
           (tee_local $4
            (i32.load
             (tee_local $5
              (i32.add
               (i32.add
                (get_local $6)
                (i32.and
                 (get_local $4)
                 (i32.const 4)
                )
               )
               (i32.const 16)
              )
             )
            )
           )
          )
         )
         (i32.store
          (get_local $5)
          (get_local $3)
         )
         (i32.store offset=24
          (get_local $3)
          (get_local $6)
         )
         (br $label$118)
        )
       )
       (i32.store
        (i32.add
         (get_local $0)
         (i32.const 4)
        )
        (i32.or
         (get_local $4)
         (get_local $5)
        )
       )
       (i32.store
        (get_local $6)
        (get_local $3)
       )
       (i32.store offset=24
        (get_local $3)
        (get_local $6)
       )
      )
      (i32.store offset=12
       (get_local $3)
       (get_local $3)
      )
      (i32.store offset=8
       (get_local $3)
       (get_local $3)
      )
      (br $label$3)
     )
     (i32.store offset=12
      (tee_local $1
       (i32.load offset=8
        (get_local $6)
       )
      )
      (get_local $3)
     )
     (i32.store offset=8
      (get_local $6)
      (get_local $3)
     )
     (i32.store offset=24
      (get_local $3)
      (i32.const 0)
     )
     (i32.store offset=12
      (get_local $3)
      (get_local $6)
     )
     (i32.store offset=8
      (get_local $3)
      (get_local $1)
     )
    )
    (return
     (i32.add
      (get_local $9)
      (i32.const 8)
     )
    )
   )
   (block $label$121
    (block $label$122
     (if
      (i32.ne
       (get_local $4)
       (i32.load
        (tee_local $1
         (i32.add
          (i32.add
           (get_local $0)
           (i32.shl
            (tee_local $2
             (i32.load offset=28
              (get_local $4)
             )
            )
            (i32.const 2)
           )
          )
          (i32.const 304)
         )
        )
       )
      )
      (block
       (i32.store
        (i32.add
         (i32.add
          (get_local $8)
          (i32.const 16)
         )
         (i32.shl
          (i32.ne
           (i32.load offset=16
            (get_local $8)
           )
           (get_local $4)
          )
          (i32.const 2)
         )
        )
        (get_local $5)
       )
       (br_if $label$122
        (get_local $5)
       )
       (br $label$1)
      )
     )
     (i32.store
      (get_local $1)
      (get_local $5)
     )
     (br_if $label$121
      (i32.eqz
       (get_local $5)
      )
     )
    )
    (i32.store offset=24
     (get_local $5)
     (get_local $8)
    )
    (if
     (tee_local $1
      (i32.load offset=16
       (get_local $4)
      )
     )
     (block
      (i32.store offset=16
       (get_local $5)
       (get_local $1)
      )
      (i32.store offset=24
       (get_local $1)
       (get_local $5)
      )
     )
    )
    (br_if $label$1
     (i32.eqz
      (tee_local $1
       (i32.load
        (i32.add
         (get_local $4)
         (i32.const 20)
        )
       )
      )
     )
    )
    (i32.store
     (i32.add
      (get_local $5)
      (i32.const 20)
     )
     (get_local $1)
    )
    (i32.store offset=24
     (get_local $1)
     (get_local $5)
    )
    (br $label$1)
   )
   (i32.store
    (tee_local $1
     (i32.add
      (get_local $0)
      (i32.const 4)
     )
    )
    (i32.and
     (i32.load
      (get_local $1)
     )
     (i32.rotl
      (i32.const -2)
      (get_local $2)
     )
    )
   )
  )
  (block $label$125
   (if
    (i32.le_u
     (get_local $3)
     (i32.const 15)
    )
    (block
     (i32.store offset=4
      (get_local $4)
      (i32.or
       (tee_local $1
        (i32.add
         (get_local $3)
         (get_local $6)
        )
       )
       (i32.const 3)
      )
     )
     (i32.store offset=4
      (tee_local $1
       (i32.add
        (get_local $4)
        (get_local $1)
       )
      )
      (i32.or
       (i32.load offset=4
        (get_local $1)
       )
       (i32.const 1)
      )
     )
     (br $label$125)
    )
   )
   (i32.store offset=4
    (get_local $4)
    (i32.or
     (get_local $6)
     (i32.const 3)
    )
   )
   (i32.store offset=4
    (get_local $7)
    (i32.or
     (get_local $3)
     (i32.const 1)
    )
   )
   (i32.store
    (i32.add
     (get_local $7)
     (get_local $3)
    )
    (get_local $3)
   )
   (set_local $1
    (block $label$127 (result i32)
     (block $label$128
      (i32.store offset=12
       (tee_local $2
        (block $label$129 (result i32)
         (block $label$130
          (if
           (i32.le_u
            (get_local $3)
            (i32.const 255)
           )
           (block
            (set_local $1
             (i32.add
              (i32.add
               (get_local $0)
               (i32.shl
                (tee_local $2
                 (i32.shr_u
                  (get_local $3)
                  (i32.const 3)
                 )
                )
                (i32.const 3)
               )
              )
              (i32.const 40)
             )
            )
            (br_if $label$130
             (i32.eqz
              (i32.and
               (tee_local $3
                (i32.load
                 (get_local $0)
                )
               )
               (tee_local $2
                (i32.shl
                 (i32.const 1)
                 (get_local $2)
                )
               )
              )
             )
            )
            (set_local $3
             (i32.add
              (get_local $1)
              (i32.const 8)
             )
            )
            (br $label$129
             (i32.load offset=8
              (get_local $1)
             )
            )
           )
          )
          (br_if $label$128
           (i32.eqz
            (tee_local $2
             (i32.shr_u
              (get_local $3)
              (i32.const 8)
             )
            )
           )
          )
          (drop
           (br_if $label$127
            (i32.const 31)
            (i32.gt_u
             (get_local $3)
             (i32.const 16777215)
            )
           )
          )
          (br $label$127
           (i32.or
            (i32.and
             (i32.shr_u
              (get_local $3)
              (i32.add
               (tee_local $1
                (i32.add
                 (i32.sub
                  (i32.const 14)
                  (i32.or
                   (i32.or
                    (tee_local $6
                     (i32.and
                      (i32.shr_u
                       (i32.add
                        (tee_local $2
                         (i32.shl
                          (get_local $2)
                          (tee_local $1
                           (i32.and
                            (i32.shr_u
                             (i32.add
                              (get_local $2)
                              (i32.const 1048320)
                             )
                             (i32.const 16)
                            )
                            (i32.const 8)
                           )
                          )
                         )
                        )
                        (i32.const 520192)
                       )
                       (i32.const 16)
                      )
                      (i32.const 4)
                     )
                    )
                    (get_local $1)
                   )
                   (tee_local $2
                    (i32.and
                     (i32.shr_u
                      (i32.add
                       (tee_local $1
                        (i32.shl
                         (get_local $2)
                         (get_local $6)
                        )
                       )
                       (i32.const 245760)
                      )
                      (i32.const 16)
                     )
                     (i32.const 2)
                    )
                   )
                  )
                 )
                 (i32.shr_u
                  (i32.shl
                   (get_local $1)
                   (get_local $2)
                  )
                  (i32.const 15)
                 )
                )
               )
               (i32.const 7)
              )
             )
             (i32.const 1)
            )
            (i32.shl
             (get_local $1)
             (i32.const 1)
            )
           )
          )
         )
         (i32.store
          (get_local $0)
          (i32.or
           (get_local $3)
           (get_local $2)
          )
         )
         (set_local $3
          (i32.add
           (get_local $1)
           (i32.const 8)
          )
         )
         (get_local $1)
        )
       )
       (get_local $7)
      )
      (i32.store
       (get_local $3)
       (get_local $7)
      )
      (i32.store offset=12
       (get_local $7)
       (get_local $1)
      )
      (i32.store offset=8
       (get_local $7)
       (get_local $2)
      )
      (br $label$125)
     )
     (i32.const 0)
    )
   )
   (i32.store offset=28
    (get_local $7)
    (get_local $1)
   )
   (i64.store offset=16 align=4
    (get_local $7)
    (i64.const 0)
   )
   (set_local $2
    (i32.add
     (i32.add
      (get_local $0)
      (i32.shl
       (get_local $1)
       (i32.const 2)
      )
     )
     (i32.const 304)
    )
   )
   (block $label$132
    (block $label$133
     (if
      (i32.and
       (tee_local $5
        (i32.load
         (tee_local $6
          (i32.add
           (get_local $0)
           (i32.const 4)
          )
         )
        )
       )
       (tee_local $9
        (i32.shl
         (i32.const 1)
         (get_local $1)
        )
       )
      )
      (block
       (set_local $1
        (i32.shl
         (get_local $3)
         (select
          (i32.const 0)
          (i32.sub
           (i32.const 25)
           (i32.shr_u
            (get_local $1)
            (i32.const 1)
           )
          )
          (i32.eq
           (get_local $1)
           (i32.const 31)
          )
         )
        )
       )
       (set_local $6
        (i32.load
         (get_local $2)
        )
       )
       (loop $label$135
        (br_if $label$132
         (i32.eq
          (i32.and
           (i32.load offset=4
            (tee_local $2
             (get_local $6)
            )
           )
           (i32.const -8)
          )
          (get_local $3)
         )
        )
        (set_local $6
         (i32.shr_u
          (get_local $1)
          (i32.const 29)
         )
        )
        (set_local $1
         (i32.shl
          (get_local $1)
          (i32.const 1)
         )
        )
        (br_if $label$135
         (tee_local $6
          (i32.load
           (tee_local $5
            (i32.add
             (i32.add
              (get_local $2)
              (i32.and
               (get_local $6)
               (i32.const 4)
              )
             )
             (i32.const 16)
            )
           )
          )
         )
        )
       )
       (i32.store
        (get_local $5)
        (get_local $7)
       )
       (i32.store offset=24
        (get_local $7)
        (get_local $2)
       )
       (br $label$133)
      )
     )
     (i32.store
      (get_local $6)
      (i32.or
       (get_local $5)
       (get_local $9)
      )
     )
     (i32.store
      (get_local $2)
      (get_local $7)
     )
     (i32.store offset=24
      (get_local $7)
      (get_local $2)
     )
    )
    (i32.store offset=12
     (get_local $7)
     (get_local $7)
    )
    (i32.store offset=8
     (get_local $7)
     (get_local $7)
    )
    (br $label$125)
   )
   (i32.store offset=12
    (tee_local $1
     (i32.load offset=8
      (get_local $2)
     )
    )
    (get_local $7)
   )
   (i32.store offset=8
    (get_local $2)
    (get_local $7)
   )
   (i32.store offset=24
    (get_local $7)
    (i32.const 0)
   )
   (i32.store offset=12
    (get_local $7)
    (get_local $2)
   )
   (i32.store offset=8
    (get_local $7)
    (get_local $1)
   )
  )
  (i32.add
   (get_local $4)
   (i32.const 8)
  )
 )
 (func $mspace_init (type $2) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (set_local $3
   (get_local $0)
  )
  (set_local $4
   (i32.sub
    (i32.shl
     (current_memory)
     (i32.const 16)
    )
    (get_local $0)
   )
  )
  (i32.store
   (i32.const 64)
   (tee_local $8
    (i32.sub
     (i32.load
      (i32.const 64)
     )
     (i32.const 16)
    )
   )
  )
  (set_local $6
   (i32.const 0)
  )
  (if
   (i32.eqz
    (tee_local $2
     (i32.load
      (i32.const 72)
     )
    )
   )
   (block
    (i64.store align=4
     (i32.const 76)
     (i64.const 281474976776192)
    )
    (i64.store align=4
     (i32.const 84)
     (i64.const -1)
    )
    (i32.store
     (i32.const 72)
     (tee_local $2
      (i32.xor
       (i32.and
        (i32.add
         (get_local $8)
         (i32.const 12)
        )
        (i32.const -16)
       )
       (i32.const 1431655768)
      )
     )
    )
    (i32.store
     (i32.const 92)
     (i32.const 0)
    )
   )
  )
  (block $label$2
   (br_if $label$2
    (i32.lt_u
     (get_local $4)
     (i32.const 521)
    )
   )
   (set_local $6
    (i32.const 0)
   )
   (br_if $label$2
    (i32.le_u
     (i32.sub
      (i32.const -520)
      (i32.load
       (i32.const 76)
      )
     )
     (get_local $4)
    )
   )
   (set_local $1
    (i32.const 0)
   )
   (set_local $5
    (call $memset
     (tee_local $6
      (i32.add
       (tee_local $0
        (i32.add
         (get_local $3)
         (select
          (i32.and
           (i32.sub
            (i32.const -8)
            (get_local $3)
           )
           (i32.const 7)
          )
          (i32.const 0)
          (i32.and
           (i32.add
            (get_local $3)
            (i32.const 8)
           )
           (i32.const 7)
          )
         )
        )
       )
       (i32.const 8)
      )
     )
     (i32.const 0)
     (i32.const 480)
    )
   )
   (i32.store offset=4
    (get_local $0)
    (i32.const 483)
   )
   (i32.store
    (i32.add
     (get_local $0)
     (i32.const 444)
    )
    (get_local $4)
   )
   (i32.store
    (i32.add
     (get_local $0)
     (i32.const 440)
    )
    (get_local $4)
   )
   (i32.store
    (i32.add
     (get_local $0)
     (i32.const 460)
    )
    (get_local $4)
   )
   (i32.store
    (i32.add
     (get_local $0)
     (i32.const 44)
    )
    (get_local $2)
   )
   (i32.store
    (i32.add
     (get_local $0)
     (i32.const 40)
    )
    (i32.const -1)
   )
   (i32.store
    (i32.add
     (get_local $0)
     (i32.const 24)
    )
    (get_local $3)
   )
   (i32.store
    (i32.add
     (get_local $0)
     (i32.const 456)
    )
    (get_local $3)
   )
   (i32.store
    (i32.add
     (get_local $0)
     (i32.const 472)
    )
    (i32.const 0)
   )
   (set_local $2
    (i32.load
     (i32.const 92)
    )
   )
   (i32.store
    (i32.add
     (get_local $0)
     (i32.const 476)
    )
    (i32.const 0)
   )
   (i32.store
    (i32.add
     (get_local $0)
     (i32.const 452)
    )
    (i32.or
     (get_local $2)
     (i32.const 4)
    )
   )
   (loop $label$3
    (i32.store
     (i32.add
      (tee_local $2
       (i32.add
        (get_local $0)
        (get_local $1)
       )
      )
      (i32.const 56)
     )
     (tee_local $7
      (i32.add
       (get_local $2)
       (i32.const 48)
      )
     )
    )
    (i32.store
     (i32.add
      (get_local $2)
      (i32.const 60)
     )
     (get_local $7)
    )
    (br_if $label$3
     (i32.ne
      (tee_local $1
       (i32.add
        (get_local $1)
        (i32.const 8)
       )
      )
      (i32.const 256)
     )
    )
   )
   (i32.store offset=4
    (tee_local $7
     (i32.add
      (tee_local $2
       (i32.add
        (tee_local $1
         (i32.add
          (get_local $5)
          (i32.and
           (i32.load
            (i32.add
             (get_local $5)
             (i32.const -4)
            )
           )
           (i32.const -8)
          )
         )
        )
        (i32.const -8)
       )
      )
      (tee_local $1
       (select
        (i32.and
         (i32.sub
          (i32.const 0)
          (get_local $1)
         )
         (i32.const 7)
        )
        (i32.const 0)
        (i32.and
         (get_local $1)
         (i32.const 7)
        )
       )
      )
     )
    )
    (i32.or
     (tee_local $1
      (i32.sub
       (i32.add
        (i32.sub
         (tee_local $0
          (i32.add
           (get_local $3)
           (get_local $4)
          )
         )
         (get_local $2)
        )
        (i32.const -40)
       )
       (get_local $1)
      )
     )
     (i32.const 1)
    )
   )
   (i32.store offset=460
    (get_local $5)
    (i32.const 8)
   )
   (i32.store offset=28
    (get_local $5)
    (i32.load
     (i32.const 88)
    )
   )
   (i32.store offset=24
    (get_local $5)
    (get_local $7)
   )
   (i32.store offset=12
    (get_local $5)
    (get_local $1)
   )
   (i32.store
    (i32.add
     (get_local $0)
     (i32.const -36)
    )
    (i32.const 40)
   )
  )
  (i32.store
   (i32.const 64)
   (i32.add
    (get_local $8)
    (i32.const 16)
   )
  )
  (get_local $6)
 )
 (func $malloc (type $2) (param $0 i32) (result i32)
  (call $mspace_malloc
   (get_global $.msp)
   (get_local $0)
  )
 )
 (func $Body (type $iFFFFFFFi) (param $0 i32) (param $1 f64) (param $2 f64) (param $3 f64) (param $4 f64) (param $5 f64) (param $6 f64) (param $7 f64) (result i32)
  (f64.store
   (get_local $0)
   (get_local $2)
  )
  (f64.store offset=8
   (get_local $0)
   (get_local $3)
  )
  (f64.store offset=16
   (get_local $0)
   (get_local $4)
  )
  (f64.store offset=24
   (get_local $0)
   (get_local $5)
  )
  (f64.store offset=32
   (get_local $0)
   (get_local $6)
  )
  (f64.store offset=40
   (get_local $0)
   (get_local $7)
  )
  (get_local $0)
 )
 (func $Sun (type $i) (result i32)
  (call $Body
   (call $memset
    (call $malloc
     (i32.const 56)
    )
    (i32.const 0)
    (i32.const 56)
   )
   (f64.const 0)
   (f64.const 0)
   (f64.const 0)
   (f64.const 0)
   (f64.const 0)
   (f64.const 0)
   (get_global $SOLAR_MASS)
  )
 )
 (func $Jupiter (type $i) (result i32)
  (call $Body
   (call $memset
    (call $malloc
     (i32.const 56)
    )
    (i32.const 0)
    (i32.const 56)
   )
   (f64.const 4.841431442464721)
   (f64.const -1.1603200440274284)
   (f64.const -0.10362204447112311)
   (f64.mul
    (f64.const 0.001660076642744037)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const 0.007699011184197404)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const -6.90460016972063e-05)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const 9.547919384243266e-04)
    (get_global $SOLAR_MASS)
   )
  )
 )
 (func $Saturn (type $i) (result i32)
  (call $Body
   (call $memset
    (call $malloc
     (i32.const 56)
    )
    (i32.const 0)
    (i32.const 56)
   )
   (f64.const 8.34336671824458)
   (f64.const 4.124798564124305)
   (f64.const -0.4035234171143214)
   (f64.mul
    (f64.const -0.002767425107268624)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const 0.004998528012349172)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const 2.3041729757376393e-05)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const 2.858859806661308e-04)
    (get_global $SOLAR_MASS)
   )
  )
 )
 (func $Uranus (type $i) (result i32)
  (call $Body
   (call $memset
    (call $malloc
     (i32.const 56)
    )
    (i32.const 0)
    (i32.const 56)
   )
   (f64.const 12.894369562139131)
   (f64.const -15.111151401698631)
   (f64.const -0.22330757889265573)
   (f64.mul
    (f64.const 0.002964601375647616)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const 2.3784717395948095e-03)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const -2.9658956854023756e-05)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const 4.366244043351563e-05)
    (get_global $SOLAR_MASS)
   )
  )
 )
 (func $Neptune (type $i) (result i32)
  (call $Body
   (call $memset
    (call $malloc
     (i32.const 56)
    )
    (i32.const 0)
    (i32.const 56)
   )
   (f64.const 15.379697114850917)
   (f64.const -25.919314609987964)
   (f64.const 0.17925877295037118)
   (f64.mul
    (f64.const 2.6806777249038932e-03)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const 0.001628241700382423)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const -9.515922545197159e-05)
    (get_global $DAYS_PER_YEAR)
   )
   (f64.mul
    (f64.const 5.1513890204661145e-05)
    (get_global $SOLAR_MASS)
   )
  )
 )
 (func $Body#offsetMomentum (type $iFFFi) (param $0 i32) (param $1 f64) (param $2 f64) (param $3 f64) (result i32)
  (f64.store offset=24
   (get_local $0)
   (f64.div
    (f64.neg
     (get_local $1)
    )
    (get_global $SOLAR_MASS)
   )
  )
  (f64.store offset=32
   (get_local $0)
   (f64.div
    (f64.neg
     (get_local $2)
    )
    (get_global $SOLAR_MASS)
   )
  )
  (f64.store offset=40
   (get_local $0)
   (f64.div
    (f64.neg
     (get_local $3)
    )
    (get_global $SOLAR_MASS)
   )
  )
  (get_local $0)
 )
 (func $NBodySystem (type $1) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 f64)
  (local $4 f64)
  (local $5 f64)
  (local $6 i32)
  (local $7 f64)
  (local $8 i32)
  (set_local $3
   (f64.const 0)
  )
  (set_local $4
   (f64.const 0)
  )
  (set_local $5
   (f64.const 0)
  )
  (set_local $8
   (i32.load offset=4
    (get_local $1)
   )
  )
  (set_local $2
   (i32.const 0)
  )
  (loop $continue$1.1
   (if
    (i32.lt_u
     (get_local $2)
     (get_local $8)
    )
    (block
     (set_local $7
      (f64.load offset=48
       (tee_local $6
        (i32.load offset=4
         (i32.add
          (get_local $1)
          (i32.mul
           (get_local $2)
           (i32.const 4)
          )
         )
        )
       )
      )
     )
     (set_local $3
      (f64.add
       (get_local $3)
       (f64.mul
        (f64.load offset=24
         (get_local $6)
        )
        (get_local $7)
       )
      )
     )
     (set_local $4
      (f64.add
       (get_local $4)
       (f64.mul
        (f64.load offset=32
         (get_local $6)
        )
        (get_local $7)
       )
      )
     )
     (set_local $5
      (f64.add
       (get_local $5)
       (f64.mul
        (f64.load offset=40
         (get_local $6)
        )
        (get_local $7)
       )
      )
     )
     (set_local $2
      (i32.add
       (get_local $2)
       (i32.const 1)
      )
     )
     (br $continue$1.1)
    )
   )
  )
  (i32.store
   (get_local $0)
   (get_local $1)
  )
  (drop
   (call $Body#offsetMomentum
    (i32.load offset=4
     (i32.load
      (get_local $0)
     )
    )
    (get_local $3)
    (get_local $4)
    (get_local $5)
   )
  )
  (get_local $0)
 )
 (func $NBodySystem#advance (type $iFv) (param $0 i32) (param $1 f64)
  (local $2 i32)
  (local $3 i32)
  (local $4 f64)
  (local $5 f64)
  (local $6 f64)
  (local $7 f64)
  (local $8 i32)
  (local $9 f64)
  (local $10 f64)
  (local $11 f64)
  (local $12 f64)
  (local $13 i32)
  (local $14 i32)
  (local $15 f64)
  (local $16 f64)
  (local $17 f64)
  (local $18 f64)
  (set_local $14
   (i32.load offset=4
    (tee_local $13
     (i32.load
      (get_local $0)
     )
    )
   )
  )
  (set_local $3
   (i32.const 0)
  )
  (loop $continue$1.1
   (if
    (i32.lt_u
     (get_local $3)
     (get_local $14)
    )
    (block
     (set_local $15
      (f64.load
       (tee_local $0
        (i32.load offset=4
         (i32.add
          (get_local $13)
          (i32.mul
           (get_local $3)
           (i32.const 4)
          )
         )
        )
       )
      )
     )
     (set_local $16
      (f64.load offset=8
       (get_local $0)
      )
     )
     (set_local $17
      (f64.load offset=16
       (get_local $0)
      )
     )
     (set_local $5
      (f64.load offset=24
       (get_local $0)
      )
     )
     (set_local $6
      (f64.load offset=32
       (get_local $0)
      )
     )
     (set_local $7
      (f64.load offset=40
       (get_local $0)
      )
     )
     (set_local $18
      (f64.load offset=48
       (get_local $0)
      )
     )
     (set_local $8
      (i32.add
       (get_local $3)
       (i32.const 1)
      )
     )
     (loop $continue$1.2
      (if
       (i32.lt_u
        (get_local $8)
        (get_local $14)
       )
       (block
        (set_local $4
         (f64.mul
          (get_local $18)
          (tee_local $9
           (f64.div
            (get_local $1)
            (f64.mul
             (tee_local $4
              (f64.add
               (f64.add
                (f64.mul
                 (tee_local $10
                  (f64.sub
                   (get_local $15)
                   (f64.load
                    (tee_local $2
                     (i32.load offset=4
                      (i32.add
                       (get_local $13)
                       (i32.mul
                        (get_local $8)
                        (i32.const 4)
                       )
                      )
                     )
                    )
                   )
                  )
                 )
                 (get_local $10)
                )
                (f64.mul
                 (tee_local $11
                  (f64.sub
                   (get_local $16)
                   (f64.load offset=8
                    (get_local $2)
                   )
                  )
                 )
                 (get_local $11)
                )
               )
               (f64.mul
                (tee_local $12
                 (f64.sub
                  (get_local $17)
                  (f64.load offset=16
                   (get_local $2)
                  )
                 )
                )
                (get_local $12)
               )
              )
             )
             (f64.sqrt
              (get_local $4)
             )
            )
           )
          )
         )
        )
        (set_local $5
         (f64.sub
          (get_local $5)
          (f64.mul
           (get_local $10)
           (tee_local $9
            (f64.mul
             (f64.load offset=48
              (get_local $2)
             )
             (get_local $9)
            )
           )
          )
         )
        )
        (set_local $6
         (f64.sub
          (get_local $6)
          (f64.mul
           (get_local $11)
           (get_local $9)
          )
         )
        )
        (set_local $7
         (f64.sub
          (get_local $7)
          (f64.mul
           (get_local $12)
           (get_local $9)
          )
         )
        )
        (f64.store offset=24
         (get_local $2)
         (f64.mul
          (get_local $10)
          (get_local $4)
         )
        )
        (f64.store offset=32
         (get_local $2)
         (f64.mul
          (get_local $11)
          (get_local $4)
         )
        )
        (f64.store offset=40
         (get_local $2)
         (f64.mul
          (get_local $12)
          (get_local $4)
         )
        )
        (set_local $8
         (i32.add
          (get_local $8)
          (i32.const 1)
         )
        )
        (br $continue$1.2)
       )
      )
     )
     (f64.store offset=24
      (get_local $0)
      (get_local $5)
     )
     (f64.store offset=32
      (get_local $0)
      (get_local $6)
     )
     (f64.store offset=40
      (get_local $0)
      (get_local $7)
     )
     (f64.store
      (get_local $0)
      (f64.mul
       (get_local $1)
       (get_local $5)
      )
     )
     (f64.store offset=8
      (get_local $0)
      (f64.mul
       (get_local $1)
       (get_local $6)
      )
     )
     (f64.store offset=16
      (get_local $0)
      (f64.mul
       (get_local $1)
       (get_local $7)
      )
     )
     (set_local $3
      (i32.add
       (get_local $3)
       (i32.const 1)
      )
     )
     (br $continue$1.1)
    )
   )
  )
 )
 (func $NBodySystem#energy (type $iF) (param $0 i32) (result f64)
  (local $1 f64)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 f64)
  (local $7 f64)
  (local $8 f64)
  (local $9 f64)
  (local $10 f64)
  (set_local $1
   (f64.const 0)
  )
  (set_local $5
   (i32.load offset=4
    (tee_local $4
     (i32.load
      (get_local $0)
     )
    )
   )
  )
  (set_local $2
   (i32.const 0)
  )
  (loop $continue$1.1
   (if
    (i32.lt_u
     (get_local $2)
     (get_local $5)
    )
    (block
     (set_local $7
      (f64.load
       (tee_local $0
        (i32.load offset=4
         (i32.add
          (get_local $4)
          (i32.mul
           (get_local $2)
           (i32.const 4)
          )
         )
        )
       )
      )
     )
     (set_local $8
      (f64.load offset=8
       (get_local $0)
      )
     )
     (set_local $9
      (f64.load offset=16
       (get_local $0)
      )
     )
     (set_local $1
      (f64.add
       (get_local $1)
       (f64.mul
        (f64.mul
         (f64.const 0.5)
         (tee_local $10
          (f64.load offset=48
           (get_local $0)
          )
         )
        )
        (f64.add
         (f64.add
          (f64.mul
           (tee_local $1
            (f64.load offset=24
             (get_local $0)
            )
           )
           (get_local $1)
          )
          (f64.mul
           (tee_local $1
            (f64.load offset=32
             (get_local $0)
            )
           )
           (get_local $1)
          )
         )
         (f64.mul
          (tee_local $1
           (f64.load offset=40
            (get_local $0)
           )
          )
          (get_local $1)
         )
        )
       )
      )
     )
     (set_local $0
      (i32.add
       (get_local $2)
       (i32.const 1)
      )
     )
     (loop $continue$1.2
      (if
       (i32.lt_u
        (get_local $0)
        (get_local $5)
       )
       (block
        (set_local $6
         (f64.sub
          (get_local $7)
          (f64.load
           (tee_local $3
            (i32.load offset=4
             (i32.add
              (get_local $4)
              (i32.mul
               (get_local $0)
               (i32.const 4)
              )
             )
            )
           )
          )
         )
        )
        (set_local $1
         (f64.sub
          (get_local $1)
          (f64.div
           (f64.mul
            (get_local $10)
            (f64.load offset=48
             (get_local $3)
            )
           )
           (f64.sqrt
            (f64.add
             (f64.add
              (f64.mul
               (get_local $6)
               (get_local $6)
              )
              (f64.mul
               (tee_local $1
                (f64.sub
                 (get_local $8)
                 (f64.load offset=8
                  (get_local $3)
                 )
                )
               )
               (get_local $1)
              )
             )
             (f64.mul
              (tee_local $1
               (f64.sub
                (get_local $9)
                (f64.load offset=16
                 (get_local $3)
                )
               )
              )
              (get_local $1)
             )
            )
           )
          )
         )
        )
        (set_local $0
         (i32.add
          (get_local $0)
          (i32.const 1)
         )
        )
        (br $continue$1.2)
       )
      )
     )
     (set_local $2
      (i32.add
       (get_local $2)
       (i32.const 1)
      )
     )
     (br $continue$1.1)
    )
   )
  )
  (get_local $1)
 )
 (func $test (type $iF) (param $0 i32) (result f64)
  (local $1 i32)
  (local $2 i32)
  (i32.store
   (tee_local $2
    (call $memset
     (call $malloc
      (i32.add
       (i32.mul
        (tee_local $1
         (i32.const 5)
        )
        (i32.const 4)
       )
       (i32.const 4)
      )
     )
     (i32.const 0)
     (get_local $1)
    )
   )
   (get_local $1)
  )
  (i32.store offset=4
   (tee_local $1
    (get_local $2)
   )
   (call $Sun)
  )
  (i32.store offset=4
   (i32.add
    (get_local $1)
    (i32.const 4)
   )
   (call $Jupiter)
  )
  (i32.store offset=4
   (i32.add
    (get_local $1)
    (i32.const 8)
   )
   (call $Saturn)
  )
  (i32.store offset=4
   (i32.add
    (get_local $1)
    (i32.const 12)
   )
   (call $Uranus)
  )
  (i32.store offset=4
   (i32.add
    (get_local $1)
    (i32.const 16)
   )
   (call $Neptune)
  )
  (drop
   (call $NBodySystem
    (call $memset
     (call $malloc
      (i32.const 4)
     )
     (i32.const 0)
     (i32.const 4)
    )
    (get_local $1)
   )
  )
  (set_local $1
   (i32.const 0)
  )
  (loop $continue$1.1
   (if
    (i32.lt_u
     (get_local $1)
     (get_local $0)
    )
    (block
     (call $NBodySystem#advance
      (get_local $0)
      (f64.const 0.01)
     )
     (set_local $1
      (i32.add
       (get_local $1)
       (i32.const 1)
      )
     )
     (br $continue$1.1)
    )
   )
  )
  (call $NBodySystem#energy
   (get_local $0)
  )
 )
 (func $.start (type $v)
  (set_global $.msp
   (call $mspace_init
    (i32.const 8)
   )
  )
  (set_global $SOLAR_MASS
   (f64.mul
    (f64.mul
     (f64.const 4)
     (get_global $PI)
    )
    (get_global $PI)
   )
  )
 )
)
