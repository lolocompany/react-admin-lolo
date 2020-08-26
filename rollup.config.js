import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import css from 'rollup-plugin-css-only'

import packageJSON from "./package.json";
const input = "./src/index.js";

export default [
  // CommonJS
  {
    input,
    output: {
      file: packageJSON.main,
      format: "cjs"
    },
    plugins: [
      babel({
        exclude: "node_modules/**"
      }),
      commonjs(),
      css({ output: 'dist/bundle.css' })
    ]
  }
];
