import React from 'react';
import PropTypes from 'prop-types';
import { humanize, underscore, pluralize } from 'inflected';
import { Link } from 'react-router-dom';

import EventBreadcrumbItems from './EventBreadcrumbItems';
import EventCapacityDisplay from './EventCapacityDisplay';
import { EventPageQuery } from './queries.gql';
import FormItemDisplay from '../../FormPresenter/ItemDisplays/FormItemDisplay';
import RunsSection from './RunsSection';
import { deserializeForm } from '../../FormPresenter/GraphQLFormDeserialization';
import ErrorDisplay from '../../ErrorDisplay';
import useQuerySuspended from '../../useQuerySuspended';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import parsePageContent from '../../parsePageContent';

function getSectionizedFormItems(formData, formResponse) {
  const form = deserializeForm(formData);
  const displayFormItems = form.getAllItems().filter(item => (
    item.identifier !== 'short_blurb'
    && item.identifier !== 'title'
    && item.public_description != null
    && formResponse[item.identifier]
  ));
  const shortFormItems = [];
  const longFormItems = [];
  displayFormItems.forEach((item) => {
    if (item.item_type === 'free_text' && item.properties.format === 'markdown') {
      longFormItems.push(item);
    } else {
      shortFormItems.push(item);
    }
  });
  longFormItems.sort((a, b) => {
    if (a.identifier === 'description') {
      return -1;
    }

    if (b.identifier === 'description') {
      return 1;
    }

    return 0;
  });

  return { shortFormItems, longFormItems };
}

function EventPage({ eventId, eventPath }) {
  const { data, error } = useQuerySuspended(EventPageQuery, { variables: { eventId } });

  usePageTitle(
    useValueUnless(() => data.event.title, error),
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const {
    convention, currentAbility, myProfile, event,
  } = data;

  const formResponse = JSON.parse(event.form_response_attrs_json_with_rendered_markdown);
  const {
    shortFormItems, longFormItems,
  } = getSectionizedFormItems(event.form, formResponse);

  const acceptsSignups = (
    !event.registration_policy.slots_limited
    || event.registration_policy.total_slots_including_not_counted > 0
  );

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

          <dl className="row">
            {shortFormItems.map(item => (
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
              event.team_members.length > 0
                ? (
                  <>
                    <dt className="col-md-3">{pluralize(humanize(underscore(event.event_category.team_member_name)))}</dt>
                    <dd className="col-md-9">
                      <ul className="list-unstyled mb-0">
                        {event.team_members.map(teamMember => (
                          <li key={teamMember.id}>
                            {teamMember.user_con_profile.name_without_nickname}
                            {
                              teamMember.email
                                ? (
                                  <>
                                    {' ('}
                                    <a href={`mailto:${teamMember.email}`}>
                                      {teamMember.email}
                                    </a>
                                    {')'}
                                  </>
                                )
                                : null
                            }
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
                    <dd className="col-md-9"><EventCapacityDisplay event={event} /></dd>
                  </>
                )
                : null
            }
          </dl>
        </div>

        <div className="col-md-3">
          {
            currentAbility.can_update_event
              ? (
                <div className="card">
                  <div className="card-header">
                    Event Admin
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <Link to={`${eventPath}/edit`}>Edit event</Link>
                    </li>
                    <li className="list-group-item">
                      <Link to={`${eventPath}/team_members`}>
                        Edit
                        {' '}
                        {pluralize(event.event_category.team_member_name)}
                      </Link>
                    </li>
                  </ul>
                </div>
              )
              : null
          }
        </div>
      </div>

      <RunsSection
        event={event}
        eventPath={eventPath}
        currentAbility={currentAbility}
        myProfile={myProfile}
        timezoneName={convention.timezone_name}
      />

      {
        longFormItems.map(item => (
          formResponse[item.identifier] && formResponse[item.identifier].trim() !== ''
            ? (
              <section className="my-4" key={item.identifier}>
                <hr />

                {
                  item.identifier === 'description'
                    ? null
                    : <h4>{item.public_description}</h4>
                }

                {parsePageContent(formResponse[item.identifier]).bodyComponents}
              </section>
            )
            : null
        ))
      }
    </>
  );
}

EventPage.propTypes = {
  eventId: PropTypes.number.isRequired,
  eventPath: PropTypes.string.isRequired,
};

export default EventPage;
