import prettyTime from 'pretty-time';

import { consola } from '../utils/cli';

export default class LogReporter {
  compiling(context) {
    consola.info(`Compiling ${context.name}`);
  }

  compiled(context) {
    const time = prettyTime(context.state.elapsed, 2);
    consola.success(`Compiled ${context.name} in ${time}`);
  }
}
