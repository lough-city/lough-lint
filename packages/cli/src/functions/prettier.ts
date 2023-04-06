import { dirname, join } from 'path'
import chalk from 'chalk'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync } from '../utils/file'
import { fileURLToPath } from 'url'
import { Package } from '@lough/npm-operate'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const initPrettier = (npm: Package) => {
  startSpinner('prettier: 初始化开始 ')

  // 安装依赖
  npm.installDev('prettier@latest')

  // .prettierrc.js
  copyFileSync(join(__dirname, '../templates/.prettierrc.js'), `${process.cwd()}/.prettierrc.js`)

  // .prettierignore
  copyFileSync(join(__dirname, '../templates/.prettierignore'), `${process.cwd()}/.prettierignore`)

  succeedSpinner(chalk.green('prettier: 初始化成功!'))
}
