import prettyTime from 'pretty-time';

import { consola } from '../utils/cli';

export default class LogReporter {
  compiling(context) {
    consola.info(`Compiling ${context.options.name}`);
  }

  compiled(context) {
    const time = prettyTime(context.state.elapsed, 2);
    consola.success(`Compiled ${context.options.name} in ${time}`);
  }
}
