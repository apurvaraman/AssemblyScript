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

var prelude = fs.readFileSync(require.resolve("../lib/prelude-loader.js"), "utf8");
var basedir = __dirname + "/../lib/loader";
var banner = [
  "/*!",
  " * @license AssemblyScript Loader v" + require("../package.json").version + " (c) 2017, Daniel Wirtz",
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
  preludePath: "lib/prelude-loader.js"
})
.add("./index.js")
.exclude("long") // optional
.on("dep", function(dep) {
  console.log("- " + path.relative(basedir, dep.file) + " [" + dep.id + "]");
})
.bundle()
.pipe( source("assemblyscript-loader.js") )
.pipe( buffer() )
.pipe( sourcemaps.init({ loadMaps: true }) )
.pipe( uglify() )
.pipe( header(banner) )
.pipe( sourcemaps.write(".") )
.pipe( vfs.dest(__dirname + "/../dist") )
.on("end", function() {

  console.log("\nbundling DTS files ...");

  var seen = {};
  var dtsOut = __dirname + "/../dist/assemblyscript-loader.d.ts";
  dts.bundle({
    name: "assemblyscript-loader",
    main: __dirname + "/../lib/loader/index.d.ts",
    exclude: function(file, external) {
      const excluded = false; // no excludes
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
