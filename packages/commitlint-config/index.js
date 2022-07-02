/**
 * 工程化
 */
const ENGINEERING = {
  /**
   * 构建过程或辅助工具的变动
   */
  chore: 'chore',
  /**
   * 与 CI（持续集成服务）有关的改动
   */
  ci: 'ci',
  /**
   * 代码风格修改
   */
  style: 'style',
  /**
   * 文档
   */
  docs: 'docs',
  /**
   * 测试
   */
  test: 'test'
}

/**
 * 功能
 */
const FEATURE = {
  /**
   * 新功能、新特性
   */
  feat: 'feat',
  /**
   * 页面布局与样式
   */
  ui: 'ui',
  /**
   * 重构
   */
  refactor: 'refactor',
  /**
   * 优化相关，比如：提升性能、体验
   */
  perf: 'perf'
}

/**
 * 版本发布
 */
const RELEASE = {
  /**
   * 编译相关的修改，例如版本发布、对项目构建或者依赖的改动
   */
  build: 'build',
  /**
   * 发布
   */
  release: 'release'
}

/**
 * BUG 修复
 */
const BUG_FIX = {
  /**
   * 修补BUG
   */
  fix: 'fix'
}

const typeEnum = [
  ...Object.keys(ENGINEERING),
  ...Object.keys(FEATURE),
  ...Object.keys(RELEASE),
  ...Object.keys(BUG_FIX)
]

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
    'type-enum': [2, 'always', typeEnum]
  }
}
