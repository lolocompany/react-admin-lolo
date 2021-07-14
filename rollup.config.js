import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from "@rollup/plugin-commonjs"
import replace from '@rollup/plugin-replace'
import css from "rollup-plugin-import-css"
import external from 'rollup-plugin-peer-deps-external'
import del from 'rollup-plugin-delete'
import pkg from './package.json'

const externalDeps = [
  ...Object.keys(pkg.peerDependencies || {}),
]

const makeExternalPredicate = externalArr => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
  return id => pattern.test(id)
}


const CODES = [
  'THIS_IS_UNDEFINED',
  'MISSING_GLOBAL_NAME',
  'CIRCULAR_DEPENDENCY',
  'UNRESOLVED_IMPORT'
]

const discardWarning = warning => {
  if (CODES.includes(warning.code)) {
    return
  }
  console.error(warning)
}

export default {
  input: pkg.source,
  output: [
    {
      dir: `${pkg.outDir}/cjs`,
      format: 'cjs',
      sourcemap: true
    },
    {
      dir: `${pkg.outDir}/esm`,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    external(),
    commonjs({ 
      include: /node_modules/
    }),
    babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    nodeResolve({
      preferBuiltins: false,
      browser: true,
    }),
    css(),
    json(),
    del({ targets: ['dist/*'] }),
  ],
  external: makeExternalPredicate(externalDeps),
  onwarn: discardWarning
}