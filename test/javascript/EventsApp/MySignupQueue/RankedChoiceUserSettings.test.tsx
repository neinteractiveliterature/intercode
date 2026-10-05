import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { render, userEvent, waitFor, within } from '../../testUtils';
import RankedChoiceUserSettings from '../../../../app/javascript/EventsApp/MySignupQueue/RankedChoiceUserSettings';
import {
  CreateMyRankedChoiceUserConstraintDocument,
  DeleteRankedChoiceUserConstraintDocument,
  UpdateRankedChoiceUserConstraintDocument,
} from '../../../../app/javascript/EventsApp/MySignupQueue/mutations.generated';
import { MySignupQueueQueryDocument } from '../../../../app/javascript/EventsApp/MySignupQueue/queries.generated';
import { UpdateUserConProfileDocument } from '../../../../app/javascript/UserConProfiles/mutations.generated';
import Timespan from '../../../../app/javascript/Timespan';
import { RankedChoiceFallbackAction } from '../../../../app/javascript/graphqlTypes.generated';
import {
  buildMySignupQueueData,
  buildQueueConstraint,
  buildQueueSignup,
  QueueConstraint,
  QueueSignup,
} from '../../fixtures/signupQueue';

// A convention from Friday 6am to Monday 6am in New York.  Convention days start at 6am, so the days are Friday
// 6am-Saturday 6am, Saturday 6am-Sunday 6am, and Sunday 6am-Monday 6am.
const FRIDAY_START = '2026-06-05T06:00:00-04:00';
const SATURDAY_START = '2026-06-06T06:00:00-04:00';
const SUNDAY_START = '2026-06-07T06:00:00-04:00';
const MONDAY_START = '2026-06-08T06:00:00-04:00';

// The availability display draws cells sized from the width of its container, and jsdom has no layout, so it's a
// stand-in that says how many slots are used and left.
vi.mock('../../../../app/javascript/EventsApp/EventPage/BucketAvailabilityDisplay', () => ({
  default: ({ signupCount, remainingCapacity }: { signupCount: number; remainingCapacity: number }) => (
    <span data-testid="availability">
      {signupCount} used, {remainingCapacity} left
    </span>
  ),
}));

// Reports of unexpected errors, so tests can check what's reported
const reportError = vi.hoisted(() => vi.fn());
vi.mock('../../../../app/javascript/ErrorReporting', () => ({ default: () => ({ error: reportError }) }));

