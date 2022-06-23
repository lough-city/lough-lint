import fs from 'fs'
import chalk from 'chalk'
import { prompt } from 'inquirer'
import { LINT_TYPE } from '../constants'
import { PACKAGE_MANAGE_TOOL } from '../constants/npm'
import { initEslint } from '../functions/eslint'
import { initStylelint } from '../functions/stylelint'
import { initPrettier } from '../functions/prettier'
import { initEditor } from '../functions/editor'
import { initCommitlint } from '../functions/commitlint'
import { existsNpmConfigSync, getPackageManageTool, readNpmConfigSync, writePackageJSONSync } from '../utils/npm'
import { existsGitConfigSync } from '../utils/git'
import { failSpinner, succeedSpinner } from '../utils/spinner'
import lough from '../config/lough'

const getLintTypeList = () =>
  prompt<{ targets: Array<LINT_TYPE> }>([
    {
      type: 'checkbox',
      name: 'targets',
      message: `请选择初始化规范 (默认全选，空格键切换选中态，回车确认):`,
      choices: Object.keys(LINT_TYPE).map(type => ({ name: type, checked: true }))
    }
  ])

const getPMT = () =>
  prompt<{ pmt: PACKAGE_MANAGE_TOOL }>([
    {
      type: 'list',
      name: 'pmt',
      message: `请选择初始化规范 (默认全选，空格键切换选中态，回车确认):`,
      default: PACKAGE_MANAGE_TOOL.npm,
      choices: Object.keys(PACKAGE_MANAGE_TOOL)
    }
  ])

const action = async () => {
  if (!existsNpmConfigSync()) {
    failSpinner('请先初始化 NPM，或者在项目根目录进行初始化程序！')
    return
  }

  const lintList = await getLintTypeList()

  if (lintList.targets.includes(LINT_TYPE.commitlint) && !existsGitConfigSync()) {
    failSpinner('请先初始化 GIT，或者在 GIT 项目中初始化 commitlint！')
    return
  }

  let packageManageTool = getPackageManageTool()

  if (!packageManageTool) packageManageTool = (await getPMT()).pmt

  lough.packageManageTool = packageManageTool as PACKAGE_MANAGE_TOOL
  if (fs.existsSync(`${process.cwd()}/lerna.json`)) lough.isMorePackage = true

  if (lintList.targets.includes(LINT_TYPE.eslint)) await initEslint()

  if (lintList.targets.includes(LINT_TYPE.stylelint)) initStylelint()

  if (lintList.targets.includes(LINT_TYPE.eslint) && lintList.targets.includes(LINT_TYPE.stylelint)) {
    const npmConfig = readNpmConfigSync()

    // 添加 lint scripts
    if (!npmConfig.scripts) npmConfig.scripts = {}
    npmConfig.scripts['lint'] = 'npm run lint:es && npm run lint:style'
    npmConfig.scripts['lint-fix'] = 'npm run lint:es-fix && npm run lint:style-fix'

    writePackageJSONSync(npmConfig)
  }

  if (lintList.targets.includes(LINT_TYPE.prettier)) initPrettier()

  if (lintList.targets.includes(LINT_TYPE.editor)) initEditor()

  if (lintList.targets.includes(LINT_TYPE.commitlint)) initCommitlint()

  succeedSpinner(chalk.green('初始化成功！'))
}

export default {
  command: 'init',
  description: '初始化 lint 规范',
  action
}
