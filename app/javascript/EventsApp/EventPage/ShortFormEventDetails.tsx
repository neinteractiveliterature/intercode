import { Fragment, useMemo } from 'react';
import { pluralize, humanize, underscore } from 'inflected';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import EventCapacityDisplay from './EventCapacityDisplay';
import FormItemDisplay from '../../FormPresenter/ItemDisplays/FormItemDisplay';
import useSectionizedFormItems from './useSectionizedFormItems';
import teamMembersForDisplay from '../teamMembersForDisplay';
import Gravatar from '../../Gravatar';
import { formResponseValueIsComplete } from '../../Models/FormItem';
import { useEventPageQuery } from './queries.generated';

export type ShortFormEventDetailsProps = {
  eventId: number;
};

function ShortFormEventDetails({ eventId }: ShortFormEventDetailsProps) {
  const { t } = useTranslation();
  const { data, loading, error } = useEventPageQuery({ variables: { eventId } });

  const { shortFormItems, formResponse } = useSectionizedFormItems(
    error || loading || !data ? undefined : data.event,
  );

  const displayTeamMembers = useMemo(
    () => (error || loading || !data ? [] : teamMembersForDisplay(data.event)),
    [data, error, loading],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { event, convention } = data!;

  const acceptsSignups =
    event.registration_policy &&
    (!event.registration_policy.slots_limited ||
      (event.registration_policy.total_slots_including_not_counted &&
        event.registration_policy.total_slots_including_not_counted > 0));

  return (
    <dl className="row mb-0">
      {shortFormItems
        .filter((item) => formResponseValueIsComplete(item, formResponse[item.identifier ?? '']))
        .map((item) => (
          <Fragment key={item.identifier ?? item.id}>
            <dt className="col-md-3">{item.public_description}</dt>
            <dd className="col-md-9">
              <FormItemDisplay
                formItem={item}
                convention={convention!}
                value={formResponse[item.identifier ?? '']}
                displayMode="public"
              />
            </dd>
          </Fragment>
        ))}
      {displayTeamMembers.length > 0 ? (
        <>
          <dt className="col-md-3">
            {pluralize(humanize(underscore(event.event_category.team_member_name)))}
          </dt>
          <dd className="col-md-9">
            <ul className="list-unstyled mb-0">
              {displayTeamMembers.map((teamMember) => (
                <li key={teamMember.id}>
                  <div className="d-flex align-items-center mb-1">
                    <div className="me-2">
                      <Gravatar
                        url={teamMember.user_con_profile.gravatar_url}
                        enabled={teamMember.user_con_profile.gravatar_enabled}
                        pixelSize={26}
                      />
                    </div>
                    <div>
                      {teamMember.user_con_profile.name_without_nickname}
                      {teamMember.email ? (
                        <>
                          {' '}
                          (<a href={`mailto:${teamMember.email}`}>{teamMember.email}</a>)
                        </>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </dd>
        </>
      ) : null}
      {acceptsSignups ? (
        <>
          <dt className="col-md-3">{t('events.runCapacity.label', 'Capacity')}</dt>
          <dd className="col-md-9 mb-0">
            <EventCapacityDisplay event={event} />
          </dd>
        </>
      ) : null}
    </dl>
  );
}

export default ShortFormEventDetails;
