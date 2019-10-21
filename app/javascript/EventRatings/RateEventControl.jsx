import React from 'react';
import EventRatingIcon from './EventRatingIcon';

function RatingPicker() {
  return (
    <div className="d-flex">
      {['-1', '0', '1'].map((rating) => (
        <EventRatingIcon rating={rating} key={rating} />
      ))}
    </div>
  );
}

function RateEventControl({ eventId, rating, onChange }) {
  return (
    <div className="bg-white border rounded">
      {rating != null && rating !== 0
        ? <EventRatingIcon rating={rating} />
        : <RatingPicker />}
    </div>
  );
}

export default RateEventControl;