describe('RankedChoiceUserSettings', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const sent = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    sent.mockReset();
    reportError.mockReset();
  });

  const recordingMock = (
    query: MockLink.MockedResponse['request']['query'],
    data: Record<string, unknown>,
    options: Partial<MockLink.MockedResponse> = {},
  ): MockLink.MockedResponse => ({
    request: {
      query,
      variables: (variables: unknown) => {
        sent(variables);
        return true;
      },
    },
    result: { data },
    ...options,
  });

  const constraintPayload = (field: string, constraint: QueueConstraint) => ({
    __typename: 'Mutation',
    [field]: {
      __typename: `${field[0].toUpperCase()}${field.slice(1)}Payload`,
      ranked_choice_user_constraint: constraint,
    },
  });

  const refetchMock = (constraints: QueueConstraint[] = []) => ({
    request: { query: MySignupQueueQueryDocument },
    result: { data: buildMySignupQueueData({ ranked_choice_user_constraints: constraints }) },
    maxUsageCount: 5,
  });

  const renderSettings = (
    {
      constraints = [],
      signups = [],
      fallbackAction = RankedChoiceFallbackAction.Waitlist,
    }: {
      constraints?: QueueConstraint[];
      signups?: QueueSignup[];
      fallbackAction?: RankedChoiceFallbackAction;
    } = {},
    apolloMocks: MockLink.MockedResponse[] = [],
  ) =>
    render(
      <RankedChoiceUserSettings
        data={buildMySignupQueueData({
          ranked_choice_user_constraints: constraints,
          signups,
          ranked_choice_fallback_action: fallbackAction,
        })}
      />,
      {
        apolloMocks,
        appRootContextValue: {
          timezoneName: 'America/New_York',
          conventionTimespan: Timespan.finiteFromStrings(FRIDAY_START, MONDAY_START),
          myProfile: undefined,
        },
      },
    );

  const rowFor = (result: Awaited<ReturnType<typeof renderSettings>>, label: RegExp) =>
    result.getByText(label).closest('tr') as HTMLElement;
  const selectIn = (row: HTMLElement) => within(row).getByRole('combobox') as HTMLSelectElement;

  describe('the limits', () => {
    it('has a row for the total, one for each convention day, then any other limits', async () => {
      const result = await renderSettings({
        constraints: [buildQueueConstraint({ id: '9', start: '2026-06-05T20:00:00Z', finish: '2026-06-05T22:00:00Z' })],
      });

      const labels = Array.from(result.container.querySelectorAll('tbody tr td:first-child label')).map(
        (label) => label.textContent,
      );
      expect(labels).toEqual([
        'Total event signups',
        'Friday event signups',
        'Saturday event signups',
        'Sunday event signups',
        expect.stringMatching(/^Events /),
      ]);
    });

    it('shows each limit as set, or as no limit', async () => {
      const result = await renderSettings({
        constraints: [
          buildQueueConstraint({ id: '1', maximum_signups: 6 }),
          buildQueueConstraint({ id: '2', start: FRIDAY_START, finish: SATURDAY_START, maximum_signups: 2 }),
        ],
      });

      expect(selectIn(rowFor(result, /Total event signups/))).toHaveValue('6');
      expect(selectIn(rowFor(result, /Friday event signups/))).toHaveValue('2');
      expect(selectIn(rowFor(result, /Saturday event signups/))).toHaveValue('NO_LIMIT');
    });

    it('offers no limit, none at all, and 1 to 10', async () => {
      const result = await renderSettings();

      const options = Array.from(selectIn(rowFor(result, /Total event signups/)).options).map((option) => option.text);

      expect(options).toHaveLength(12);
      expect(options.slice(0, 3)).toEqual(['No limit', 'Don’t automatically sign me up for events', '1 at most']);
      expect(options[11]).toBe('10 at most');
    });

    it('only treats a limit as a convention day’s if it exactly matches the day', async () => {
      const result = await renderSettings({
        constraints: [buildQueueConstraint({ id: '2', start: FRIDAY_START, finish: SUNDAY_START, maximum_signups: 2 })],
      });

      expect(selectIn(rowFor(result, /Friday event signups/))).toHaveValue('NO_LIMIT');
      expect(result.getAllByText(/^Events /)).toHaveLength(1);
    });

    it('matches a convention day whatever time zone the limit was written in', async () => {
      const result = await renderSettings({
        constraints: [
          buildQueueConstraint({
            id: '2',
            start: '2026-06-06T10:00:00Z',
            finish: '2026-06-07T10:00:00Z',
            maximum_signups: 3,
          }),
        ],
      });

      expect(selectIn(rowFor(result, /Saturday event signups/))).toHaveValue('3');
    });
  });

  describe('how many slots are left', () => {
    it('counts confirmed, counted signups that overlap the limit’s period', async () => {
      const result = await renderSettings({
        constraints: [
          buildQueueConstraint({ id: '2', start: FRIDAY_START, finish: SATURDAY_START, maximum_signups: 3 }),
          buildQueueConstraint({ id: '3', maximum_signups: 5 }),
        ],
        signups: [
          buildQueueSignup({ id: '1' }),
          // not counted, so it doesn't use up a slot
          buildQueueSignup({ id: '2', counted: false }),
          // waitlisted doesn't either
          buildQueueSignup({ id: '3', state: 'waitlisted' as QueueSignup['state'] }),
          // on Saturday, outside Friday's limit
          buildQueueSignup({
            id: '4',
            run: {
              __typename: 'Run',
              id: '2',
              starts_at: '2026-06-06T20:00:00Z',
              ends_at: '2026-06-07T00:00:00Z',
              event: { __typename: 'Event', id: '2', title: 'Saturday Game' },
            },
          }),
        ],
      });

      expect(within(rowFor(result, /Friday event signups/)).getByTestId('availability')).toHaveTextContent(
        '1 used, 2 left',
      );
      // (the total limit counts the Saturday signup too)
      expect(within(rowFor(result, /Total event signups/)).getByTestId('availability')).toHaveTextContent(
        '2 used, 3 left',
      );
      // a day with no limit set has nothing to show
      expect(within(rowFor(result, /Sunday event signups/)).queryByTestId('availability')).toBeNull();
    });
  });

  describe('changing a limit', () => {
    it('creates a total limit when there is none (no start or finish), then refetches', async () => {
      const created = buildQueueConstraint({ id: '5', maximum_signups: 4 });
      const result = await renderSettings({}, [
        recordingMock(
          CreateMyRankedChoiceUserConstraintDocument,
          constraintPayload('createRankedChoiceUserConstraint', created),
        ),
        refetchMock([created]),
      ]);

      await user.selectOptions(selectIn(rowFor(result, /Total event signups/)), '4');

      await waitFor(() => expect(sent).toHaveBeenCalledTimes(1));
      expect(sent).toHaveBeenCalledWith({ rankedChoiceUserConstraint: { maximumSignups: 4 } });
    });

    it('creates a limit for a convention day with that day’s start and finish', async () => {
      const created = buildQueueConstraint({
        id: '5',
        start: SATURDAY_START,
        finish: SUNDAY_START,
        maximum_signups: 2,
      });
      const result = await renderSettings({}, [
        recordingMock(
          CreateMyRankedChoiceUserConstraintDocument,
          constraintPayload('createRankedChoiceUserConstraint', created),
        ),
        refetchMock([created]),
      ]);

      await user.selectOptions(selectIn(rowFor(result, /Saturday event signups/)), '2');

      await waitFor(() => expect(sent).toHaveBeenCalledTimes(1));
      const variables = sent.mock.calls[0][0].rankedChoiceUserConstraint;
      expect(variables.maximumSignups).toBe(2);
      expect(new Date(variables.start).getTime()).toBe(new Date(SATURDAY_START).getTime());
      expect(new Date(variables.finish).getTime()).toBe(new Date(SUNDAY_START).getTime());
    });

    it('updates an existing limit with just the new maximum', async () => {
      const existing = buildQueueConstraint({ id: '5', maximum_signups: 4 });
      const result = await renderSettings({ constraints: [existing] }, [
        recordingMock(
          UpdateRankedChoiceUserConstraintDocument,
          constraintPayload('updateRankedChoiceUserConstraint', { ...existing, maximum_signups: 6 }),
        ),
        refetchMock([{ ...existing, maximum_signups: 6 }]),
      ]);

      await user.selectOptions(selectIn(rowFor(result, /Total event signups/)), '6');

      await waitFor(() => expect(sent).toHaveBeenCalledTimes(1));
      expect(sent).toHaveBeenCalledWith({ id: '5', rankedChoiceUserConstraint: { maximumSignups: 6 } });
    });

    it('can set a limit of none at all', async () => {
      const existing = buildQueueConstraint({ id: '5', maximum_signups: 4 });
      const result = await renderSettings({ constraints: [existing] }, [
        recordingMock(
          UpdateRankedChoiceUserConstraintDocument,
          constraintPayload('updateRankedChoiceUserConstraint', { ...existing, maximum_signups: 0 }),
        ),
        refetchMock(),
      ]);

      await user.selectOptions(selectIn(rowFor(result, /Total event signups/)), '0');

      await waitFor(() => expect(sent).toHaveBeenCalledTimes(1));
      expect(sent).toHaveBeenCalledWith({ id: '5', rankedChoiceUserConstraint: { maximumSignups: 0 } });
    });

    it('deletes the limit when it is set back to no limit', async () => {
      const existing = buildQueueConstraint({ id: '5', maximum_signups: 4 });
      const result = await renderSettings({ constraints: [existing] }, [
        recordingMock(DeleteRankedChoiceUserConstraintDocument, {
          __typename: 'Mutation',
          deleteRankedChoiceUserConstraint: {
            __typename: 'DeleteRankedChoiceUserConstraintPayload',
            clientMutationId: null,
          },
        }),
        refetchMock(),
      ]);

      await user.selectOptions(selectIn(rowFor(result, /Total event signups/)), 'NO_LIMIT');

      await waitFor(() => expect(sent).toHaveBeenCalledTimes(1));
      expect(sent).toHaveBeenCalledWith({ id: '5' });
    });

    it('shows the error if the change fails', async () => {
      const result = await renderSettings({}, [
        {
          request: { query: CreateMyRankedChoiceUserConstraintDocument, variables: () => true },
          result: { errors: [{ message: 'Maximum signups is too high' }] },
        },
      ]);

      await user.selectOptions(selectIn(rowFor(result, /Total event signups/)), '4');

      expect(await result.findByText(/Maximum signups is too high/)).toBeTruthy();
      // (the server has already dealt with a GraphQL error, and it's shown on the page, so it isn't also reported)
      expect(reportError).not.toHaveBeenCalled();
    });

    it('reports a failure that isn’t a GraphQL error, like the network being down', async () => {
      const failure = new Error('Failed to fetch');
      const result = await renderSettings({}, [
        { request: { query: CreateMyRankedChoiceUserConstraintDocument, variables: () => true }, error: failure },
      ]);

      await user.selectOptions(selectIn(rowFor(result, /Total event signups/)), '4');

      await waitFor(() => expect(reportError).toHaveBeenCalledTimes(1));
      expect(reportError.mock.calls[0][0]).toBe(failure);
    });
  });

  describe('what to do when every choice is full', () => {
    it('shows the current choice', async () => {
      const result = await renderSettings({ fallbackAction: RankedChoiceFallbackAction.None });

      expect(result.getByRole('radio', { name: "Don't sign me up for anything" })).toBeChecked();
    });

    it('offers to waitlist or to do nothing, but not the unfinished random option', async () => {
      const result = await renderSettings();

      expect(result.getByRole('radio', { name: /Waitlist me for the first choice/ })).toBeTruthy();
      expect(result.getByRole('radio', { name: "Don't sign me up for anything" })).toBeTruthy();
      expect(result.queryByRole('radio', { name: /FEELING LUCKY/ })).toBeNull();
    });

    it('saves a changed choice to the user’s profile', async () => {
      const result = await render(
        <RankedChoiceUserSettings
          data={buildMySignupQueueData({ ranked_choice_fallback_action: RankedChoiceFallbackAction.Waitlist })}
        />,
        {
          apolloMocks: [
            recordingMock(
              UpdateUserConProfileDocument,
              {
                __typename: 'Mutation',
                updateUserConProfile: { __typename: 'UpdateUserConProfilePayload', user_con_profile: null },
              },
              {},
            ),
            refetchMock(),
          ],
          appRootContextValue: {
            myProfile: {
              __typename: 'UserConProfile',
              id: '7',
              name: 'Alice Attendee',
              email: 'alice@example.com',
              mobile_phone: null,
              accepted_clickwrap_agreement: true,
              needs_update: false,
              name_without_nickname: 'Alice Attendee',
              first_name: 'Alice',
              last_name: 'Attendee',
              gravatar_enabled: false,
              gravatar_url: '',
              ticket: null,
              current_pending_order: null,
            },
            conventionTimespan: undefined,
          },
        },
      );

      await user.click(result.getByRole('radio', { name: "Don't sign me up for anything" }));

      await waitFor(() => expect(sent).toHaveBeenCalledTimes(1));
      expect(sent).toHaveBeenCalledWith({
        input: { id: '7', user_con_profile: { ranked_choice_fallback_action: 'NONE' } },
      });
    });
  });
});
