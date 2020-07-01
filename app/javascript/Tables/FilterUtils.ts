import { Transforms } from '../ComposableFormUtils';

export function encodeStringArray(value?: string[] | null) {
  const encoded = (value || []).join(',');
  if (encoded.length === 0) {
    return null;
  }
  return encoded;
}

export function decodeStringArray(value: string) {
  const decoded = (value || '').split(',').filter((decodedValue) => decodedValue.length > 0);
  if (decoded.length === 0) {
    return null;
  }
  return decoded;
}

export function encodeIntegerArray(value?: (number | null)[] | null) {
  if (!value || value.length === 0) {
    return null;
  }

  return value.map((integer) => integer?.toString()).join(',');
}

export function decodeIntegerArray(value?: string | null) {
  if (value == null) {
    return null;
  }
  const decoded = value.split(',').map(Transforms.integer).filter((integer) => integer != null);
  if (decoded.length === 0) {
    return null;
  }
  return decoded;
}

export function encodeBooleanFilter(value?: boolean | null) {
  if (value == null) {
    return null;
  }

  return value ? 'true' : 'false';
}

export function decodeBooleanFilter(value?: 'true' | 'false' | null) {
  if (value == null) {
    return null;
  }

  return (value === 'true');
}

export function toStringOrNull(value?: any): string | null {
  if (value == null) {
    return null;
  }

  return value.toString();
}

export function nonEmptyString(value?: string | null) {
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
  encode: encodeStringArray, decode: decodeStringArray,
};
const integerArray: FilterCodec<(number | null)[]> = {
  encode: encodeIntegerArray, decode: decodeIntegerArray,
};
const booleanCodec: FilterCodec<boolean> = {
  encode: encodeBooleanFilter, decode: decodeBooleanFilter,
};
const floatCodec: FilterCodec<number> = {
  encode: toStringOrNull, decode: Transforms.float,
};
const integerCodec: FilterCodec<number> = {
  encode: toStringOrNull, decode: Transforms.integer,
};
const nonEmptyStringCodec: FilterCodec<string> = {
  encode: nonEmptyString, decode: (value?: string | null) => value ?? null,
};

export const FilterCodecs = {
  stringArray,
  integerArray,
  boolean: booleanCodec,
  float: floatCodec,
  integer: integerCodec,
  nonEmptyString: nonEmptyStringCodec,
};

export interface FieldFilterCodecs {
  encodeFilterValue(field: string, value: any): string;
  decodeFilterValue(field: string, value: string): any;
}

export function buildFieldFilterCodecs(fieldCodecs: { [field: string]: FilterCodec<any> }) {
  return {
    encodeFilterValue: (field: string, value: any) => {
      const codec = fieldCodecs[field];
      if (codec) {
        return codec.encode(value);
      }
      return value;
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
