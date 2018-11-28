import React from 'react';
import PropTypes from 'prop-types';

import EventPageDisplay from './EventPageDisplay';
import { EventPageQuery } from './queries.gql';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';

function EventPage({ eventId, eventPath }) {
  return (
    <QueryWithStateDisplay query={EventPageQuery} variables={{ eventId }}>
      {({
        data: {
          convention, currentAbility, myProfile, event,
        },
      }) => (
        <EventPageDisplay
          convention={convention}
          currentAbility={currentAbility}
          myProfile={myProfile}
          event={event}
          eventPath={eventPath}
        />
      )}
    </QueryWithStateDisplay>
  );
}

EventPage.propTypes = {
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default EventPage;
