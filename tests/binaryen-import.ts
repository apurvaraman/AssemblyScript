// ref: https://github.com/WebAssembly/binaryen/issues/1080

import * as binaryen from "../src/binaryen";

var module = new binaryen.Module();

var signature = module.addFunctionType("v", binaryen.none, []);
module.addImport("fn", "env", "fn", signature);

module.addFunction("main", signature, [], module.block("", [
  module.call("fn", [], binaryen.none)
]));
module.addExport("main", "main");

console.log(module.emitText());

module.validate(); // fails
