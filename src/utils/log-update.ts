import stringWidth from "string-width";
import wrapAnsi from "wrap-ansi";
import { eraseLines } from "./cli";

// Based on https://github.com/sindresorhus/log-update/blob/master/index.js

const originalWrite = Symbol("webpackbarWrite");

export default class LogUpdate {
  private prevLines: string | null;
  private listening: boolean;
  private extraLines: string;
  private _streams: NodeJS.WriteStream[];

  constructor() {
    this.prevLines = null;
    this.listening = false;
    this.extraLines = "";
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
      eraseLines(this.lineCount) + wrappedLines + "\n" + this.extraLines;

    this.write(data);
    this.prevLines = data;
  }

  /**
   * The number of lines currently rendered, based on this.prevLines and the
   * terminal width. Since the terminal can be resized at any time, this value
   * should be retrieved immediately before erasing to get an accurate count.
   */
  get lineCount() {
    if (this.prevLines === null) {
      return 0;
    }

    const splitLines = this.prevLines.split("\n");
    let lineCount = 0;
    for (const line of splitLines) {
      // Use stringWidth to only count printed characters
      const lineWidth = stringWidth(line);
      lineCount += Math.max(1, Math.ceil(lineWidth / this.columns));
    }
    return lineCount;
  }

  get columns() {
    return (process.stderr.columns || 80) - 2;
  }

  write(data) {
    const stream = process.stderr;
    if (stream.write[originalWrite]) {
      stream.write[originalWrite].call(stream, data, "utf8");
    } else {
      stream.write(data, "utf8");
    }
  }

  clear() {
    this.done();
    this.write(eraseLines(this.lineCount));
  }

  done() {
    this.stopListen();

    this.prevLines = null;
    this.extraLines = "";
  }

  _onData(data) {
    const str = String(data);
    const lines = str.split("\n").length - 1;
    if (lines > 0) {
      this.prevLines += data;
      this.extraLines += data;
    }
  }

  listen() {
    // Prevent listening more than once
    if (this.listening) {
      return;
    }

    // Spy on all streams
    for (const stream of this._streams) {
      // Prevent overriding more than once
      if (stream.write[originalWrite]) {
        continue;
      }

      // Create a wrapper fn
      const write = (data, ...args) => {
        if (!stream.write[originalWrite]) {
          return stream.write(data, ...args);
        }
        this._onData(data);
        return stream.write[originalWrite].call(stream, data, ...args);
      };

      // Backup original write fn
      write[originalWrite] = stream.write;

      // Override write fn
      stream.write = write;
    }

    this.listening = true;
  }

  stopListen() {
    // Restore original write fns
    for (const stream of this._streams) {
      if (stream.write[originalWrite]) {
        stream.write = stream.write[originalWrite];
      }
    }

    this.listening = false;
  }
}
