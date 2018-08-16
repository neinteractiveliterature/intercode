import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { humanize } from 'inflected';
import classNames from 'classnames';

import QueryWithStateDisplay from '../QueryWithStateDisplay';
import RunHeader from './RunHeader';

const signupSummaryQuery = gql`
query($eventId: Int!, $runId: Int!) {
  event(id: $eventId) {
    id

    registration_policy {
      buckets {
        key
        name
        expose_attendees
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
            name_inverted
          }
        }
      }
    }
  }
}
`;

class RunSignupSummary extends React.Component {
  renderSignupRow = (signup, registrationPolicy) => (
    <tr key={signup.id} className={classNames({ 'table-warning': signup.state === 'waitlisted' })}>
      <td>{signup.user_con_profile.name_inverted}</td>
      <td>
        {humanize(signup.state)}
      </td>
    </tr>
  )

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
              {data.event.run.signups_paginated.entries.map(signup => this.renderSignupRow(signup, data.event.registration_policy))}
            </tbody>
          </table>
        )}
      </QueryWithStateDisplay>
    </div>
  )
}

export default RunSignupSummary;
