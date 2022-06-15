import { prompt } from 'inquirer'
import path from 'path'
import execa from 'execa'
import chalk from 'chalk'
import { ES_LINT_TYPE } from '../constants/eslint'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync } from '../utils/file'
import { removeNpmDepSync } from '../utils/npm'
import { dependenciesMap } from '../constants/dependencies'

const packageName = '@lough/eslint-config'

const packageDeps = dependenciesMap[packageName]

const getEslintType = () =>
  prompt<{ type: ES_LINT_TYPE }>([
    {
      type: 'list',
      name: 'type',
      message: `请选择 eslint 规范类型:`,
      choices: Object.keys(ES_LINT_TYPE)
    }
  ]).then(res => res.type)

export const initEslint = async () => {
  const eslintType = await getEslintType()

  startSpinner('eslint: 初始化开始 ')

  // 检测并移除当前项目相关依赖
  removeNpmDepSync([packageName, ...packageDeps])

  // 安装依赖
  execa.commandSync(`npm install ${packageName}@latest --save-dev`, { stdio: 'inherit' })

  // .eslintrc.js
  copyFileSync(path.join(__dirname, '../templates/.eslintrc.js'), `${process.cwd()}/.eslintrc.js`, v =>
    v.replace('{{type}}', eslintType)
  )

  // .eslintignore
  copyFileSync(path.join(__dirname, '../templates/.eslintignore'), `${process.cwd()}/.eslintignore`)

  succeedSpinner(chalk.green('eslint: 初始化成功!'))
}
