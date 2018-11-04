import { consola } from '../utils/cli';

export default class SimpleReporter {
  beforeRun(context) {
    consola.info(`Compiling ${context.state.name}`);
  }

  done(context) {
    const { hasError, message, name } = context.state;
    consola[hasError ? 'error' : 'success'](`${name}: ${message}`);
  }
}