const coreRules = require('./rules')
const orderRules = require('./rules/order')

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'],
  rules: Object.assign({}, coreRules, orderRules)
}
