import { useState } from 'react';
import { pluralize, underscore, humanize } from 'inflected';
import { useTranslation } from 'react-i18next';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import ChoiceSetFilter from '../../Tables/ChoiceSetFilter';
import EmailList from '../../UIComponents/EmailList';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';
import {
  RunSignupsTableSignupsQueryData,
  useRunSignupsTableSignupsQuery,
} from './queries.generated';

function getEmails({
  data,
  includes,
}: {
  data: RunSignupsTableSignupsQueryData;
  includes: string[];
}) {
  const teamMemberUserConProfileIds = data.event.team_members.map(
    (teamMember) => teamMember.user_con_profile.id,
  );

  const includesObject: { [field: string]: boolean } = {};
  includes.forEach((value) => {
    includesObject[value] = true;
  });

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
    email: signup.user_con_profile.email ?? '',
    name: signup.user_con_profile.name_without_nickname,
  }));
}

export type RunEmailListProps = {
  runId: number;
  eventId: number;
  separator: ', ' | '; ';
};

function RunEmailList({ runId, eventId, separator }: RunEmailListProps) {
  const { t } = useTranslation();
  const [includes, setIncludes] = useState(['teamMembers', 'confirmed']);
  const { data, loading, error } = useRunSignupsTableSignupsQuery({
    variables: {
      runId,
      eventId,
      filters: {
        state: ['confirmed', 'waitlisted'],
      },
      sort: [{ field: 'id', desc: false }],
      perPage: 100,
    },
  });

  usePageTitle(
    useValueUnless(() => {
      const mainTitle =
        separator === '; '
          ? t('events.signupsAdmin.emailsSemicolonTitle', 'Emails (semicolon-separated)')
          : t('events.signupsAdmin.emailsCommaTitle', 'Emails (comma-separated)');
      return `${mainTitle} - ${data?.event.title}`;
    }, error || loading),
  );

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <EmailList
      emails={getEmails({ data: data!, includes })}
      separator={separator}
      renderToolbarContent={() => (
        <ChoiceSetFilter
          multiple
          choices={[
            {
              label: t(
                'events.signupAdmin.emailFilters.teamMembers',
                'Include {{ teamMemberName }}',
                { teamMemberName: pluralize(data!.event.event_category.team_member_name) },
              ),
              value: 'teamMembers',
            },
            {
              label: t('events.signupAdmin.emailFilters.confirmed', 'Include confirmed'),
              value: 'confirmed',
            },
            {
              label: t('events.signupAdmin.emailFilters.waitlisted', 'Include waitlisted'),
              value: 'waitlisted',
            },
          ]}
          column={{
            setFilter: setIncludes,
            filterValue: includes,
          }}
          renderHeaderCaption={(currentIncludes) => {
            if (currentIncludes.length === 0) {
              return t('events.signupAdmin.emailFilters.nobody', 'Nobody');
            }

            return [...currentIncludes]
              .sort()
              .map((include) => {
                if (include === 'teamMembers') {
                  return humanize(
                    underscore(pluralize(data!.event.event_category.team_member_name)),
                  );
                }

                return t(`signups.states.${include}`, humanize(underscore(include)));
              })
              .join(', ');
          }}
        />
      )}
    />
  );
}

export default RunEmailList;
