import path from 'path'
import chalk from 'chalk'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync } from '../utils/file'
import { addNpmDevDep, readNpmConfigSync, removeNpmDepSync, writePackageJSONSync } from '../utils/npm'
import { dependenciesMap } from '../constants/dependencies'

const packageName = '@lough/stylelint-config'

const packageDeps = dependenciesMap[packageName]

export const initStylelint = () => {
  startSpinner('stylelint: 初始化开始 ')

  // 检测并移除当前项目相关依赖
  removeNpmDepSync([packageName, ...packageDeps])

  // 安装依赖
  addNpmDevDep(`${packageName}@latest`)

  // .stylelintrc.js
  copyFileSync(path.join(__dirname, '../templates/.stylelintrc.js'), `${process.cwd()}/.stylelintrc.js`)

  // .stylelintignore
  copyFileSync(path.join(__dirname, '../templates/.stylelintignore'), `${process.cwd()}/.stylelintignore`)

  const npmConfig = readNpmConfigSync()

  // 添加 lint scripts
  if (!npmConfig.scripts) npmConfig.scripts = {}
  npmConfig.scripts['lint:style'] = 'stylelint --config .stylelintrc.js ./**/*.{css,less,scss,styl}'
  npmConfig.scripts['lint:style-fix'] = 'stylelint --fix --config .stylelintrc.js ./**/*.{css,less,scss,styl}'

  writePackageJSONSync(npmConfig)

  succeedSpinner(chalk.green('stylelint: 初始化成功!'))
}
