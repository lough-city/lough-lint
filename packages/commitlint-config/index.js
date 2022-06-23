module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // <type> 为空
    'type-empty': [2, 'never'],
    // <type> 小写
    'type-case': [2, 'always', 'lower-case'],
    // <subject> 为空
    'subject-empty': [2, 'never'],
    // <body> 换行
    'body-leading-blank': [2, 'always'],
    // <footer> 以空行开头
    'footer-leading-blank': [1, 'always'],
    // header 最长72
    'header-max-length': [2, 'never', 72],
    // <type> 枚举
    'type-enum': [
      2,
      'always',
      [
        // 编译相关的修改，例如发布版本、对项目构建或者依赖的改动
        'build',
        // 其他修改, 比如改变构建流程、或者增加依赖库、工具等
        'chore',
        // 持续集成修改
        'ci',
        // 文档修改
        'docs',
        // 新特性、新功能
        'feat',
        // 修改bug
        'fix',
        // 优化相关，比如提升性能、体验
        'perf',
        // 代码重构
        'refactor',
        // 回滚到上一个版本
        'revert',
        // 代码格式修改, 注意不是 css 修改
        'style',
        // 测试用例修改
        'test',
        // 改变页面布局与样式
        'ui',
        // 发布版本
        'release'
      ]
    ]
  }
}
