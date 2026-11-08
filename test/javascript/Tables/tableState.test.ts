import {
  buildFieldFilterCodecs,
  decodeBooleanFilter,
  decodeIntegerArray,
  decodeStringArray,
  encodeBooleanFilter,
  encodeIntegerArray,
  encodeStringArray,
  FilterCodecs,
  nonEmptyString,
} from '../../../app/javascript/Tables/FilterUtils';
import {
  reactTableFiltersToTableResultsFilters,
  reactTableSortToTableResultsSort,
} from '../../../app/javascript/Tables/TableUtils';
import { decodeReactRouterReactTableSearchParams } from '../../../app/javascript/Tables/useReactRouterReactTable';
import {
  columnVisibilityToVisibleColumnIds,
  visibleColumnIdsToColumnVisibility,
} from '../../../app/javascript/Tables/useColumnSelection';

// How table state (page, filters, sorting, visible columns) is turned into URLs and into GraphQL variables, and back.

describe('filter codecs', () => {
  describe('string arrays', () => {
    it('joins with commas, and has nothing to say about an empty list', () => {
      expect(encodeStringArray(['a', 'b'])).toBe('a,b');
      expect(encodeStringArray([])).toBeNull();
      expect(encodeStringArray(null)).toBeNull();
    });

    it('splits on commas, dropping empty items, and has nothing to say about an empty list', () => {
      expect(decodeStringArray('a,b')).toEqual(['a', 'b']);
      expect(decodeStringArray('a,,b,')).toEqual(['a', 'b']);
      expect(decodeStringArray('')).toBeNull();
      expect(decodeStringArray(',')).toBeNull();
    });
  });

  describe('integer arrays', () => {
    it('round-trips', () => {
      expect(encodeIntegerArray([1, 20, 3])).toBe('1,20,3');
      expect(decodeIntegerArray('1,20,3')).toEqual([1, 20, 3]);
    });

    it('has nothing to say about empty or missing lists', () => {
      expect(encodeIntegerArray([])).toBeNull();
      expect(encodeIntegerArray(null)).toBeNull();
      expect(decodeIntegerArray('')).toBeNull();
      expect(decodeIntegerArray(null)).toBeNull();
    });

    it('skips items that are not numbers', () => {
      expect(decodeIntegerArray('1,x,3')).toEqual([1, 3]);
      expect(decodeIntegerArray('x')).toBeNull();
    });
  });

  describe('booleans', () => {
    it('uses true and false, and has nothing to say about null', () => {
      expect(encodeBooleanFilter(true)).toBe('true');
      expect(encodeBooleanFilter(false)).toBe('false');
      expect(encodeBooleanFilter(null)).toBeNull();
      expect(decodeBooleanFilter('true')).toBe(true);
      expect(decodeBooleanFilter('false')).toBe(false);
      expect(decodeBooleanFilter(null)).toBeNull();
    });
  });

  describe('non-empty strings', () => {
    it('treats an empty string as no value', () => {
      expect(nonEmptyString('x')).toBe('x');
      expect(nonEmptyString('')).toBeNull();
      expect(nonEmptyString(null)).toBeNull();
    });
  });

  describe('numbers', () => {
    it('round-trips integers and floats', () => {
      expect(FilterCodecs.integer.encode(42)).toBe('42');
      expect(FilterCodecs.integer.decode('42')).toBe(42);
      expect(FilterCodecs.float.encode(1.5)).toBe('1.5');
      expect(FilterCodecs.float.decode('1.5')).toBe(1.5);
    });
  });

  describe('json', () => {
    it('round-trips structured values', () => {
      const value = { a: [1, 2], b: 'c' };
      expect(FilterCodecs.json.decode(FilterCodecs.json.encode(value))).toEqual(value);
    });

    it('decodes unparseable text as no value', () => {
      expect(FilterCodecs.json.decode('{not json')).toBeNull();
      expect(FilterCodecs.json.decode(null)).toBeNull();
    });
  });
});

describe('buildFieldFilterCodecs', () => {
  const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({
    tags: FilterCodecs.stringArray,
    active: FilterCodecs.boolean,
  });

  it('uses the codec for the field when there is one', () => {
    expect(encodeFilterValue('tags', ['a', 'b'])).toBe('a,b');
    expect(decodeFilterValue('tags', 'a,b')).toEqual(['a', 'b']);
    expect(encodeFilterValue('active', false)).toBe('false');
    expect(decodeFilterValue('active', 'false')).toBe(false);
  });

  it('passes text through for fields without a codec', () => {
    expect(encodeFilterValue('name', 'Alice')).toBe('Alice');
    expect(decodeFilterValue('name', 'Alice')).toBe('Alice');
  });

  it('encodes a missing value as nothing', () => {
    expect(encodeFilterValue('name', null)).toBeNull();
    expect(encodeFilterValue('name', undefined)).toBeNull();
  });

  it('refuses to guess at how to encode a non-text value for a field without a codec', () => {
    expect(() => encodeFilterValue('name', ['a'])).toThrow(/No encoder for field name/);
  });
});

