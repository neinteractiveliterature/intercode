import { Transforms } from '../ComposableFormUtils';

export function encodeStringArray(value) {
  const encoded = (value || []).join(',');
  if (encoded.length === 0) {
    return null;
  }
  return encoded;
}

export function decodeStringArray(value) {
  const decoded = (value || '').split(',').filter((decodedValue) => decodedValue.length > 0);
  if (decoded.length === 0) {
    return null;
  }
  return decoded;
}

export function encodeIntegerArray(value) {
  if (value.length === 0) {
    return null;
  }

  return value.map((integer) => integer.toString()).join(',');
}

export function decodeIntegerArray(value) {
  const decoded = value.split(',').map(Transforms.integer).filter((integer) => integer != null);
  if (decoded.length === 0) {
    return null;
  }
  return decoded;
}


export function encodeBooleanFilter(value) {
  if (value == null) {
    return null;
  }

  return value ? 'true' : 'false';
}

export function decodeBooleanFilter(value) {
  if (value == null) {
    return null;
  }

  return (value === 'true');
}

export function toStringOrNull(value) {
  if (value == null) {
    return null;
  }

  return value.toString();
}

export function nonEmptyString(value) {
  if (value == null || value === '') {
    return null;
  }

  return value;
}

export const FilterCodecs = {
  stringArray: {
    encode: encodeStringArray,
    decode: decodeStringArray,
  },
  integerArray: {
    encode: encodeIntegerArray,
    decode: decodeIntegerArray,
  },
  boolean: {
    encode: encodeBooleanFilter,
    decode: decodeBooleanFilter,
  },
  float: {
    encode: toStringOrNull,
    decode: Transforms.float,
  },
  integer: {
    encode: toStringOrNull,
    decode: Transforms.integer,
  },
  nonEmptyString: {
    encode: nonEmptyString,
    decode: Transforms.identity,
  },
};

export function buildFieldFilterCodecs(fieldCodecs) {
  return {
    encodeFilterValue: (field, value) => {
      const codec = fieldCodecs[field];
      if (codec) {
        return codec.encode(value);
      }
      return value;
    },
    decodeFilterValue: (field, value) => {
      const codec = fieldCodecs[field];
      if (codec) {
        return codec.decode(value);
      }
      return value;
    },
  };
}
