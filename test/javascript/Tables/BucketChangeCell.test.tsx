import { CellContext } from '@tanstack/react-table';

import { render } from '../testUtils';
import BucketChangeCell, { BucketChangeType } from '../../../app/javascript/Tables/BucketChangeCell';
import { SignupChangeType } from '../../../app/javascript/EventsApp/SignupAdmin/RunSignupChangesTable';
import { EventForFormatBucket } from '../../../app/javascript/EventsApp/SignupAdmin/SignupUtils';
import { SignupChangeAction, SignupState } from '../../../app/javascript/graphqlTypes.generated';

describe('BucketChangeCell', () => {
  const event: EventForFormatBucket = {
    event_category: { team_member_name: 'GM' },
    registration_policy: {
      buckets: [
        { id: '1', name: 'Player' },
        { id: '2', name: 'GM' },
      ],
    },
    team_members: [],
  };

  const buildSignupChange = (overrides: Partial<SignupChangeType> = {}): SignupChangeType => ({
    __typename: 'SignupChange',
    id: '1',
    state: SignupState.Confirmed,
    counted: true,
    action: SignupChangeAction.SelfServiceSignup,
    created_at: '2025-01-01T00:00:00Z',
    bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
    previous_signup_change: null,
    signup: { __typename: 'Signup', id: '1', requested_bucket: { __typename: 'RegistrationPolicyBucket', id: '1' } },
    user_con_profile: {
      __typename: 'UserConProfile',
      id: '1',
      name_inverted: 'User, Test',
      gravatar_enabled: false,
      gravatar_url: '',
    },
    ...overrides,
  });

  // BucketChangeCell only reads getValue() out of the full CellContext it's normally given by
  // react-table -- this builds just enough of a fake context to exercise it directly.
  const renderCell = async (value: BucketChangeType) => {
    const cellContext = { getValue: () => value } as unknown as CellContext<unknown, BucketChangeType>;
    return render(<BucketChangeCell {...cellContext} />);
  };

  it('shows just the new bucket name when there is no previous change', async () => {
    const value: BucketChangeType = { signupChange: buildSignupChange(), event };
    const { getByText, queryByText } = await renderCell(value);

    expect(getByText('Player')).toBeTruthy();
    expect(queryByText('GM')).toBeFalsy();
  });

  it('shows the old bucket struck through when the bucket changed, matching old and new by id', async () => {
    const value: BucketChangeType = {
      signupChange: buildSignupChange({
        bucket: { __typename: 'RegistrationPolicyBucket', id: '2' },
        signup: { __typename: 'Signup', id: '1', requested_bucket: null },
        previous_signup_change: {
          __typename: 'SignupChange',
          id: '0',
          state: SignupState.Confirmed,
          counted: true,
          bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
        },
      }),
      event,
    };
    const { container, getByText } = await renderCell(value);

    // The old bucket (id 1, "Player") is struck through; the new one (id 2, "GM") is shown plainly
    // -- matched by id even though the two buckets share no key/name relationship in this fixture.
    expect(getByText('Player (no preference)').closest('s')).toBeTruthy();
    expect(container.textContent).toContain('GM (no preference)');
  });

  it('does not show a struck-through old bucket when the bucket did not actually change', async () => {
    const value: BucketChangeType = {
      signupChange: buildSignupChange({
        bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
        previous_signup_change: {
          __typename: 'SignupChange',
          id: '0',
          state: SignupState.Confirmed,
          counted: true,
          bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
        },
      }),
      event,
    };
    const { getByText, container } = await renderCell(value);

    expect(getByText('Player')).toBeTruthy();
    expect(container.querySelector('s')).toBeFalsy();
  });
});
