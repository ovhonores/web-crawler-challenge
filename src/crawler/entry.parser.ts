import * as cheerio from 'cheerio';

import type { Entry } from './interfaces/entry.interface';

interface EntrySelectors {
  entry: string;
  rank: string;
  title: string;
  subtext: string;
  points: string;
  comments: string;
}

export class EntryParser {
  parseEntries(
    html: string,
    maxEntries: number,
    selectors: EntrySelectors,
  ): Entry[] {
    const $ = cheerio.load(html);

    const entries: Entry[] = [];

    $(selectors.entry)
      .slice(0, maxEntries)
      .each((_, element) => {
        try {
          const $row = $(element);

          const rankText = $row.find(selectors.rank).text().trim();

          const numberMatch = rankText.match(/\d+/);
          const number = numberMatch ? Number.parseInt(numberMatch[0], 10) : 0;

          const title = $row.find(selectors.title).first().text().trim();

          const $subtext = $row.next('tr').find(selectors.subtext);

          const pointsText = $subtext.find(selectors.points).text().trim();

          const pointsMatch = pointsText.match(/\d+/);
          const points = pointsMatch ? Number.parseInt(pointsMatch[0], 10) : 0;

          const commentsText = $subtext
            .find(selectors.comments)
            .last()
            .text()
            .trim();

          const commentsMatch = commentsText.match(/\d+/);
          const comments = commentsMatch
            ? Number.parseInt(commentsMatch[0], 10)
            : 0;

          if (title && !isNaN(number) && !isNaN(points)) {
            entries.push({ number, title, points, comments });
          }
        } catch (error) {
          console.error('Error parsing entry:', error);
        }
      });

    return entries;
  }
}
