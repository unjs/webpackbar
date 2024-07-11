import ansis from "ansis";
import { consola as _consola } from "consola";
import markdownTable from "markdown-table";

import { BLOCK_CHAR, BLOCK_CHAR2, BAR_LENGTH } from "./consts";

import { range } from ".";

export const consola = _consola.withTag("webpackbar");

export const colorize = (color) => {
  if (color[0] === "#") {
    return ansis.hex(color);
  }

  return ansis[color] || ansis.reset; // || ansis.keyword(color);
};

export const renderBar = (progress, color) => {
  const w = progress * (BAR_LENGTH / 100);
  const bg = ansis.white(BLOCK_CHAR);
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
