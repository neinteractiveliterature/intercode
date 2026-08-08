import { v4 as uuidv4 } from 'uuid';
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
> & {
  // Absent for a bucket added in the current edit session; see EditingRegistrationBucket.
  id?: RegistrationPolicyBucket['id'];
  // Only present for buckets belonging to an in-progress edit session; see EditingRegistrationBucket.
  generatedId?: string;
};

export type RegistrationPolicyForRegistrationPolicyUtils = Pick<RegistrationPolicy, 'prevent_no_preference_signups'> & {
  buckets: BucketForRegistrationPolicyUtils[];
};

function sumBucketProperty(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
  property: 'total_slots' | 'minimum_slots' | 'preferred_slots',
): number {
  return (registrationPolicy.buckets ?? []).reduce((sum, bucket) => sum + (bucket[property] ?? 0), 0);
}

export function sumTotalSlots(registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils): number {
  return sumBucketProperty(registrationPolicy, 'total_slots');
}

export function sumMinimumSlots(registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils): number {
  return sumBucketProperty(registrationPolicy, 'minimum_slots');
}

export function sumPreferredSlots(registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils): number {
  return sumBucketProperty(registrationPolicy, 'preferred_slots');
}

export function getRegistrationPolicySlotsLimited(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
): boolean {
  return (registrationPolicy.buckets ?? []).every((bucket) => bucket.slots_limited);
}

export function getRegistrationPolicyBucket(
  registrationPolicy: RegistrationPolicyForRegistrationPolicyUtils,
  generatedId: string,
): BucketForRegistrationPolicyUtils | undefined {
  return (registrationPolicy.buckets ?? []).find((bucket) => bucket.generatedId === generatedId);
}

export function addRegistrationPolicyBucket<T extends RegistrationPolicyForRegistrationPolicyUtils>(
  registrationPolicy: T,
  generatedId: string,
  bucket: Omit<T['buckets'][0], 'generatedId'>,
): T {
  if (getRegistrationPolicyBucket(registrationPolicy, generatedId)) {
    throw new Error(`Bucket with generatedId ${generatedId} already exists in registration policy`);
  }

  return {
    ...registrationPolicy,
    buckets: [...(registrationPolicy.buckets ?? []), { generatedId, ...bucket }],
  };
}

export function removeRegistrationPolicyBucket<T extends RegistrationPolicyForRegistrationPolicyUtils>(
  registrationPolicy: T,
  generatedId: string,
): T {
  return {
    ...registrationPolicy,
    buckets: (registrationPolicy.buckets ?? []).filter((bucket) => bucket.generatedId !== generatedId),
  };
}

export function updateRegistrationPolicyBucket<T extends RegistrationPolicyForRegistrationPolicyUtils>(
  registrationPolicy: T,
  generatedId: string,
  newBucket: Omit<T['buckets'][0], 'generatedId'>,
): T {
  const index = (registrationPolicy.buckets ?? []).findIndex((bucket) => bucket.generatedId === generatedId);

  if (index === -1) {
    return addRegistrationPolicyBucket(registrationPolicy, generatedId, newBucket);
  }

  const newBuckets = [...(registrationPolicy.buckets ?? [])];
  newBuckets.splice(index, 1, { generatedId, ...newBucket });

  return {
    ...registrationPolicy,
    buckets: newBuckets,
  };
}

export function getRegistrationPolicyAnythingBucket<T extends RegistrationPolicyForRegistrationPolicyUtils>(
  registrationPolicy: T,
): BucketForRegistrationPolicyUtils | undefined {
  return (registrationPolicy.buckets ?? []).find((bucket) => bucket.anything);
}

export type RegistrationPolicyBucketWithGeneratedId = RegistrationPolicyBucket & { generatedId: string };
export type RegistrationPolicyWithGeneratedBucketIds = Omit<RegistrationPolicy, 'buckets'> & {
  buckets: RegistrationPolicyBucketWithGeneratedId[];
};

// Tags every bucket entering an editing session with a stable, client-only generatedId, so the
// editor never has to rely on key (which won't always be present) or id (which new buckets don't
// have yet) for its own bookkeeping.
export function withGeneratedBucketIds(
  registrationPolicy: RegistrationPolicy,
): RegistrationPolicyWithGeneratedBucketIds {
  return {
    ...registrationPolicy,
    buckets: registrationPolicy.buckets.map((bucket) => ({
      ...bucket,
      generatedId: (bucket as RegistrationPolicyBucketWithGeneratedId).generatedId ?? uuidv4(),
    })),
  };
}

// The inverse of withGeneratedBucketIds -- generatedId must never be sent to the server, so this
// is applied before a registration policy leaves the editor for good.
export function withoutGeneratedBucketIds(
  registrationPolicy: RegistrationPolicyWithGeneratedBucketIds,
): RegistrationPolicy {
  return {
    ...registrationPolicy,
    buckets: registrationPolicy.buckets.map(({ generatedId, ...bucket }) => bucket),
  };
}
