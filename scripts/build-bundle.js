var browserify = require("browserify");
var sourcemaps = require("gulp-sourcemaps");
var uglify     = require("gulp-uglify");
var header     = require("gulp-header");
var source     = require("vinyl-source-stream");
var buffer     = require("vinyl-buffer");
var vfs        = require("vinyl-fs");
var dts        = require("dts-bundle");
var rimraf     = require("rimraf");
var fs         = require("fs");
var path       = require("path");

var prelude = fs.readFileSync(require.resolve("../lib/prelude.js"), "utf8");
var basedir = __dirname + "/..";
var banner = [
  "/*!",
  " * @license AssemblyScript v" + require("../package.json").version + " (c) 2017, Daniel Wirtz",
  " * Compiled " + (new Date()).toUTCString().replace("GMT", "UTC"),
  " * Licensed under the Apache-License, Version 2.0",
  " * see: https://github.com/dcodeIO/AssemblyScript for details",
  " */"
].join("\n") + "\n";

console.log("bundling JS files ...");

browserify({
  basedir: basedir,
  debug: true,
  prelude: prelude,
  preludePath: "./lib/prelude.js"
})
.add("./out/index.js")
.exclude("binaryen") // required
.exclude("wabt")     // optional...
.exclude("buffer")
.exclude("crypto")
.exclude("fs")
.exclude("os")
.exclude("process")
.exclude("source-map-support")
.exclude("_process") // replaced (see lib/prelude.js)
.on("dep", function(dep) {
  console.log("- " + path.relative(basedir, dep.file) + " [" + dep.id + "]");
})
.bundle()
.pipe( source("assemblyscript.js") )
.pipe( buffer() )
.pipe( sourcemaps.init({ loadMaps: true }) ) // TODO: For some reason, this does not load tsc's source maps
.pipe( uglify() )
.pipe( header(banner) )
.pipe( sourcemaps.write() )
.pipe( vfs.dest(__dirname + "/../dist") )
.on("end", function() {

  console.log("\nbundling DTS files ...");

  var seen = {};
  var dtsOut = __dirname + "/../dist/assemblyscript.d.ts";
  dts.bundle({
    name: "assemblyscript",
    main: __dirname + "/../out/index.d.ts",
    exclude: function(file, external) {
      const excluded = external || /[\/\\^]lib[\/\\]typescript[\/\\]build$/.test(file);
      if (!seen[file])
        console.log("- " + file + (excluded ? " [excluded]" : ""));
      seen[file] = true;
      return excluded;
    },
    out: dtsOut,
    indent: "  ",
    externals: false,
    referenceExternals: false
  });
  console.log("\ncomplete.");
});
