import { vi } from 'vitest';

import {
  getFilterableEventFormItems,
  mergeFormItemsAcrossForms,
} from '../../../app/javascript/EventsApp/useFilterableFormItems';
import { MultipleChoiceFormItem } from '../../../app/javascript/FormAdmin/FormItemUtils';
import { buildFreeTextItem, buildMultipleChoiceItem } from '../fixtures/formItems';
import { buildCatalogCategory, buildCatalogConvention, buildCatalogFormItem } from '../fixtures/eventCatalog';

const choices = (item: unknown) => (item as MultipleChoiceFormItem).rendered_properties.choices.map((c) => c.value);

describe('getFilterableEventFormItems', () => {
  const system = (id: string, values: string[]) =>
    buildCatalogFormItem(
      {
        ...buildMultipleChoiceItem({
          identifier: 'system',
          choices: values.map((value) => ({ caption: value.toUpperCase(), value })),
        }),
        id,
      },
      'Game system',
    );

  it('is empty when nothing is exposed in the catalog', () => {
    const hidden = buildCatalogFormItem(buildFreeTextItem({ identifier: 'secret' }), 'Secret', false);

    expect(getFilterableEventFormItems(buildCatalogConvention([buildCatalogCategory({}, [hidden])]))).toEqual([]);
  });

  it('includes the exposed items, once each, across categories', () => {
    const convention = buildCatalogConvention([
      buildCatalogCategory({ id: '4' }, [buildCatalogFormItem(buildFreeTextItem({ identifier: 'theme' }), 'Theme')]),
      buildCatalogCategory({ id: '5' }, [
        buildCatalogFormItem({ ...buildFreeTextItem({ identifier: 'theme' }), id: 'other-theme' }, 'Theme'),
      ]),
    ]);

    const items = getFilterableEventFormItems(convention);

    expect(items.map((item) => item.identifier)).toEqual(['theme']);
  });

  it('merges the choices of a multiple choice item that several categories have, without duplicates', () => {
    const convention = buildCatalogConvention([
      buildCatalogCategory({ id: '4' }, [system('a', ['dnd', 'fate'])]),
      buildCatalogCategory({ id: '5' }, [system('b', ['fate', 'gurps'])]),
    ]);

    const [item] = getFilterableEventFormItems(convention);

    expect(choices(item)).toEqual(['dnd', 'fate', 'gurps']);
  });
});

describe('mergeFormItemsAcrossForms', () => {
  const form = (...items: ReturnType<typeof buildCatalogFormItem>[]) => ({ form_sections: [{ form_items: items }] });

  it('keeps items with different identifiers separate', () => {
    const merged = mergeFormItemsAcrossForms([
      form(
        buildCatalogFormItem(buildFreeTextItem({ identifier: 'one' }), 'One'),
        buildCatalogFormItem({ ...buildFreeTextItem({ identifier: 'two' }), id: 'two' }, 'Two'),
      ),
    ]);

    expect(merged.map((item) => item.identifier)).toEqual(['one', 'two']);
  });

  it('warns and takes the first when items of different types share an identifier', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const merged = mergeFormItemsAcrossForms([
      form(buildCatalogFormItem(buildFreeTextItem({ identifier: 'clash' }), 'Clash')),
      form(buildCatalogFormItem({ ...buildMultipleChoiceItem({ identifier: 'clash' }), id: 'mc' }, 'Clash')),
    ]);

    expect(merged).toHaveLength(1);
    expect(merged[0].item_type).toBe('free_text');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Don't know how to merge"));
    warn.mockRestore();
  });

  it('is empty for no forms', () => {
    expect(mergeFormItemsAcrossForms([])).toEqual([]);
  });
});
