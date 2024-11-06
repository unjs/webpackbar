import { delimiter } from "node:path";
import figures from "figures";
import { blue } from "ansis";

const { bullet, tick, cross, pointerSmall, radioOff } = figures;

export const nodeModules = `${delimiter}node_modules${delimiter}`;
export const BAR_LENGTH = 25;
export const BLOCK_CHAR = "█";
export const BLOCK_CHAR2 = "█";
export const NEXT = " " + blue(pointerSmall) + " ";
export const BULLET = bullet;
export const TICK = tick;
export const CROSS = cross;
export const CIRCLE_OPEN = radioOff;
