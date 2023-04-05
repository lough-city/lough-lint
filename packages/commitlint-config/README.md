# @lough/commitlint-config

> Commitlint extends configuration.

## Install

```bash
npm i @lough/commitlint-config -D
```

or

```bash
yarn add @lough/commitlint-config -D
```

## Usage

> 以下为手动安装步骤，自动安装可使用 [Cli](https://github.com/lough-city/lough-lint/tree/main/packages/cli)

- 新建 `.commitlintrc.js` 文件，用于配置 `commitlint` 检测

```js
module.exports = {
  extends: ['@lough/commitlint-config']
}
```

- 安装 `git commit hooks`

```bash
npm install husky@7.0.2 lint-staged@11.1.2 -D
```

- 在 `package.json` 文件，添加 `npm prepare hooks`

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint -c .eslintrc.js --ext .ts,.tsx"],
    "*.{css,less,scss,styl}": ["stylelint --config .stylelintrc.js *.{css,less,scss,styl}"]
  }
}
```

- 初始化 `husky`

```bash
npx husky install
```

- 在 `.husky/pre-commit` 文件，添加 `git pre-commit hooks`

```bash
npx lint-staged
```

- 在 `.husky/commit-msg` 文件，添加 `git commit-msg hooks`

```bash
npx --no-install commitlint --config .commitlintrc.js --edit $1
```
