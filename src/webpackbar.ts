import Webpack from 'webpack'
import { isMinimal } from 'std-env'
import prettyTime from 'pretty-time'
import { startCase, shortenPath, objectValues } from './utils'
import type { WebpackBarOptions, ReporterOpts, Reporter, State } from './types'
import * as reporters from './reporters'
import { parseRequest, hook } from './utils/webpack'

export type { Reporter, State } from './types'

// Default plugin options
const DEFAULTS = {
  name: 'webpack',
  color: 'green',
  reporters: isMinimal ? ['basic'] : ['fancy'],
  reporter: null
}

// Default state object
const DEFAULT_STATE = {
  start: null,
  progress: -1,
  done: false,
  message: '',
  details: [],
  request: null,
  hasErrors: false
}

const globalStates: { [key: string]: State } = {}

export default class WebpackBarPlugin extends Webpack.ProgressPlugin {
  private options: any
  private reporters: Reporter[]

  constructor (options?: WebpackBarOptions) {
    super({ activeModules: true })

    this.options = Object.assign({}, DEFAULTS, options)

    // Assign a better handler to base ProgressPlugin
    this.handler = (percent, message, ...details) => {
      this.updateProgress(percent, message, details)
    }

    // Reporters
    const _reporters: ReporterOpts[] = Array
      .from(this.options.reporters || [])
      .concat(this.options.reporter)
      .filter(Boolean)
      .map((reporter) => {
        if (Array.isArray(reporter)) {
          return { reporter: reporter[0], options: reporter[1] }
        }
        if (typeof reporter === 'string') {
          return { reporter }
        }
        return { reporter } as ReporterOpts
      })

    // Resolve reporters
    this.reporters = _reporters.map(({ reporter, options = {} }) => {
      if (typeof reporter === 'string') {
        if (this.options[reporter] === false) {
          return undefined
        }
        options = { ...this.options[reporter], ...options }
        // eslint-disable-next-line import/namespace
        reporter = (reporters[reporter] || require(reporter)) as Reporter
      }

      if (typeof reporter === 'function') {
        try {
          // @ts-ignore
          reporter = new reporter(options) // eslint-disable-line new-cap
        } catch (err) {
          reporter = (reporter as Function)(options)
        }
      }
      return reporter as Reporter
    }).filter(Boolean)
  }

  callReporters (fn, payload = {}) {
    for (const reporter of this.reporters) {
      if (typeof reporter[fn] === 'function') {
        try {
          reporter[fn](this, payload)
        } catch (e) {
          process.stdout.write(e.stack + '\n')
        }
      }
    }
  }

  get hasRunning () {
    return objectValues(this.states).some(state => !state.done)
  }

  get hasErrors () {
    return objectValues(this.states).some(state => state.hasErrors)
  }

  get statesArray () {
    return objectValues(this.states).sort((s1, s2) =>
      s1.name.localeCompare(s2.name)
    )
  }

  get states () {
    return globalStates
  }

  get state (): State {
    return globalStates[this.options.name]
  }

  _ensureState () {
    // Keep our state in shared object
    if (!this.states[this.options.name]) {
      this.states[this.options.name] = {
        ...DEFAULT_STATE,
        color: this.options.color,
        name: startCase(this.options.name)
      }
    }
  }

  apply (compiler) {
    // Prevent adding multi instances to the same compiler
    if (compiler.webpackbar) {
      return
    }
    compiler.webpackbar = this

    // Apply base hooks
    super.apply(compiler)

    // Register our state after all plugins initialized
    hook(compiler, 'afterPlugins', () => {
      this._ensureState()
    })

    // Hook into the compiler before a new compilation is created.
    hook(compiler, 'compile', () => {
      this._ensureState()

      Object.assign(this.state, {
        ...DEFAULT_STATE,
        start: process.hrtime()
      })

      this.callReporters('start')
    })

    // Watch compilation has been invalidated.
    hook(compiler, 'invalid', (fileName, changeTime) => {
      this._ensureState()

      this.callReporters('change', {
        path: fileName,
        shortPath: shortenPath(fileName),
        time: changeTime
      })
    })

    // Compilation has completed
    hook(compiler, 'done', (stats) => {
      this._ensureState()

      // Prevent calling done twice
      if (this.state.done) {
        return
      }

      const hasErrors = stats.hasErrors()
      const status = hasErrors ? 'with some errors' : 'successfully'

      const time = this.state.start
        ? ' in ' + prettyTime(process.hrtime(this.state.start), 2)
        : ''

      Object.assign(this.state, {
        ...DEFAULT_STATE,
        progress: 100,
        done: true,
        message: `Compiled ${status}${time}`,
        hasErrors
      })

      this.callReporters('progress')

      this.callReporters('done', { stats })

      if (!this.hasRunning) {
        this.callReporters('beforeAllDone')
        this.callReporters('allDone')
        this.callReporters('afterAllDone')
      }
    })
  }

  updateProgress (percent = 0, message = '', details = []) {
    const progress = Math.floor(percent * 100)

    const activeModule = details.pop()

    Object.assign(this.state, {
      progress,
      message: message || '',
      details,
      request: parseRequest(activeModule)
    })

    this.callReporters('progress')
  }
}
