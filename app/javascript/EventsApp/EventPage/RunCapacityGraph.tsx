import { useTranslation } from 'react-i18next';

import RunCapacityGraphBucket from './RunCapacityGraphBucket';
import SignupCountData from '../SignupCountData';
import sortBuckets from './sortBuckets';
import BucketAvailabilityDisplay from './BucketAvailabilityDisplay';
import { EventPageQueryData } from './queries.generated';
import styles from 'styles/run_capacity_graph.module.scss';

export type RunCapacityGraphProps = {
  run: Pick<EventPageQueryData['convention']['event']['runs'][0], 'grouped_signup_counts'>;
  event: Pick<EventPageQueryData['convention']['event'], 'registration_policy'>;
  signupsAvailable: boolean;
};

function RunCapacityGraph({ run, event, signupsAvailable }: RunCapacityGraphProps): React.JSX.Element {
  const { t } = useTranslation();
  const signupCountData = SignupCountData.fromRun(run);

  return (
    <div className={`run-capacity ${styles.runCapacity} bg-white rounded mb-2`} style={{ overflow: 'hidden' }}>
      {sortBuckets((event.registration_policy || {}).buckets || []).map((bucket, bucketIndex) => (
        <RunCapacityGraphBucket
          bucket={bucket}
          signupCountData={signupCountData}
          key={bucket.key}
          signupsAvailable={signupsAvailable}
          bucketIndex={bucketIndex}
        />
      ))}
      <div className={`bucket-capacity ${styles.bucketCapacity}`}>
        <>
          {t('events.runCapacity.waitlistCount', {
            waitlistCount: signupCountData.getWaitlistCount(),
          })}
          <BucketAvailabilityDisplay
            className="text-secondary"
            signupCount={signupCountData.getWaitlistCount()}
            remainingCapacity={0}
          />
        </>
      </div>
    </div>
  );
}

export default RunCapacityGraph;
