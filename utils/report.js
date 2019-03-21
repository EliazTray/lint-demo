const chalk = require('chalk')
const signale = require('signale')

module.exports = function reportMessage (node, { ruleName, index, expectedValue, value }) {
  const startLine = node.positionBy({ index }).line
  signale.error(chalk.default.redBright(
    `The ${ruleName} ${startLine}:${index}: ${value}, expected ${chalk.default.green(expectedValue)}`
  ))
}
