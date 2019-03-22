#!/usr/bin/env node
const cac = require('cac')
const { version } = require('./package.json')
const cli = cac()

const main = require('./src/index')

cli
  .command('<files>', 'use globby pattern match the files')
  .option('--config <configPath>', 'specify the clint config')
  .option('--fix', 'fix the error')
  .allowUnknownOptions()
  .action((path, options) => {
    main(path, options)
  })

cli.help()
cli.version(version)
cli.parse()
