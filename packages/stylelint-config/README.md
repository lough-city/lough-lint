# @lough/stylelint-config

> Stylelint extends configuration.

## Install

```bash
npm i @lough/stylelint-config -D
```

or

```bash
yarn add @lough/stylelint-config -D
```

## Usage

> 以下为手动安装步骤，自动安装可使用 [Cli](https://github.com/AnCIity/lough-lint/tree/main/packages/cli)

- 新建 `.stylelintrc.js` 文件，用于配置 `stylelint` 检测

```js
module.exports = {
  extends: ['@lough/stylelint-config/react']
}
```

- 新建 `.stylelintignore` 文件，用于屏蔽 `stylelint` 检测

```ignore
node_modules
build
dist

*.tsx
*.ts
```
