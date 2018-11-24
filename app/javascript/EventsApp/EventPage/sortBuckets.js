function compareBuckets(a, b) {
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

  return (a.name || '').localeCompare(b.name || '', { sensitivity: 'base' });
}

export default function sortBuckets(buckets) {
  return [...buckets].sort(compareBuckets);
}
