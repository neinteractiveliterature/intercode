import React from 'react';
import PropTypes from 'prop-types';

import EventBreadcrumbItems from './EventBreadcrumbItems';
import { EventPageQuery } from './queries.gql';
import RunsSection from './RunsSection';
import ErrorDisplay from '../../ErrorDisplay';
import useQuerySuspended from '../../useQuerySuspended';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import ShortFormEventDetails from './ShortFormEventDetails';
import EventAdminMenu from './EventAdminMenu';
import LongFormEventDetails from './LongFormEventDetails';

function EventPage({ eventId, eventPath }) {
  const { data, error } = useQuerySuspended(EventPageQuery, { variables: { eventId } });

  usePageTitle(
    useValueUnless(() => data.event.title, error),
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const {
    convention, currentAbility, event,
  } = data;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <EventBreadcrumbItems
            event={event}
            convention={convention}
            currentAbility={currentAbility}
            eventPath={eventPath}
          />
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-9">
          <h1>{event.title}</h1>

          <ShortFormEventDetails eventId={eventId} />
        </div>

        <div className="col-md-3">
          <EventAdminMenu eventId={eventId} />
        </div>
      </div>

      <section className="my-4">
        <RunsSection eventId={eventId} />
      </section>

      <LongFormEventDetails eventId={eventId} />
    </>
  );
}

EventPage.propTypes = {
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default EventPage;
