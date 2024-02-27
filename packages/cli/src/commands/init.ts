import chalk from 'chalk';
import inquirer from 'inquirer';
import { TECH_TYPE, InitFlow, NORM_TYPE } from '../functions/init';
import { existsGitConfigSync } from '../utils/git';
import { failSpinner, startLoadingSpinner, succeedLoadingSpinner, succeedSpinner } from '../utils/spinner';

const getTechType = () =>
  inquirer
    .prompt<{ type: TECH_TYPE }>([
      {
        type: 'list',
        name: 'type',
        message: `Please select the tech type:`,
        choices: Object.keys(TECH_TYPE)
      }
    ])
    .then(res => res.type);

const getNormList = () =>
  inquirer.prompt<{ targets: Array<NORM_TYPE> }>([
    {
      type: 'checkbox',
      name: 'targets',
      message: `Select the norm you want to init:`,
      choices: Object.keys(NORM_TYPE).map(type => ({
        name: type,
        checked: true
      }))
    }
  ]);

/**
 * 初始化选项
 */
export interface InitOptions {
  /**
   * 技术类型
   */
  techType?: TECH_TYPE;
  /**
   * 规范类型
   * @description 需要初始化的规范列表
   */
  norms?: Array<NORM_TYPE>;
  /**
   * 静默
   * @description 是否开启静默模式
   * @default false
   */
  quite?: boolean;
}

const action = async (options: InitOptions) => {
  const { norms, techType } = options;

  const normList = norms || (options.quite ? Object.values(NORM_TYPE) : (await getNormList()).targets);

  if (normList.includes(NORM_TYPE.commitlint) && !existsGitConfigSync()) {
    failSpinner('init GIT or init in a GIT project!');
    return;
  }

  let _techType = TECH_TYPE.typescript;
  if (normList.includes(NORM_TYPE.eslint) || normList.includes(NORM_TYPE.tsconfig)) {
    _techType = techType || (options.quite ? TECH_TYPE.typescript : await getTechType());
  }

  const initFlow = new InitFlow({
    techType: _techType,
    cycle: options.quite
      ? undefined
      : {
          eslintStart() {
            startLoadingSpinner('eslint: 初始化开始');
          },
          eslintEnd() {
            succeedLoadingSpinner(chalk.green('eslint: 初始化成功!'));
          },
          tsconfigStart() {
            startLoadingSpinner('tsconfig: 初始化开始');
          },
          tsconfigEnd() {
            succeedLoadingSpinner(chalk.green('tsconfig: 初始化成功!'));
          },
          stylelintStart() {
            startLoadingSpinner('stylelint: 初始化开始');
          },
          stylelintEnd() {
            startLoadingSpinner(chalk.green('stylelint: 初始化成功!'));
          },
          commitlintStart() {
            startLoadingSpinner('commitlint: 初始化开始');
          },
          commitlintEnd() {
            startLoadingSpinner(chalk.green('commitlint: 初始化成功!'));
          },
          editorStart() {
            startLoadingSpinner('editor: 初始化开始');
          },
          editorEnd() {
            startLoadingSpinner(chalk.green('editor: 初始化成功!'));
          },
          prettierStart() {
            startLoadingSpinner('prettier: 初始化开始');
          },
          prettierEnd() {
            startLoadingSpinner(chalk.green('prettier: 初始化成功!'));
          }
        }
  });

  initFlow.pipeline({ normList });

  succeedSpinner(`${chalk.blue('Lough Lint:')} ${chalk.green('succeed')}`);
};

export default {
  name: 'init',
  description: 'init project lint function.',
  options: [
    ['-tt, --techType [string]', `init tech type: typescript | react | node`],
    ['-n, --norms [string...]', `init lint norms: tsconfig | eslint | stylelint | commitlint | prettier | editor`],
    ['-q, --quite [boolean]', 'execute the program silently.', false]
  ],
  action
};
