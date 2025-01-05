import { parseIntOrNull, parseFloatOrNull, notEmpty } from '@neinteractiveliterature/litform';

export function encodeStringArray(value?: string[] | null): string | null {
  const encoded = (value || []).join(',');
  if (encoded.length === 0) {
    return null;
  }
  return encoded;
}

export function decodeStringArray(value: string): string[] | null {
  const decoded = (value || '').split(',').filter((decodedValue) => decodedValue.length > 0);
  if (decoded.length === 0) {
    return null;
  }
  return decoded;
}

export function encodeIntegerArray(value?: (number | null)[] | null): string | null {
  if (!value || value.length === 0) {
    return null;
  }

  return value.map((integer) => integer?.toString()).join(',');
}

export function decodeIntegerArray(value?: string | null): number[] | null {
  if (value == null) {
    return null;
  }
  const decoded = value.split(',').map(parseIntOrNull).filter(notEmpty);
  if (decoded.length === 0) {
    return null;
  }
  return decoded;
}

export function encodeBooleanFilter(value?: boolean | null): string | null {
  if (value == null) {
    return null;
  }

  return value ? 'true' : 'false';
}

export function decodeBooleanFilter(value?: 'true' | 'false' | null): boolean | null {
  if (value == null) {
    return null;
  }

  return value === 'true';
}

export function toStringOrNull<T extends { toString(): string }>(value?: T): string | null {
  if (value == null) {
    return null;
  }

  return value.toString();
}

export function nonEmptyString(value?: string | null): Exclude<string, ''> | null {
  if (value == null || value === '') {
    return null;
  }

  return value;
}

export interface FilterCodec<T> {
  encode(value?: T): string | null;
  decode(value?: string | null): T | null;
}

const stringArray: FilterCodec<string[]> = {
  encode: encodeStringArray,
  decode: decodeStringArray,
};
const integerArray: FilterCodec<(number | null)[]> = {
  encode: encodeIntegerArray,
  decode: decodeIntegerArray,
};
const booleanCodec: FilterCodec<boolean> = {
  encode: encodeBooleanFilter,
  decode: decodeBooleanFilter,
};
const floatCodec: FilterCodec<number> = {
  encode: toStringOrNull,
  decode: parseFloatOrNull,
};
const integerCodec: FilterCodec<number> = {
  encode: toStringOrNull,
  decode: parseIntOrNull,
};
const nonEmptyStringCodec: FilterCodec<string> = {
  encode: nonEmptyString,
  decode: (value?: string | null) => value ?? null,
};
const jsonCodec: FilterCodec<unknown> = {
  encode: JSON.stringify,
  decode: (value?: string | null) => {
    if (value == null) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch (err) {
      return null;
    }
  },
};

export const FilterCodecs = {
  stringArray,
  integerArray,
  boolean: booleanCodec,
  float: floatCodec,
  integer: integerCodec,
  nonEmptyString: nonEmptyStringCodec,
  json: jsonCodec,
};

export interface FieldFilterCodecs {
  encodeFilterValue(field: string, value: unknown): string | null;
  decodeFilterValue(field: string, value: string): unknown;
}

export function buildFieldFilterCodecs(fieldCodecs: { [field: string]: FilterCodec<unknown> }): FieldFilterCodecs {
  return {
    encodeFilterValue: (field: string, value: unknown) => {
      const codec = fieldCodecs[field];
      if (codec) {
        return codec.encode(value);
      }
      if (typeof value === 'string') {
        return value;
      }
      if (value == null) {
        return null;
      }
      throw new Error(`No encoder for field ${field} with value ${JSON.stringify(value)}`);
    },
    decodeFilterValue: (field: string, value: string | null | undefined) => {
      const codec = fieldCodecs[field];
      if (codec) {
        return codec.decode(value);
      }
      return value;
    },
  };
}
