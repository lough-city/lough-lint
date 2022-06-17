import path from 'path'
import chalk from 'chalk'
import execa from 'execa'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync } from '../utils/file'
import { addNpmDevDep, readNpmConfigSync, removeNpmDepSync, writePackageJSONSync } from '../utils/npm'
import { dependenciesMap } from '../constants/dependencies'

const packageName = '@lough/commitlint-config'

const packageDeps = dependenciesMap[packageName]

export const initCommitlint = () => {
  startSpinner('commitlint: 初始化开始 ')

  /* init commitlint config START */

  // 检测并移除当前项目相关依赖
  removeNpmDepSync([packageName, ...packageDeps])

  // 安装依赖
  addNpmDevDep(`${packageName}@latest`)

  // .commitlintrc.js
  copyFileSync(path.join(__dirname, '../templates/.commitlintrc.js'), `${process.cwd()}/.commitlintrc.js`)

  /* init commitlint config END */

  /* init git commit hooks START */

  // 安装 git commit hooks
  addNpmDevDep(['husky@7.0.2', 'lint-staged@11.1.2'])

  const npmConfig = readNpmConfigSync()

  // 添加 npm install 时，husky 初始化机制
  if (!npmConfig.scripts) npmConfig.scripts = {}
  npmConfig.scripts.prepare = 'husky install'

  // 添加 git commit hooks 配置
  npmConfig['lint-staged'] = {
    '*.{js,jsx,ts,tsx}': ['eslint -c .eslintrc.js --ext .ts,.tsx'],
    '*.{css,less,scss,styl}': ['stylelint --config .stylelintrc.js *.{css,less,scss,styl}']
  }

  writePackageJSONSync(npmConfig)

  // 初始化
  execa.commandSync(`npx husky install`)

  // 添加 pre commit hooks
  copyFileSync(path.join(__dirname, '../templates/pre-commit'), `${process.cwd()}/.husky/pre-commit`)

  // 添加 commit msg hooks
  copyFileSync(path.join(__dirname, '../templates/commit-msg'), `${process.cwd()}/.husky/commit-msg`)

  /* init git commit hooks END */

  succeedSpinner(chalk.green('commitlint: 初始化成功!'))
}
