import { readdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const packagesPath = join(__dirname, '../../')

const files = readdirSync(packagesPath)

const packageNameList = files.filter(name => name !== 'cli')

const dependenciesMap = {}

for (const name of packageNameList) {
  const packageNpmConfigPath = join(packagesPath, name, 'package.json')
  if (!existsSync(packageNpmConfigPath)) continue
  const npmConfigText = readFileSync(packageNpmConfigPath, 'utf-8')
  const npmConfig = JSON.parse(npmConfigText)
  if (!npmConfig.dependencies) npmConfig.dependencies = {}

  const depList = Object.keys(npmConfig.dependencies)
  dependenciesMap[npmConfig.name] = depList
}

writeFileSync(
  join(__dirname, '../src/constants/dependencies.ts'),
  `export const dependenciesMap:Record<${Object.keys(dependenciesMap)
    .map(name => `'${name}'`)
    .join(' | ')}, Array<string>> = ${JSON.stringify(dependenciesMap)}`,
  'utf8'
)
