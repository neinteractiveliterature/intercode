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
import { EventPageQueryDocument } from './queries.generated';
import useSectionizedFormItems from './useSectionizedFormItems';
import FormItemDisplay from '../../FormPresenter/ItemDisplays/FormItemDisplay';
import { valueIsPresent } from './valueIsPresent';
import buildEventUrl from '../buildEventUrl';
import { Route } from './+types/index';

export const loader = async ({ params: { eventId }, context }: Route.LoaderArgs) => {
  const client = context!.client;

  const { data } = await client.query({
    query: EventPageQueryDocument,
    variables: { eventId: eventId ?? '' },
  });
  return data;
};

function EventPage({ loaderData: data }: Route.ComponentProps): JSX.Element {
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

          <ShortFormEventDetails data={data} />
        </div>

        <div className="col-md-3">
          {myProfile && (
            <div className="d-flex justify-content-center justify-content-md-end mb-4">
              <RateEventControl value={event.my_rating} onChange={(rating) => rateEvent(event.id, rating)} size={1.5} />
            </div>
          )}

          <EventAdminMenu data={data} />

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
        <RunsSection data={data} />
      </section>

      <LongFormEventDetails data={data} />
    </>
  );
}

export default EventPage;
