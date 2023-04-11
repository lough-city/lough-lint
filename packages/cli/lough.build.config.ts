import { defineConfig } from '@lough/build-cli';

export default defineConfig({
  external: ['@lough/npm-operate', 'chalk', 'commander', 'execa', 'inquirer', 'ora'],
  style: false,
  input: 'src/index.ts'
});
