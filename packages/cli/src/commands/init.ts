import { Package } from '@lough/npm-operate';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { PROJECT_TYPE, InitFlow, NORM_TYPE } from '../functions/init';
import { existsGitConfigSync } from '../utils/git';
import { failSpinner, succeedSpinner } from '../utils/spinner';

const getProjectType = () =>
  inquirer
    .prompt<{ type: PROJECT_TYPE }>([
      {
        type: 'list',
        name: 'type',
        message: `Please select the project type:`,
        choices: Object.keys(PROJECT_TYPE)
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

interface IOptions {
  type?: PROJECT_TYPE;
  norms?: Array<NORM_TYPE>;
  notInteraction: boolean;
}

const action = async (options: IOptions) => {
  const { notInteraction, norms, type } = options;

  const npm = new Package();

  const normList = norms || (notInteraction ? Object.values(NORM_TYPE) : (await getNormList()).targets);

  if (normList.includes(NORM_TYPE.commitlint) && !existsGitConfigSync()) {
    failSpinner('init GIT or init in a GIT project!');
    return;
  }

  let projectType = PROJECT_TYPE.typescript;
  if (normList.includes(NORM_TYPE.eslint) || normList.includes(NORM_TYPE.tsconfig)) {
    projectType = type || (notInteraction ? PROJECT_TYPE.typescript : await getProjectType());
  }

  const initFlow = new InitFlow({ npm });

  initFlow.pipeline({ normList, projectType });

  succeedSpinner(`${chalk.blue('Lough Lint:')} ${chalk.green('succeed')}`);
};

export default {
  command: 'init',
  description: 'init project lint function.',
  action
};
