export default class StatsReporter {
  constructor(options) {
    this.options = options;
  }

  done(_, { stats }) {
    process.stderr.write('\n' + stats.toString(this.options) + '\n');
  }
}
