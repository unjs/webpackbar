import prettyTime from 'pretty-time';
import Consola from 'consola';

const consola = Consola.withTag('webpackbar');

export default class LogReporter {
  compiling(context) {
    consola.info(`Compiling ${context.options.name}`);
  }

  compiled(context) {
    const time = prettyTime(context.state.elapsed, 2);
    consola.success(`Compiled ${context.options.name} in ${time}`);
  }
}
