import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import EventBreadcrumbItems from './EventBreadcrumbItems';
import { EventPageQuery } from './queries.gql';
import RunsSection from './RunsSection';
import ErrorDisplay from '../../ErrorDisplay';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import ShortFormEventDetails from './ShortFormEventDetails';
import EventAdminMenu from './EventAdminMenu';
import LongFormEventDetails from './LongFormEventDetails';
import RateEventControl from '../../EventRatings/RateEventControl';
import AppRootContext from '../../AppRootContext';
import useRateEvent from '../../EventRatings/useRateEvent';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function EventPage({ eventId, eventPath }) {
  const { myProfile } = useContext(AppRootContext);
  const { data, loading, error } = useQuery(EventPageQuery, { variables: { eventId } });
  const rateEvent = useRateEvent();

  usePageTitle(
    useValueUnless(() => data.event.title, error || loading),
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

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
                size={1.5}
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
