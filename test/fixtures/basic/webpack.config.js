import path from 'path'
import WebpackBar from '../../../src/webpackbar'

const makeConfig = (options) => {
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
  }
}

const config = makeConfig()
config.from = makeConfig

export default config
