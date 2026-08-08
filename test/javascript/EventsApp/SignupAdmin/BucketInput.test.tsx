import { vi } from 'vitest';

import { render } from '../../testUtils';
import BucketInput from '../../../../app/javascript/EventsApp/SignupAdmin/BucketInput';
import { SignupFieldsFragment } from '../../../../app/javascript/EventsApp/SignupAdmin/queries.generated';
import { SignupState } from '../../../../app/javascript/graphqlTypes.generated';

describe('BucketInput', () => {
  const buildSignup = (overrides: Partial<SignupFieldsFragment> = {}): SignupFieldsFragment => ({
    __typename: 'Signup',
    id: '1',
    state: SignupState.Confirmed,
    counted: true,
    bucket: { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player' },
    requested_bucket: { __typename: 'RegistrationPolicyBucket', id: '1' },
    run: {
      __typename: 'Run',
      id: '1',
      title_suffix: null,
      starts_at: '2025-01-01T19:00:00Z',
      ends_at: '2025-01-01T23:00:00Z',
      rooms: [],
      event: {
        __typename: 'Event',
        id: '1',
        title: 'Test Event',
        event_category: { __typename: 'EventCategory', id: '1', team_member_name: 'GM', teamMemberNamePlural: 'GMs' },
        registration_policy: {
          __typename: 'RegistrationPolicy',
          buckets: [
            { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player', name: 'Player', anything: false },
            { __typename: 'RegistrationPolicyBucket', id: '2', key: 'gm', name: 'GM', anything: false },
            { __typename: 'RegistrationPolicyBucket', id: '3', key: 'flex', name: 'Flex', anything: true },
          ],
        },
        team_members: [],
      },
    },
    user_con_profile: {
      __typename: 'UserConProfile',
      id: '1',
      name_without_nickname: 'Test User',
      nickname: null,
      birth_date: null,
      email: null,
      address: null,
      city: null,
      state: null,
      zipcode: null,
      country: null,
      mobile_phone: null,
      gravatar_enabled: false,
      gravatar_url: '',
    },
    ...overrides,
  });

  it('labels the bucket the signup currently occupies and the one it requested, matching by id', async () => {
    // bucket.key ("player") intentionally does not match requested_bucket's id (1) by key, to
    // confirm this matches by id and not by any key-based coincidence.
    const signup = buildSignup({
      bucket: { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player' },
      requested_bucket: { __typename: 'RegistrationPolicyBucket', id: '2' },
    });
    const { getByLabelText } = await render(
      <BucketInput signup={signup} value={null} onChange={vi.fn()} caption="Bucket" />,
    );

    expect(getByLabelText('Player (current)')).toBeTruthy();
    expect(getByLabelText('GM (user requested)')).toBeTruthy();
    expect(getByLabelText('Flex')).toBeTruthy();
  });

  it('disables the bucket the signup already occupies', async () => {
    const signup = buildSignup({
      bucket: { __typename: 'RegistrationPolicyBucket', id: '1', key: 'player' },
      requested_bucket: null,
    });
    const { getByLabelText } = await render(
      <BucketInput signup={signup} value={null} onChange={vi.fn()} caption="Bucket" />,
    );

    expect(getByLabelText('Player (current)')).toBeDisabled();
    expect(getByLabelText('GM')).not.toBeDisabled();
  });

  it('disables the anything bucket once the signup is already in any bucket', async () => {
    const signup = buildSignup({
      bucket: { __typename: 'RegistrationPolicyBucket', id: '2', key: 'gm' },
      requested_bucket: null,
    });
    const { getByLabelText } = await render(
      <BucketInput signup={signup} value={null} onChange={vi.fn()} caption="Bucket" />,
    );

    expect(getByLabelText('Flex')).toBeDisabled();
  });

  it('does not disable the anything bucket for a signup with no current bucket', async () => {
    const signup = buildSignup({ bucket: null, requested_bucket: null });
    const { getByLabelText } = await render(
      <BucketInput signup={signup} value={null} onChange={vi.fn()} caption="Bucket" />,
    );

    expect(getByLabelText('Flex')).not.toBeDisabled();
  });
});
