import prettyTime from 'pretty-time';

import { consola } from '../utils/cli';

export default class SimpleReporter {
  beforeRun(context) {
    consola.info(`Compiling ${context.name}`);
  }

  done(context) {
    const { hasError } = context.state;
    consola[hasError ? 'error' : 'success'](
      `${context.name} ${context.state.message}`
    );
  }
}
