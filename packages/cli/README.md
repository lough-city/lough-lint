# @lough/lint-cli

> This is a Lint tool docked in lough.

## Feature

> `JavaScript` 开发中的代码规范自动化搭建脚手架。

支持以下功能

- `eslint`: 校验 `Javascript` 代码

  > 安装 `VSCode` 插件 `ESLint`

  - `typescript`: 支持 `typescript` 开发校验

  - `react`: 支持 `react` 技术栈开发校验

  - `node`: 支持 `node` 开发校验

  - `base`: `javascript` 基础校验

- `stylelint`: 校验 `CSS` 代码

  > 安装 `VSCode` 插件 `Stylelint`

- `commitlint`: 利用 `Git` `hooks` 提交前校验代码

- `prettier`: 格式化代码

  > 安装 `VSCode` 插件 `Prettier - Code formatter`

- `editor`: 统一编辑器配置

  > 安装 `VSCode` 插件 `EditorConfig for VS Code`

## Install

```bash
npm i @lough/lint-cli -g
```

or

```bash
yarn add @lough/lint-cli -g
```

## Usage

```bash
lough-lint init
```

## CMD



### Command


```bash
lough-lint [options] [command]
```



init project lint function.



**options**:

- `"-tt, --techType [string]", "init tech type: typescript | react | node"`
- `"-n, --norms [string...]", "init lint norms: tsconfig | eslint | stylelint | commitlint | prettier | editor"`
- `"-q, --quite [boolean]", "execute the program silently.", false`



**action**: `(options: IOptions) => Promise<void>`



## API



### Class



#### InitFlow 初始化流

**parameters**

| 属性 | 说明 | 必传 | 类型 | 默认值 |
| ---- | ----- | ---- | -------- | ------ |
| parameters | - | 是 | `InitFlowParameters` | - |

**returns**: `InitFlow`


**members**

| 属性 | 说明 | 类型 | 标记 |
| ---- | ----- | -------- | -------- |
| eslint | 代码 | `() => void` |  |
| tsconfig | 类型 | `() => void` |  |
| stylelint | 样式 | `() => void` |  |
| commitlint | 提交 | `() => void` |  |
| editor | 编辑器 | `() => void` |  |
| prettier | 格式化 | `() => void` |  |
| pipeline | 流水线 | `(params: { normList: NORM_TYPE[]; }) => void` |  |



### Enum



#### NORM_TYPE 规范类型


**members**

| 属性 | 说明 | 值 |
| ---- | ---- | ------- |
| tsconfig | 类型 | `'tsconfig'` |
| eslint | 代码 | `'eslint'` |
| stylelint | 样式 | `'stylelint'` |
| commitlint | 提交 | `'commitlint'` |
| prettier | 格式化 | `'prettier'` |
| editor | 编辑器 | `'editor'` |



#### TECH_TYPE 技术类型


**members**

| 属性 | 说明 | 值 |
| ---- | ---- | ------- |
| typescript | TypeScript | `'typescript'` |
| react | React | `'react'` |
| node | Node | `'node'` |



### Interface



#### InitFlowLifeCycle 初始化流生命周期


**members**

| 属性 | 说明 | 类型 |
| ---- | ---- | ------- |
| eslintStart | eslint 开始 | `() => any` |
| eslintEnd | eslint 结束 | `() => any` |
| tsconfigStart | tsconfig 开始 | `() => any` |
| tsconfigEnd | tsconfig 结束 | `() => any` |
| stylelintStart | stylelint 开始 | `() => any` |
| stylelintEnd | stylelint 结束 | `() => any` |
| commitlintStart | commitlint 开始 | `() => any` |
| commitlintEnd | commitlint 结束 | `() => any` |
| editorStart | editor 开始 | `() => any` |
| editorEnd | editor 结束 | `() => any` |
| prettierStart | prettier 开始 | `() => any` |
| prettierEnd | prettier 结束 | `() => any` |



#### InitFlowParameters 初始化流参数


**members**

| 属性 | 说明 | 类型 |
| ---- | ---- | ------- |
| techType | 技术类型 | `TECH_TYPE` |
| cycle | 生命周期 | `InitFlowLifeCycle` |
| npm | 包 | `Package` |


