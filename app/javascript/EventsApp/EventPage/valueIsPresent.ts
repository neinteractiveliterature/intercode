export function valueIsPresent(value: unknown): boolean {
  if (value == null) {
    return false;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  if (typeof value === 'boolean') {
    return true;
  }

  return !!value;
}
