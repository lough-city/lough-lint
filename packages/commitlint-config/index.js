/**
 * 工程化
 */
const ENGINEERING = {
  /**
   * 事务
   * @description 变动事务，改动其他不影响代码的事务
   */
  chore: 'chore',
  /**
   * 脚本
   * @description 更新脚本，改动CI或执行脚本配置
   */
  ci: 'ci',
  /**
   * 样式
   * @description 变动格式，不影响代码逻辑
   */
  style: 'style',
  /**
   * 文档
   * @description 更新文档，仅修改文档不修改代码
   */
  docs: 'docs',
  /**
   * 测试
   * @description 新增测试，追加测试用例验证代码
   */
  test: 'test'
}

/**
 * 功能
 */
const FEATURE = {
  /**
   * 功能
   * @description 新增功能，迭代项目需求
   */
  feat: 'feat',
  /**
   * 重构
   * @description 重构代码，非新增功能也非修复缺陷
   */
  refactor: 'refactor',
  /**
   * 性能
   * @description 优化性能，提高代码执行性能
   */
  perf: 'perf'
}

/**
 * 版本发布
 */
const RELEASE = {
  /**
   * 构建
   * @description 更新构建，改动构建工具或外部依赖
   */
  build: 'build',
  /**
   * 发布
   * @description 发布版本，版本的发布及其标记
   */
  release: 'release'
}

/**
 * BUG 修复
 */
const BUG_FIX = {
  /**
   * 修复
   * @description 修复缺陷，修复上一版本存在问题
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
