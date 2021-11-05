import { delimiter } from 'path'

import figures from 'figures'
import chalk from 'chalk'

const { bullet, tick, cross, pointerSmall, radioOff } = figures

export const nodeModules = `${delimiter}node_modules${delimiter}`
export const BAR_LENGTH = 25
export const BLOCK_CHAR = '█'
export const BLOCK_CHAR2 = '█'
export const NEXT = ' ' + chalk.blue(pointerSmall) + ' '
export const BULLET = bullet
export const TICK = tick
export const CROSS = cross
export const CIRCLE_OPEN = radioOff
