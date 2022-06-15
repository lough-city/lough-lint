const common = require('./rules/common.js')

module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 6
  },
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: Object.assign(
    {
      'prettier/prettier': 'error'
    },
    common
  )
}
