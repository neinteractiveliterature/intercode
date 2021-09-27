import { RegistrationPolicy, RegistrationPolicyBucket } from '../graphqlTypes.generated';

export type BucketForRegistrationPolicyUtils = Pick<
  RegistrationPolicyBucket,
  | 'key'
  | 'total_slots'
  | 'minimum_slots'
  | 'preferred_slots'
  | 'slots_limited'
  | 'anything'
  | 'not_counted'
  | 'expose_attendees'
  | 'name'
  | 'description'
>;

export type RegistrationPolicyForRegistrationPolicyUtils = Pick<
  RegistrationPolicy,
  'prevent_no_preference_signups'
> & {
  buckets: BucketForRegistrationPolicyUtils[];
};

function sumBucketProperty(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
  property: 'total_slots' | 'minimum_slots' | 'preferred_slots',
): number {
  return (registrationPolicy.buckets ?? []).reduce(
    (sum, bucket) => sum + (bucket[property] ?? 0),
    0,
  );
}

export function sumTotalSlots(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
): number {
  return sumBucketProperty(registrationPolicy, 'total_slots');
}

export function sumMinimumSlots(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
): number {
  return sumBucketProperty(registrationPolicy, 'minimum_slots');
}

export function sumPreferredSlots(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
): number {
  return sumBucketProperty(registrationPolicy, 'preferred_slots');
}

export function getRegistrationPolicySlotsLimited(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
): boolean {
  return (registrationPolicy.buckets ?? []).every((bucket) => bucket.slots_limited);
}

export function getRegistrationPolicyBucket(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
  key: string,
): BucketForRegistrationPolicyUtils | undefined {
  return (registrationPolicy.buckets ?? []).find((bucket) => bucket.key === key);
}

export function addRegistrationPolicyBucket<T extends RegistrationPolicyForRegistrationPolicyUtils>(
  registrationPolicy: T,
  key: string,
  bucket: Omit<T['buckets'][0], 'key'>,
): T {
  if (getRegistrationPolicyBucket(registrationPolicy, key)) {
    throw new Error(`Bucket with key ${key} already exists in registration policy`);
  }

  return {
    ...registrationPolicy,
    buckets: [...(registrationPolicy.buckets ?? []), { key, ...bucket }],
  };
}

export function removeRegistrationPolicyBucket<
  T extends RegistrationPolicyForRegistrationPolicyUtils,
>(registrationPolicy: T, key: string): T {
  return {
    ...registrationPolicy,
    buckets: (registrationPolicy.buckets ?? []).filter((bucket) => bucket.key !== key),
  };
}

export function updateRegistrationPolicyBucket<
  T extends RegistrationPolicyForRegistrationPolicyUtils,
>(registrationPolicy: T, key: string, newBucket: Omit<T['buckets'][0], 'key'>): T {
  const index = (registrationPolicy.buckets ?? []).findIndex((bucket) => bucket.key === key);

  if (index === -1) {
    return addRegistrationPolicyBucket(registrationPolicy, key, newBucket);
  }

  const newBuckets = [...(registrationPolicy.buckets ?? [])];
  newBuckets.splice(index, 1, { key, ...newBucket });

  return {
    ...registrationPolicy,
    buckets: newBuckets,
  };
}

export function getRegistrationPolicyAnythingBucket<
  T extends RegistrationPolicyForRegistrationPolicyUtils,
>(registrationPolicy: T): BucketForRegistrationPolicyUtils | undefined {
  return (registrationPolicy.buckets ?? []).find((bucket) => bucket.anything);
}
