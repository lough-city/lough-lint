import ora from 'ora'
import chalk from 'chalk'

const spinner = ora()

export const startSpinner = (text?: string) => {
  text = `${text}...\n`
  spinner.start(text)
  spinner.stopAndPersist({ symbol: '✨', text: text })
}

export const succeedSpinner = (text?: string) => {
  spinner.stopAndPersist({ symbol: '🎉', text: `${text}\n` })
}

export const failSpinner = (text?: string) => {
  spinner.fail(chalk.red(text))
}
