describe('selector-type-case', () => {
  it('fix selector-type with lower case', async () => {
    const root = postcss.parse(code)
    checkSelectorTypeCase(root, {
      ruleName: 'selector-type-case',
      expectation: 'lower',
      fix: true
    })
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
})
