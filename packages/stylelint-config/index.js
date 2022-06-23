const coreRules = require('./rules')
const orderRules = require('./rules/order')

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-order', 'stylelint-declaration-block-no-ignored-properties'],
  overrides: [
    {
      files: ['*.stylus', '*.styl', '**/*.stylus', '**/*.styl'],
      customSyntax: 'postcss-styl',
      rules: {
        'declaration-block-trailing-semicolon': ['never']
      }
    },
    {
      files: ['*.scss', '**/*.scss'],
      customSyntax: 'postcss-scss'
    },
    {
      files: ['*.less', '**/*.less'],
      customSyntax: 'postcss-less'
    }
  ],
  rules: Object.assign({ 'plugin/declaration-block-no-ignored-properties': true }, coreRules, orderRules)
}
