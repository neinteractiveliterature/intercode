export default function buildBlankSignupCountsFromRegistrationPolicy(registrationPolicy) {
  if (!registrationPolicy || !registrationPolicy.buckets) {
    return [];
  }

  return registrationPolicy.buckets
    .reduce((signupCountByBucketAndCounted, bucket) => ({
      ...signupCountByBucketAndCounted,
      [bucket.key]: { counted: 0, not_counted: 0 },
    }), {});
}
