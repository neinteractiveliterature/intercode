export function findBucket(bucketKey, registrationPolicy) {
  return registrationPolicy.buckets.find(bucket => bucket.key === bucketKey);
}