describe('reactTableFiltersToTableResultsFilters', () => {
  it('turns a list of filters into an object by column', () => {
    expect(
      reactTableFiltersToTableResultsFilters([
        { id: 'name', value: 'Alice' },
        { id: 'tags', value: ['a', 'b'] },
      ]),
    ).toEqual({ name: 'Alice', tags: ['a', 'b'] });
  });

  it('gives an empty object for no filters', () => {
    expect(reactTableFiltersToTableResultsFilters([])).toEqual({});
    expect(reactTableFiltersToTableResultsFilters(null)).toEqual({});
    expect(reactTableFiltersToTableResultsFilters(undefined)).toEqual({});
  });
});

describe('reactTableSortToTableResultsSort', () => {
  it('turns sorting into fields and directions, in order', () => {
    expect(
      reactTableSortToTableResultsSort([
        { id: 'last_name', desc: false },
        { id: 'email', desc: true },
      ]),
    ).toEqual([
      { field: 'last_name', desc: false },
      { field: 'email', desc: true },
    ]);
  });

  it('gives an empty list for no sorting', () => {
    expect(reactTableSortToTableResultsSort([])).toEqual([]);
    expect(reactTableSortToTableResultsSort(null)).toEqual([]);
  });
});

describe('decodeReactRouterReactTableSearchParams', () => {
  const decode = (search: string, options?: Parameters<typeof decodeReactRouterReactTableSearchParams>[1]) =>
    decodeReactRouterReactTableSearchParams(new URLSearchParams(search), options);

  it('starts on the first page, unfiltered and unsorted', () => {
    expect(decode('')).toEqual({ page: 0, filters: [], sortBy: [] });
  });

  it('counts pages from one in the URL, and from zero in the table', () => {
    expect(decode('page=3').page).toBe(2);
  });

  it('reads filters and sorting, in order', () => {
    expect(decode('filters.name=Alice&filters.email=a%40b.c&sort.last_name=desc&sort.id=asc')).toEqual({
      page: 0,
      filters: [
        { id: 'name', value: 'Alice' },
        { id: 'email', value: 'a@b.c' },
      ],
      sortBy: [
        { id: 'last_name', desc: true },
        { id: 'id', desc: false },
      ],
    });
  });

  it('ignores other parameters', () => {
    expect(decode('columns=a,b&utm_source=x')).toEqual({ page: 0, filters: [], sortBy: [] });
  });

  it('decodes filter values with the codec for the field, and drops filters that decode to nothing', () => {
    const { decodeFilterValue } = buildFieldFilterCodecs({
      tags: FilterCodecs.stringArray,
      active: FilterCodecs.boolean,
    });

    expect(decode('filters.tags=a,b&filters.active=true&filters.empty=', { decodeFilterValue })).toMatchObject({
      filters: [
        { id: 'tags', value: ['a', 'b'] },
        { id: 'active', value: true },
        { id: 'empty', value: '' },
      ],
    });
    expect(decode('filters.tags=,', { decodeFilterValue }).filters).toEqual([]);
  });

  describe('defaults', () => {
    const defaultState = {
      page: 4,
      filters: [{ id: 'name', value: 'Default' }],
      sortBy: [{ id: 'id', desc: true }],
    };

    it('uses them when the URL says nothing', () => {
      expect(decode('', { defaultState })).toEqual(defaultState);
    });

    it('prefers what the URL says, for each of page, filters and sorting separately', () => {
      expect(decode('page=2', { defaultState })).toEqual({ ...defaultState, page: 1 });
      expect(decode('filters.email=x', { defaultState })).toEqual({
        ...defaultState,
        filters: [{ id: 'email', value: 'x' }],
      });
      expect(decode('sort.email=asc', { defaultState })).toEqual({
        ...defaultState,
        sortBy: [{ id: 'email', desc: false }],
      });
    });
  });
});

describe('column visibility', () => {
  it('turns a visibility map into the set of visible column ids', () => {
    expect(columnVisibilityToVisibleColumnIds({ a: true, b: false, c: true })).toEqual(new Set(['a', 'c']));
  });

  it('turns visible column ids into a visibility map for every column that has an id', () => {
    const columns = [{ id: 'a' }, { id: 'b' }, { header: 'no id' }, { id: 'c' }];

    expect(visibleColumnIdsToColumnVisibility(new Set(['a', 'c']), columns)).toEqual({ a: true, b: false, c: true });
  });
});
