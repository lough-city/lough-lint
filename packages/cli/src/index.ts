#!/usr/bin/env node
import { program } from 'commander'
import { dirname, join } from 'path'
import init from './commands/init'
import { fileURLToPath } from 'url';
import { Package } from '@lough/npm-operate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function start() {
  const npm = new Package({ dirName: join(__dirname, '..') });
  program.version(npm.version);

  program.command(init.command).description(init.description).action(init.action)

  program.parseAsync(process.argv)
}

start()
