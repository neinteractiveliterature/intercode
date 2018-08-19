import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment-timezone';
import { dasherize, underscore } from 'inflected';

import { formatSignupStatus } from './SignupUtils';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { timespanFromRun } from '../TimespanUtils';

const userConProfileSignupsQuery = gql`
query($id: Int!) {
  convention {
    timezone_name
  }

  myProfile {
    id
  }

  userConProfile(id: $id) {
    id
    name_without_nickname

    team_members {
      id

      event {
        id
        title
      }
    }

    signups {
      id
      state
      counted
      bucket_key
      requested_bucket_key

      user_con_profile {
        id
      }

      run {
        id
        starts_at

        event {
          id
          title
          length_seconds
          team_member_name

          registration_policy {
            buckets {
              key
              name
            }
          }

          team_members {
            id

            user_con_profile {
              id
            }
          }
        }

        rooms {
          id
          name
        }
      }
    }
  }
}
`;

function filterAndSortSignups(signups) {
  const filteredSignups = signups.filter(({ state }) => state !== 'withdrawn');

  return filteredSignups
    .sort((a, b) => moment(a.run.starts_at).valueOf() - moment(b.run.starts_at).valueOf());
}

class UserConProfileSignupsCard extends React.Component {
  static propTypes = {
    userConProfileId: PropTypes.number.isRequired,
  }

  renderEventLink = event => (
    <a href={`/events/${event.id}`}>
      {event.title}
    </a>
  )

  renderSignup = (signup, convention) => (
    <li className="list-group-item" key={signup.id}>
      <ul className="list-unstyled">
        <li><strong>{this.renderEventLink(signup.run.event)}</strong></li>
        <li>{formatSignupStatus(signup, signup.run.event)}</li>
        <li>
          <small>
            {timespanFromRun(convention, signup.run.event, signup.run)
              .humanizeInTimezone(convention.timezone_name)
            }
          </small>
        </li>
        <li>
          <small>
            {
              signup.run.rooms.map(room => room.name)
                .sort((a, b) => a.localeCompare(b, { sensitivity: 'base' })).join(', ')
            }
          </small>
        </li>
      </ul>
    </li>
  )

  renderUnSignedUpTeamMemberEvents = (userConProfile, myProfile) => {
    const unSignedUpEvents = userConProfile.team_members
      .filter(teamMember => !userConProfile.signups
        .some(signup => signup.run.event.id === teamMember.event.id && signup.state === 'confirmed'))
      .map(teamMember => teamMember.event);

    if (unSignedUpEvents.length === 0) {
      return null;
    }

    return (
      <li className="list-group-item list-group-item-warning">
        {(
          userConProfile.id === myProfile.id
            ? 'You are a team member for the following events, but are not signed up for them:'
            : `${userConProfile.name_without_nickname} is a team member for the following events, but is not signed up for them:`
        )}
        {' '}
        {unSignedUpEvents.map(event => this.renderEventLink(event)).reduce((prev, curr) => [prev, ', ', curr])}
      </li>
    );
  }

  render = () => (
    <QueryWithStateDisplay
      query={userConProfileSignupsQuery}
      variables={{ id: this.props.userConProfileId }}
    >
      {({ data }) => (
        <div className="card">
          <div className="card-header">Signups</div>
          <ul className="list-group list-group-flush">
            {
              data.userConProfile.signups.length === 0
                ? <li className="list-group-item"><em>No signups</em></li>
                : null
            }
            {
              filterAndSortSignups(data.userConProfile.signups)
                .map(signup => this.renderSignup(signup, data.convention))
            }
            {this.renderUnSignedUpTeamMemberEvents(data.userConProfile, data.myProfile)}
          </ul>
        </div>
      )}
    </QueryWithStateDisplay>
  );
}

export default UserConProfileSignupsCard;
