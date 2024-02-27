import { defineConfig } from '@lough/build-cli';

export default defineConfig({
  external: ['@lough/npm-operate', '@logically/coding-model', 'chalk', 'commander', 'execa', 'inquirer', 'ora'],
  style: false,
  input: ['src/index.ts', 'src/bin.ts', 'src/commands']
});
