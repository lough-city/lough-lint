import chalk from 'chalk'
import { prompt } from 'inquirer'
import { LINT_TYPE } from '../constants'
import { initEslint } from '../functions/eslint'
import { initStylelint } from '../functions/stylelint'
import { initPrettier } from '../functions/prettier'
import { initEditor } from '../functions/editor'
import { initCommitlint } from '../functions/commitlint'
import { existsNpmConfigSync } from '../utils/npm'
import { existsGitConfigSync } from '../utils/git'
import { failSpinner, succeedSpinner } from '../utils/spinner'

const getLintTypeList = () =>
  prompt<{ targets: Array<LINT_TYPE> }>([
    {
      type: 'checkbox',
      name: 'targets',
      message: `请选择初始化规范 (默认全选，空格键切换选中态，回车确认):`,
      choices: Object.keys(LINT_TYPE).map(type => ({ name: type, checked: true }))
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

  if (lintList.targets.includes(LINT_TYPE.eslint)) await initEslint()

  if (lintList.targets.includes(LINT_TYPE.stylelint)) initStylelint()

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
