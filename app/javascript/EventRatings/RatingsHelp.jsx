import React from 'react';
import EventRatingIcon from './EventRatingIcon';

function RatingsHelp() {
  return (
    <>
      You can mark an event as a “favorite” by clicking the
      {' '}
      <EventRatingIcon rating={1} />
      {' '}
      icon on it, and you can hide an event from your default view by clicking the
      {' '}
      <EventRatingIcon rating={-1} />
      {' '}
      icon.  To revert to “TBD,” click the icon again.  Your preferences are always private, and
      event runners and convention staff cannot see what you’ve favorited or hidden.
    </>
  );
}

export default RatingsHelp;
