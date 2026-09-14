import { Injectable } from '@nestjs/common';

import type { Entry } from './interfaces/entry.interface';
import { HN_SELECTORS } from './hn-selectors';
import { EntryParser } from './entry.parser';

@Injectable()
export class HnParser {
  parseEntries(html: string, maxEntries: number): Entry[] {
    const entryParser = new EntryParser();
    const entries: Entry[] = entryParser.parseEntries(
      html,
      maxEntries,
      HN_SELECTORS,
    );
    return entries;
  }
}
