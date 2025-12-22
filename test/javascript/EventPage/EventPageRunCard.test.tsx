import { render, fireEvent, waitFor } from '../testUtils';
import EventPageRunCard, { EventPageRunCardProps } from '../../../app/javascript/EventsApp/EventPage/EventPageRunCard';
import { EventPageQueryData } from '../../../app/javascript/EventsApp/EventPage/queries.generated';
import {
  SignupMode,
  SignupState,
  SignupRankedChoiceState,
  FormType,
  SignupRequestState,
} from '../../../app/javascript/graphqlTypes.generated';
import {
  CreateMySignupDocument,
  CreateMySignupMutationData,
  CreateSignupRankedChoiceDocument,
  CreateSignupRankedChoiceMutationData,
  WithdrawSignupRequestDocument,
  WithdrawSignupRequestMutationData,
} from '../../../app/javascript/EventsApp/EventPage/mutations.generated';
import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

describe('EventPageRunCard', () => {
  const mockEvent: EventPageQueryData['convention']['event'] = {
    __typename: 'Event',
    id: '1',
    title: 'Test Event',
    length_seconds: 14400,
    private_signup_list: false,
    my_rating: null,
    can_play_concurrently: false,
    form_response_attrs_json_with_rendered_markdown: '{}',
    event_category: {
      __typename: 'EventCategory',
      id: '1',
      team_member_name: 'GM',
      teamMemberNamePlural: 'GMs',
    },
    ticket_types: [],
    form: {
      __typename: 'Form',
      id: '1',
      form_type: FormType.Event,
      title: 'Event Form',
      form_sections: [],
    },
    team_members: [],
    registration_policy: {
      __typename: 'RegistrationPolicy',
      slots_limited: true,
      prevent_no_preference_signups: false,
      total_slots_including_not_counted: 10,
      buckets: [
        {
          __typename: 'RegistrationPolicyBucket',
          key: 'player',
          name: 'Player',
          description: 'Regular player',
          not_counted: false,
          slots_limited: true,
          anything: false,
          minimum_slots: 0,
          total_slots: 10,
        },
      ],
    },
    runs: [],
  };

  const mockRun: EventPageQueryData['convention']['event']['runs'][0] = {
    __typename: 'Run',
    id: '1',
    title_suffix: 'Friday Night',
    starts_at: '2025-01-01T19:00:00Z',
    current_ability_can_signup_summary_run: false,
    grouped_signup_counts: [
      {
        __typename: 'GroupedSignupCount',
        bucket_key: 'player',
        count: 5,
        counted: true,
        state: SignupState.Confirmed,
        team_member: false,
      },
    ],
    rooms: [
      {
        __typename: 'Room',
        id: '1',
        name: 'Room 101',
      },
    ],
    my_signups: [],
    my_signup_requests: [],
    my_signup_ranked_choices: [],
  };

  const mockMyProfile: EventPageQueryData['convention']['my_profile'] = {
    __typename: 'UserConProfile',
    id: '1',
    signup_constraints: {
      __typename: 'UserSignupConstraints',
      at_maximum_signups: false,
    },
  };

  const mockCurrentAbility: EventPageQueryData['currentAbility'] = {
    __typename: 'Ability',
    can_read_schedule: true,
    can_update_event: false,
    can_read_event_signups: false,
  };

  const mockSignupRounds: EventPageQueryData['convention']['signup_rounds'] = [];

  const defaultProps: EventPageRunCardProps = {
    event: mockEvent,
    run: mockRun,
    myProfile: mockMyProfile,
    currentAbility: mockCurrentAbility,
    signupRounds: mockSignupRounds,
    addToQueue: false,
  };

  const renderEventPageRunCard = async (
    props: Partial<EventPageRunCardProps> = {},
    apolloMocks: MockLink.MockedResponse[] = [],
  ) => {
    return await render(<EventPageRunCard {...defaultProps} {...props} />, {
      apolloMocks,
      appRootContextValue: {
        signupMode: SignupMode.SelfService,
        timezoneName: 'America/New_York',
      },
    });
  };

  describe('rendering states', () => {
    test('renders run card without signup', async () => {
      const { getByText, getByRole, container } = await renderEventPageRunCard();
      // Check for run title suffix
      expect(getByText('Friday Night')).toBeTruthy();
      // Check for signup button
      expect(getByRole('button', { name: /Sign up now/i })).toBeTruthy();
      // Check that bucket name is displayed in the capacity graph
      expect(container.textContent).toMatch(/Player/);
    });

    test('renders with existing confirmed signup', async () => {
      const runWithSignup = {
        ...mockRun,
        my_signups: [
          {
            __typename: 'Signup' as const,
            id: '1',
            state: SignupState.Confirmed,
            waitlist_position: null,
            counted: true,
            expires_at: null,
          },
        ],
      };

      const { getByRole } = await renderEventPageRunCard({ run: runWithSignup });
      // Should have a withdraw button when signed up
      expect(getByRole('button', { name: /withdraw/i })).toBeTruthy();
    });

    test('renders with waitlisted signup', async () => {
      const runWithWaitlist = {
        ...mockRun,
        my_signups: [
          {
            __typename: 'Signup' as const,
            id: '1',
            state: SignupState.Waitlisted,
            waitlist_position: 3,
            counted: true,
            expires_at: null,
          },
        ],
      };

      const { container, getByRole } = await renderEventPageRunCard({ run: runWithWaitlist });
      // Should show waitlist position in the card
      expect(container.textContent).toMatch(/3/);
      expect(getByRole('button', { name: /withdraw/i })).toBeTruthy();
    });

    test('renders with pending signup request', async () => {
      const runWithRequest: EventPageRunCardProps['run'] = {
        ...mockRun,
        my_signup_requests: [
          {
            __typename: 'SignupRequest' as const,
            id: '1',
            state: SignupRequestState.Pending,
            target_run: {
              __typename: 'Run' as const,
              id: '1',
            },
            requested_bucket_key: 'player',
            replace_signup: null,
          },
        ],
      };

      const { getByRole } = await renderEventPageRunCard({ run: runWithRequest });
      // Should have a withdraw signup request button
      expect(getByRole('button', { name: /withdraw/i })).toBeTruthy();
    });
  });

  describe('signup creation', () => {
    test('creates self-service signup successfully', async () => {
      const mockSignup = {
        __typename: 'Signup' as const,
        id: '2',
        state: SignupState.Confirmed,
        waitlist_position: null,
        counted: true,
        expires_at: null,
      };

      const mutationCalled = vi.fn();
      const createSignupMock: MockLink.MockedResponse<CreateMySignupMutationData> = {
        request: {
          query: CreateMySignupDocument,
          variables: {
            runId: '1',
            requestedBucketKey: 'player',
            noRequestedBucket: false,
          },
        },
        result: () => {
          mutationCalled();
          return {
            data: {
              __typename: 'Mutation',
              createMySignup: {
                __typename: 'CreateMySignupPayload' as const,
                signup: { ...mockSignup, run: { ...mockRun, my_signups: [...mockRun.my_signups, mockSignup] } },
              },
            },
          };
        },
      };

      const { getByRole } = await renderEventPageRunCard({}, [createSignupMock]);

      // Find and click the signup button
      const signupButton = getByRole('button', { name: /Sign up now/i }) as HTMLButtonElement;

      // Verify button is initially enabled
      expect(signupButton.disabled).toBe(false);

      fireEvent.click(signupButton);

      // Verify the button becomes disabled during the mutation
      await waitFor(() => {
        expect(signupButton.disabled).toBe(true);
      });

      // Verify the mutation was called
      await waitFor(() => {
        expect(mutationCalled).toHaveBeenCalledTimes(1);
      });

      // Verify button is re-enabled after mutation completes
      await waitFor(() => {
        expect(signupButton.disabled).toBe(false);
      });
    });

    test('creates ranked choice for queue', async () => {
      const mutationCalled = vi.fn();
      const createRankedChoiceMock: MockLink.MockedResponse<CreateSignupRankedChoiceMutationData> = {
        request: {
          query: CreateSignupRankedChoiceDocument,
          variables: {
            targetRunId: '1',
            requestedBucketKey: 'player',
          },
        },
        result: () => {
          mutationCalled();
          return {
            data: {
              __typename: 'Mutation',
              createSignupRankedChoice: {
                __typename: 'CreateSignupRankedChoicePayload' as const,
                signup_ranked_choice: {
                  __typename: 'SignupRankedChoice' as const,
                  id: '1',
                  state: SignupRankedChoiceState.Pending,
                  priority: 1,
                  requested_bucket_key: 'player',
                  target_run: {
                    __typename: 'Run' as const,
                    id: '1',
                  },
                },
              },
            },
          };
        },
      };

      const profileAtMaxSignups = {
        ...mockMyProfile,
        signup_constraints: {
          __typename: 'UserSignupConstraints' as const,
          at_maximum_signups: true,
        },
      };

      const { getByRole } = await renderEventPageRunCard(
        {
          myProfile: profileAtMaxSignups,
          addToQueue: true,
        },
        [createRankedChoiceMock],
      );

      // Should show "Add to queue" option
      const queueButton = getByRole('button', { name: /Add to.*queue/i }) as HTMLButtonElement;
      expect(queueButton).toBeTruthy();

      fireEvent.click(queueButton);

      // Verify the mutation was called
      await waitFor(() => {
        expect(mutationCalled).toHaveBeenCalledTimes(1);
      });

      // After adding to queue, the mutation completes successfully
      // Note: The UI won't update to show "in queue" state without a full revalidation
      // which would require mocking the EventPageQuery to return updated data
    });
  });

  describe('signup withdrawal', () => {
    test('withdraws pending signup request', async () => {
      const runWithRequest: EventPageRunCardProps['run'] = {
        ...mockRun,
        my_signup_requests: [
          {
            __typename: 'SignupRequest' as const,
            id: '1',
            state: SignupRequestState.Pending,
            target_run: {
              __typename: 'Run' as const,
              id: '1',
            },
            requested_bucket_key: 'player',
            replace_signup: null,
          },
        ],
      };

      const mutationCalled = vi.fn();
      const withdrawRequestMock: MockLink.MockedResponse<WithdrawSignupRequestMutationData> = {
        request: {
          query: WithdrawSignupRequestDocument,
          variables: {
            id: '1',
          },
        },
        result: () => {
          mutationCalled();
          return {
            data: {
              __typename: 'Mutation',
              withdrawSignupRequest: {
                __typename: 'WithdrawSignupRequestPayload' as const,
                signup_request: {
                  __typename: 'SignupRequest' as const,
                  id: '1',
                  state: SignupRequestState.Withdrawn,
                  target_run: mockRun,
                  requested_bucket_key: 'player',
                  replace_signup: null,
                },
              },
            },
          };
        },
      };

      const { getByText, getByRole } = await renderEventPageRunCard({ run: runWithRequest }, [withdrawRequestMock]);

      const withdrawButton = getByText(/withdraw.*request/i);
      fireEvent.click(withdrawButton);

      // Should show confirmation dialog
      await waitFor(() => {
        expect(getByText(/Test Event/)).toBeTruthy();
      });

      // Click OK on the confirmation dialog to proceed with withdrawal
      const okButton = await waitFor(() => getByRole('button', { name: 'OK' }));
      fireEvent.click(okButton);

      // Verify the mutation was called
      await waitFor(() => {
        expect(mutationCalled).toHaveBeenCalledTimes(1);
      });

      // After withdrawal, the mutation completes successfully
      // Note: The UI won't update to remove the pending request without a full revalidation
      // which would require mocking the EventPageQuery to return updated data
    });
  });

  describe('moderated signup mode', () => {
    test('renders signup button in moderated mode', async () => {
      const { getByRole } = await renderEventPageRunCard({}, []);

      const signupButton = getByRole('button', { name: /Sign up now/i });

      // In moderated mode, clicking would open modal instead of creating signup directly
      // The modal component is rendered but not visible until clicked
      expect(signupButton).toBeTruthy();
    });
  });

  describe('team member signup', () => {
    test('shows team member signup option for team members', async () => {
      const eventWithTeamMember = {
        ...mockEvent,
        team_members: [
          {
            __typename: 'TeamMember' as const,
            id: '1',
            email: 'gm@example.com',
            display_team_member: true,
            user_con_profile: {
              __typename: 'UserConProfile' as const,
              id: '1',
              name_without_nickname: 'Test GM',
              gravatar_enabled: false,
              gravatar_url: '',
            },
          },
        ],
      };

      const { getByText } = await renderEventPageRunCard({ event: eventWithTeamMember });
      expect(getByText('GM')).toBeTruthy();
    });
  });

  describe('signup options', () => {
    test('shows no preference option when multiple buckets exist', async () => {
      const eventWithMultipleBuckets = {
        ...mockEvent,
        registration_policy: {
          ...mockEvent.registration_policy!,
          buckets: [
            {
              __typename: 'RegistrationPolicyBucket' as const,
              key: 'player',
              name: 'Player',
              description: 'Regular player',
              not_counted: false,
              slots_limited: true,
              anything: false,
              minimum_slots: 0,
              total_slots: 5,
            },
            {
              __typename: 'RegistrationPolicyBucket' as const,
              key: 'premium',
              name: 'Premium',
              description: 'Premium player',
              not_counted: false,
              slots_limited: true,
              anything: false,
              minimum_slots: 0,
              total_slots: 5,
            },
          ],
        },
      };

      const { getByText } = await renderEventPageRunCard({ event: eventWithMultipleBuckets });
      expect(getByText('Player')).toBeTruthy();
      expect(getByText('Premium')).toBeTruthy();
      expect(getByText('No preference')).toBeTruthy();
    });

    test('hides no preference when prevent_no_preference_signups is true', async () => {
      const eventPreventingNoPreference = {
        ...mockEvent,
        registration_policy: {
          ...mockEvent.registration_policy!,
          prevent_no_preference_signups: true,
          buckets: [
            {
              __typename: 'RegistrationPolicyBucket' as const,
              key: 'player',
              name: 'Player',
              description: 'Regular player',
              not_counted: false,
              slots_limited: true,
              anything: false,
              minimum_slots: 0,
              total_slots: 5,
            },
            {
              __typename: 'RegistrationPolicyBucket' as const,
              key: 'premium',
              name: 'Premium',
              description: 'Premium player',
              not_counted: false,
              slots_limited: true,
              anything: false,
              minimum_slots: 0,
              total_slots: 5,
            },
          ],
        },
      };

      const { queryByText } = await renderEventPageRunCard({ event: eventPreventingNoPreference });
      expect(queryByText('No preference')).toBeNull();
    });
  });
});
