// This file performs environmental checks before building dependency components.
//
// Some of these components rely on Git submodules to be initialized, npm packages to be built or
// specific development dependencies to be working.

var path = require("path");
var fs = require("fs");

function error(message) {
  return "\u001b[91m" + message + "\u001b[0m";
}

// Check dependencies

var pkg = require("../package.json");
Object.keys(pkg.devDependencies).forEach(key => {
  try { require(key + "/package.json"); } catch (e) {
  console.error(
  error("Missing development dependency: ") + key + `

  Make sure that development dependencies have been installed:

  $> npm install
  `
  );
  process.exit(1);
  }
});

// Check TypeScript submodule

var typescriptDir = path.join(__dirname, "..", "lib", "typescript", "master");
if (!fs.existsSync(path.join(typescriptDir, "src", "compiler", "diagnosticInformationMap.generated.ts"))) {
  console.error(
  error("The TypeScript submodule at lib/typescript/master must be initialized and built first:") + `

  $> git submodule init
  $> cd lib/typescript/master
  $> npm install
  $> npm run build
  `);
  process.exit(1);
}

// Check C compiler

var wa = require("webassembly/cli/util");
wa.run(path.join(wa.bindir, "clang"), ["-v"], { stdio: "ignore", quiet: true })
.catch(err => {
  console.error(
  error("It seems that clang is not working on this platform:") + "\n\n  " + err.stack + `

  Make sure that the webassembly package is properly installed:

  $> npm install webassembly
  `
  );
  process.exit(1);
});
