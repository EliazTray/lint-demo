const postcss = require('postcss')
const fs = require('fs')
// const path = require('path')
// const chalk = require('chalk')
// const { dump } = require('dumper.js')
const signale = require('signale')
const cosmiconfig = require('cosmiconfig')
const globby = require('globby')

const checkSelectorTypeCase = require('../rules/selector-type-case')
const checkColorHexCase = require('../rules/color-hex-case')

const keyToFunc = {
  'selector-type-case': checkSelectorTypeCase,
  'color-hex-case': checkColorHexCase
}

function parse (sourcePath, ruleConfig, needFix) {
  const root = postcss.parse(fs.readFileSync(sourcePath))

  // 遍历每个 rules
  Object.entries(ruleConfig).forEach(([key, value]) => {
    if (typeof keyToFunc[key] === 'function') {
      keyToFunc[key].call(this, root, {
        ruleName: key,
        expectation: value,
        fix: needFix
      })
    }
  })

  checkFix(root, sourcePath, needFix)
}

// 获取 clint 配置
function getConfig (path = process.cwd(), configName = 'clint') {
  const explorer = cosmiconfig(configName)
  const searchResult = explorer.searchSync(path)

  if (!searchResult) {
    throw new TypeError('Please provide the config')
  }
  return searchResult.config
}

// check needFix？
function checkFix (root, to, needFix = false) {
  // if fixed, get result
  if (needFix) {
    try {
      fs.writeFileSync(to, root.toString())
    } catch (error) {
      signale.error(error)
    }
  }
}

module.exports = function (path, options) {
  const config = getConfig(options.config)
  const matchFiles = globby.sync(path)

  matchFiles.forEach(file => {
    parse(file, config, options.fix)
  })
}

// u can transform one rule function to plugin.
// postcss([ /* your plugin  */]).process(fs.readFileSync(path), { from: file }).toString()
