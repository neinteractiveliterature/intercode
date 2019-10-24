import React from 'react';
import { getRatingIconClass, getRatingColorClass, RATING_NAMES } from './EventRatingIcon';

function RatingsHelp() {
  return (
    <>
      You can mark an event as a “favorite” by clicking the
      {' '}
      <i className={`fa ${getRatingIconClass(1)} ${getRatingColorClass(1)}`}>
        <span className="sr-only">{RATING_NAMES[1]}</span>
      </i>
      {' '}
      icon on it, and you can hide an event from your default view by clicking the
      {' '}
      <i className={`fa ${getRatingIconClass(-1)} ${getRatingColorClass(-1)}`}>
        <span className="sr-only">{RATING_NAMES[-1]}</span>
      </i>
      {' '}
      icon.  To revert to “TBD,” click the icon again.  Your preferences are always private, and
      event runners and convention staff cannot see what you’ve favorited or hidden.
    </>
  );
}

export default RatingsHelp;
