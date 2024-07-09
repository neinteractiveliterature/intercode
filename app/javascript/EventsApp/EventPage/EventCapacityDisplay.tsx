import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import sortBuckets from './sortBuckets';
import { EventPageQueryData, RunCardRegistrationPolicyFieldsFragment } from './queries.generated';

function describeBucketCapacity(bucket: RunCardRegistrationPolicyFieldsFragment['buckets'][0], t: TFunction) {
  if (!bucket.slots_limited) {
    return t('events.runCapacity.unlimitedSimple');
  }

  if (bucket.minimum_slots === bucket.total_slots) {
    return `${bucket.minimum_slots}`;
  }

  return `${bucket.minimum_slots}-${bucket.total_slots}`;
}

export type EventCapacityDisplayProps = {
  event: EventPageQueryData['convention']['event'];
};

function EventCapacityDisplay({ event }: EventCapacityDisplayProps): JSX.Element {
  const { t } = useTranslation();
  return (
    <ul className="list-inline mb-0">
      {sortBuckets(event.registration_policy?.buckets ?? []).map((bucket) => (
        <li className="list-inline-item me-4" key={bucket.key}>
          <strong>{bucket.name}:</strong> {describeBucketCapacity(bucket, t)}
        </li>
      ))}
    </ul>
  );
}

export default EventCapacityDisplay;
