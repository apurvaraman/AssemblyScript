import * as fs from "fs";
import * as path from "path";
import * as tape from "tape";
import * as jsdiff from "diff";
import * as chalk from "chalk";
import * as minimist from "minimist";
import * as util from "./util";

const argv = minimist(process.argv.slice(2), {
  default: {
    create: false,
    src: true,
    dist: true,
    diff: true
  },
  boolean: [ "help", "create", "src", "dist" ]
});

const EUSAGE = 1;

if (argv.help) {
  process.stderr.write([
    "Usage: npm test -- [options]",
    "",
    chalk.reset.white.bold("Options:"),
    " --create               Creates missing fixtures from the current runs output.",
    " --no-src               Does not test the sources.",
    " --no-dist              Does not test the distribution.",
    " --no-diff              Does not print diff contents.",
    "",
    "For pretty-printed output, run: npm run test:spec",
    ""
  ].join("\n"));
  process.exit(EUSAGE);
}

// test sources
import Compiler from "../src/compiler";
import * as binaryen from "../src/binaryen";
import * as typescript from "../src/typescript";
import * as wabt from "../src/wabt";
if (argv.src !== false)
  runTests("src", Compiler, binaryen, typescript, wabt);

// test distribution
import * as dist from "..";
if (argv.dist !== false)
  runTests("dist", dist.Compiler, dist.binaryen, dist.typescript, dist.wabt);

// common test runner for both source and the distribution files
function runTests(kind: string, Compiler: any, binaryen: any, typescript: any, wabt: any) {

  // 1) test compiler results to match fictures
  tape(kind + " - fixtures", test => {
    const basedir = path.join(__dirname, "fixtures");

    fs.readdirSync(basedir).forEach(file => {
      if (!/\.ts$/.test(file)) return;

      test.test(kind + " - fixtures - " + file, function(test) {
        file = path.join(basedir, file);

        const source = fs.readFileSync(file, "utf8");
        const options = getOptions(source);

        let module: binaryen.Module | null = null;
        let actual: string = "";

        try {
          module = <binaryen.Module>Compiler.compileFile(file, options);
        } catch (err) {
          test.fail("should compile without throwing");
          console.log(err.stack.replace(/^/mg, "> "));
          test.end();
          return;
        }

        const messages = typescript.formatDiagnosticsWithColorAndContext(Compiler.lastDiagnostics);
        if (messages.length)
          process.stderr.write(messages.replace(/^/mg, "> ") + "\n");

        test.ok(module, "should not fail to compile");
        if (module) {
          test.ok(module.validate(), "should validate");

          actual = distill(module.emitText());

          const wastFile = file.replace(/\.ts$/, ".wast");

          if (fs.existsSync(wastFile)) {
            const expected = distill(fs.readFileSync(wastFile, "utf8"));
            if (argv.diff) {
              const diff = jsdiff.diffChars(expected, actual);
              let changed = false;
              diff.forEach(part => {
                if (part.added || part.removed)
                  changed = true;
              });
              test.notOk(changed, "should match the precompiled fixture");
              if (changed) // print it
                diff.forEach(part => {
                  if (part.added || part.removed)
                    changed = true;
                  process.stderr.write((part.added ? chalk.green : part.removed ? chalk.red : chalk.grey)(part.value));
                });
            } else if (expected !== actual)
              test.fail("should match the precompiled fixture");
          } else {
            if (argv["create"]) {
              test.comment("creating fixture: " + wastFile);
              fs.writeFileSync(wastFile, actual, { encoding: "utf8" });
            } else
              test.fail("fixture should exist (use --create to create it)");
          }
        }
        test.end();
      });
    });

    test.end();
  });

  // 2) run interop tests
  tape(kind + " - interop", test => {
    if (typeof WebAssembly === "undefined") {
      test.comment("Skipping interop tests: WebAssembly is not supported on node " + process.version);
      test.end();
      return;
    }
    const basedir = path.join(__dirname, "interop");
    const options = { "silent": true };

    fs.readdirSync(basedir).forEach(file => {
      if (!/\.test\.ts$/.test(file)) return;

      const runner = require("./interop/" + file).test;
      const name = file.substring(0, file.length - 8);
      file = __dirname + "/interop/" + name + ".ts";

      const source = fs.readFileSync(file, "utf8");
      const options = getOptions(source);

      let module: binaryen.Module;
      try {
        module = <binaryen.Module>Compiler.compileFile(file, options);
      } catch (err) {
        test.fail(name + ".ts should compile without throwing");
        console.log(err.stack.replace(/^/mg, "> "));
        return;
      }

      const messages = typescript.formatDiagnosticsWithColorAndContext(Compiler.lastDiagnostics);
      if (messages.length)
        process.stderr.write(messages.replace(/^/mg, "> ") + "\n");

      test.ok(module, name + ".ts should not fail to compile");
      if (!module) return;

      const buffer = module.emitBinary();

      // async subtest
      test.test(kind + " - interop - " + name, test => {
        util.load(buffer)
        .then(module => runner(test, module))
        .catch(err => {
          test.fail("loading " + name + ".wasm should not be rejected (" + err.message + ")");
          console.log(err.stack.replace(/^/mg, "> "));
          test.end();
        });
      });
    });

    test.end();
  });

  // 3) other tests

  // test that Compiler.compileString works as well
  tape(kind + " - compileString", test => {
    const module = Compiler.compileString(`
    export function test(a: int): int {
      return a;
    }

    function start(): void {}
    `, { silent: true });

    test.ok(module, "should compile without errors");
    if (module) {
      test.notOk(Compiler.lastDiagnostics.length, "should not generate any warnings");
      test.doesNotThrow(() => {
        module.optimize();
        const text = module.emitText();
        test.ok(typeof text === "string" && text.length, "should emit a non-empty string");
      }, "should optimize and emit without throwing");
    }

    test.end();
  });

  // test that official text format (uses WABT) is working
  tape(kind + " - wabt", test => {
    const source = [
      "(module",
      "  (type (;0;) (func (param i32 i32) (result i32)))",
      "  (func $add (type 0) (param i32 i32) (result i32)",
      "    get_local 0",
      "    get_local 1",
      "    i32.add)",
      "  (memory (;0;) 1)",
      "  (export \"add\" (func $add)))",
      ""
    ].join("\n");
    test.doesNotThrow(() => {
      const wasm = wabt.wastToWasm(source, { filename: "test.wasm", writeDebugNames: true });
      const wast = wabt.wasmToWast(wasm, { readDebugNames: true });
      test.equal(wast, source, "should convert from wast to wasm and back");
    }, "should convert between wast and wasm without throwing");

    test.end();
  });
}

// utility

/** Strips everything before the first export. */
function distill(text: string): string {
  const match = /^ *\(export/m.exec(text);
  if (match)
    return text.substring(match.index).replace(/\r?\n\)\r?\n?$/, "\n");
  return text;
}

const baseOptions = { "silent": true };

/** Gets additional options of a source file. */
function getOptions(source: string): string {
  const firstLine = source.split(/\r?\n/, 1)[0];
  let opts = Object.create(baseOptions);
  if (firstLine.substring(0, 3) === "//!") {
    const config = JSON.parse(firstLine.substring(3));
    Object.keys(config).forEach(key => opts[key] = config[key]);
  }
  return opts;
}
