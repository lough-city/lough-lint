import path from 'path'
import execa from 'execa'
import chalk from 'chalk'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync } from '../utils/file'
import { removeNpmDepSync } from '../utils/npm'
import { dependenciesMap } from '../constants/dependencies'

const packageName = '@lough/stylelint-config'

const packageDeps = dependenciesMap[packageName]

export const initStylelint = () => {
  startSpinner('stylelint: 初始化开始 ')

  // 检测并移除当前项目相关依赖
  removeNpmDepSync([packageName, ...packageDeps])

  // 安装依赖
  execa.commandSync(`npm install ${packageName}@latest --save-dev`, { stdio: 'inherit' })

  // .stylelintrc.js
  copyFileSync(path.join(__dirname, '../templates/.stylelintrc.js'), `${process.cwd()}/.stylelintrc.js`)

  // .stylelintignore
  copyFileSync(path.join(__dirname, '../templates/.stylelintignore'), `${process.cwd()}/.stylelintignore`)

  succeedSpinner(chalk.green('stylelint: 初始化成功!'))
}