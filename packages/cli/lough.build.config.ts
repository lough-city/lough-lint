import { defineConfig } from '@lough/build-cli';

export default defineConfig({
  external: ['chalk' ,'commander' ,'execa' ,'inquirer' ,'ora'],
  globals: {},
  style: false,
  input: 'src/index.ts'
});
