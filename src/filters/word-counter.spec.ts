import { wordCount } from './word-counter';

describe('wordCount', () => {
  it('should count simple words', () => {
    expect(wordCount('hello world')).toBe(2);
  });

  it('should exclude symbols', () => {
    expect(
      wordCount(
        'Why is the x86 undefined instruction called ud2? Why  " 2? " ',
      ),
    ).toBe(10);
  });

  it('should count hyphenated words as one', () => {
    expect(wordCount('self-explained')).toBe(1);
  });

  it('should count C++ as one word', () => {
    expect(wordCount('Why Rust is eating C++')).toBe(5);
  });

  it('should return 0 for empty string', () => {
    expect(wordCount('')).toBe(0);
  });

  it('should return 0 for symbols only', () => {
    expect(wordCount('- - -')).toBe(0);
  });

  it('should handle multiple spaces', () => {
    expect(wordCount('hello    world')).toBe(2);
  });

  it('should handle multiple spaces and carriage returns', () => {
    expect(
      wordCount(
        `hello   
         world`,
      ),
    ).toBe(2);
  });

  it('should count titles with punctuation', () => {
    expect(wordCount('Ask HN: How do you handle burnout?')).toBe(7);
  });
});
