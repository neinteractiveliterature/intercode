import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { humanize, underscore } from 'inflected';
import classNames from 'classnames';

import { findBucket } from './SignupUtils';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import RunHeader from './RunHeader';

const signupSummaryQuery = gql`
query RunSignupSummaryQuery($eventId: Int!, $runId: Int!) {
  event(id: $eventId) {
    id
    team_member_name

    registration_policy {
      buckets {
        key
        name
        expose_attendees
      }
    }

    team_members {
      id
      user_con_profile {
        id
      }
    }

    run(id: $runId) {
      id

      signups_paginated(
        per_page: 1000,
        sort: [{ field: "state", desc: false }, { field: "name", desc: false }],
        filters: { state: ["confirmed", "waitlisted"] }
      ) {
        entries {
          id
          state
          bucket_key

          user_con_profile {
            id
            name_inverted
          }
        }
      }
    }
  }
}
`;

class RunSignupSummary extends React.Component {
  static propTypes = {
    eventId: PropTypes.number.isRequired,
    runId: PropTypes.number.isRequired,
  }

  renderSignupRow = (signup, registrationPolicy, teamMembers, teamMemberName) => {
    const bucket = findBucket(signup.bucket_key, registrationPolicy);
    const suffix = (
      signup.bucket_key && bucket && bucket.expose_attendees
        ? ` (${bucket.name})`
        : null
    );
    const isTeamMember = teamMembers
      .some(teamMember => teamMember.user_con_profile.id === signup.user_con_profile.id);

    return (
      <tr
        key={signup.id}
        className={classNames({
          'table-warning': signup.state === 'waitlisted',
          'table-secondary': isTeamMember,
        })}
      >
        <td>
          {signup.user_con_profile.name_inverted}
          {
            isTeamMember
              ? (
                <strong>
                  {' ('}
                  {humanize(underscore(teamMemberName))}
                  {')'}
                </strong>
              )
              : null
          }
        </td>
        <td>
          {humanize(signup.state)}
          {suffix}
        </td>
      </tr>
    );
  }

  render = () => (
    <div>
      <RunHeader eventId={this.props.eventId} runId={this.props.runId} />

      <QueryWithStateDisplay query={signupSummaryQuery} variables={{ eventId: this.props.eventId, runId: this.props.runId }}>
        {({ data }) => (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {data.event.run.signups_paginated.entries.map(signup => this.renderSignupRow(
                signup,
                data.event.registration_policy,
                data.event.team_members,
                data.event.team_member_name,
              ))}
            </tbody>
          </table>
        )}
      </QueryWithStateDisplay>
    </div>
  )
}

export default RunSignupSummary;
