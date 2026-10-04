import { RegistrationPolicy, RegistrationPolicyBucket } from '../../../app/javascript/graphqlTypes.generated';

// Leaf builders for registration policy data.  They return the full generated types, which any GraphQL fragment
// type that picks a subset of these fields accepts, so a test can drop one straight into whichever fragment-shaped
// data it's building.  Override whatever the test cares about; everything else gets a sensible default.

export function buildBucket(overrides: Partial<RegistrationPolicyBucket> = {}): RegistrationPolicyBucket {
  return {
    __typename: 'RegistrationPolicyBucket',
    id: '1',
    key: 'player',
    name: 'Player',
    description: null,
    anything: false,
    expose_attendees: false,
    not_counted: false,
    slots_limited: true,
    total_slots: 10,
    preferred_slots: 5,
    minimum_slots: 2,
    ...overrides,
  };
}

// The three buckets most tests need: a regular bucket, a second regular bucket, and a flex ("anything") bucket
export function buildStandardBuckets(): RegistrationPolicyBucket[] {
  return [
    buildBucket({ id: '1', key: 'player', name: 'Player' }),
    buildBucket({ id: '2', key: 'gm', name: 'GM', total_slots: 2, preferred_slots: 2, minimum_slots: 1 }),
    buildBucket({
      id: '3',
      key: 'flex',
      name: 'Flex',
      anything: true,
      slots_limited: false,
      total_slots: null,
      preferred_slots: null,
      minimum_slots: null,
    }),
  ];
}

export function buildRegistrationPolicy(
  overrides: Partial<Omit<RegistrationPolicy, 'buckets'>> & { buckets?: RegistrationPolicyBucket[] } = {},
): Pick<RegistrationPolicy, '__typename' | 'buckets' | 'prevent_no_preference_signups'> {
  return {
    __typename: 'RegistrationPolicy',
    prevent_no_preference_signups: false,
    buckets: buildStandardBuckets(),
    ...overrides,
  };
}
