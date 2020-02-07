import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { pluralize, humanize, underscore } from 'inflected';

import ErrorDisplay from '../../ErrorDisplay';
import EventCapacityDisplay from './EventCapacityDisplay';
import { EventPageQuery } from './queries.gql';
import FormItemDisplay from '../../FormPresenter/ItemDisplays/FormItemDisplay';
import useQuerySuspended from '../../useQuerySuspended';
import useSectionizedFormItems from './useSectionizedFormItems';
import teamMembersForDisplay from '../teamMembersForDisplay';
import Gravatar from '../../Gravatar';
import { formResponseValueIsComplete } from '../../Models/FormItem';

function ShortFormEventDetails({ eventId }) {
  const { data, error } = useQuerySuspended(EventPageQuery, { variables: { eventId } });

  const { shortFormItems, formResponse } = useSectionizedFormItems(error ? null : data.event);

  const displayTeamMembers = useMemo(
    () => (error ? [] : teamMembersForDisplay(data.event)),
    [data, error],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { event, convention } = data;

  const acceptsSignups = (
    !event.registration_policy.slots_limited
    || event.registration_policy.total_slots_including_not_counted > 0
  );

  return (
    <dl className="row mb-0">
      {shortFormItems
        .filter((item) => formResponseValueIsComplete(item, formResponse[item.identifier]))
        .map((item) => (
          <React.Fragment key={item.identifier}>
            <dt className="col-md-3">{item.public_description}</dt>
            <dd className="col-md-9">
              <FormItemDisplay
                formItem={item}
                convention={convention}
                value={formResponse[item.identifier]}
                displayMode="public"
              />
            </dd>
          </React.Fragment>
        ))}
      {
        displayTeamMembers.length > 0
          ? (
            <>
              <dt className="col-md-3">{pluralize(humanize(underscore(event.event_category.team_member_name)))}</dt>
              <dd className="col-md-9">
                <ul className="list-unstyled mb-0">
                  {displayTeamMembers.map((teamMember) => (
                    <li key={teamMember.id}>
                      <div className="d-flex align-items-center mb-1">
                        <div className="mr-2">
                          <Gravatar
                            url={teamMember.user_con_profile.gravatar_url}
                            enabled={teamMember.user_con_profile.gravatar_enabled}
                            pixelSize={26}
                          />
                        </div>
                        <div>
                          {teamMember.user_con_profile.name_without_nickname}
                          {
                            teamMember.email
                              ? (
                                <>
                                  {' '}
                                  (
                                  <a href={`mailto:${teamMember.email}`}>
                                    {teamMember.email}
                                  </a>
                                  )
                                </>
                              )
                              : null
                          }
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          )
          : null
      }
      {
        acceptsSignups
          ? (
            <>
              <dt className="col-md-3">Capacity</dt>
              <dd className="col-md-9 mb-0"><EventCapacityDisplay event={event} /></dd>
            </>
          )
          : null
      }
    </dl>
  );
}

ShortFormEventDetails.propTypes = {
  eventId: PropTypes.number.isRequired,
};

export default ShortFormEventDetails;
