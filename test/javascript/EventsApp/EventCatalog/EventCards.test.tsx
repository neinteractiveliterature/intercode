import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { render, userEvent } from '../../testUtils';
import EventListEvents from '../../../../app/javascript/EventsApp/EventCatalog/EventList/EventListEvents';
import EventCard from '../../../../app/javascript/EventsApp/EventCatalog/EventList/EventCard';
import { RateEventDocument } from '../../../../app/javascript/EventRatings/mutations.generated';
import { buildFreeTextItem } from '../../fixtures/formItems';
import {
  buildCatalogCategory,
  buildCatalogConvention,
  buildCatalogEvent,
  buildCatalogFormItem,
  buildCatalogRun,
  buildCatalogTeamMember,
  buildEventListData,
  CatalogCategory,
  CatalogEventEntry,
} from '../../fixtures/eventCatalog';

const category = buildCatalogCategory();
// (the page merges the loader's convention in, as the dates are needed for the convention days)
const listConvention = { ...buildCatalogConvention(), ...buildEventListData([]).convention };
const appRootContextValue = { timezoneName: 'UTC' };

const withCategory = (event: CatalogEventEntry, eventCategory: CatalogCategory = category) => ({
  ...event,
  event_category: eventCategory,
});

describe('EventCard', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const renderCard = (
    event: CatalogEventEntry,
    {
      eventCategory = category,
      canReadSchedule = true,
      sortBy,
      myProfile,
      apolloMocks,
    }: {
      eventCategory?: CatalogCategory;
      canReadSchedule?: boolean;
      sortBy?: { id: string; desc: boolean }[];
      myProfile?: boolean;
      apolloMocks?: MockLink.MockedResponse[];
    } = {},
  ) =>
    render(
      <EventCard
        convention={listConvention}
        event={withCategory(event, eventCategory)}
        canReadSchedule={canReadSchedule}
        sortBy={sortBy}
      />,
      {
        appRootContextValue: {
          ...appRootContextValue,
          ...(myProfile ? { myProfile: { __typename: 'UserConProfile', id: '2', name: 'Me' } as never } : {}),
        },
        apolloMocks,
      },
    );

  it('shows the title as a link to the event, the category and the blurb', async () => {
    const { getByRole, getByText } = await renderCard(buildCatalogEvent({ id: '9', title: 'Big Game' }));

    expect(getByRole('link', { name: 'Big Game' }).getAttribute('href')).toBe('/events/9-big-game');
    expect(getByText('Tabletop RPG')).toBeTruthy();
    expect(getByText('A fine game')).toBeTruthy();
  });

  describe('when it runs', () => {
    it('says it is unscheduled when there are no runs', async () => {
      const { getByText } = await renderCard(buildCatalogEvent());

      expect(getByText('Unscheduled')).toBeTruthy();
    });

    it('does not show run times to someone who cannot read the schedule', async () => {
      const { queryByText } = await renderCard(
        buildCatalogEvent({ runs: [buildCatalogRun('1', '2026-06-05T18:00:00Z')] }),
        { canReadSchedule: false },
      );

      expect(queryByText('Unscheduled')).toBeNull();
      expect(document.body.textContent).not.toMatch(/6:00/);
    });

    it('lists up to four runs in time order', async () => {
      const { container } = await renderCard(
        buildCatalogEvent({
          runs: [buildCatalogRun('2', '2026-06-06T18:00:00Z'), buildCatalogRun('1', '2026-06-05T14:00:00Z')],
        }),
      );

      const lead = container.querySelector('.lead') as HTMLElement;
      const text = lead.textContent ?? '';
      expect(text.indexOf('2:00pm')).toBeGreaterThan(-1);
      expect(text.indexOf('2:00pm')).toBeLessThan(text.indexOf('6:00pm'));
      expect(text).toMatch(/ and /);
    });

    it('gives only the time for a second run on the same day', async () => {
      const { container } = await renderCard(
        buildCatalogEvent({
          runs: [buildCatalogRun('1', '2026-06-05T14:00:00Z'), buildCatalogRun('2', '2026-06-05T18:00:00Z')],
        }),
      );

      const text = (container.querySelector('.lead') as HTMLElement).textContent ?? '';
      // (the date shows once per size variant, so a second run's date would add more)
      expect(text.match(/June 5, 2026/g)).toHaveLength(1);
      expect(text.match(/Jun 5, 2026/g)).toHaveLength(1);
      expect(text).toMatch(/and 6:00pm/);
    });

    it('summarises more than four runs by count and first start', async () => {
      const runs = [1, 2, 3, 4, 5].map((n) => buildCatalogRun(String(n), `2026-06-0${n}T14:00:00Z`));
      const { container } = await renderCard(buildCatalogEvent({ runs }));

      expect((container.querySelector('.lead') as HTMLElement).textContent).toMatch(/^5 runs starting /);
    });
  });

  describe('the team', () => {
    it('lists displayed team members in surname order, with the category’s name for the role', async () => {
      const { getByText } = await renderCard(
        buildCatalogEvent({
          team_members: [
            buildCatalogTeamMember('1', 'Zed Zimmer'),
            buildCatalogTeamMember('2', 'Amy Adams'),
            buildCatalogTeamMember('3', 'Hidden Person', { display: false }),
          ],
        }),
      );

      expect(getByText('GMs:')).toBeTruthy();
      const content = getByText('GMs:').parentElement?.textContent ?? '';
      expect(content).toBe('GMs: Amy Adams, Zed Zimmer');
    });

    it('uses the singular for one team member', async () => {
      const { getByText } = await renderCard(
        buildCatalogEvent({ team_members: [buildCatalogTeamMember('1', 'Amy Adams')] }),
      );

      expect(getByText('GM:')).toBeTruthy();
    });

    it('shows avatars for team members who have them enabled', async () => {
      const { container } = await renderCard(
        buildCatalogEvent({ team_members: [buildCatalogTeamMember('1', 'Amy Adams', { gravatar: true })] }),
      );

      expect(container.querySelector('img')).toBeTruthy();
    });

    it('shows no team line without displayed team members', async () => {
      const { queryByText } = await renderCard(buildCatalogEvent());

      expect(queryByText(/GMs?:/)).toBeNull();
    });
  });

  describe('the author', () => {
    const team = [buildCatalogTeamMember('1', 'Amy Adams'), buildCatalogTeamMember('2', 'Bob Brown')];

    it('is shown when it is not just the team', async () => {
      const { getByText } = await renderCard(
        buildCatalogEvent({ team_members: team, form_response_attrs: { author: 'Someone Else' } }),
      );

      expect(getByText('Someone Else')).toBeTruthy();
    });

    it('is left out when it is exactly the team', async () => {
      const { queryByText } = await renderCard(
        buildCatalogEvent({ team_members: team, form_response_attrs: { author: 'Amy Adams and Bob Brown' } }),
      );

      expect(queryByText(/Author/)).toBeNull();
    });

    it('is shown when it names the team plus others', async () => {
      const { getByText } = await renderCard(
        buildCatalogEvent({
          team_members: team,
          form_response_attrs: { author: 'Amy Adams and Bob Brown and Carol Clark' },
        }),
      );

      expect(getByText(/Carol Clark/)).toBeTruthy();
    });

    it('pluralizes the label for several authors', async () => {
      const { getByText } = await renderCard(
        buildCatalogEvent({ form_response_attrs: { author: 'Carol Clark, Dan Davis' } }),
      );

      expect(getByText(/Authors:/)).toBeTruthy();
    });
  });

  it('shows the organization', async () => {
    const { getByText } = await renderCard(buildCatalogEvent({ form_response_attrs: { organization: 'Acme Games' } }));

    expect(getByText('Acme Games')).toBeTruthy();
  });

  describe('items exposed in the catalog', () => {
    const exposed = buildFreeTextItem({ identifier: 'system', caption: 'System' });
    const hidden = buildFreeTextItem({ identifier: 'secret', caption: 'Secret' });
    const richCategory = () =>
      buildCatalogCategory({}, [
        buildCatalogFormItem(exposed, 'Game system'),
        buildCatalogFormItem({ ...hidden, id: 'item-secret' }, 'Secret thing', false),
      ]);

    it('are shown with their public description and value', async () => {
      const { getByText } = await renderCard(
        buildCatalogEvent({ form_response_attrs: { system: 'D&D', secret: 'hush' } }),
        { eventCategory: richCategory() },
      );

      expect(getByText('Game system:')).toBeTruthy();
      expect(getByText(/D&D/)).toBeTruthy();
    });

    it('are left out when not exposed, or when there is no value', async () => {
      const { queryByText } = await renderCard(buildCatalogEvent({ form_response_attrs: { secret: 'hush' } }), {
        eventCategory: richCategory(),
      });

      expect(queryByText('Game system:')).toBeNull();
      expect(queryByText('Secret thing:')).toBeNull();
      expect(queryByText(/hush/)).toBeNull();
    });
  });

  describe('when it was added', () => {
    it('is shown when sorting by order added', async () => {
      const { getByText } = await renderCard(buildCatalogEvent({ created_at: '2026-01-02T12:00:00Z' }), {
        sortBy: [{ id: 'created_at', desc: true }],
      });

      expect(getByText(/Added .*Jan/)).toBeTruthy();
    });

    it('is not shown otherwise', async () => {
      const { queryByText } = await renderCard(buildCatalogEvent(), { sortBy: [{ id: 'title', desc: false }] });

      expect(queryByText(/Added/)).toBeNull();
    });
  });

  describe('rating', () => {
    it('is offered only to people with a profile', async () => {
      const without = await renderCard(buildCatalogEvent());
      expect(without.queryByRole('button', { name: /favorite|like|rating/i })).toBeNull();
      without.unmount();

      const withProfile = await renderCard(buildCatalogEvent(), { myProfile: true });
      expect(withProfile.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('sends the chosen rating for the event', async () => {
      const sent = vi.fn();
      const { getAllByRole } = await renderCard(buildCatalogEvent({ id: '9' }), {
        myProfile: true,
        apolloMocks: [
          {
            request: {
              query: RateEventDocument,
              variables: (variables: unknown) => {
                sent(variables);
                return true;
              },
            },
            result: {
              data: {
                rateEvent: { __typename: 'RateEventPayload', event: { __typename: 'Event', id: '9', my_rating: 1 } },
              },
            },
          },
        ],
      });

      // the buttons are in the order of the ratings (like, dislike, ...)
      await user.click(getAllByRole('button')[0]);

      await vi.waitFor(() => expect(sent).toHaveBeenCalled());
      expect(sent.mock.calls[0][0]).toMatchObject({ eventId: '9' });
    });
  });
});

describe('EventListEvents', () => {
  const renderList = (
    entries: CatalogEventEntry[],
    {
      sortBy,
      fetchMoreIfNeeded = vi.fn(),
    }: { sortBy?: { id: string; desc: boolean }[]; fetchMoreIfNeeded?: () => void } = {},
  ) =>
    render(
      <EventListEvents
        convention={listConvention}
        eventsPaginated={{
          ...buildEventListData(entries).convention.events_paginated,
          entries: entries.map((e) => withCategory(e)),
        }}
        sortBy={sortBy}
        canReadSchedule
        fetchMoreIfNeeded={fetchMoreIfNeeded}
      />,
      { appRootContextValue },
    );

  const friday = (id: string, title: string, time = '14:00') =>
    buildCatalogEvent({ id, title, runs: [buildCatalogRun(`r${id}`, `2026-06-05T${time}:00Z`)] });
  const saturday = (id: string, title: string) =>
    buildCatalogEvent({ id, title, runs: [buildCatalogRun(`r${id}`, '2026-06-06T14:00:00Z')] });

  it('shows a card for each event, in the order given', async () => {
    const { getAllByRole } = await renderList([friday('1', 'First'), friday('2', 'Second')]);

    expect(getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent)).toEqual(['First', 'Second']);
  });

  describe('in convention order', () => {
    const sortBy = [{ id: 'first_scheduled_run_start', desc: false }];

    it('puts a heading for each convention day above its first event', async () => {
      const { getAllByRole } = await renderList([friday('1', 'First'), friday('2', 'Second'), saturday('3', 'Third')], {
        sortBy,
      });

      const headings = getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
      expect(headings).toEqual([expect.stringMatching(/Friday/), expect.stringMatching(/Saturday/)]);
    });

    it('puts the first day’s heading above the very first event', async () => {
      const { container } = await renderList([friday('1', 'First')], { sortBy });

      const first = container.firstElementChild as HTMLElement;
      expect(first.tagName).toBe('H3');
    });
  });

  it('puts no day headings in when sorted any other way', async () => {
    const { queryAllByRole } = await renderList([friday('1', 'First'), saturday('2', 'Second')], {
      sortBy: [{ id: 'title', desc: false }],
    });

    expect(queryAllByRole('heading', { level: 3 })).toEqual([]);
  });
});
