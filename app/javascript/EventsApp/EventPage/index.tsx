import { useContext } from 'react';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import EventBreadcrumbItems from './EventBreadcrumbItems';
import RunsSection from './RunsSection';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import ShortFormEventDetails from './ShortFormEventDetails';
import EventAdminMenu from './EventAdminMenu';
import LongFormEventDetails from './LongFormEventDetails';
import RateEventControl from '../../EventRatings/RateEventControl';
import AppRootContext from '../../AppRootContext';
import useRateEvent from '../../EventRatings/useRateEvent';
import { useEventPageQuery } from './queries.generated';
import useSectionizedFormItems from './useSectionizedFormItems';
import parsePageContent from '../../parsePageContent';

export type EventPageProps = {
  eventId: number;
  eventPath: string;
};

function EventPage({ eventId, eventPath }: EventPageProps) {
  const { myProfile } = useContext(AppRootContext);
  const { data, loading, error } = useEventPageQuery({ variables: { eventId } });
  const rateEvent = useRateEvent();
  const { secretFormItems, formResponse } = useSectionizedFormItems(data?.event);

  usePageTitle(useValueUnless(() => data!.event.title, error || loading));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { convention, currentAbility, event } = data!;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <EventBreadcrumbItems
            event={event}
            convention={convention!}
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

          {secretFormItems.map((item) =>
            formResponse[item.identifier ?? ''] &&
            formResponse[item.identifier ?? ''].trim() !== '' ? (
              <section
                className="my-2 card bg-light"
                id={item.identifier ?? `item${item.id}`}
                key={item.identifier ?? `item${item.id}`}
              >
                <div className="card-header">
                  <strong>{item.public_description}</strong>
                </div>

                <div className="card-body">
                  {parsePageContent(formResponse[item.identifier ?? '']).bodyComponents}
                </div>
              </section>
            ) : null,
          )}
        </div>
      </div>

      <section className="my-4">
        <RunsSection eventId={eventId} />
      </section>

      <LongFormEventDetails eventId={eventId} />
    </>
  );
}

export default EventPage;
