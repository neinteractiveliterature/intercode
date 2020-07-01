import React from 'react';

import sortBuckets from './sortBuckets';
import { RegistrationPolicyBucket } from '../../graphqlTypes.generated';
import { EventPageEventFieldsFragment } from './queries.generated';

function describeBucketCapacity(
  bucket: Pick<RegistrationPolicyBucket, 'slots_limited' | 'minimum_slots' | 'total_slots'>,
) {
  if (!bucket.slots_limited) {
    return 'unlimited';
  }

  if (bucket.minimum_slots === bucket.total_slots) {
    return bucket.minimum_slots;
  }

  return `${bucket.minimum_slots}-${bucket.total_slots}`;
}

export type EventCapacityDisplayProps = {
  event: Pick<EventPageEventFieldsFragment, 'registration_policy'>,
};

function EventCapacityDisplay({ event }: EventCapacityDisplayProps) {
  return (
    <ul className="list-inline mb-0">
      {sortBuckets(event.registration_policy?.buckets ?? []).map((bucket) => (
        <li className="list-inline-item mr-4" key={bucket.key}>
          <strong>
            {bucket.name}
            :
          </strong>
          {' '}
          {describeBucketCapacity(bucket)}
        </li>
      ))}
    </ul>
  );
}

export default EventCapacityDisplay;
