import path from "node:path";

import formatStats from "./format";

export default class Profiler {
  private requests: any[];

  constructor() {
    this.requests = [];
  }

  onRequest(request) {
    if (!request) {
      return;
    }

    // Measure time for last request
    if (this.requests.length > 0) {
      const lastReq = this.requests.at(-1);
      if (lastReq.start) {
        lastReq.time = process.hrtime(lastReq.start);
        delete lastReq.start;
      }
    }

    // Ignore requests without any file or loaders
    if (!request.file || request.loaders.length === 0) {
      return;
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

    for (const { request, time = [0, 0] } of this.requests) {
      for (const loader of request.loaders) {
        addToStat(loaderStats, loader, 1, time);
      }

      const ext = request.file && path.extname(request.file).slice(1);
      addToStat(extStats, ext && ext.length > 0 ? ext : "unknown", 1, time);
    }

    return {
      ext: extStats,
      loader: loaderStats,
    };
  }

  getFormattedStats() {
    return formatStats(this.getStats());
  }
}
