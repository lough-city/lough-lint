import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { startSpinner, succeedSpinner } from '../utils/spinner'
import { copyFileSync } from '../utils/file'

export const initEditor = () => {
  startSpinner('editor: 初始化开始 ')

  const vscodeConfigPath = `${process.cwd()}/.vscode`
  if (!fs.existsSync(vscodeConfigPath)) fs.mkdirSync(vscodeConfigPath)

  // settings.json
  copyFileSync(path.join(__dirname, '../templates/settings.json'), `${vscodeConfigPath}/settings.json`)

  // extensions.json
  copyFileSync(path.join(__dirname, '../templates/extensions.json'), `${vscodeConfigPath}/extensions.json`)

  // .editorconfig
  copyFileSync(path.join(__dirname, '../templates/.editorconfig'), `${process.cwd()}/.editorconfig`)

  succeedSpinner(chalk.green('editor: 初始化成功!'))
}
