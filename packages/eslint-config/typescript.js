const typescriptRule = require('./rules/typescript-common.js')

module.exports = {
  parserOptions: {
    ecmaVersion: 6
  },
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'import'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  settings: {
    'import/resolver': {
      node: true,
      typescript: true
    }
  },
  rules: Object.assign({}, typescriptRule, {
    'import/order': [
      'error',
      {
        // [内置模块, 外部模块, 内部引用, 父节点依赖, 兄弟依赖, index 文件依赖, 声明依赖（typescript）, 类型依赖（typescript）, 未知依赖]
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type', 'unknown'],
        // 每个分组之间换行
        'newlines-between': 'always',
        // 排序
        alphabetize: {
          // 排序规则，asc升序，desc降序
          order: 'asc',
          // 是否忽略大小写
          caseInsensitive: false
        },
        // 如果为 true，未命名的导入，给出警告，但是不做 fix。false 的话，不做警告。建议 false，手动把样式放在最后。
        warnOnUnassignedImports: false
      }
    ]
  })
}
