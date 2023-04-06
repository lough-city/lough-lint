import fs from 'fs'
import { dirname, join } from 'path'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { ES_LINT_TYPE } from '../constants/eslint'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync, removeDirOrFileSync } from '../utils/file'
import { dependenciesMap } from '../constants/dependencies'
import { fileURLToPath } from 'url'
import { Package } from '@lough/npm-operate'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageName = '@lough/eslint-config'

const packageDeps = dependenciesMap[packageName]

const getEslintType = () =>
  inquirer.prompt<{ type: ES_LINT_TYPE }>([
    {
      type: 'list',
      name: 'type',
      message: `请选择 eslint 规范类型:`,
      choices: Object.keys(ES_LINT_TYPE)
    }
  ]).then(res => res.type)

export const initEslint = async (npm: Package) => {
  const eslintType = await getEslintType()

  startSpinner('eslint: 初始化开始 ')

  // 检测并移除当前项目相关依赖
  npm.uninstall([packageName, ...packageDeps])

  // 安装依赖
  npm.installDev(`${packageName}@latest`)

  // 删除 .eslintrc.json
  if (fs.existsSync(join(__dirname, '../templates/.eslintrc.json')))
    removeDirOrFileSync(join(__dirname, '../templates/.eslintrc.json'))

  // .eslintrc.js
  copyFileSync(join(__dirname, '../templates/.eslintrc.js'), `${process.cwd()}/.eslintrc.js`, v =>
    v.replace('{{type}}', eslintType)
  )

  // .eslintignore
  copyFileSync(join(__dirname, '../templates/.eslintignore'), `${process.cwd()}/.eslintignore`)

  const config = npm.readConfig()

  // 添加 lint scripts
  if (!config.scripts) config.scripts = {}
  config.scripts['lint:es'] = 'eslint -c .eslintrc.js --ext .ts,.tsx ./'
  config.scripts['lint:es-fix'] = 'eslint --fix -c .eslintrc.js --ext .ts,.tsx ./'

  npm.writeConfig(config)

  succeedSpinner(chalk.green('eslint: 初始化成功!'))
}
