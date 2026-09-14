export const wordCount = (title: string): number =>
  title.split(/\s+/).filter((token) => /[a-zA-Z0-9]/.test(token)).length;
