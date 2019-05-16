import React from 'react';
import PropTypes from 'prop-types';
import { pluralize, underscore, humanize } from 'inflected';

import ChoiceSetFilter from '../../Tables/ChoiceSetFilter';
import EmailList from '../../UIComponents/EmailList';
import { RunSignupsTableSignupsQuery } from './queries.gql';
import QueryWithStateDisplay from '../../QueryWithStateDisplay';

function getEmails({ data, includes }) {
  const teamMemberUserConProfileIds = data.event.team_members
    .map(teamMember => teamMember.user_con_profile.id);

  const includesObject = {};
  includes.forEach((value) => { includesObject[value] = true; });

  const signups = data.event.run.signups_paginated.entries.filter((signup) => {
    const isTeamMember = teamMemberUserConProfileIds.includes(signup.user_con_profile.id);

    if (!includesObject.confirmed && !isTeamMember && signup.state === 'confirmed') {
      return false;
    }

    if (!includesObject.waitlisted && !isTeamMember && signup.state === 'waitlisted') {
      return false;
    }

    if (!includesObject.teamMembers && isTeamMember) {
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
      includes: ['teamMembers', 'confirmed'],
    };
  }

  render = () => {
    const { runId, eventId } = this.props;
    const { includes } = this.state;

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
              emails={getEmails({ data, includes })}
              separator={this.props.separator}
              renderToolbarContent={() => (
                <ChoiceSetFilter
                  choices={[
                    { label: `Include ${pluralize(data.event.event_category.team_member_name)}`, value: 'teamMembers' },
                    { label: 'Include confirmed', value: 'confirmed' },
                    { label: 'Include waitlisted', value: 'waitlisted' },
                  ]}
                  filter={{ value: includes }}
                  onChange={(nextIncludes) => { this.setState({ includes: nextIncludes }); }}
                  renderHeaderCaption={(currentIncludes) => {
                    if (currentIncludes.length === 0) {
                      return 'Nobody';
                    }

                    return [...currentIncludes].sort().map((include) => {
                      if (include === 'teamMembers') {
                        return humanize(underscore(pluralize(
                          data.event.event_category.team_member_name,
                        )));
                      }

                      return humanize(underscore(include));
                    }).join(', ');
                  }}
                />
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
