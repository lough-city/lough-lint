# @lough/eslint-config

> Eslint extends configuration.

## Install

```bash
npm i @lough/eslint-config -D
```

or

```bash
yarn add @lough/eslint-config -D
```

## Usage

> 以下为手动安装步骤，自动安装可使用 [Cli](https://github.com/lough-city/lough-lint/tree/main/packages/cli)

- 新建 `.eslintrc.js` 文件，用于配置 `eslint` 检测

> 支持: `typescript`, `react`, `node`, `base`

```js
module.exports = {
  extends: ['@lough/eslint-config/react']
}
```

- 新建 `.eslintignore` 文件，用于屏蔽 `eslint` 检测

```ignore
node_modules
build
dist
```

- 打开 `package.json` 文件，添加 `scripts`

```js
{
  "scripts": {
    "lint:es": "eslint -c .eslintrc.js --ext .ts,.tsx ./",
    "lint:es-fix": "eslint --fix -c .eslintrc.js --ext .ts,.tsx ./"
  }
}
```
