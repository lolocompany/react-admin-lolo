import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-import-css';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import pkg from './package.json';

const CODES = [
  'THIS_IS_UNDEFINED',
  'MISSING_GLOBAL_NAME',
  'CIRCULAR_DEPENDENCY',
  'UNRESOLVED_IMPORT',
  'UNUSED_EXTERNAL_IMPORT',
];

const discardWarning = warning => {
  if (CODES.includes(warning.code)) {
    return;
  }
  console.error(warning);
};

export default {
  input: pkg.source,
  output: [
    {
      dir: `${pkg.outDir}/cjs`,
      format: 'cjs',
      sourcemap: true,
    },
    {
      dir: `${pkg.outDir}/esm`,
      format: 'es',
      sourcemap: true,
    },
  ],
  watch: {
    include: 'src/**',
    exclude: ['node_modules/**'],
    buildDelay: 200,
  },
  plugins: [
    external(),
    babel({ exclude: 'node_modules/**', babelHelpers: 'runtime' }),
    commonjs({
      include: /node_modules/,
    }),
    nodeResolve({
      preferBuiltins: false,
      browser: true,
    }),
    css(),
    json(),
    del({ targets: ['dist/*'] }),
  ],
  external: [...Object.keys(pkg.peerDependencies || {}), '@babel/runtime'],
  onwarn: discardWarning,
};
