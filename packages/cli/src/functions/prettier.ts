import path from 'path'
import execa from 'execa'
import chalk from 'chalk'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync } from '../utils/file'

export const initPrettier = () => {
  startSpinner('prettier: 初始化开始 ')

  // 安装依赖
  execa.commandSync(`npm install prettier@latest --save-dev`, { stdio: 'inherit' })

  // .prettierrc.js
  copyFileSync(path.join(__dirname, '../templates/.prettierrc.js'), `${process.cwd()}/.prettierrc.js`)

  // .prettierignore
  copyFileSync(path.join(__dirname, '../templates/.prettierignore'), `${process.cwd()}/.prettierignore`)

  succeedSpinner(chalk.green('prettier: 初始化成功!'))
}
