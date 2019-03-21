const postcss = require('postcss')
const fs = require('fs')
const path = require('path')
// const chalk = require('chalk')
const signale = require('signale')

// selector 解析函数
const checkSelectorTypeCase = require('../rules/selector-type-case')

const from = path.resolve(__dirname, './index.css')
const to = path.resolve(__dirname, './output.css')

const source = fs.readFileSync(from)

function parse (str) {
  const root = postcss.parse(str)
  // 遍历每一个 rules
  // checkSelectorTypeCase(root, true)
  checkSelectorTypeCase(root)

  // get result
  try {
    fs.writeFileSync(to, root.toString())
  } catch (error) {
    signale.error(error)
  }
}

parse(source)
