import { defineConfig } from '@lough/build-cli';

export default defineConfig({
  external: ['@lough/npm-operate', '@logically/coding-model', 'chalk', 'commander', 'execa', 'inquirer', 'ora'],
  style: false,
  input: ['src/bin.ts', 'src/index.ts']
});
