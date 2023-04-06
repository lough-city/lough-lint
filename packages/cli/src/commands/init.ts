import chalk from 'chalk'
import inquirer from 'inquirer'
import { LINT_TYPE } from '../constants'
import { initEslint } from '../functions/eslint'
import { initStylelint } from '../functions/stylelint'
import { initPrettier } from '../functions/prettier'
import { initEditor } from '../functions/editor'
import { initCommitlint } from '../functions/commitlint'
import { existsGitConfigSync } from '../utils/git'
import { failSpinner, succeedSpinner } from '../utils/spinner'
import { Package } from '@lough/npm-operate';

const getLintTypeList = () =>
  inquirer.prompt<{ targets: Array<LINT_TYPE> }>([
    {
      type: 'checkbox',
      name: 'targets',
      message: `请选择初始化规范 (默认全选，空格键切换选中态，回车确认):`,
      choices: Object.keys(LINT_TYPE).map(type => ({ name: type, checked: true }))
    }
  ])


const action = async () => {
  const npm = new Package();

  const lintList = await getLintTypeList()

  if (lintList.targets.includes(LINT_TYPE.commitlint) && !existsGitConfigSync()) {
    failSpinner('请先初始化 GIT，或者在 GIT 项目中初始化 commitlint！')
    return
  }

  if (lintList.targets.includes(LINT_TYPE.eslint)) await initEslint(npm)

  if (lintList.targets.includes(LINT_TYPE.stylelint)) initStylelint(npm)

  if (lintList.targets.includes(LINT_TYPE.eslint) && lintList.targets.includes(LINT_TYPE.stylelint)) {
    const config = npm.readConfig()

    // 添加 lint scripts
    if (!config.scripts) config.scripts = {}
    config.scripts['lint'] = 'npm run lint:es && npm run lint:style'
    config.scripts['lint-fix'] = 'npm run lint:es-fix && npm run lint:style-fix'

    npm.writeConfig(config)
  }

  if (lintList.targets.includes(LINT_TYPE.prettier)) initPrettier(npm)

  if (lintList.targets.includes(LINT_TYPE.editor)) initEditor()

  if (lintList.targets.includes(LINT_TYPE.commitlint)) initCommitlint(npm)

  succeedSpinner(chalk.green('初始化成功！'))
}

export default {
  command: 'init',
  description: '初始化 lint 规范',
  action
}
