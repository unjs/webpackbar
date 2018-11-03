import fs from 'fs';

import ansiEscapes from 'ansi-escapes';
import wrapAnsi from 'wrap-ansi';

// Based on https://github.com/sindresorhus/log-update/blob/master/index.js

export default class LogUpdate {
  constructor() {
    this.prevLineCount = 0;
  }

  render(lines) {
    const wrappedLines = wrapAnsi(lines, this.columns, {
      trim: false,
      hard: true,
      wordWrap: false,
    });

    const earaseChars = ansiEscapes.eraseLines(this.prevLineCount);

    this.write(earaseChars + wrappedLines + '\n');

    this.prevLineCount = wrappedLines.split('\n').length + 1;
  }

  get columns() {
    return (process.stderr.columns || 80) - 2;
  }

  write(data) {
    fs.writeSync(2, data);
    fs.fsyncSync(2);
  }

  clear() {
    this.write(ansiEscapes.eraseLines(this.prevLineCount));
    this.prevLineCount = 0;
  }

  done() {
    this.prevLineCount = 0;
  }
}
