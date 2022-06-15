#!/usr/bin/env node
import { program } from 'commander'
import { join } from 'path'
import { readFileSync } from 'fs'
import init from './commands/init'

function start() {
  const jsonPath = join(__dirname, '../package.json')
  const jsonContent = readFileSync(jsonPath, 'utf-8')
  const jsonResult = JSON.parse(jsonContent)
  program.version(jsonResult.version)

  program.command(init.command).description(init.description).action(init.action)

  program.parseAsync(process.argv)
}

start()
