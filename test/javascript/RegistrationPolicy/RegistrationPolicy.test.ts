import { withoutGeneratedBucketIds } from '../../../app/javascript/RegistrationPolicy/RegistrationPolicy';
import { RegistrationPolicyBucket } from '../../../app/javascript/graphqlTypes.generated';

describe('withoutGeneratedBucketIds', () => {
  const bucket: RegistrationPolicyBucket & { generatedId: string } = {
    __typename: 'RegistrationPolicyBucket',
    id: '1',
    generatedId: 'abc',
    key: 'signups',
    name: 'Signups',
    description: 'Signups for this event',
    anything: false,
    slots_limited: false,
    not_counted: false,
    expose_attendees: false,
    minimum_slots: null,
    preferred_slots: null,
    total_slots: null,
  };

  const policy = {
    __typename: 'RegistrationPolicy' as const,
    buckets: [bucket],
    freeze_no_preference_buckets: false,
    prevent_no_preference_signups: false,
  };

  it('strips generatedId', () => {
    expect(withoutGeneratedBucketIds(policy).buckets[0]).not.toHaveProperty('generatedId');
  });

  it('turns null slot counts into 0 so an unlimited bucket can be saved', () => {
    expect(withoutGeneratedBucketIds(policy).buckets[0]).toMatchObject({
      minimum_slots: 0,
      preferred_slots: 0,
      total_slots: 0,
    });
  });

  it('leaves real slot counts alone', () => {
    const limited = { ...policy, buckets: [{ ...bucket, slots_limited: true, minimum_slots: 2, total_slots: 6 }] };
    expect(withoutGeneratedBucketIds(limited).buckets[0]).toMatchObject({
      minimum_slots: 2,
      preferred_slots: 0,
      total_slots: 6,
    });
  });
});
