import {
  EventListEventsQueryData,
  EventListEventsQueryDocument,
  EventListEventsQueryVariables,
} from '../../app/javascript/EventsApp/EventCatalog/EventList/queries.generated';
import { buildIntercodeApolloCache } from '../../app/javascript/useIntercodeApolloClient';

type EventEntry = EventListEventsQueryData['convention']['events_paginated']['entries'][number];
type EventsPaginationData = EventListEventsQueryData['convention']['events_paginated'];

function makeEntry(id: string): EventEntry {
  return {
    __typename: 'Event',
    id,
    title: `Event ${id}`,
    created_at: '2024-01-01T00:00:00Z',
    short_blurb_html: null,
    form_response_attrs_json_with_rendered_markdown: null,
    my_rating: null,
    length_seconds: 3600,
    event_category: { __typename: 'EventCategory', id: '1' },
    runs: [],
    team_members: [],
    registration_policy: null,
  };
}

function makeEventsPagination(
  page: number,
  perPage: number,
  eventIds: string[],
  totalEntries = 40,
): EventsPaginationData {
  return {
    __typename: 'EventsPagination',
    current_page: page,
    per_page: perPage,
    total_entries: totalEntries,
    total_pages: Math.ceil(totalEntries / perPage),
    entries: eventIds.map(makeEntry),
  };
}

function makeQueryData(
  page: number,
  perPage: number,
  eventIds: string[],
  totalEntries?: number,
): EventListEventsQueryData {
  return {
    __typename: 'Query',
    currentAbility: { __typename: 'Ability', can_read_schedule: false },
    convention: {
      __typename: 'Convention',
      id: '1',
      timezone_mode: 'convention_local' as EventListEventsQueryData['convention']['timezone_mode'],
      events_paginated: makeEventsPagination(page, perPage, eventIds, totalEntries),
    },
  };
}

describe('buildIntercodeApolloCache', () => {
  describe('Convention.events_paginated merge policy', () => {
    const vars = (page: number, pageSize: number): EventListEventsQueryVariables => ({ page, pageSize });

    it('stores the first page of events', () => {
      const cache = buildIntercodeApolloCache();
      cache.writeQuery({
        query: EventListEventsQueryDocument,
        variables: vars(1, 20),
        data: makeQueryData(1, 20, ['event-1', 'event-2']),
      });

      const result = cache.readQuery({ query: EventListEventsQueryDocument, variables: vars(1, 20) });
      expect(result?.convention.events_paginated.entries).toHaveLength(2);
      expect(result?.convention.events_paginated.entries[0].id).toBe('event-1');
      expect(result?.convention.events_paginated.entries[1].id).toBe('event-2');
    });

    it('merges a second page at the correct offset', () => {
      const cache = buildIntercodeApolloCache();

      cache.writeQuery({
        query: EventListEventsQueryDocument,
        variables: vars(1, 2),
        data: makeQueryData(1, 2, ['event-1', 'event-2'], 4),
      });
      cache.writeQuery({
        query: EventListEventsQueryDocument,
        variables: vars(2, 2),
        data: makeQueryData(2, 2, ['event-3', 'event-4'], 4),
      });

      const result = cache.readQuery({ query: EventListEventsQueryDocument, variables: vars(1, 2) });
      expect(result?.convention.events_paginated.entries).toHaveLength(4);
      expect(result?.convention.events_paginated.entries[0].id).toBe('event-1');
      expect(result?.convention.events_paginated.entries[1].id).toBe('event-2');
      expect(result?.convention.events_paginated.entries[2].id).toBe('event-3');
      expect(result?.convention.events_paginated.entries[3].id).toBe('event-4');
    });

    it('uses defaults of page=1 and per_page=20 when args are absent', () => {
      const cache = buildIntercodeApolloCache();

      cache.writeQuery({
        query: EventListEventsQueryDocument,
        variables: {},
        data: makeQueryData(1, 20, ['event-1', 'event-2']),
      });

      const result = cache.readQuery({ query: EventListEventsQueryDocument, variables: {} });
      // With default page=1 and per_page=20, offset=0, so entries start at index 0
      expect(result?.convention.events_paginated.entries[0].id).toBe('event-1');
      expect(result?.convention.events_paginated.entries[1].id).toBe('event-2');
    });

    it('preserves metadata from the incoming page', () => {
      const cache = buildIntercodeApolloCache();

      cache.writeQuery({
        query: EventListEventsQueryDocument,
        variables: vars(1, 2),
        data: makeQueryData(1, 2, ['event-1', 'event-2'], 4),
      });
      cache.writeQuery({
        query: EventListEventsQueryDocument,
        variables: vars(2, 2),
        data: makeQueryData(2, 2, ['event-3', 'event-4'], 4),
      });

      const result = cache.readQuery({ query: EventListEventsQueryDocument, variables: vars(2, 2) });
      expect(result?.convention.events_paginated.current_page).toBe(2);
      expect(result?.convention.events_paginated.total_entries).toBe(4);
      expect(result?.convention.events_paginated.total_pages).toBe(2);
    });

    it('all events_paginated queries share the same cache slot (keyArgs: false)', () => {
      const cache = buildIntercodeApolloCache();

      cache.writeQuery({
        query: EventListEventsQueryDocument,
        variables: vars(1, 20),
        data: makeQueryData(1, 20, ['event-1', 'event-2']),
      });

      // Reading with different variables should still return the merged data
      const result = cache.readQuery({ query: EventListEventsQueryDocument, variables: vars(2, 20) });
      expect(result?.convention.events_paginated.entries[0].id).toBe('event-1');
    });
  });
});
