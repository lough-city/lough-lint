const fs = require('fs')
const path = require('path')

const packagesPath = path.join(__dirname, '../../')

const files = fs.readdirSync(packagesPath)

const packageNameList = files.filter(name => name !== 'cli')

const dependenciesMap = {}

for (const name of packageNameList) {
  const packageNpmConfigPath = path.join(packagesPath, name, 'package.json')
  if (!fs.existsSync(packageNpmConfigPath)) continue
  const npmConfigText = fs.readFileSync(packageNpmConfigPath, 'utf-8')
  const npmConfig = JSON.parse(npmConfigText)
  if (!npmConfig.dependencies) npmConfig.dependencies = {}

  const depList = Object.keys(npmConfig.dependencies)
  dependenciesMap[npmConfig.name] = depList
}

fs.writeFileSync(
  path.join(__dirname, '../src/constants/dependencies.ts'),
  `export const dependenciesMap:Record<${Object.keys(dependenciesMap)
    .map(name => `'${name}'`)
    .join(' | ')}, Array<string>> = ${JSON.stringify(dependenciesMap)}`,
  'utf8'
)
