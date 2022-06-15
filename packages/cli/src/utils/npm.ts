import fs from 'fs'
import execa from 'execa'

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

    execa.commandSync(`npm uninstall ${packageName}`, { stdio: 'inherit' })
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
