export default class ProfileReporter {
  done(context) {
    if (context.options.profile) {
      const formattedStats = context.state.profile.getFormattedStats();
      process.stderr.write(`\n${formattedStats}\n`);
    }
  }
}
