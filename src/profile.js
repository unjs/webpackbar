import path from 'path';

export default class Profile {
  constructor(name) {
    this.name = name;
    this.requests = [];
  }

  onRequest(request) {
    if (this.requests.length) {
      this.requests[this.requests.length - 1].time = process.hrtime(this.requests[this.requests.length - 1].start);
      delete this.requests[this.requests.length - 1].start;
    }

    this.requests.push({
      request,
      start: process.hrtime(),
    });
  }

  getStats() {
    const loaderStats = {};
    const extStats = {};

    const getStat = (stats, name) => {
      if (!stats[name]) {
        // eslint-disable-next-line no-param-reassign
        stats[name] = {
          count: 0,
          time: [0, 0],
        };
      }
      return stats[name];
    };

    const addToStat = (stats, name, count, time) => {
      const stat = getStat(stats, name);
      stat.count += count;
      stat.time[0] += time[0];
      stat.time[1] += time[1];
    };

    this.requests.forEach(({ request, time = [0, 0] }) => {
      request.loaders.forEach((loader) => {
        addToStat(loaderStats, loader, 1, time);
      });

      const ext = request.file && path.extname(request.file).substr(1);
      addToStat(extStats, ext && ext.length ? ext : 'unknown', 1, time);
    });

    return {
      ext: extStats,
      loader: loaderStats,
    };
  }
}
