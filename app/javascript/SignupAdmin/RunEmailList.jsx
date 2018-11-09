import React from 'react';
import PropTypes from 'prop-types';
import { pluralize } from 'inflected';

import BootstrapFormCheckbox from '../BuiltInFormControls/BootstrapFormCheckbox';
import EmailList from '../UIComponents/EmailList';
import { mutator, Transforms } from '../ComposableFormUtils';
import { RunSignupsTableSignupsQuery } from './queries.gql';
import QueryWithStateDisplay from '../QueryWithStateDisplay';

function getEmails({ data, includeTeamMembers, includeWaitlisted }) {
  const teamMemberUserConProfileIds = data.event.team_members
    .map(teamMember => teamMember.user_con_profile.id);

  const signups = data.event.run.signups_paginated.entries.filter((signup) => {
    if (!includeWaitlisted && signup.state === 'waitlisted') {
      return false;
    }

    if (!includeTeamMembers && teamMemberUserConProfileIds.includes(signup.user_con_profile.id)) {
      return false;
    }

    return true;
  });

  return signups.map(signup => ({
    email: signup.user_con_profile.email,
    name: signup.user_con_profile.name_without_nickname,
  }));
}

class RunEmailList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      includeTeamMembers: true,
      includeWaitlisted: false,
    };
    this.mutator = mutator({
      component: this,
      transforms: {
        includeTeamMembers: Transforms.checkboxChange,
        includeWaitlisted: Transforms.checkboxChange,
      },
    });
  }

  render = () => {
    const { runId, eventId } = this.props;
    const { includeTeamMembers, includeWaitlisted } = this.state;

    // TODO figure out how to handle more than 100 signups
    return (
      <QueryWithStateDisplay
        query={RunSignupsTableSignupsQuery}
        variables={{
          runId,
          eventId,
          filters: {
            state: ['confirmed', 'waitlisted'],
          },
          sort: [
            { field: 'id', desc: false },
          ],
          perPage: 100,
        }}
      >
        {({ data }) => (
          <>
            <EmailList
              emails={getEmails({ data, includeTeamMembers, includeWaitlisted })}
              separator={this.props.separator}
              renderToolbarContent={() => (
                <ul className="list-inline">
                  <li className="list-inline-item mr-4">
                    <BootstrapFormCheckbox
                      name="includeTeamMembers"
                      label={`Include ${pluralize(data.event.team_member_name)}`}
                      checked={includeTeamMembers}
                      onChange={this.mutator.includeTeamMembers}
                    />
                  </li>
                  <li className="list-inline-item mr-4">
                    <BootstrapFormCheckbox
                      name="includeWaitlisted"
                      label="Include waitlisted"
                      checked={includeWaitlisted}
                      onChange={this.mutator.includeWaitlisted}
                    />
                  </li>
                </ul>
              )}
            />
          </>
        )}
      </QueryWithStateDisplay>
    );
  }
}

RunEmailList.propTypes = {
  runId: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  separator: PropTypes.string.isRequired,
};

export default RunEmailList;
