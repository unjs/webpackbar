export default class ProfileReporter {
  done(plugin) {
    if (plugin.options.profile) {
      const formattedStats = plugin.state.profile.getFormattedStats();
      plugin.options.stream.write(`\n${formattedStats}\n`);
    }
  }
}
