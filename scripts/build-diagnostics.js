var fs = require("fs");

var messages = require("../src/typescript/diagnosticMessages.json");

var out = [
  "/** @module assemblyscript/typescript */ /** */",
  "",
  "// This is a generated file. Edit diagnosticMessages.json instead and run 'npm run build:diagnostics' afterwards.",
  "",
  "import { DiagnosticCategory } from \"../typescript\";",
  "",
  "/** AssemblyScript specific diagnostic messages. */",
  "export const DiagnosticsEx = {"
];

var total = Object.keys(messages).length;
var index = 0;
var seen = {};

Object.keys(messages).forEach(message => {
  var m = messages[message];
  var key = message.replace(/[^\w]+/g, "_").replace(/_+$/, "");
  var code = m.code;
  var category = m.category || "Error";
  if (seen[code])
    throw Error("duplicate code: " + code);
  out.push(
    "  " + key + ": {",
    "    code: <number><any>" + JSON.stringify("/AS" + code) + ",",
    "    category: DiagnosticCategory." + category + ",",
    "    key: " + JSON.stringify(key + "_AS" + code) + ",",
    "    message: " + JSON.stringify(message),
    "  }" + (++index !== total ? "," : "")
  );
  seen[code] = true;
});

out.push(
  "};",
  "",
  "export { DiagnosticsEx as default };",
  ""
)

fs.writeFileSync(__dirname + "/../src/typescript/diagnosticMessages.generated.ts", out.join("\n"), { encoding: "utf8" });
