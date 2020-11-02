import chalk from 'chalk'
import { Reporter } from 'src/types'

import { colorize } from '../utils/cli'
import Profiler from '../profiler'

export default class ProfileReporter implements Reporter {
  progress (context) {
    if (!context.state.profiler) {
      context.state.profiler = new Profiler()
    }

    context.state.profiler.onRequest(context.state.request)
  }

  done (context) {
    if (context.state.profiler) {
      context.state.profile = context.state.profiler.getFormattedStats()
      delete context.state.profiler
    }
  }

  allDone (context) {
    let str = ''

    for (const state of context.statesArray) {
      const color = colorize(state.color)

      if (state.profile) {
        str +=
          color(`\nProfile results for ${chalk.bold(state.name)}\n`) +
          `\n${state.profile}\n`
        delete state.profile
      }
    }

    process.stderr.write(str)
  }
}
