import ansiEscapes from 'ansi-escapes';
import wrapAnsi from 'wrap-ansi';

// Based on https://github.com/sindresorhus/log-update/blob/master/index.js

export default class LogUpdate {
  constructor() {
    this.prevLineCount = 0;
    this.listening = false;
    this.extraLines = '';
    this._onData = this._onData.bind(this);
    this._streams = [process.stdout, process.stderr];
  }

  render(lines) {
    this.listen();

    const wrappedLines = wrapAnsi(lines, this.columns, {
      trim: false,
      hard: true,
      wordWrap: false,
    });

    const data =
      ansiEscapes.eraseLines(this.prevLineCount) +
      wrappedLines +
      '\n' +
      this.extraLines;

    this.write(data);

    this.prevLineCount = data.split('\n').length;
  }

  get columns() {
    return (process.stderr.columns || 80) - 2;
  }

  write(data) {
    const stream = process.stderr;
    const forward = stream.write.__webpackbar_original;
    if (forward) {
      forward.call(stream, data, 'utf-8');
    } else {
      stream.write(data, 'utf-8');
    }
  }

  clear() {
    this.done();
    this.write(ansiEscapes.eraseLines(this.prevLineCount));
  }

  done() {
    this.stopListen();

    this.prevLineCount = 0;
    this.extraLines = '';
  }

  _onData(data) {
    const str = String(data);
    const lines = str.split('\n').length - 1;
    if (lines > 0) {
      this.prevLineCount += lines;
      this.extraLines += data;
    }
  }

  listen() {
    if (this.listening) {
      return;
    }

    const t = this;

    for (const stream of this._streams) {
      if (!stream.write.__webpackbar_original) {
        const write = function write(data, ...args) {
          const forward = write.__webpackbar_original;
          if (!forward) {
            return stream.write(data, ...args);
          }
          t._onData(data);
          forward.call(stream, data, ...args);
        };
        write.__webpackbar_original = stream.write;
        stream.write = write;
      }
    }

    this.listening = true;
  }

  stopListen() {
    for (const stream of this._streams) {
      if (stream.write.__webpackbar_original) {
        stream.write = stream.write.__webpackbar_original;
      }
    }

    this.listening = false;
  }
}
