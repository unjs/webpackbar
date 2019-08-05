import path from 'path'

import webpack from 'webpack'

import Self from '../../../src'

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
    plugins: [new webpack.NamedModulesPlugin(), new Self(options)]
  }
}

const config = makeConfig()
config.from = makeConfig

export default config
