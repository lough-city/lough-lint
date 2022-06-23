import fs from 'fs'
import execa from 'execa'
import { PACKAGE_MANAGE_TOOL } from '../constants/npm'
import lough from '../config/lough'

/**
 * NPM 配置路径
 */
export const npmConfigPath = `${process.cwd()}/package.json`

/**
 * 是否存在 NPM 配置
 * @description 借此判断 NPM 是否初始化
 */
export const existsNpmConfigSync = () => fs.existsSync(npmConfigPath)

/**
 * 获取安装 NPM 开发包命令
 * @param packageName 待安装包
 */
const getNpmInstallDevDepCommand = (packageName: string) => {
  if (lough.packageManageTool === PACKAGE_MANAGE_TOOL.yarn) {
    if (lough.isMorePackage) return `yarn add ${packageName} -WD`
    return `yarn add ${packageName} -D`
  }

  return `npm install ${packageName} -D`
}

/**
 * 获取卸载 NPM 开发包命令
 * @param packageName 待卸载包
 */
const getNpmUnInstallDevDepCommand = (packageName: string) => {
  if (lough.packageManageTool === PACKAGE_MANAGE_TOOL.yarn) {
    if (lough.isMorePackage) return `yarn remove ${packageName} -WD`
    return `yarn remove ${packageName} -D`
  }

  return `npm uninstall ${packageName} -D`
}

/**
 * 添加 NPM 开发包
 * @param packages 待添加包
 */
export const addNpmDevDep = (packages: string | Array<string>) => {
  if (!Array.isArray(packages)) packages = [packages]

  for (const packageName of packages) {
    execa.commandSync(getNpmInstallDevDepCommand(packageName), { stdio: 'inherit' })
  }
}

/**
 * 添加 NPM 生成包
 * @param packages 待添加包
 */
export const addNpmDep = (packages: string | Array<string>) => {
  if (!Array.isArray(packages)) packages = [packages]

  for (const packageName of packages) {
    execa.commandSync(getNpmInstallDevDepCommand(packageName), { stdio: 'inherit' })
  }
}

/**
 * 删除 NPM 包
 * @param packages 待移除包
 */
export const removeNpmDepSync = (packages: string | Array<string>) => {
  if (!Array.isArray(packages)) packages = [packages]

  const npmConfigText = fs.readFileSync(npmConfigPath, 'utf-8')
  const npmConfig = JSON.parse(npmConfigText)
  let dependencies = []

  if (npmConfig.hasOwnProperty('dependencies')) {
    dependencies = dependencies.concat(Object.keys(npmConfig.dependencies))
  }

  if (npmConfig.hasOwnProperty('devDependencies')) {
    dependencies = dependencies.concat(Object.keys(npmConfig.devDependencies))
  }

  for (const packageName of packages) {
    if (!dependencies.includes(packageName)) continue

    execa.commandSync(getNpmUnInstallDevDepCommand(packageName), { stdio: 'inherit' })
  }
}

/**
 * 读取 NPM 配置
 */
export const readNpmConfigSync = () => {
  const npmConfigText = fs.readFileSync(npmConfigPath, 'utf-8')
  const npmConfig = JSON.parse(npmConfigText)

  return npmConfig
}

/**
 * 写入 NPM 配置
 * @param data 待写入数据
 */
export const writePackageJSONSync = <T extends Record<string, any>>(data: T) => {
  fs.writeFileSync(npmConfigPath, JSON.stringify(data, null, 2), 'utf8')
}

/**
 * 获取包管理工具
 */
export const getPackageManageTool = () => {
  return fs.existsSync(`${process.cwd()}/package-lock.json`)
    ? 'npm'
    : fs.existsSync(`${process.cwd()}/yarn.lock`)
    ? 'yarn'
    : undefined
}
