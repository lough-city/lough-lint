import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { LifeCycle } from '@logically/coding-model';
import { IPackage, Package } from '@lough/npm-operate';
import execa from 'execa';
import { dependenciesMap } from '../../constants/dependencies';
import { copyFileSync, removeDirOrFileSync } from '../../utils/file';
import { NORM_TYPE, TECH_TYPE } from './const';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __templateDir = '../../templates/';

/**
 * 初始化流生命周期
 */
export interface InitFlowLifeCycle {
  /**
   * eslint 开始
   */
  eslintStart: () => any;
  /**
   * eslint 结束
   */
  eslintEnd: () => any;
  /**
   * tsconfig 开始
   */
  tsconfigStart: () => any;
  /**
   * tsconfig 结束
   */
  tsconfigEnd: () => any;
  /**
   * stylelint 开始
   */
  stylelintStart: () => any;
  /**
   * stylelint 结束
   */
  stylelintEnd: () => any;
  /**
   * commitlint 开始
   */
  commitlintStart: () => any;
  /**
   * commitlint 结束
   */
  commitlintEnd: () => any;
  /**
   * editor 开始
   */
  editorStart: () => any;
  /**
   * editor 结束
   */
  editorEnd: () => any;
  /**
   * prettier 开始
   */
  prettierStart: () => any;
  /**
   * prettier 结束
   */
  prettierEnd: () => any;
}

/**
 * 初始化流参数
 */
export interface InitFlowParameters {
  /**
   * 技术类型
   */
  techType: TECH_TYPE;
  /**
   * 生命周期
   */
  cycle?: InitFlowLifeCycle;
  /**
   * 包
   */
  npm?: Package;
}

/**
 * 初始化流
 */
export class InitFlow {
  private options: InitFlowParameters;

  private cycle = new LifeCycle<InitFlowLifeCycle>();

  private npm: Package;

  constructor(parameters: InitFlowParameters) {
    const { cycle, npm, ..._parameters } = parameters;

    if (cycle) this.cycle.on(cycle);

    this.options = _parameters;

    this.npm = npm || new Package();
  }

  /**
   * 代码
   */
  eslint() {
    const packageName = '@lough/eslint-config';

    const packageDeps = dependenciesMap[packageName];

    this.cycle.emit('eslintStart');

    // 检测并移除当前项目相关依赖
    this.npm.uninstall([packageName, ...packageDeps]);

    // 安装依赖
    this.npm.installDev(`${packageName}@latest`);

    // 删除 .eslintrc.json
    if (existsSync(`${process.cwd()}/.eslintrc.json`)) removeDirOrFileSync(`${process.cwd()}/.eslintrc.json`);

    // .eslintrc.js
    copyFileSync(join(__dirname, __templateDir, '.eslintrc.js'), `${process.cwd()}/.eslintrc.js`, v =>
      v.replace('{{type}}', this.options.techType)
    );

    // .eslintignore
    copyFileSync(join(__dirname, __templateDir, '.eslintignore'), `${process.cwd()}/.eslintignore`);

    const config = this.npm.readConfig();

    // 添加 lint scripts
    if (!config.scripts) config.scripts = {};
    config.scripts['lint:es'] = 'eslint -c .eslintrc.js --ext .ts,.tsx ./';
    config.scripts['lint:es-fix'] = 'eslint --fix -c .eslintrc.js --ext .ts,.tsx ./';

    this.npm.writeConfig(config);

    this.cycle.emit('eslintEnd');
  }

  /**
   * 类型
   */
  tsconfig() {
    const packageName = '@lough/tsconfig';

    this.cycle.emit('tsconfigStart');

    // 安装依赖
    this.npm.installDev(['typescript@5.1.6', `${packageName}@latest`]);

    // tsconfig.json
    if (existsSync(`${process.cwd()}/tsconfig.json`)) {
      copyFileSync(`${process.cwd()}/tsconfig.json`, `${process.cwd()}/tsconfig.json`, v =>
        v.replace(
          '{',
          `{
  "extends": "@lough/tsconfig/${this.options.techType}",`
        )
      );
    } else {
      copyFileSync(join(__dirname, __templateDir, 'tsconfig.json'), `${process.cwd()}/tsconfig.json`, v =>
        v.replace('{{type}}', this.options.techType)
      );
    }

    this.cycle.emit('tsconfigEnd');
  }

  /**
   * 样式
   */
  stylelint() {
    const packageName = '@lough/stylelint-config';

    const packageDeps = dependenciesMap[packageName];

    this.cycle.emit('stylelintStart');

    // 检测并移除当前项目相关依赖
    this.npm.uninstall([packageName, ...packageDeps]);

    // 安装依赖
    this.npm.installDev(`${packageName}@latest`);

    // .stylelintrc.js
    copyFileSync(join(__dirname, __templateDir, '.stylelintrc.js'), `${process.cwd()}/.stylelintrc.js`);

    // .stylelintignore
    copyFileSync(join(__dirname, __templateDir, '.stylelintignore'), `${process.cwd()}/.stylelintignore`);

    const config = this.npm.readConfig();

    // 添加 lint scripts
    if (!config.scripts) config.scripts = {};
    config.scripts['lint:style'] = 'stylelint --config .stylelintrc.js ./**/*.{css,less,scss,styl}';
    config.scripts['lint:style-fix'] = 'stylelint --fix --config .stylelintrc.js ./**/*.{css,less,scss,styl}';

    this.npm.writeConfig(config);

    this.cycle.emit('stylelintEnd');
  }

