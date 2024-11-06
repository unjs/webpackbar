import prettyTime from "pretty-time";
import { bold } from "ansis";
import { startCase } from "../utils";
import { createTable } from "../utils/cli";

import getDescription from "./description";

export default function formatStats(allStats) {
  const lines = [];

  for (const category of Object.keys(allStats)) {
    const stats = allStats[category];

    lines.push(`> Stats by ${bold(startCase(category))}`);

    let totalRequests = 0;
    const totalTime = [0, 0];

    const data = [
      [startCase(category), "Requests", "Time", "Time/Request", "Description"],
    ];

    for (const item of Object.keys(stats)) {
      const stat = stats[item];

      totalRequests += stat.count || 0;

      const description = getDescription(category, item);

      totalTime[0] += stat.time[0];
      totalTime[1] += stat.time[1];

      const avgTime = [stat.time[0] / stat.count, stat.time[1] / stat.count];

      data.push([
        item,
        stat.count || "-",
        prettyTime(stat.time),
        prettyTime(avgTime),
        description,
      ]);
    }

    data.push(["Total", totalRequests, prettyTime(totalTime), "", ""]);

    lines.push(createTable(data));
  }

  return `${lines.join("\n\n")}\n`;
}
