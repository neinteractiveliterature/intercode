import { useContext } from 'react';

import EventBreadcrumbItems from './EventBreadcrumbItems';
import RunsSection from './RunsSection';
import usePageTitle from '../../usePageTitle';
import ShortFormEventDetails from './ShortFormEventDetails';
import EventAdminMenu from './EventAdminMenu';
import LongFormEventDetails from './LongFormEventDetails';
import RateEventControl from '../../EventRatings/RateEventControl';
import AppRootContext from '../../AppRootContext';
import useRateEvent from '../../EventRatings/useRateEvent';
import { useEventPageQuery } from './queries.generated';
import useSectionizedFormItems from './useSectionizedFormItems';
import FormItemDisplay from '../../FormPresenter/ItemDisplays/FormItemDisplay';
import { valueIsPresent } from './valueIsPresent';
import { useParams } from 'react-router';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform/dist';
import buildEventUrl from '../buildEventUrl';

function useLoadEventPageQueryFromParams() {
  const params = useParams<{ eventId: string }>();
  return useEventPageQuery({ variables: { eventId: params.eventId ?? '' } });
}

export default LoadQueryWrapper(useLoadEventPageQueryFromParams, function EventPage({ data }): JSX.Element {
  const { myProfile } = useContext(AppRootContext);
  const rateEvent = useRateEvent();
  const { secretFormItems, formResponse } = useSectionizedFormItems(data.convention.event);

  usePageTitle(data.convention.event.title);

  const { convention, currentAbility } = data;
  const event = convention.event;

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <EventBreadcrumbItems
            event={event}
            convention={convention}
            currentAbility={currentAbility}
            eventPath={buildEventUrl(event)}
          />
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-9">
          <h1>{event.title}</h1>

          <ShortFormEventDetails eventId={event.id} />
        </div>

        <div className="col-md-3">
          {myProfile && (
            <div className="d-flex justify-content-center justify-content-md-end mb-4">
              <RateEventControl value={event.my_rating} onChange={(rating) => rateEvent(event.id, rating)} size={1.5} />
            </div>
          )}

          <EventAdminMenu eventId={event.id} />

          {secretFormItems.map(
            (item) =>
              valueIsPresent(formResponse[item.identifier ?? '']) && (
                <section
                  className="my-2 card bg-light"
                  id={item.identifier ?? `item${item.id}`}
                  key={item.identifier ?? `item${item.id}`}
                >
                  <div className="card-header">
                    <strong>{item.public_description}</strong>
                  </div>

                  <div className="card-body">
                    <FormItemDisplay
                      convention={convention}
                      displayMode="public"
                      formItem={item}
                      value={formResponse[item.identifier ?? '']}
                    />
                  </div>
                </section>
              ),
          )}
        </div>
      </div>

      <section className="my-4">
        <RunsSection eventId={event.id} />
      </section>

      <LongFormEventDetails eventId={event.id} />
    </>
  );
});
