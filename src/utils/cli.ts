import c from "ansis";
import { consola as _consola } from "consola";
import { markdownTable } from "markdown-table";

import { BLOCK_CHAR, BLOCK_CHAR2, BAR_LENGTH } from "./consts";

import { range } from ".";

export const consola = _consola.withTag("webpackbar");

export const colorize = (color: string) => {
  return color[0] === "#" ? c.hex(color) : c[color] || c.reset;
};

export const renderBar = (progress, color) => {
  const w = progress * (BAR_LENGTH / 100);
  const bg = c.white(BLOCK_CHAR);
  const fg = colorize(color)(BLOCK_CHAR2);

  return range(BAR_LENGTH)
    .map((i) => (i < w ? fg : bg))
    .join("");
};

export function createTable(data) {
  return markdownTable(data);
}

export function ellipsis(str, n) {
  if (str.length <= n - 3) {
    return str;
  }
  return `${str.slice(0, Math.max(0, n - 1))}...`;
}

export function ellipsisLeft(str, n) {
  if (str.length <= n - 3) {
    return str;
  }
  return `...${str.slice(str.length - n - 1)}`;
}

// Based on github.com/terkelg/sisteransi (MIT - 2018 Terkel Gjervig Nielsen)
export function eraseLines(count: number) {
  let clear = "";
  for (let i = 0; i < count; i++) {
    clear += `\u001B[2K` + (i < count - 1 ? `\u001B[1A` : "");
  }
  if (count) clear += `\u001B[G`;
  return clear;
}
