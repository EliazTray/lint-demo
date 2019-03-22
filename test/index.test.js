const postcss = require('postcss')
const lintDemo = require('../src')

const checkSelectorTypeCase = require('../rules/selector-type-case')
const checkColorHexCase = require('../rules/color-hex-case')

const code = `
A {
  color: #FFF;
  font-size: 12px;
}

UL LI {
  color: #F0f;
}

button {
  position: absolute;
}
`

test('main', () => {
  expect(typeof lintDemo).toBe('function')
})

describe('selector-type-case', () => {
  it('fix selector-type with lower case', async () => {
    const root = postcss.parse(code)
    checkSelectorTypeCase(root, { ruleName: 'selector-type-case', expectation: 'lower', fix: true })
    expect(root.toString()).toBe(`
a {
  color: #FFF;
  font-size: 12px;
}

ul li {
  color: #F0f;
}

button {
  position: absolute;
}
`)
  })

  it('fix selector-type with upper case', async () => {
    const root = postcss.parse(code)
    checkSelectorTypeCase(root, { ruleName: 'selector-type-case', expectation: 'upper', fix: true })
    expect(root.toString()).toBe(`
A {
  color: #FFF;
  font-size: 12px;
}

UL LI {
  color: #F0f;
}

BUTTON {
  position: absolute;
}
`)
  })
})

describe('color-hex-case', () => {
  it('fix color-hex-case with upper case', async () => {
    const root = postcss.parse(code)
    checkColorHexCase(root, { ruleName: 'color-hex-case', expectation: 'upper', fix: true })
    expect(root.toString()).toBe(`
A {
  color: #FFF;
  font-size: 12px;
}

UL LI {
  color: #F0F;
}

button {
  position: absolute;
}
`)
  })

  it('fix color-hex-case with lower case', async () => {
    const root = postcss.parse(code)
    checkColorHexCase(root, { ruleName: 'color-hex-case', expectation: 'lower', fix: true })
    expect(root.toString()).toBe(`
A {
  color: #fff;
  font-size: 12px;
}

UL LI {
  color: #f0f;
}

button {
  position: absolute;
}
`)
  })
})
