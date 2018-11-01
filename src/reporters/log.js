import prettyTime from 'pretty-time';
import Consola from 'consola';

const consola = Consola.withTag('webpackbar');

export default class LogReporter {
  compiling(plugin) {
    consola.info(`Compiling ${plugin.options.name}`);
  }

  compiled(plugin) {
    consola.success(
      `Compiled ${plugin.options.name} in ${prettyTime(plugin.state.time, 2)}`
    );
  }
}
