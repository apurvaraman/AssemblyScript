var fs = require("fs");
var path = require("path");
var minimist = require("minimist");
var chalk = require("chalk");
var pkg = require("../package.json");
var options = require("./asc.json");
var assemblyscript;

var isDev = fs.existsSync(__dirname + "/../src/index.ts") && path.basename(path.join(__dirname, "..", "..")) !== "node_modules";
var isOut = false;

if (isDev) {
  if (fs.existsSync(__dirname + "/../out/index.js")) {
    assemblyscript = require("../out");
    isOut = true;
  } else {
    require("ts-node/register");
    assemblyscript = require("../src");
  }
} else
  assemblyscript = require("../dist/assemblyscript");

var Compiler = assemblyscript.Compiler;

var ESUCCESS = 0;
var EUSAGE   = 1;
var EINVALID = 2;
var EFAILURE = 3;

/** Runs the command line compiler using the specified command line arguments. */
function main(args, callback) {

  var opts = {};
  Object.keys(options).forEach(key => {
    var opt = options[key];
    if (opt.aliases)
      (opts.alias || (opts.alias = {}))[key] = opt.aliases;
    if (opt.default !== undefined)
      (opts.default || (opts.default = {}))[key] = opt.default;
    if (opt.type === "string")
      (opts.string || (opts.string = [])).push(key);
    else if (opt.type === "boolean")
      (opts.boolean || (opts.boolean = [])).push(key);
  });

  var argv = minimist(args, opts);

  var files = argv._;
  var configFile;

  // prefer specified config file
  if (argv.config)
    configFile = argv.config;

  // otherwise check entry file directory
  else if (files.length)
    if (!fs.existsSync(configFile = path.join(path.dirname(files[0]), "asconfig.json")))
      configFile = undefined;

  // load config file
  if (configFile) {
    try {
      var config = JSON.parse(fs.readFileSync(configFile, "utf8"));
      if (config.entryFile) {
        if (!files.length) // prefer command line
          files = [ config.entryFile ];
        delete config.file;
      }
      Object.keys(config).forEach(key => {
        if (options[key] && key !== "config")
          argv[key] = config[key];
      });
    } catch (e) {
      if (!argv.quiet)
        process.stderr.write(chalk.red("\nFailed to load config file: " + e.message + "\n"));
      return callback(EFAILURE);
    }
  }

  // print usage information if requested or no input files have been provided
  if (argv.help || files.length !== 1) {
    (argv.help ? process.stdout : process.stderr).write([
      "Version " + pkg.version + (isDev ? "-dev" + (isOut ? " (out)" : "") : ""),
      "Syntax: "+ chalk.reset.cyan.bold("asc") + " [options] entryFile",
      "",
      chalk.reset.white.bold("Options:"),
      ""
    ].concat(Object.keys(options).map(key => {
      var opt = options[key];
      var cmd = " --" + key;
      if (opt.aliases && opt.aliases.length && opt.aliases[0].length === 1)
        cmd += ", -" + opt.aliases[0];
      while (cmd.length < 20)
        cmd += " ";
      return cmd + opt.desc.replace(/\n/g, "\n                    ") + "\n";
    })).join("\n").replace(/\[default\]/g, chalk.gray("[default]")));
    return callback(argv.help ? ESUCCESS : EUSAGE);
  }

  // compile to a Binaryen module
  var wasmModule = Compiler.compileFile(files[0], {
    silent: !!argv.quiet,
    target: argv.target,
    memoryModel: argv.memoryModel
  });

  // bail out if that didn't work
  if (!wasmModule)
    return callback(EFAILURE);

  // from this point on the module must be disposed (finish does this implicitly)

  // optimize the Binaryen module if requested
  if (argv.optimize)
    wasmModule.optimize();

  // validate the Binaryen module if requested
  if (argv.validate) {
    var result = wasmModule.validate(); // FIXME: this always prints to console on error
    if (!result) {
      if (!argv.quiet)
        process.stderr.write(chalk.red("\nValidation failed. See above for details.\n"));
      return finish(Error("validation failed"));
    }
  }

  // default to text format if --outFile references a .wast or .wat and --textFormat isn't specified
  if (argv.outFile && !argv.textFormat) {
    if (/\.wast$/.test(argv.outFile))
      argv.textFormat = "sexpr";
    else if (/\.wat$/.test(argv.outFile))
      argv.textFormat = "linear";
  }

  // emit to --outFile if specified, otherwise print to stdout
  var output = argv.outFile ? fs.createWriteStream(argv.outFile) : process.stdout;

  // emit a text file alongside a binary if --textFile is provided
  if (argv.textFile)
    writeBinary(wasmModule, output, function(err) {
      if (err) return finish(err);
      writeText(wasmModule, argv.textFormat || /\.wat$/.test(argv.textFile) && "linear" || "sexpr", fs.createWriteStream(argv.textFile), finish);
    });

  // emit just text format if --textFormat is provided but --textFile isn't
  else if (argv.textFormat !== undefined || output.isTTY)
    writeText(wasmModule, argv.textFormat, output, finish);

  // emit a binary otherwise
  else
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
      if (!argv.quiet)
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