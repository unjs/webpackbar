import { startCase } from '../utils'

const DB = {
  loader: {
    get: loader => startCase(loader)
  },
  ext: {
    get: ext => `${ext} files`,
    vue: 'Vue Single File components',
    js: 'JavaScript files',
    sass: 'SASS files',
    scss: 'SASS files',
    unknown: 'Unknown files'
  }
}

export default function getDescription (category, keyword) {
  if (!DB[category]) {
    return startCase(keyword)
  }

  if (DB[category][keyword]) {
    return DB[category][keyword]
  }

  if (DB[category].get) {
    return DB[category].get(keyword)
  }

  return '-'
}
