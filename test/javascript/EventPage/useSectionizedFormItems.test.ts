import { renderHook } from '@testing-library/react';

import useSectionizedFormItems from '../../../app/javascript/EventsApp/EventPage/useSectionizedFormItems';
import { EventPageQueryData } from '../../../app/javascript/EventsApp/EventPage/queries.generated';
import { FormItemRole, FormType } from '../../../app/javascript/graphqlTypes.generated';

type EventForm = NonNullable<EventPageQueryData['convention']['event']['form']>;
type EventFormItem = EventForm['form_sections'][number]['form_items'][number];

let nextId = 1;

const freeText = (
  identifier: string | null,
  {
    format = 'text',
    publicDescription = 'Description',
    visibility = FormItemRole.Normal,
    position = nextId,
  }: {
    format?: 'text' | 'markdown';
    publicDescription?: string | null;
    visibility?: FormItemRole;
    position?: number;
  } = {},
): EventFormItem => ({
  __typename: 'FormItem',
  id: String(nextId++),
  position,
  identifier,
  item_type: 'free_text',
  public_description: publicDescription,
  rendered_properties: JSON.stringify({ caption: identifier ?? '', lines: 1, free_text_type: 'text', format }),
  default_value: null,
  visibility,
  writeability: FormItemRole.Normal,
  expose_in: null,
});

const buildForm = (items: EventFormItem[]): EventForm => ({
  __typename: 'Form',
  id: '1',
  title: 'Event form',
  form_type: FormType.Event,
  form_sections: [{ __typename: 'FormSection', id: '1', title: 'Main', position: 1, form_items: items }],
});

const sectionize = (items: EventFormItem[], response: Record<string, unknown>) =>
  renderHook(() =>
    useSectionizedFormItems({
      form: buildForm(items),
      form_response_attrs_json_with_rendered_markdown: JSON.stringify(response),
    }),
  ).result.current;

const identifiers = (items: { identifier?: string | null }[]) => items.map((item) => item.identifier);

describe('useSectionizedFormItems', () => {
  beforeEach(() => {
    nextId = 1;
  });

  it('has nothing for an event that hasn’t loaded', () => {
    const { result } = renderHook(() => useSectionizedFormItems(undefined));

    expect(result.current).toEqual({ shortFormItems: [], longFormItems: [], secretFormItems: [], formResponse: {} });
  });

  it('has nothing, but still the response, for an event with no form', () => {
    const { result } = renderHook(() =>
      useSectionizedFormItems({ form: null, form_response_attrs_json_with_rendered_markdown: '{"author":"Alice"}' }),
    );

    expect(result.current.shortFormItems).toEqual([]);
    expect(result.current.formResponse).toEqual({ author: 'Alice' });
  });

  it('gives the form response, parsed', () => {
    const { formResponse } = sectionize([freeText('author')], { author: 'Alice' });

    expect(formResponse).toEqual({ author: 'Alice' });
  });

  describe('which items are shown', () => {
    it('leaves out the title and short blurb, which the page shows in its own way', () => {
      const { shortFormItems } = sectionize([freeText('title'), freeText('short_blurb'), freeText('author')], {
        title: 'Big Game',
        short_blurb: 'A game',
        author: 'Alice',
      });

      expect(identifiers(shortFormItems)).toEqual(['author']);
    });

    it('leaves out items with no public description, or a blank one', () => {
      const { shortFormItems } = sectionize(
        [
          freeText('a', { publicDescription: null }),
          freeText('b', { publicDescription: '   ' }),
          freeText('c', { publicDescription: 'Shown' }),
        ],
        { a: 'x', b: 'x', c: 'x' },
      );

      expect(identifiers(shortFormItems)).toEqual(['c']);
    });

    it('leaves out items with no identifier', () => {
      const { shortFormItems } = sectionize([freeText(null), freeText('b')], { b: 'x' });

      expect(identifiers(shortFormItems)).toEqual(['b']);
    });

    it('leaves out items the event has no answer for', () => {
      const { shortFormItems } = sectionize([freeText('a'), freeText('b'), freeText('c')], { a: 'x', b: '' });

      expect(identifiers(shortFormItems)).toEqual(['a']);
    });

    it('keeps an item whose answer is false', () => {
      const { shortFormItems } = sectionize([freeText('can_play_concurrently')], { can_play_concurrently: false });

      expect(identifiers(shortFormItems)).toEqual(['can_play_concurrently']);
    });

    it('lists items in the form’s order', () => {
      const { shortFormItems } = sectionize(
        [freeText('b', { position: 2 }), freeText('a', { position: 1 }), freeText('c', { position: 3 })],
        { a: 'x', b: 'x', c: 'x' },
      );

      expect(identifiers(shortFormItems)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('which section an item goes in', () => {
    it('puts markdown text in the long form items', () => {
      const result = sectionize([freeText('notes', { format: 'markdown' }), freeText('author')], {
        notes: '<p>x</p>',
        author: 'A',
      });

      expect(identifiers(result.longFormItems)).toEqual(['notes']);
      expect(identifiers(result.shortFormItems)).toEqual(['author']);
    });

    it('puts anything only some people can see in the secret items, whatever kind it is', () => {
      const result = sectionize(
        [
          freeText('hidden', { visibility: FormItemRole.TeamMember }),
          freeText('hidden_notes', { format: 'markdown', visibility: FormItemRole.Admin }),
          freeText('author'),
        ],
        { hidden: 'x', hidden_notes: 'y', author: 'A' },
      );

      expect(identifiers(result.secretFormItems)).toEqual(['hidden', 'hidden_notes']);
      expect(identifiers(result.shortFormItems)).toEqual(['author']);
      expect(result.longFormItems).toEqual([]);
    });

    it('puts the description first among the long items', () => {
      const { longFormItems } = sectionize(
        [
          freeText('notes', { format: 'markdown', position: 1 }),
          freeText('description', { format: 'markdown', position: 2 }),
          freeText('other', { format: 'markdown', position: 3 }),
        ],
        { notes: 'a', description: 'b', other: 'c' },
      );

      expect(identifiers(longFormItems)).toEqual(['description', 'notes', 'other']);
    });
  });
});
