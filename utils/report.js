const chalk = require('chalk')
const signale = require('signale')

module.exports = function reportMessage (node, ruleName, sourceIndex, expectedValue, currentValue) {
  const startLine = node.positionBy({ index: sourceIndex }).line
  signale.error(chalk.default.redBright(
    `The ${ruleName} ${startLine}:${sourceIndex}: ${currentValue}, expected ${chalk.default.green(expectedValue)}`
  ))
}
