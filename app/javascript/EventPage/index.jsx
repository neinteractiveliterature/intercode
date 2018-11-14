import React from 'react';
import PropTypes from 'prop-types';
import { humanize, underscore, pluralize } from 'inflected';
import moment from 'moment-timezone';

import { EventPageQuery } from './queries.gql';
import Form from '../Models/Form';
import FormItemDisplay from '../FormPresenter/ItemDisplays/FormItemDisplay';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import RunsSection from './RunsSection';
import sortBuckets from './sortBuckets';

function EventPage({ eventId }) {
  return (
    <QueryWithStateDisplay query={EventPageQuery} variables={{ eventId }}>
      {({
        data: {
          convention, currentAbility, myProfile, event,
        },
      }) => {
        const form = Form.fromApiResponse(JSON.parse(event.form.form_api_json));
        const formResponse = JSON.parse(event.form_response_attrs_json_with_rendered_markdown);

        const displayFormItems = form.getAllItems().filter(item => (
          item.get('identifier') !== 'short_blurb'
          && item.get('properties').public_description != null
          && formResponse[item.get('identifier')]
        ));
        const shortFormItems = [];
        const longFormItems = [];
        displayFormItems.forEach((item) => {
          if (item.get('itemType') === 'free_text' && item.get('properties').format === 'markdown') {
            longFormItems.push(item);
          } else {
            shortFormItems.push(item);
          }
        });
        longFormItems.sort((a, b) => {
          if (a.get('identifier') === 'description') {
            return -1;
          }

          if (b.get('identifier') === 'description') {
            return 1;
          }

          return 0;
        });

        const acceptsSignups = (
          !event.registration_policy.slots_limited
          || event.registration_policy.total_slots_including_not_counted > 0
        );

        return (
          <>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  {
                    currentAbility.can_read_schedule && event.runs.length > 0
                      ? (
                        <a href={`/events/schedule/${moment.tz(event.runs[0].starts_at, convention.timezone_name).format('dddd').toLowerCase()}`}>
                          Con schedule
                        </a>
                      )
                      : (
                        <a href="/events">
                          List of events
                        </a>
                      )
                  }
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {event.title}
                </li>
              </ol>
            </nav>

            <div className="row">
              <div className="col-md-9">
                <h1>{event.title}</h1>

                <dl className="row">
                  {shortFormItems.map(item => (
                    <React.Fragment key={item.get('identifier')}>
                      <dt className="col-md-3">{item.get('properties').public_description}</dt>
                      <dd className="col-md-9">
                        <FormItemDisplay
                          formItem={item}
                          convention={convention}
                          value={formResponse[item.get('identifier')]}
                          displayMode="public"
                        />
                      </dd>
                    </React.Fragment>
                  ))}
                  {
                    event.team_members.length > 0
                      ? (
                        <>
                          <dt className="col-md-3">{pluralize(humanize(underscore(event.team_member_name)))}</dt>
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
                          <dd className="col-md-9">
                            <ul className="list-inline">
                              {sortBuckets(event.registration_policy.buckets).map(bucket => (
                                <li className="list-inline-item mr-4" key={bucket.key}>
                                  <strong>
                                    {bucket.name}
                                    :
                                  </strong>
                                  {' '}
                                  {
                                    bucket.slots_limited
                                      ? (
                                        bucket.minimum_slots === bucket.total_slots
                                        ? bucket.minimum_slots
                                        : `${bucket.minimum_slots}-${bucket.total_slots}`
                                      ) :
                                      'unlimited'
                                  }
                                </li>
                              ))}
                            </ul>
                          </dd>
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
                            <a href={`/events/${event.id}/edit`}>Edit event</a>
                          </li>
                          <li className="list-group-item">
                            <a href={`/events/${event.id}/team_members`}>
                              Edit
                              {' '}
                              {humanize(underscore(pluralize(event.team_member_name)))}
                            </a>
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
              currentAbility={currentAbility}
              myProfile={myProfile}
              timezoneName={convention.timezone_name}
            />

            {
              longFormItems.map(item => (
                <section className="my-4" key={item.get('identifier')}>
                  <hr />

                  {
                    item.get('identifier') === 'description'
                      ? null
                      : <h4>{item.get('properties').public_description}</h4>
                  }

                  <div dangerouslySetInnerHTML={{ __html: formResponse[item.get('identifier')]}} />
                </section>
              ))
            }
          </>
        );
      }}
    </QueryWithStateDisplay>
  );
}

// %nav{'aria-label' => 'breadcrumb'}
//   %ol.breadcrumb
//     %li.breadcrumb-item
//       - if can?(:schedule, convention) && @runs.any?
//         = link_to 'Con schedule', "/events/schedule/#{@runs.first.starts_at.strftime('%A').downcase}"
//       - else
//         = link_to 'List of events', events_path
//     %li.breadcrumb-item.active{'aria-current' => 'page'}
//       = @event.title

EventPage.propTypes = {
  eventId: PropTypes.number.isRequired,
};

export default EventPage;
