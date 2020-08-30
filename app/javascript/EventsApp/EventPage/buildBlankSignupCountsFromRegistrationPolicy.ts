import { SignupCountsByBucketKeyAndCounted } from '../SignupCountData';

export default function buildBlankSignupCountsFromRegistrationPolicy(registrationPolicy: {
  buckets: { key: string }[];
}): SignupCountsByBucketKeyAndCounted {
  if (!registrationPolicy || !registrationPolicy.buckets) {
    return {};
  }

  return registrationPolicy.buckets.reduce(
    (signupCountByBucketAndCounted, bucket) => ({
      ...signupCountByBucketAndCounted,
      [bucket.key]: { counted: 0, not_counted: 0 },
    }),
    {},
  );
}
