import React, { useContext } from 'react';
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
import RateEventControl from '../../EventRatings/RateEventControl';
import AppRootContext from '../../AppRootContext';
import useRateEvent from '../../EventRatings/useRateEvent';

function EventPage({ eventId, eventPath }) {
  const { myProfile } = useContext(AppRootContext);
  const { data, error } = useQuerySuspended(EventPageQuery, { variables: { eventId } });
  const rateEvent = useRateEvent();

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
          {myProfile && (
            <div className="d-flex justify-content-center justify-content-md-end mb-4">
              <RateEventControl
                value={event.my_rating}
                onChange={(rating) => rateEvent(event.id, rating)}
              />
            </div>
          )}

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
