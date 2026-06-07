import { useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { vi } from 'vitest';
import { render, fireEvent, waitFor } from '../testUtils';
import RateEventControl from '../../../app/javascript/EventRatings/RateEventControl';
import useRateEvent from '../../../app/javascript/EventRatings/useRateEvent';
import {
  EventListEventsQueryData,
  EventListEventsQueryDocument,
} from '../../../app/javascript/EventsApp/EventCatalog/EventList/queries.generated';
import { RateEventDocument, RateEventMutationData } from '../../../app/javascript/EventRatings/mutations.generated';
import { TimezoneMode } from '../../../app/javascript/graphqlTypes.generated';
import { MockedResponse } from '@apollo/client/testing';
import { buildIntercodeApolloCache } from '../../../app/javascript/useIntercodeApolloClient';

type EventEntry = EventListEventsQueryData['convention']['events_paginated']['entries'][number];

function makeEntry(id: string, my_rating: number | null = null): EventEntry {
  return {
    __typename: 'Event',
    id,
    title: `Event ${id}`,
    created_at: null,
    short_blurb_html: null,
    form_response_attrs_json_with_rendered_markdown: null,
    my_rating,
    length_seconds: 3600,
    event_category: { __typename: 'EventCategory', id: '1' },
    runs: [],
    team_members: [],
    registration_policy: null,
  };
}

function makeQueryData(entry: EventEntry): EventListEventsQueryData {
  return {
    __typename: 'Query',
    currentAbility: { __typename: 'Ability', can_read_schedule: false },
    convention: {
      __typename: 'Convention',
      id: '1',
      timezone_mode: TimezoneMode.ConventionLocal,
      events_paginated: {
        __typename: 'EventsPagination',
        total_entries: 1,
        total_pages: 1,
        current_page: 1,
        per_page: 10,
        entries: [entry],
      },
    },
  };
}

// Mimics how EventList reads rating from Apollo cache via useQuery and passes it to RateEventControl.
// This is the critical data flow: the rating display is controlled by Apollo cache, not local state.
function EventRatingFromCache({ eventId }: { eventId: string }) {
  const { data, loading } = useQuery(EventListEventsQueryDocument, {
    variables: { page: 1, pageSize: 10 },
  });
  const rateEvent = useRateEvent();

  if (loading || !data) {
    return <div data-testid="loading" />;
  }

  const event = data.convention.events_paginated.entries.find((e) => e.id === eventId);
  if (!event) {
    return <div data-testid="not-found" />;
  }

  return <RateEventControl value={event.my_rating} onChange={(rating) => rateEvent(event.id, rating)} />;
}

// Mimics EventList's pattern more exactly: uses previousData as a fallback during loading.
// This is important because EventList does: `const data = loading && previousData ? previousData : currentData`
// If loading becomes true after the mutation (due to variable changes from revalidation),
// and previousData still has the pre-mutation rating, the star would incorrectly revert to hollow.
function EventRatingWithPreviousDataPattern({ eventId, extraVar }: { eventId: string; extraVar?: string }) {
  const {
    data: currentData,
    previousData,
    loading,
  } = useQuery(EventListEventsQueryDocument, {
    variables: { page: 1, pageSize: 10, ...(extraVar ? { fetchFormItemIdentifiers: [extraVar] } : {}) },
  });
  const rateEvent = useRateEvent();
  // This is the same pattern as EventList
  const data = loading && previousData ? previousData : currentData;

  if (!data) {
    return <div data-testid="loading" />;
  }

  const event = data.convention.events_paginated.entries.find((e) => e.id === eventId);
  if (!event) {
    return <div data-testid="not-found" />;
  }

  return <RateEventControl value={event.my_rating} onChange={(rating) => rateEvent(event.id, rating)} />;
}

// A wrapper that lets tests change variables to simulate what happens when
// filterableFormItemIdentifiers changes after revalidation.
function VariableChangingWrapper({ eventId }: { eventId: string }) {
  const [extraVar, setExtraVar] = useState<string | undefined>(undefined);
  return (
    <>
      <button data-testid="change-vars" onClick={() => setExtraVar('new-identifier')}>
        Change variables
      </button>
      <EventRatingWithPreviousDataPattern eventId={eventId} extraVar={extraVar} />
    </>
  );
}

describe('RateEventControl', () => {
  test('shows two buttons (favorite and hidden) when not rated', async () => {
    const onChange = vi.fn();
    const { getAllByRole } = await render(<RateEventControl value={null} onChange={onChange} />);
    expect(getAllByRole('button')).toHaveLength(2);
  });

  test('shows hollow star icon when not rated', async () => {
    const onChange = vi.fn();
    const { container } = await render(<RateEventControl value={null} onChange={onChange} />);
    expect(container.querySelector('.bi-star')).toBeTruthy();
    expect(container.querySelector('.bi-star-fill')).toBeNull();
  });

  test('shows only one button when favorited', async () => {
    const onChange = vi.fn();
    const { getAllByRole } = await render(<RateEventControl value={1} onChange={onChange} />);
    expect(getAllByRole('button')).toHaveLength(1);
  });

  test('shows filled star icon when favorited', async () => {
    const onChange = vi.fn();
    const { container } = await render(<RateEventControl value={1} onChange={onChange} />);
    expect(container.querySelector('.bi-star-fill')).toBeTruthy();
  });

  test('shows only one button when hidden', async () => {
    const onChange = vi.fn();
    const { getAllByRole } = await render(<RateEventControl value={-1} onChange={onChange} />);
    expect(getAllByRole('button')).toHaveLength(1);
  });

  test('calls onChange(1) when favorite button is clicked', async () => {
    const onChange = vi.fn();
    const { getByRole } = await render(<RateEventControl value={null} onChange={onChange} />);
    fireEvent.click(getByRole('button', { name: 'Favorite' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  test('calls onChange(0) when the selected button is clicked while favorited', async () => {
    const onChange = vi.fn();
    const { getByRole } = await render(<RateEventControl value={1} onChange={onChange} />);
    // The single button when favorited has accessible name "Favorite" and acts as the clear button
    fireEvent.click(getByRole('button', { name: 'Favorite' }));
    expect(onChange).toHaveBeenCalledWith(0);
  });

  test('calls onChange(-1) when hide button is clicked', async () => {
    const onChange = vi.fn();
    const { getByRole } = await render(<RateEventControl value={null} onChange={onChange} />);
    fireEvent.click(getByRole('button', { name: 'Hidden' }));
    expect(onChange).toHaveBeenCalledWith(-1);
  });
});

describe('Event catalog rating integration', () => {
  const queryVariables = { page: 1, pageSize: 10 };

  test('shows hollow star before favoriting', async () => {
    const queryMock: MockedResponse<EventListEventsQueryData> = {
      request: { query: EventListEventsQueryDocument, variables: queryVariables },
      result: { data: makeQueryData(makeEntry('1', null)) },
    };

    const { container, queryByTestId } = await render(<EventRatingFromCache eventId="1" />, {
      apolloMocks: [queryMock],
    });

    await waitFor(() => expect(queryByTestId('loading')).toBeNull());
    expect(container.querySelector('.bi-star')).toBeTruthy();
    expect(container.querySelector('.bi-star-fill')).toBeNull();
  });

  // Reproduces issue #11614: after favoriting, the star should become filled and the
  // component should switch to showing a single "clear" button instead of two buttons.
  // This test will fail if the Apollo cache update from the RateEvent mutation does not
  // propagate back to the useQuery(EventListEventsQueryDocument) that drives the display.
  test('updates to filled star after favoriting', async () => {
    const queryMock: MockedResponse<EventListEventsQueryData> = {
      request: { query: EventListEventsQueryDocument, variables: queryVariables },
      result: { data: makeQueryData(makeEntry('1', null)) },
    };

    const mutationCalled = vi.fn();
    const mutationMock: MockedResponse<RateEventMutationData> = {
      request: { query: RateEventDocument, variables: { eventId: '1', rating: 1 } },
      result: () => {
        mutationCalled();
        return {
          data: {
            __typename: 'Mutation',
            rateEvent: {
              __typename: 'RateEventPayload',
              event: { __typename: 'Event', id: '1', my_rating: 1 },
            },
          },
        };
      },
    };

    const { container, getByRole, queryByTestId } = await render(<EventRatingFromCache eventId="1" />, {
      apolloMocks: [queryMock, mutationMock],
    });

    await waitFor(() => expect(queryByTestId('loading')).toBeNull());

    // Initially shows hollow star and two buttons
    expect(container.querySelector('.bi-star')).toBeTruthy();
    expect(container.querySelector('.bi-star-fill')).toBeNull();

    // Click the favorite button
    fireEvent.click(getByRole('button', { name: 'Favorite' }));

    // Verify the mutation was called
    await waitFor(() => expect(mutationCalled).toHaveBeenCalledTimes(1));

    // After mutation, the Apollo cache should update Event:1.my_rating = 1, which should
    // propagate to useQuery and cause the star to become filled
    await waitFor(() => {
      expect(container.querySelector('.bi-star-fill')).toBeTruthy();
    });
  });

  // Reproduces issue #11614: once favorited, clicking the star should unfavorite (clear the rating).
  // This requires the UI to first show the selected state (filled star), which is a prerequisite.
  test('allows unfavoriting after favoriting', async () => {
    const queryMock: MockedResponse<EventListEventsQueryData> = {
      request: { query: EventListEventsQueryDocument, variables: queryVariables },
      result: { data: makeQueryData(makeEntry('1', null)) },
    };

    const favoriteMock: MockedResponse<RateEventMutationData> = {
      request: { query: RateEventDocument, variables: { eventId: '1', rating: 1 } },
      result: {
        data: {
          __typename: 'Mutation',
          rateEvent: {
            __typename: 'RateEventPayload',
            event: { __typename: 'Event', id: '1', my_rating: 1 },
          },
        },
      },
    };

    const unfavoriteCalled = vi.fn();
    const unfavoriteMock: MockedResponse<RateEventMutationData> = {
      request: { query: RateEventDocument, variables: { eventId: '1', rating: 0 } },
      result: () => {
        unfavoriteCalled();
        return {
          data: {
            __typename: 'Mutation',
            rateEvent: {
              __typename: 'RateEventPayload',
              event: { __typename: 'Event', id: '1', my_rating: 0 },
            },
          },
        };
      },
    };

    const { container, getByRole, getAllByRole, queryByTestId } = await render(<EventRatingFromCache eventId="1" />, {
      apolloMocks: [queryMock, favoriteMock, unfavoriteMock],
    });

    await waitFor(() => expect(queryByTestId('loading')).toBeNull());

    // Favorite the event
    fireEvent.click(getByRole('button', { name: 'Favorite' }));

    // Wait for the UI to show the favorited state (filled star, single button)
    await waitFor(() => {
      expect(container.querySelector('.bi-star-fill')).toBeTruthy();
    });

    // Now unfavorite: click the single button (the clear button)
    const clearButton = getByRole('button', { name: 'Favorite' });
    fireEvent.click(clearButton);

    // After unfavoriting, should return to two buttons with hollow star
    await waitFor(() => {
      expect(unfavoriteCalled).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(getAllByRole('button')).toHaveLength(2);
      expect(container.querySelector('.bi-star-fill')).toBeNull();
    });
  });
});

// Re-run the key integration tests with the production Apollo cache (keyArgs: false + custom merge).
// This catches bugs that only manifest with the real cache configuration used in production.
describe('Event catalog rating integration (with production Apollo cache)', () => {
  const queryVariables = { page: 1, pageSize: 10 };

  test('updates to filled star after favoriting', async () => {
    const queryMock: MockedResponse<EventListEventsQueryData> = {
      request: { query: EventListEventsQueryDocument, variables: queryVariables },
      result: { data: makeQueryData(makeEntry('1', null)) },
    };

    const mutationCalled = vi.fn();
    const mutationMock: MockedResponse<RateEventMutationData> = {
      request: { query: RateEventDocument, variables: { eventId: '1', rating: 1 } },
      result: () => {
        mutationCalled();
        return {
          data: {
            __typename: 'Mutation',
            rateEvent: {
              __typename: 'RateEventPayload',
              event: { __typename: 'Event', id: '1', my_rating: 1 },
            },
          },
        };
      },
    };

    const { container, getByRole, queryByTestId } = await render(<EventRatingFromCache eventId="1" />, {
      apolloMocks: [queryMock, mutationMock],
      apolloCache: buildIntercodeApolloCache(),
    });

    await waitFor(() => expect(queryByTestId('loading')).toBeNull());

    expect(container.querySelector('.bi-star')).toBeTruthy();
    expect(container.querySelector('.bi-star-fill')).toBeNull();

    fireEvent.click(getByRole('button', { name: 'Favorite' }));

    await waitFor(() => expect(mutationCalled).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      expect(container.querySelector('.bi-star-fill')).toBeTruthy();
    });
  });

  test('allows unfavoriting after favoriting', async () => {
    const queryMock: MockedResponse<EventListEventsQueryData> = {
      request: { query: EventListEventsQueryDocument, variables: queryVariables },
      result: { data: makeQueryData(makeEntry('1', null)) },
    };

    const favoriteMock: MockedResponse<RateEventMutationData> = {
      request: { query: RateEventDocument, variables: { eventId: '1', rating: 1 } },
      result: {
        data: {
          __typename: 'Mutation',
          rateEvent: {
            __typename: 'RateEventPayload',
            event: { __typename: 'Event', id: '1', my_rating: 1 },
          },
        },
      },
    };

    const unfavoriteCalled = vi.fn();
    const unfavoriteMock: MockedResponse<RateEventMutationData> = {
      request: { query: RateEventDocument, variables: { eventId: '1', rating: 0 } },
      result: () => {
        unfavoriteCalled();
        return {
          data: {
            __typename: 'Mutation',
            rateEvent: {
              __typename: 'RateEventPayload',
              event: { __typename: 'Event', id: '1', my_rating: 0 },
            },
          },
        };
      },
    };

    const { container, getByRole, getAllByRole, queryByTestId } = await render(<EventRatingFromCache eventId="1" />, {
      apolloMocks: [queryMock, favoriteMock, unfavoriteMock],
      apolloCache: buildIntercodeApolloCache(),
    });

    await waitFor(() => expect(queryByTestId('loading')).toBeNull());

    fireEvent.click(getByRole('button', { name: 'Favorite' }));

    await waitFor(() => {
      expect(container.querySelector('.bi-star-fill')).toBeTruthy();
    });

    fireEvent.click(getByRole('button', { name: 'Favorite' }));

    await waitFor(() => {
      expect(unfavoriteCalled).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(getAllByRole('button')).toHaveLength(2);
      expect(container.querySelector('.bi-star-fill')).toBeNull();
    });
  });
});

// Tests the EventList previousData fallback pattern specifically.
// EventList does: `const data = loading && previousData ? previousData : currentData`
// If Apollo sets loading=true after a variable change (triggered by revalidation updating
// filterableFormItemIdentifiers), and previousData still has my_rating: null, the star
// would incorrectly revert to hollow even though the mutation already set my_rating: 1 in cache.
describe('EventList previousData fallback pattern', () => {
  const baseQueryVariables = { page: 1, pageSize: 10 };
  const changedQueryVariables = { page: 1, pageSize: 10, fetchFormItemIdentifiers: ['new-identifier'] };

  test('maintains filled star even when useQuery variables change after favoriting', async () => {
    const queryMock: MockedResponse<EventListEventsQueryData> = {
      request: { query: EventListEventsQueryDocument, variables: baseQueryVariables },
      result: { data: makeQueryData(makeEntry('1', null)) },
    };

    // When variables change (fetchFormItemIdentifiers added), the mock for the new variables
    // returns the updated data with my_rating: 1 (as would happen with cache-first if the
    // cache was updated by the mutation)
    const changedVarsQueryMock: MockedResponse<EventListEventsQueryData> = {
      request: { query: EventListEventsQueryDocument, variables: changedQueryVariables },
      result: { data: makeQueryData(makeEntry('1', 1)) },
    };

    const mutationMock: MockedResponse<RateEventMutationData> = {
      request: { query: RateEventDocument, variables: { eventId: '1', rating: 1 } },
      result: {
        data: {
          __typename: 'Mutation',
          rateEvent: {
            __typename: 'RateEventPayload',
            event: { __typename: 'Event', id: '1', my_rating: 1 },
          },
        },
      },
    };

    const { container, getByRole, getByTestId } = await render(<VariableChangingWrapper eventId="1" />, {
      apolloMocks: [queryMock, mutationMock, changedVarsQueryMock],
      apolloCache: buildIntercodeApolloCache(),
    });

    // Wait for initial load
    await waitFor(() => expect(container.querySelector('.bi-star')).toBeTruthy());

    // Click favorite to trigger mutation
    fireEvent.click(getByRole('button', { name: 'Favorite' }));

    // Wait for mutation to complete and star to be filled
    await waitFor(() => {
      expect(container.querySelector('.bi-star-fill')).toBeTruthy();
    });

    // Simulate what happens after revalidation: variables change (new fetchFormItemIdentifiers)
    fireEvent.click(getByTestId('change-vars'));

    // Even after variables change, the star should REMAIN filled (not revert to hollow).
    // This test will FAIL if the `loading && previousData` pattern causes a regression
    // because previousData still holds the pre-mutation data.
    await waitFor(() => {
      expect(container.querySelector('.bi-star-fill')).toBeTruthy();
    });
  });
});
