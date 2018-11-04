export default class StatsReporter {
  constructor(options) {
    this.options = options;
  }

  done(context, { stats }) {
    process.stderr.write('\n' + stats.toString() + '\n');
  }
}
