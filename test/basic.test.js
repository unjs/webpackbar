import util from 'util';
import webpack from 'webpack';
import basicConfig from './fixtures/basic/webpack.config';

const logUpdateMethods = ['render', 'clear', 'done'];

const mockLogUpdate = () => {
  const m = jest.fn();
  logUpdateMethods.forEach((k) => {
    m[k] = jest.fn;
  });
  return m;
};

describe('webpackbar', () => {
  const logUpdate = mockLogUpdate();

  test('compile', async () => {
    const compiler = webpack(basicConfig({
      name: 'test1',
      logUpdate,
    }));

    const run = util.promisify(compiler.run);
    const stats = await run.call(compiler);

    expect(stats.hasErrors()).toBe(false);
    expect(stats.hasWarnings()).toBe(false);
  });

  test('logUpdate', () => {
    expect(logUpdate).toMatchSnapshot();
  });

  for (const method of logUpdateMethods) {
    test(`logUpdate.${method}`, () => {
      expect(logUpdate[method]).toMatchSnapshot();
    });
  }
});
