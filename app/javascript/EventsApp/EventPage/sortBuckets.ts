export type RunCapacityBucket = {
  key: string;
  name?: string | null;
  slots_limited: boolean;
  total_slots?: number | null;
  anything: boolean;
  not_counted: boolean;
};

function compareBuckets(a: RunCapacityBucket, b: RunCapacityBucket) {
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

export default function sortBuckets<T extends RunCapacityBucket>(buckets: T[]): T[] {
  return [...buckets].sort(compareBuckets);
}
