import { dirname, join } from 'path'
import chalk from 'chalk'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync } from '../utils/file'
import { dependenciesMap } from '../constants/dependencies'
import { fileURLToPath } from 'url'
import { Package } from '@lough/npm-operate'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageName = '@lough/stylelint-config'

const packageDeps = dependenciesMap[packageName]

export const initStylelint = (npm: Package) => {
  startSpinner('stylelint: 初始化开始 ')

  // 检测并移除当前项目相关依赖
  npm.uninstall([packageName, ...packageDeps])

  // 安装依赖
  npm.installDev(`${packageName}@latest`)

  // .stylelintrc.js
  copyFileSync(join(__dirname, '../templates/.stylelintrc.js'), `${process.cwd()}/.stylelintrc.js`)

  // .stylelintignore
  copyFileSync(join(__dirname, '../templates/.stylelintignore'), `${process.cwd()}/.stylelintignore`)

  const config = npm.readConfig()

  // 添加 lint scripts
  if (!config.scripts) config.scripts = {}
  config.scripts['lint:style'] = 'stylelint --config .stylelintrc.js ./**/*.{css,less,scss,styl}'
  config.scripts['lint:style-fix'] = 'stylelint --fix --config .stylelintrc.js ./**/*.{css,less,scss,styl}'

  npm.writeConfig(config)

  succeedSpinner(chalk.green('stylelint: 初始化成功!'))
}
