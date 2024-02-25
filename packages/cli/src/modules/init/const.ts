/**
 * 规范类型
 */
export enum NORM_TYPE {
  /**
   * 类型
   */
  tsconfig = 'tsconfig',
  /**
   * 代码
   */
  eslint = 'eslint',
  /**
   * 样式
   */
  stylelint = 'stylelint',
  /**
   * 提交
   */
  commitlint = 'commitlint',
  /**
   * 格式化
   */
  prettier = 'prettier',
  /**
   * 编辑器
   */
  editor = 'editor'
}

/**
 * 技术类型
 */
export enum TECH_TYPE {
  /**
   * TypeScript
   */
  typescript = 'typescript',
  /**
   * React
   */
  react = 'react',
  /**
   * Node
   */
  node = 'node'
}
