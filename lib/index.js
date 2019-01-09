var parse = require("posthtml-parser")
var htmlToReactComponentsLib = require("./processor")

module.exports = function extractReactComponents(html, options) {
  options = options || {}

  let components = htmlToReactComponentsLib(parse(html), options)
  require("./writer").writeToFS(components, options)
  return components
}
