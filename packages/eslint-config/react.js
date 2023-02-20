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
  rules: Object.assign({}, react, reactHooks, {
    'import/order': [
      'error',
      {
        // [内置模块, 外部模块, 内部引用, 父节点依赖, 兄弟依赖, index 文件依赖, 声明依赖（typescript）, 类型依赖（typescript）, 未知依赖]
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type', 'unknown'],
        // 通过路径自定义分组
        pathGroups: [
          {
            // 当前组中模块的最短路径匹配
            pattern: 'react*',
            // 在规定的组中选其一
            group: 'external',
            // 定义组的位置，after、before
            position: 'before'
          }
        ],
        // pathGroups 配置的导入的类型不做处理的定义在这里
        pathGroupsExcludedImportTypes: ['builtin'],
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
