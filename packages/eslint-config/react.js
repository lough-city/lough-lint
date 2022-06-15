const react = require('./rules/react-common.js')
const reactHooks = require('./rules/react-hooks-common.js')

module.exports = {
  extends: ['./base.js', './typescript.js', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 6
  },
  plugins: ['react', 'react-hooks'],
  env: {
    browser: true
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect'
    }
  },
  rules: Object.assign({}, react, reactHooks)
}
