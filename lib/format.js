function formatCode(components) {
  let prettier = require("prettier");
  return Object.keys(components).reduce(function (cs, name) {
    cs[name] = prettier.format(components[name], {semi: true, parser: "babylon"})
    return cs
  }, {})
}

module.exports = formatCode;
