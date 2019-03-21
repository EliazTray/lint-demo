const reportMessage = require('../utils/report')
const styleSearch = require('style-search')

module.exports = function checkSelectorTypeCase (root, { ruleName, expectation, fix = false }) {
  root.walkDecls(decl => {
    const declString = decl.toString()
    const fixPositions = []

    styleSearch({ source: declString, target: '#' }, match => {
      const hexMatch = /^#[0-9A-Za-z]+/.exec(
        declString.substr(match.startIndex)
      )

      if (!hexMatch) {
        return
      }

      const hexValue = hexMatch[0]
      const expectedHex = expectation === 'lower' ? hexValue.toLowerCase() : hexValue.toUpperCase()

      if (hexValue === expectedHex) {
        return
      }

      if (fix) {
        fixPositions.unshift({
          expectedHex,
          currentHex: hexValue,
          startIndex: match.startIndex
        })

        return
      }

      reportMessage(root, {
        ruleName,
        index: match.startIndex,
        expectedValue: expectedHex,
        value: hexValue
      })
    })

    if (fixPositions.length) {
      const declProp = decl.prop
      const declBetween = decl.raws.between

      fixPositions.forEach(function (fixPosition) {
        decl.value = replaceHex(
          decl.value,
          fixPosition.currentHex,
          fixPosition.expectedHex,
          fixPosition.startIndex - declProp.length - declBetween.length - 1
        )
      })
    }
  })
}

function replaceHex (input, searchString, replaceString, startIndex) {
  const offset = startIndex + 1
  const stringStart = input.slice(0, offset)
  const stringEnd = input.slice(offset + searchString.length)

  return stringStart + replaceString + stringEnd
}
