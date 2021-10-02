import { RunCardRegistrationPolicyFieldsFragment } from './queries.generated';

type EventPageBucket = RunCardRegistrationPolicyFieldsFragment['buckets'][0];

function compareBuckets(a: EventPageBucket, b: EventPageBucket) {
  if (a.slots_limited && !b.slots_limited) {
    return -1;
  }

  if (b.slots_limited && !a.slots_limited) {
    return 1;
  }

  if (a.anything && !b.anything) {
    return 1;
  }

  if (b.anything && !a.anything) {
    return -1;
  }

  if (a.not_counted && !b.not_counted) {
    return 1;
  }

  if (b.not_counted && !a.not_counted) {
    return -1;
  }

  return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
}

export default function sortBuckets(buckets: EventPageBucket[]): EventPageBucket[] {
  return [...buckets].sort(compareBuckets);
}
