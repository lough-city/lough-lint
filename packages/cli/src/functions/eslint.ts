import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { prompt } from 'inquirer'
import { ES_LINT_TYPE } from '../constants/eslint'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync, removeDirOrFileSync } from '../utils/file'
import { addNpmDevDep, readNpmConfigSync, removeNpmDepSync, writePackageJSONSync } from '../utils/npm'
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
  addNpmDevDep(`${packageName}@latest`)

  // 删除 .eslintrc.json
  if (fs.existsSync(path.join(__dirname, '../templates/.eslintrc.json')))
    removeDirOrFileSync(path.join(__dirname, '../templates/.eslintrc.json'))

  // .eslintrc.js
  copyFileSync(path.join(__dirname, '../templates/.eslintrc.js'), `${process.cwd()}/.eslintrc.js`, v =>
    v.replace('{{type}}', eslintType)
  )

  // .eslintignore
  copyFileSync(path.join(__dirname, '../templates/.eslintignore'), `${process.cwd()}/.eslintignore`)

  const npmConfig = readNpmConfigSync()

  // 添加 lint scripts
  if (!npmConfig.scripts) npmConfig.scripts = {}
  npmConfig.scripts['lint:es'] = 'eslint -c .eslintrc.js --ext .ts,.tsx ./'
  npmConfig.scripts['lint:es-fix'] = 'eslint --fix -c .eslintrc.js --ext .ts,.tsx ./'

  writePackageJSONSync(npmConfig)

  succeedSpinner(chalk.green('eslint: 初始化成功!'))
}
