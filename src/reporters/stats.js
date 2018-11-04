export default class StatsReporter {
  constructor(options) {
    this.options = Object.assign(
      {
        chunks: false,
        children: false,
        modules: false,
        colors: true,
        warnings: true,
        errors: true,
      },
      options
    );
  }

  done(context, { stats }) {
    context.state.statsString = stats.toString(this.options);
  }

  allDone(context) {
    let str = '';

    context.statesArray.forEach((state) => {
      str += '\n' + state.statsString + '\n';
      delete state.statsString;
    });

    process.stderr.write(str);
  }
}
