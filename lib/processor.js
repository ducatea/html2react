let api = require("posthtml/lib/api")
let render = require("posthtml-render")
let toJsxAST = require("./jsx")
let toReactComponents = require("./component")
let toModules = require("./module")
let toCode = require("./code")
let formatCode = require("./format")

function getComponentName(node) {
  return node.attrs["data-component"]
}

function removeComponentName(node) {
  delete node.attrs["data-component"]

  return node
}

function isComponent(node) {
  let annotated = node.attrs && getComponentName(node)

  if (annotated !== undefined) {
    if (getComponentName(node).length > 0) {
      return true
    } else {
      throw Error("There's annotated component without a name!")
    }
  }

  return false
}

function collectComponents(components) {
  return function(node) {
    if (isComponent(node)) {
      components.push(node)
    }

    return node
  }
}

function clearAndRenderComponents(component) {
  component[1] = render(removeComponentName(component[1]))

  return component
}

function assignByName(component) {
  return [getComponentName(component), component]
}

function mergeByName(components) {
  return components.reduce(function(cs, component) {
    cs[component[0]] = component[1]
    return cs
  }, {})
}

function htmlToReactComponentsLib(tree, options) {
  let componentType = options.componentType
  let moduleType = options.moduleType

  if (
    componentType !== "stateless" &&
    componentType !== "es5" &&
    componentType !== "es6"
  ) {
    componentType = "es6"
  }

  if (moduleType !== "es6" && moduleType !== "cjs") {
    moduleType = "es6"
  }

  let components = []
  let delimiter = options.moduleFileNameDelimiter || ""

  api.walk.bind(tree)(collectComponents(components))

  let reactComponents = toReactComponents(
    componentType,
    toJsxAST(
      mergeByName(components.map(assignByName).map(clearAndRenderComponents))
    )
  );

  if (moduleType) {
    return formatCode(toCode(toModules(moduleType, delimiter, reactComponents)))
  }

  return formatCode(toCode(reactComponents))
}

module.exports = htmlToReactComponentsLib;
