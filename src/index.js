const postcss = require('postcss')
const fs = require('fs')
const path = require('path')
// const chalk = require('chalk')
const { dump } = require('dumper.js')
const signale = require('signale')
const cosmiconfig = require('cosmiconfig')

const checkSelectorTypeCase = require('../rules/selector-type-case')
const checkColorHexCase = require('../rules/color-hex-case')

const keyToFunc = {
  'selector-type-case': checkSelectorTypeCase,
  'color-hex-case': checkColorHexCase
}

function parse (str, ruleConfig, needFix) {
  const root = postcss.parse(str)

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

  return root
}

function getConfig (configName = 'clint') {
  const explorer = cosmiconfig(configName)
  const searchResult = explorer.searchSync()

  if (!searchResult) {
    throw new TypeError('Please provide the config')
  }
  return searchResult.config
}

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

function init (needFix = false) {
  const from = path.resolve(__dirname, './index.css')
  const to = path.resolve(__dirname, './output-cosmiconfig.css')
  const source = fs.readFileSync(from)
  const config = getConfig()

  dump(config)
  checkFix(parse(source, config, needFix), to, needFix)
}

init(true)
