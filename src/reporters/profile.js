import Profiler from '../profiler';

export default class ProfileReporter {
  constructor() {
    this.profiler = new Profiler();
  }

  allDone() {
    const formattedStats = this.profiler.getFormattedStats();
    process.stderr.write(`\n${formattedStats}\n`);
  }

  progress(context) {
    this.profiler.onRequest(context.state.request);
  }
}
