import { readdirSync, mkdirSync, copyFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const files = readdirSync(join(__dirname, '../src/templates'))

mkdirSync(join(__dirname, '../es/templates'))

for (f of files) {
  copyFileSync(join(__dirname, '../src/templates/') + f, join(__dirname, '../es/templates/') + f)
}

console.log('打包成功！')
