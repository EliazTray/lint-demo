'use strict'

const selectorParser = require('postcss-selector-parser')

module.exports = function (
  selector /*: string */,
  cb /*: Function */
) {
  try {
    return selectorParser(cb).processSync(selector)
  } catch (e) {
    console.log(e)
  }
}