  /**
   * 提交
   */
  commitlint() {
    const packageName = '@lough/commitlint-config';

    const packageDeps = dependenciesMap[packageName];

    this.cycle.emit('commitlintStart');

    /* init commitlint config START */

    // .gitattributes
    copyFileSync(join(__dirname, __templateDir, '.gitattributes'), `${process.cwd()}/.gitattributes`);
    // .gitignore
    if (!existsSync(`${process.cwd()}/.gitignore`))
      copyFileSync(join(__dirname, __templateDir, '.gitignore.temp'), `${process.cwd()}/.gitignore`);

    // 检测并移除当前项目相关依赖
    this.npm.uninstall([packageName, ...packageDeps]);

    // 安装依赖
    this.npm.installDev(`${packageName}@latest`);

    // .commitlintrc.js
    copyFileSync(join(__dirname, __templateDir, '.commitlintrc.js'), `${process.cwd()}/.commitlintrc.js`);

    /* init commitlint config END */

    /* init git commit hooks START */

    // 安装 git commit hooks
    this.npm.installDev(['husky@7.0.2', 'lint-staged@11.1.2']);

    const config = this.npm.readConfig();

    // 添加 npm install 时，husky 初始化机制
    if (!config.scripts) config.scripts = {};
    config.scripts.prepare = 'husky install';

    // 添加 git commit hooks 配置
    config['lint-staged' as keyof IPackage] = {
      '*.{ts,tsx}': ['eslint -c .eslintrc.js --ext .ts,.tsx'],
      '*.{css,less,scss,styl}': ['stylelint --config .stylelintrc.js *.{css,less,scss,styl}']
    };

    this.npm.writeConfig(config);

    // 初始化
    execa.commandSync(`npx husky install`);

    // 添加 pre commit hooks
    copyFileSync(join(__dirname, __templateDir, 'pre-commit'), `${process.cwd()}/.husky/pre-commit`);

    // 添加 commit msg hooks
    copyFileSync(join(__dirname, __templateDir, 'commit-msg'), `${process.cwd()}/.husky/commit-msg`);

    /* init git commit hooks END */

    this.cycle.emit('commitlintEnd');
  }

  /**
   * 编辑器
   */
  editor() {
    this.cycle.emit('editorStart');

    const vscodeConfigPath = `${process.cwd()}/.vscode`;
    if (!existsSync(vscodeConfigPath)) mkdirSync(vscodeConfigPath);

    // settings.json
    copyFileSync(join(__dirname, __templateDir, 'settings.json'), `${vscodeConfigPath}/settings.json`);

    // extensions.json
    copyFileSync(join(__dirname, __templateDir, 'extensions.json'), `${vscodeConfigPath}/extensions.json`);

    // .editorconfig
    copyFileSync(join(__dirname, __templateDir, '.editorconfig'), `${process.cwd()}/.editorconfig`);

    this.cycle.emit('editorEnd');
  }

  /**
   * 格式化
   */
  prettier() {
    this.cycle.emit('prettierStart');

    // 安装依赖 lock
    this.npm.installDev('prettier@2.8.4');

    // .prettierrc.js
    copyFileSync(join(__dirname, __templateDir, '.prettierrc.js'), `${process.cwd()}/.prettierrc.js`);

    // .prettierignore
    copyFileSync(join(__dirname, __templateDir, '.prettierignore'), `${process.cwd()}/.prettierignore`);

    this.cycle.emit('prettierEnd');
  }

  /**
   * 流水线
   */
  pipeline(params: { normList: Array<NORM_TYPE> }) {
    if (params.normList.includes(NORM_TYPE.commitlint)) this.commitlint();
    if (params.normList.includes(NORM_TYPE.tsconfig)) this.tsconfig();
    if (params.normList.includes(NORM_TYPE.eslint)) this.eslint();
    if (params.normList.includes(NORM_TYPE.stylelint)) this.stylelint();
    if (params.normList.includes(NORM_TYPE.eslint) && params.normList.includes(NORM_TYPE.stylelint)) {
      const config = this.npm.readConfig();

      // 添加 lint scripts
      if (!config.scripts) config.scripts = {};
      config.scripts['lint'] = 'npm run lint:es && npm run lint:style';
      config.scripts['lint-fix'] = 'npm run lint:es-fix && npm run lint:style-fix';

      this.npm.writeConfig(config);
    }
    if (params.normList.includes(NORM_TYPE.prettier)) this.prettier();
    if (params.normList.includes(NORM_TYPE.editor)) this.editor();
  }
}

export * from './const';
