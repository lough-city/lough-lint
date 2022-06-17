import path from 'path'
import chalk from 'chalk'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync } from '../utils/file'
import { addNpmDevDep } from '../utils/npm'

export const initPrettier = () => {
  startSpinner('prettier: 初始化开始 ')

  // 安装依赖
  addNpmDevDep('prettier@latest')

  // .prettierrc.js
  copyFileSync(path.join(__dirname, '../templates/.prettierrc.js'), `${process.cwd()}/.prettierrc.js`)

  // .prettierignore
  copyFileSync(path.join(__dirname, '../templates/.prettierignore'), `${process.cwd()}/.prettierignore`)

  succeedSpinner(chalk.green('prettier: 初始化成功!'))
}
