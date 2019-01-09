const
  fs = require("fs"),
  path = require("path"),
  mkdirp = require("mkdirp");

function toFileName(delimiter, name) {
  if (delimiter === "") {
    return name
  }

  return name
    .replace(/[a-z][A-Z]/g, function (str) {
      return str[0] + delimiter + str[1]
    })
    .toLowerCase()
}

function writeToFS(components, options) {
  options = options || {};
  let outPath = path.resolve(options.output.path || "components");
  let delimiter = options.moduleFileNameDelimiter || "";
  let ext = options.output.fileExtension || "jsx";

  mkdirp.sync(outPath);

  Object.keys(components).forEach(function (name) {
    fs.writeFileSync(
      path.join(outPath, toFileName(delimiter, name)) + "." + ext,
      components[name],
      "utf8"
    )
  })
}

module.exports = {
  toFileName: toFileName,
  writeToFS: writeToFS
};
