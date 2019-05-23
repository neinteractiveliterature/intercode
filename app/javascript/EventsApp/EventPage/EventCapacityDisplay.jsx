import React from 'react';
import PropTypes from 'prop-types';

import sortBuckets from './sortBuckets';

function describeBucketCapacity(bucket) {
  if (!bucket.slots_limited) {
    return 'unlimited';
  }

  if (bucket.minimum_slots === bucket.total_slots) {
    return bucket.minimum_slots;
  }

  return `${bucket.minimum_slots}-${bucket.total_slots}`;
}

function EventCapacityDisplay({ event }) {
  return (
    <ul className="list-inline mb-0">
      {sortBuckets(event.registration_policy.buckets).map(bucket => (
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

EventCapacityDisplay.propTypes = {
  event: PropTypes.shape({
    registration_policy: PropTypes.shape({
      buckets: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slots_limited: PropTypes.bool.isRequired,
        minimum_slots: PropTypes.number,
        total_slots: PropTypes.number,
      })).isRequired,
    }).isRequired,
  }).isRequired,
};

export default EventCapacityDisplay;
