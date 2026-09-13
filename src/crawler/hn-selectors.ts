export const HN_SELECTORS = {
  entry: 'tr.athing',
  rank: 'span.rank',
  title: 'span.titleline > a',
  subtext: 'td.subtext',
  points: 'span.score',
  comments: 'a',
} as const;

export type SelectorKey = keyof typeof HN_SELECTORS;
