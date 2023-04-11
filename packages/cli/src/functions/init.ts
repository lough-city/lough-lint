import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { IPackage, Package } from '@lough/npm-operate';
import chalk from 'chalk';
import execa from 'execa';
import { dependenciesMap } from '../constants/dependencies';
import { copyFileSync, removeDirOrFileSync } from '../utils/file';
import { startLoadingSpinner, succeedLoadingSpinner } from '../utils/spinner';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface IFlowParameters {
  npm: Package;
  /**
   * 信息反馈
   * @default true
   */
  messageFeedback?: boolean;
}

export enum NORM_TYPE {
  tsconfig = 'tsconfig',
  eslint = 'eslint',
  stylelint = 'stylelint',
  commitlint = 'commitlint',
  prettier = 'prettier',
  editor = 'editor'
}

export enum PROJECT_TYPE {
  typescript = 'typescript',
  react = 'react',
  node = 'node'
}

/**
 * 初始化流
 */
export class InitFlow {
  private options: IFlowParameters;

  constructor(parameters: IFlowParameters) {
    this.options = { messageFeedback: true, ...parameters };
  }

  private get spinner() {
    return {
      start: this.options.messageFeedback ? startLoadingSpinner : () => undefined,
      succeed: this.options.messageFeedback ? succeedLoadingSpinner : () => undefined
    };
  }

  eslint(projectType: PROJECT_TYPE) {
    const packageName = '@lough/eslint-config';

    const packageDeps = dependenciesMap[packageName];

    this.spinner.start('eslint: 初始化开始 ');

    // 检测并移除当前项目相关依赖
    this.options.npm.uninstall([packageName, ...packageDeps]);

    // 安装依赖
    this.options.npm.installDev(`${packageName}@latest`);

    // 删除 .eslintrc.json
    if (existsSync(`${process.cwd()}/.eslintrc.json`)) removeDirOrFileSync(`${process.cwd()}/.eslintrc.json`);

    // .eslintrc.js
    copyFileSync(join(__dirname, '../templates/.eslintrc.js'), `${process.cwd()}/.eslintrc.js`, v =>
      v.replace('{{type}}', projectType)
    );

    // .eslintignore
    copyFileSync(join(__dirname, '../templates/.eslintignore'), `${process.cwd()}/.eslintignore`);

    const config = this.options.npm.readConfig();

    // 添加 lint scripts
    if (!config.scripts) config.scripts = {};
    config.scripts['lint:es'] = 'eslint -c .eslintrc.js --ext .ts,.tsx ./';
    config.scripts['lint:es-fix'] = 'eslint --fix -c .eslintrc.js --ext .ts,.tsx ./';

    this.options.npm.writeConfig(config);

    this.spinner.succeed(chalk.green('eslint: 初始化成功!'));
  }

  tsconfig(projectType: PROJECT_TYPE) {
    const packageName = '@lough/tsconfig';

    this.spinner.start('tsconfig: 初始化开始 ');

    // 安装依赖
    this.options.npm.installDev(['typescript@latest', `${packageName}@latest`]);

    // tsconfig.json
    if (existsSync(`${process.cwd()}/tsconfig.json`)) {
      copyFileSync(`${process.cwd()}/tsconfig.json`, `${process.cwd()}/tsconfig.json`, v =>
        v.replace(
          '{',
          `{
  "extends": "@lough/tsconfig/${projectType}",`
        )
      );
    } else {
      copyFileSync(join(__dirname, '../templates/tsconfig.json'), `${process.cwd()}/tsconfig.json`, v =>
        v.replace('{{type}}', projectType)
      );
    }

    this.spinner.succeed(chalk.green('tsconfig: 初始化成功!'));
  }

  stylelint() {
    const packageName = '@lough/stylelint-config';

    const packageDeps = dependenciesMap[packageName];

    this.spinner.start('stylelint: 初始化开始 ');

    // 检测并移除当前项目相关依赖
    this.options.npm.uninstall([packageName, ...packageDeps]);

    // 安装依赖
    this.options.npm.installDev(`${packageName}@latest`);

    // .stylelintrc.js
    copyFileSync(join(__dirname, '../templates/.stylelintrc.js'), `${process.cwd()}/.stylelintrc.js`);

    // .stylelintignore
    copyFileSync(join(__dirname, '../templates/.stylelintignore'), `${process.cwd()}/.stylelintignore`);

    const config = this.options.npm.readConfig();

    // 添加 lint scripts
    if (!config.scripts) config.scripts = {};
    config.scripts['lint:style'] = 'stylelint --config .stylelintrc.js ./**/*.{css,less,scss,styl}';
    config.scripts['lint:style-fix'] = 'stylelint --fix --config .stylelintrc.js ./**/*.{css,less,scss,styl}';

    this.options.npm.writeConfig(config);

    this.spinner.succeed(chalk.green('stylelint: 初始化成功!'));
  }

