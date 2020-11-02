import webpack from 'webpack'

import { getConfig } from './fixtures/basic/webpack.config'

describe('webpackbar', () => {
  test('compile', async () => {
    const done = jest.fn()

    const compiler = webpack(
      getConfig({
        name: 'test1',
        minimal: false,
        profile: true,
        color: '#202020',
        reporter: {
          done
        }
      })
    )

    const run = require('util').promisify(compiler.run)
    const stats = await run.call(compiler)

    expect(stats.hasErrors()).toBe(false)
    expect(stats.hasWarnings()).toBe(false)
    expect(done).toHaveBeenCalledTimes(1)
  })
})
