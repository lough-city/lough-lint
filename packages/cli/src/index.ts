#!/usr/bin/env node
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Package } from '@lough/npm-operate';
import { program } from 'commander';
import init from './commands/init';
import { PROJECT_TYPE, NORM_TYPE } from './functions/init';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function start() {
  const npm = new Package({ dirName: join(__dirname, '..') });
  program.version(npm.version);

  program
    .command(init.command)
    .description(init.description)
    .action(init.action)
    .option('-t, --type [string]', `init project type: ${Object.keys(PROJECT_TYPE).join(' | ')}`)
    .option('-n, --norms [string...]', `init lint norms: ${Object.keys(NORM_TYPE).join(' ')}`)
    .option('-ni, --notInteraction [boolean]', 'whether not interaction', false);

  program.parseAsync(process.argv);
}

start();