  commitlint() {
    const packageName = '@lough/commitlint-config';

    const packageDeps = dependenciesMap[packageName];

    this.spinner.start('commitlint: 初始化开始 ');

    /* init commitlint config START */

    // 检测并移除当前项目相关依赖
    this.options.npm.uninstall([packageName, ...packageDeps]);

    // 安装依赖
    this.options.npm.installDev(`${packageName}@latest`);

    // .commitlintrc.js
    copyFileSync(join(__dirname, '../templates/.commitlintrc.js'), `${process.cwd()}/.commitlintrc.js`);
    // .gitattributes
    copyFileSync(join(__dirname, '../templates/.gitattributes'), `${process.cwd()}/.gitattributes`);
    // .gitignore
    if (!existsSync(`${process.cwd()}/.gitignore`))
      copyFileSync(join(__dirname, '../templates/.gitignore'), `${process.cwd()}/.gitignore`);

    /* init commitlint config END */

    /* init git commit hooks START */

    // 安装 git commit hooks
    this.options.npm.installDev(['husky@7.0.2', 'lint-staged@11.1.2']);

    const config = this.options.npm.readConfig();

    // 添加 npm install 时，husky 初始化机制
    if (!config.scripts) config.scripts = {};
    config.scripts.prepare = 'husky install';

    // 添加 git commit hooks 配置
    config['lint-staged' as keyof IPackage] = {
      '*.{ts,tsx}': ['eslint -c .eslintrc.js --ext .ts,.tsx'],
      '*.{css,less,scss,styl}': ['stylelint --config .stylelintrc.js *.{css,less,scss,styl}']
    };

    this.options.npm.writeConfig(config);

    // 初始化
    execa.commandSync(`npx husky install`);

    // 添加 pre commit hooks
    copyFileSync(join(__dirname, '../templates/pre-commit'), `${process.cwd()}/.husky/pre-commit`);

    // 添加 commit msg hooks
    copyFileSync(join(__dirname, '../templates/commit-msg'), `${process.cwd()}/.husky/commit-msg`);

    /* init git commit hooks END */

    this.spinner.succeed(chalk.green('commitlint: 初始化成功!'));
  }

  editor() {
    this.spinner.start('editor: 初始化开始 ');

    const vscodeConfigPath = `${process.cwd()}/.vscode`;
    if (!existsSync(vscodeConfigPath)) mkdirSync(vscodeConfigPath);

    // settings.json
    copyFileSync(join(__dirname, '../templates/settings.json'), `${vscodeConfigPath}/settings.json`);

    // extensions.json
    copyFileSync(join(__dirname, '../templates/extensions.json'), `${vscodeConfigPath}/extensions.json`);

    // .editorconfig
    copyFileSync(join(__dirname, '../templates/.editorconfig'), `${process.cwd()}/.editorconfig`);

    this.spinner.succeed(chalk.green('editor: 初始化成功!'));
  }

  prettier() {
    this.spinner.start('prettier: 初始化开始 ');

    // 安装依赖
    this.options.npm.installDev('prettier@latest');

    // .prettierrc.js
    copyFileSync(join(__dirname, '../templates/.prettierrc.js'), `${process.cwd()}/.prettierrc.js`);

    // .prettierignore
    copyFileSync(join(__dirname, '../templates/.prettierignore'), `${process.cwd()}/.prettierignore`);

    this.spinner.succeed(chalk.green('prettier: 初始化成功!'));
  }

  pipeline(params: { normList: Array<NORM_TYPE>; projectType: PROJECT_TYPE }) {
    if (params.normList.includes(NORM_TYPE.tsconfig)) this.tsconfig(params.projectType!);
    if (params.normList.includes(NORM_TYPE.eslint)) this.eslint(params.projectType!);
    if (params.normList.includes(NORM_TYPE.stylelint)) this.stylelint();
    if (params.normList.includes(NORM_TYPE.eslint) && params.normList.includes(NORM_TYPE.stylelint)) {
      const config = this.options.npm.readConfig();

      // 添加 lint scripts
      if (!config.scripts) config.scripts = {};
      config.scripts['lint'] = 'npm run lint:es && npm run lint:style';
      config.scripts['lint-fix'] = 'npm run lint:es-fix && npm run lint:style-fix';

      this.options.npm.writeConfig(config);
    }
    if (params.normList.includes(NORM_TYPE.commitlint)) this.commitlint();
    if (params.normList.includes(NORM_TYPE.prettier)) this.prettier();
    if (params.normList.includes(NORM_TYPE.editor)) this.editor();
  }
}
