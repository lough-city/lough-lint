import fs from 'fs'
import { dirname, join } from 'path'
import chalk from 'chalk'
import execa from 'execa'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync } from '../utils/file'
import { dependenciesMap } from '../constants/dependencies'
import { fileURLToPath } from 'url'
import { IPackage, Package } from '@lough/npm-operate'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageName = '@lough/commitlint-config'

const packageDeps = dependenciesMap[packageName]

export const initCommitlint = (npm: Package) => {
  startSpinner('commitlint: 初始化开始 ')

  /* init commitlint config START */

  // 检测并移除当前项目相关依赖
  npm.uninstall([packageName, ...packageDeps])

  // 安装依赖
  npm.installDev(`${packageName}@latest`)

  // .commitlintrc.js
  copyFileSync(join(__dirname, '../templates/.commitlintrc.js'), `${process.cwd()}/.commitlintrc.js`)
  // .gitattributes
  copyFileSync(join(__dirname, '../templates/.gitattributes'), `${process.cwd()}/.gitattributes`)
  // .gitignore
  if (!fs.existsSync(join(__dirname, '../templates/.gitignore')))
    copyFileSync(join(__dirname, '../templates/.gitignore'), `${process.cwd()}/.gitignore`)

  /* init commitlint config END */

  /* init git commit hooks START */

  // 安装 git commit hooks
  npm.installDev(['husky@7.0.2', 'lint-staged@11.1.2'])

  const config = npm.readConfig()

  // 添加 npm install 时，husky 初始化机制
  if (!config.scripts) config.scripts = {}
  config.scripts.prepare = 'husky install'

  // 添加 git commit hooks 配置
  config['lint-staged' as keyof IPackage] = {
    '*.{ts,tsx}': ['eslint -c .eslintrc.js --ext .ts,.tsx'],
    '*.{css,less,scss,styl}': ['stylelint --config .stylelintrc.js *.{css,less,scss,styl}']
  }

  npm.writeConfig(config)

  // 初始化
  execa.commandSync(`npx husky install`)

  // 添加 pre commit hooks
  copyFileSync(join(__dirname, '../templates/pre-commit'), `${process.cwd()}/.husky/pre-commit`)

  // 添加 commit msg hooks
  copyFileSync(join(__dirname, '../templates/commit-msg'), `${process.cwd()}/.husky/commit-msg`)

  /* init git commit hooks END */

  succeedSpinner(chalk.green('commitlint: 初始化成功!'))
}
