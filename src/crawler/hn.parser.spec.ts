import { readFileSync } from 'fs';
import { join } from 'path';

import { HnParser } from './hn.parser';

describe('HnParser', () => {
  let parser: HnParser;
  let fixtureHtml: string;

  beforeAll(() => {
    parser = new HnParser();
    fixtureHtml = readFileSync(
      join(__dirname, '../../test/fixtures/hn-page.html'),
      'utf-8',
    );
  });

  it('should be defined', () => {
    expect(parser).toBeDefined();
  });

  it('should parse entries from HTML', () => {
    const entries = parser.parseEntries(fixtureHtml, 4);

    expect(entries).toHaveLength(4);
    expect(entries[0]).toEqual({
      number: 1,
      title: 'The Interim Computer Museum',
      points: 47,
      comments: 5,
    });
    expect(entries[1]).toEqual({
      number: 2,
      title: 'Make your first edit to OpenStreetMap',
      points: 382,
      comments: 89,
    });
    expect(entries[2]).toEqual({
      number: 3,
      title:
        'Real-SWE: Benchmarking AI models on private, real-world, enterprise ' +
        'codebases',
      points: 171,
      comments: 94,
    });
  });

  it('should respect maxEntries limit', () => {
    const entries = parser.parseEntries(fixtureHtml, 2);
    expect(entries).toHaveLength(2);
  });

  it('should default to 0 points and comments when missing', () => {
    const minimalHtml = `
    <html>
    <body>
      <table>
        <tr class="athing submission" id="1">
          <td class="title"><span class="rank">1.</span></td>
          <td class="title"> <span class="titleline"><a href="#">Test</a></span></td>
        </tr>
        <tr><td class="subtext"></td></tr>
      </table>
    </body>
    </html>
  `;

    const entries = parser.parseEntries(minimalHtml, 30);
    expect(entries).toHaveLength(1);
    expect(entries[0].points).toBe(0);
    expect(entries[0].comments).toBe(0);
  });
  it('should default to empty array when class athing submission is missing', () => {
    const minimalHtml = `
    <html>
    <body>
      <table>
        <tr class="others" id="1">
          <td class="title"><span class="rank">1.</span></td>
          <td class="title"><a href="#">Test</a></td>
        </tr>
        <tr><td class="subtext"></td></tr>
      </table>
    </body>
    </html>
  `;

    const entries = parser.parseEntries(minimalHtml, 30);
    expect(entries).toHaveLength(0);
  });
});
