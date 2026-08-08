import { render } from '../../testUtils';
import UserSignupQueueItem from '../../../../app/javascript/EventsApp/MySignupQueue/UserSignupQueueItem';
import { UserConProfileRankedChoiceQueueFieldsFragment } from '../../../../app/javascript/EventsApp/MySignupQueue/queries.generated';
import { RankedChoiceFallbackAction, SignupRankedChoiceState } from '../../../../app/javascript/graphqlTypes.generated';

describe('UserSignupQueueItem', () => {
  const buildUserConProfile = (
    requestedBucket: { id: string } | null,
  ): UserConProfileRankedChoiceQueueFieldsFragment => ({
    __typename: 'UserConProfile',
    id: '1',
    ranked_choice_fallback_action: RankedChoiceFallbackAction.Waitlist,
    ranked_choice_user_constraints: [],
    ticket: null,
    signups: [],
    signup_ranked_choices: [
      {
        __typename: 'SignupRankedChoice',
        id: '1',
        state: SignupRankedChoiceState.Pending,
        prioritize_waitlist: false,
        waitlist_position_cap: null,
        priority: 1,
        requested_bucket: requestedBucket && { __typename: 'RegistrationPolicyBucket', id: requestedBucket.id },
        simulated_skip_reason: null,
        target_run: {
          __typename: 'Run',
          id: '1',
          title_suffix: null,
          starts_at: '2025-01-01T19:00:00Z',
          event: {
            __typename: 'Event',
            id: '1',
            title: 'Test Event',
            length_seconds: 14400,
            event_category: { __typename: 'EventCategory', id: '1', name: 'Games' },
            registration_policy: {
              __typename: 'RegistrationPolicy',
              buckets: [
                {
                  __typename: 'RegistrationPolicyBucket',
                  id: '1',
                  key: 'player',
                  name: 'Player',
                  description: null,
                },
                { __typename: 'RegistrationPolicyBucket', id: '2', key: 'gm', name: 'GM', description: null },
              ],
            },
          },
        },
      },
    ],
  });

  const renderQueueItem = async (userConProfile: UserConProfileRankedChoiceQueueFieldsFragment) =>
    render(
      <ul>
        <UserSignupQueueItem
          userConProfile={userConProfile}
          index={0}
          refetchQueries={[]}
          readOnly={false}
          loading={false}
          enableDragDrop={false}
        />
      </ul>,
    );

  it("shows the requested bucket's name, matched by id, when one is present", async () => {
    // key intentionally does not equal any of this event's actual bucket keys, to confirm the
    // match happens by id, not by any key-based coincidence.
    const { container } = await renderQueueItem(buildUserConProfile({ id: '2' }));

    expect(container.textContent).toContain('GM');
  });

  it('shows "No preference" when there is no requested bucket', async () => {
    const { getByText } = await renderQueueItem(buildUserConProfile(null));

    expect(getByText(/No preference/)).toBeTruthy();
  });

  it('shows "No preference" when the requested bucket id does not match any of the run’s buckets', async () => {
    const { getByText } = await renderQueueItem(buildUserConProfile({ id: 'removed-bucket' }));

    expect(getByText(/No preference/)).toBeTruthy();
  });
});
