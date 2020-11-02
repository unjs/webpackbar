import { Reporter } from 'src/types'
import { consola } from '../utils/cli'

export default class SimpleReporter implements Reporter {
  start (context) {
    consola.info(`Compiling ${context.state.name}`)
  }

  change (context, { shortPath }) {
    consola.debug(`${shortPath} changed.`, `Rebuilding ${context.state.name}`)
  }

  done (context) {
    const { hasError, message, name } = context.state
    consola[hasError ? 'error' : 'success'](`${name}: ${message}`)
  }
}
