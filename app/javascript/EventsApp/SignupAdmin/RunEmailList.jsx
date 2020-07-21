import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { pluralize, underscore, humanize } from 'inflected';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import ChoiceSetFilter from '../../Tables/ChoiceSetFilter';
import EmailList from '../../UIComponents/EmailList';
import { RunSignupsTableSignupsQuery } from './queries.gql';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';
import LoadingIndicator from '../../LoadingIndicator';
import ErrorDisplay from '../../ErrorDisplay';

function getEmails({ data, includes }) {
  const teamMemberUserConProfileIds = data.event.team_members
    .map((teamMember) => teamMember.user_con_profile.id);

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

  return signups.map((signup) => ({
    email: signup.user_con_profile.email,
    name: signup.user_con_profile.name_without_nickname,
  }));
}

function RunEmailList({ runId, eventId, separator }) {
  const { t } = useTranslation();
  const [includes, setIncludes] = useState(['teamMembers', 'confirmed']);
  const { data, loading, error } = useQuery(RunSignupsTableSignupsQuery, {
    variables: {
      runId,
      eventId,
      filters: {
        state: ['confirmed', 'waitlisted'],
      },
      sort: [
        { field: 'id', desc: false },
      ],
      perPage: 100,
    },
  });

  usePageTitle(
    useValueUnless(
      () => {
        const mainTitle = separator === '; '
          ? t('events.signupsAdmin.emailsSemicolonTitle', 'Emails (semicolon-separated)')
          : t('events.signupsAdmin.emailsCommaTitle', 'Emails (comma-separated)');
        return `${mainTitle} - ${data.event.title}`;
      },
      error || loading,
    ),
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <EmailList
      emails={getEmails({ data, includes })}
      separator={separator}
      renderToolbarContent={() => (
        <ChoiceSetFilter
          choices={[
            {
              label: t(
                'events.signupAdmin.emailFilters.teamMembers',
                'Include {{ teamMemberName }}',
                { teamMemberName: pluralize(data.event.event_category.team_member_name) },
              ),
              value: 'teamMembers',
            },
            { label: t('events.signupAdmin.emailFilters.confirmed', 'Include confirmed'), value: 'confirmed' },
            { label: t('events.signupAdmin.emailFilters.waitlisted', 'Include waitlisted'), value: 'waitlisted' },
          ]}
          filter={{ value: includes }}
          onChange={setIncludes}
          renderHeaderCaption={(currentIncludes) => {
            if (currentIncludes.length === 0) {
              return t('events.signupAdmin.emailFilters.nobody', 'Nobody');
            }

            return [...currentIncludes].sort().map((include) => {
              if (include === 'teamMembers') {
                return humanize(underscore(pluralize(
                  data.event.event_category.team_member_name,
                )));
              }

              return t(`signups.states.${include}`, humanize(underscore(include)));
            }).join(', ');
          }}
        />
      )}
    />
  );
}

RunEmailList.propTypes = {
  runId: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  separator: PropTypes.oneOf([', ', '; ']).isRequired,
};

export default RunEmailList;
