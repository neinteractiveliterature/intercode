import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import BucketAvailabilityDisplay from './BucketAvailabilityDisplay';
import { RunCardRegistrationPolicyFieldsFragment } from './queries.generated';
import SignupCountData from '../SignupCountData';
import { SignupState } from '../../graphqlTypes.generated';

function describeCapacity(
  bucket: RunCardRegistrationPolicyFieldsFragment['buckets'][0],
  signupCount: number,
  signupsAvailable: boolean,
  t: TFunction,
): string {
  if (!bucket.slots_limited) {
    if (!signupsAvailable) {
      return t('events.runCapacity.unlimitedSimple');
    }

    return t('events.runCapacity.unlimitedWithCount', {
      signupCount,
    });
  }

  if (bucket.total_slots == null) {
    return t('events.runCapacity.zeroCapacity');
  }

  const remainingCapacity = bucket.total_slots - signupCount;

  if (!signupsAvailable && remainingCapacity === bucket.total_slots) {
    return t('events.runCapacity.slotCount', { count: remainingCapacity });
  }

  const displayCount = signupCount > bucket.total_slots ? bucket.total_slots : signupCount;

  return t('events.runCapacity.slotRemainingCount', {
    count: bucket.total_slots,
    filledCount: displayCount,
  });
}

export type RunCapacityGraphBucketProps = {
  bucket: RunCardRegistrationPolicyFieldsFragment['buckets'][0];
  signupCountData: SignupCountData;
  signupsAvailable: boolean;
  bucketIndex: number;
};

function RunCapacityGraphBucket({
  bucket,
  signupCountData,
  signupsAvailable,
  bucketIndex,
}: RunCapacityGraphBucketProps): JSX.Element {
  const { t } = useTranslation();
  const capacity = bucket.total_slots ?? 0;

  if (capacity < 1 && bucket.slots_limited) {
    return <></>;
  }

  const signupCount = signupCountData.sumSignupCounts({
    state: [SignupState.Confirmed, SignupState.TicketPurchaseHold],
    bucket_key: bucket.key,
  });
  const remainingCapacity = (bucket.total_slots ?? 0) - signupCount;

  return (
    <div className="bucket-capacity">
      {bucket.name}
      {' - '}
      {describeCapacity(bucket, signupCount, signupsAvailable, t)}
      <BucketAvailabilityDisplay
        className={`text-bucket-color-${(bucketIndex % 9) + 1}`}
        signupCount={signupCount}
        remainingCapacity={remainingCapacity}
      />
    </div>
  );
}

export default RunCapacityGraphBucket;
