export default function humanize(str: string): string {
  const stringWithoutSeparators = str.replace(/[_-]/g, ' ').replace(/  +/g, ' ');
  if (stringWithoutSeparators === '') {
    return '';
  }

  return `${stringWithoutSeparators[0].toUpperCase()}${stringWithoutSeparators.slice(1).toLowerCase()}`;
}
