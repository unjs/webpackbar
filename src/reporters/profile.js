export default class ProfileReporter {
  done(context) {
    if (context.options.profile) {
      const formattedStats = context.state.profile.getFormattedStats();
      context.options.stream.write(`\n${formattedStats}\n`);
    }
  }
}
