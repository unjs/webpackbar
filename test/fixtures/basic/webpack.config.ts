import path from 'path'
import type { Configuration } from 'webpack'

const WebpackBar = require('../../../index.cjs')

export function getConfig (options: any) {
  return {
    mode: 'production',
    context: __dirname,
    devtool: 'source-map',
    entry: './index.js',
    output: {
      filename: './output.js',
      path: path.join(__dirname, '/dist')
    },
    plugins: [new WebpackBar(options)]
  } as Configuration
}
