import util from 'util';
import webpack from 'webpack';
import basicConfig from './fixtures/basic/webpack.config';

const logUpdateMethods = ['clear'];

const mockLogUpdate = () => {
  const m = jest.fn();
  logUpdateMethods.forEach((k) => {
    m[k] = jest.fn();
  });
  return m;
};

describe('webpackbar', () => {
  const logUpdate = mockLogUpdate();

  test('compile', async () => {
    const compiler = webpack(basicConfig.from({
      name: 'test1',
      profile: true,
      color: '#202020',
      logUpdate,
    }));

    const run = util.promisify(compiler.run);
    const stats = await run.call(compiler);

    expect(stats.hasErrors()).toBe(false);
    expect(stats.hasWarnings()).toBe(false);
  });

  test('logUpdate', () => {
    expect(logUpdate).toBeCalled();
  });

  for (const method of logUpdateMethods) {
    test(`logUpdate.${method}`, () => {
      expect(logUpdate[method]).toBeCalled();
    });
  }
});
