import { pluralize } from 'inflected';

export default function pluralizeWithCount(word: string, count: number, hideCount = false): string {
  if (count === 1) {
    if (hideCount) {
      return word;
    }

    return `${count} ${word}`;
  }

  if (hideCount) {
    return pluralize(word);
  }

  return `${count} ${pluralize(word)}`;
}
