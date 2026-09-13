import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

import type { Entry } from './interfaces/entry.interface';
import { HN_SELECTORS } from './hn-selectors';
import { EntryParser } from './entry.parser';

@Injectable()
export class HnParser {
  parseEntries(html: string, maxEntries: number): Entry[] {
    const $ = cheerio.load(html);
    const entryParser = new EntryParser();
    const entries: Entry[] = entryParser.parseEntries(html, maxEntries, HN_SELECTORS);
   
    return entries;
  }
}
