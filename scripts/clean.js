var rimraf = require("rimraf");

console.log("\ncleaning up ...");
rimraf(__dirname + "/../out", function(err) {
  if (err) throw err;
  console.log("\ncomplete.");
});
