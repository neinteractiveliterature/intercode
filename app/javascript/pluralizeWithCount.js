import { pluralize } from 'inflected';

export default (word, count) => {
  if (count === 1) {
    return `${count} ${word}`;
  }

  return `${count} ${pluralize(word)}`;
};
