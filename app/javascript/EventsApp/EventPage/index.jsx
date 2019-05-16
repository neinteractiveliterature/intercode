import React from 'react';
import PropTypes from 'prop-types';

import EventPageDisplay from './EventPageDisplay';
import { EventPageQuery } from './queries.gql';
import useQuerySuspended from '../../useQuerySuspended';
import ErrorDisplay from '../../ErrorDisplay';

function EventPage({ eventId, eventPath }) {
  const { data, error } = useQuerySuspended(EventPageQuery, { variables: { eventId } });

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const {
    convention, currentAbility, myProfile, event,
  } = data;

  return (
    <EventPageDisplay
      convention={convention}
      currentAbility={currentAbility}
      myProfile={myProfile}
      event={event}
      eventPath={eventPath}
    />
  );
}

EventPage.propTypes = {
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default EventPage;
