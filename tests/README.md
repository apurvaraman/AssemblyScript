AssemblyScript Tests
====================

The test process consists of multiple steps, in the following order. Both the source compiler (src) and the bundled distribution (dist) are tested.

**Hint:** If raw tap output isn't what you are looking for, the following command pipes it through the spec reporter instead:

```
$> npm run test:spec
```

Note, though, that diff output and additional command line arguments aren't working properly respectively supported when using a reporter.

Fixtures
--------

The compiler is run for each AssemblyScript program (*.ts) in [fixtures/](./fixtures) and the resulting text output compared to a pre-checked sample (the .wast file in s-expression syntax next to the .ts file).

When adding new tests, passing the `--create` option to the test runner will automatically create a test sample from the current run's output:

```
$> npm test -- --create
```

The initial test sample must then be checked by hand for possible errors before committing it.

Note that test samples are reduced to just the relevant parts starting at the first `(export ...)` section.

Additional compiler options can be specified per test case on the respective .ts-file's first line as a JSON object starting with a `//!` comment. For example, where malloc is not required specifying `//! { "memoryModel": "bare" }` if it is not used at all or `//! { "memoryModel": "importmalloc" }` if malloc isn't specifically tested is recommended.

Interop
-------

The compiler is run for each AssemblyScript program (*.ts excluding *.test.ts) in [interop/](./interop) and the resulting binary loaded and provided to the respective test case (the .test.ts file next to the .ts file) that then evaluates the test result.

Additional compiler options are supported as described above.

Other tests
-----------

A few other tests defined directly within the test runner are run last.
