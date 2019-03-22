const parseSelector = require('../lib/parseSelector')
const reportMessage = require('../utils/report')

module.exports = function checkSelectorTypeCase (root, { ruleName, expectation, fix = false }) {
  root.walkRules(rule => {
    parseSelector(rule.selector, selectorAST => {
      selectorAST.walkTags(tag => {
        // seletor 的 value
        const value = tag.value // selector value
        const sourceIndex = tag.sourceIndex // 起始位置
        const expectedValue = expectation === 'lower' ? value.toLowerCase() : value.toUpperCase()

        if (value === expectedValue) {
          return
        }

        if (fix) {
          rule.selector =
            rule.selector.slice(0, sourceIndex) +
            expectedValue +
            rule.selector.slice(sourceIndex + value.length)

          return
        }
        // wont' fix, output the error message

        reportMessage(rule, {
          ruleName,
          index: sourceIndex,
          expectedValue,
          value
        })
      })
    })
  })
}
