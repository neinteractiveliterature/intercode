export function encodeStringArray(value) {
  const encoded = value.join(',');
  if (encoded.length === 0) {
    return null;
  }
  return encoded;
}

export function decodeStringArray(value) {
  const decoded = value.split(',').filter(decodedValue => decodedValue.length > 0);
  if (decoded.length === 0) {
    return null;
  }
  return decoded;
}
