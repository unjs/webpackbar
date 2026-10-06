import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "vitest";
import LogUpdate from "../src/utils/log-update";

const ERASE_LINE = "\u001B[2K";
const countErase = (chunk) => chunk.split(ERASE_LINE).length - 1;

describe("log-update", () => {
  let chunks;
  let originalWrite;

  beforeEach(() => {
    chunks = [];
    originalWrite = process.stderr.write;

    process.stderr.write = function (data) {
      chunks.push(String(data));
      return true;
    };

    Object.defineProperty(process.stderr, "columns", {
      value: 80,
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    process.stderr.write = originalWrite;
  });

  it("erases exactly the previous frame height after external output", () => {
    const logUpdate = new LogUpdate();

    logUpdate.render("line1\nline2");
    const frameHeight = logUpdate.prevLineCount;
    assert.ok(frameHeight > 0, "first frame should occupy at least one line");
    assert.equal(countErase(chunks[0]), 0, "first frame has nothing to erase");

    // Simulate third-party output (e.g. console.log) landing between renders.
    chunks.length = 0;
    process.stderr.write("external log\n");
    logUpdate.render("line1\nline2");

    assert.equal(
      countErase(chunks.at(-1)),
      frameHeight,
      "second frame must erase exactly the previous frame height",
    );
  });

  it("keeps the erase height in sync across repeated external output", () => {
    const logUpdate = new LogUpdate();

    logUpdate.render("progress");
    let expectedHeight = logUpdate.prevLineCount;

    for (let index = 0; index < 5; index++) {
      chunks.length = 0;
      process.stderr.write(`log ${index}\n`);
      logUpdate.render("progress");

      assert.equal(
        countErase(chunks.at(-1)),
        expectedHeight,
        `frame ${index + 2} must erase exactly the previous frame height`,
      );

      expectedHeight = logUpdate.prevLineCount;
    }
  });
});
