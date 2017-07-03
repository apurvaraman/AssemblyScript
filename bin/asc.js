var fs = require("fs");
var path = require("path");
var minimist = require("minimist");
var chalk = require("chalk");
var pkg = require("../package.json");
var assemblyscript;

var isDev = fs.existsSync(__dirname + "/../src/index.ts") && path.basename(path.join(__dirname, "..", "..")) !== "node_modules";

if (isDev) {
  require("ts-node/register");
  assemblyscript = require("../out");
} else
  assemblyscript = require("../dist/assemblyscript");

var Compiler = assemblyscript.Compiler;

var ESUCCESS = 0;
var EUSAGE = 1;
var EINVALID = 2;
var EFAILURE = 3;

/** Runs the command line compiler using the specified command line arguments. */
function main(args, callback) {

  var argv = minimist(args, {
    alias: {
      out: [ "o", "outFile", "outfile", "out-file" ],
      validate: [ "v" ],
      optimize: [ "O" ],
      target: [ "t" ],
      memorymodel: [ "m", "memory-model" ],
      textout: [ "text-out" ],
      help: [ "h" ]
    },
    default: {
      "validate": false,
      "optimize": false,
      "silent": false,
      "memory": "malloc"
    },
    string: [ "out", "text", "memorymodel", "textout"],
    boolean: [ "optimize", "validate", "silent", "help" ]
  });

  var files = argv._;

  if (argv.help || files.length !== 1) {
    process.stderr.write([
      "Version " + pkg.version + (isDev ? "-dev" : ""),
      "Syntax: "+ chalk.reset.cyan.bold("asc") + " [options] entryFile",
      "",
      chalk.reset.white.bold("Options:"),
      " --out, -o, --outFile   Specifies the output file name. Also recognizes .wast / .wat",
      " --validate, -v         Validates the module.",
      " --optimize, -O         Runs optimizing binaryen IR passes.",
      " --silent               Does not print anything to console.",
      "",
      " --target, -t           Specifies the target architecture:",
      "",
      "                        wasm32  Compiles to 32-bit WebAssembly " + chalk.gray("[default]"),
      "                        wasm64  Compiles to 64-bit WebAssembly",
      "",
      " --memory-model, -m     Specifies the memory model to use / how to proceed with malloc etc.:",
      "",
      "                        malloc        Bundles malloc etc. " + chalk.gray("[default]"),
      "                        exportmalloc  Bundles malloc etc. and exports each",
      "                        importmalloc  Imports malloc etc. from 'env'",
      "                        bare          Excludes malloc etc. entirely",
      "",
      " --text                 Specifies the text output format:",
      "",
      "                        sexpr   Emits s-expression syntax / .wast " + chalk.gray("[default]"),
      "                        linear  Emits official linear syntax / .wat",
      "",
      " --text-out             Outputs text format alongside a binary.",
      ""
    ].join("\n"));
    return callback(EUSAGE);
  }

  var wasmModule = Compiler.compileFile(files[0], {
    silent: !!argv.silent,
    target: argv.target,
    memoryModel: argv.memorymodel
  });

  if (!wasmModule)
    return callback(EFAILURE);

  // from this point on the module must be disposed (finish does this implicitly)

  if (argv.optimize)
    wasmModule.optimize();

  if (argv.validate) {
    var result = wasmModule.validate(); // FIXME: this always prints to console on error
    if (!result) {
      if (!argv.silent)
        process.stderr.write("\nValidation failed. See above for details.\n");
      return finish(Error("validation failed"));
    }
  }

  // Default to text format if --out references a .wast or .wat
  if (argv.out && !argv.text) {
    if (/\.wast$/.test(argv.out))
      argv.text = "sexpr";
    else if (/\.wat$/.test(argv.out))
      argv.text = "linear";
  }

  var output = argv.out ? fs.createWriteStream(argv.out) : process.stdout;

  if (argv.textout) // text to file alongside binary
    writeBinary(wasmModule, output, function(err) {
      if (err) return finish(err);
      writeText(wasmModule, argv.text || /\.wat$/.test(argv.textout) && "linear" || /\.wast$/.test(argv.textout) && "sexpr", fs.createWriteStream(argv.textout), finish);
    });
  else if (argv.text !== undefined || output.isTTY) // text only
    writeText(wasmModule, argv.text, output, finish);
  else // binary only
    writeBinary(wasmModule, output, finish);

  function finish(err) {
    wasmModule.dispose();
    return callback(err ? EFAILURE : ESUCCESS);
  }
}

exports.main = main;

/** Writes text format of the specified module, using the specified format. */
function writeText(wasmModule, format, output, callback) {
  if (format === "linear" || format === "stack") {
    if (!assemblyscript.wabt.available) {
      if (!argv.silent)
        process.stderr.write("\n" + assemblyscript.wabt.ENOTAVAILABLE + "\n");
      return callback(EFAILURE);
    }
    var binary = wasmModule.ascCurrentBinary || (wasmModule.ascCurrentBinary = wasmModule.emitBinary()); // reuse
    output.write(assemblyscript.wabt.wasmToWast(binary, { readDebugNames: true }), "utf8", end);
  } else
    output.write(wasmModule.emitText(), "utf8", end);

  function end(err) {
    if (err || output === process.stdout) return callback(err);
    output.end(callback);
  }
}

exports.writeText = writeText;

/** Writes a binary of the specified module. */
function writeBinary(wasmModule, output, callback) {
  output.write(Buffer.from(wasmModule.emitBinary()), end);

  function end(err) {
    if (err || output === process.stdout) return callback(err);
    output.end(callback);
  }
}

exports.writeBinary = writeBinary;
