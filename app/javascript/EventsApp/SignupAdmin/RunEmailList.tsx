import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import snakeCase from 'lodash/snakeCase';

import ChoiceSetFilter from '../../Tables/ChoiceSetFilter';
import EmailList from '../../UIComponents/EmailList';
import usePageTitle from '../../usePageTitle';
import {
  RunSignupsTableSignupsQueryData,
  RunSignupsTableSignupsQueryVariables,
  useRunSignupsTableSignupsQuery,
} from './queries.generated';
import humanize from '../../humanize';
import { useParams } from 'react-router';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform/dist';

function getEmails({ data, includes }: { data: RunSignupsTableSignupsQueryData; includes: string[] }) {
  const teamMemberUserConProfileIds = data.convention.event.team_members.map(
    (teamMember) => teamMember.user_con_profile.id,
  );

  const includesObject: { [field: string]: boolean } = {};
  includes.forEach((value) => {
    includesObject[value] = true;
  });

  const signups = data.convention.event.run.signups_paginated.entries.filter((signup) => {
    const isTeamMember = teamMemberUserConProfileIds.includes(signup.user_con_profile.id);

    if (!isTeamMember && signup.state === 'confirmed' && !includesObject[signup.bucket_key ?? '']) {
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

function useRunSignupsTableSignupsQueryFromParams() {
  const { runId, eventId } = useParams();
  return useRunSignupsTableSignupsQuery({
    variables: {
      eventId: eventId ?? '',
      runId: runId ?? '',
      filters: {
        state: ['confirmed', 'waitlisted'],
      },
      sort: [{ field: 'id', desc: false }],
      perPage: 100,
    },
  });
}

export type RunEmailListProps = {
  separator: ', ' | '; ';
};

export default LoadQueryWrapper<
  RunSignupsTableSignupsQueryData,
  RunSignupsTableSignupsQueryVariables,
  RunEmailListProps
>(useRunSignupsTableSignupsQueryFromParams, function RunEmailList({ data, separator }) {
  const { t } = useTranslation();
  const [includes, setIncludes] = useState(() => [
    'teamMembers',
    ...(data.convention.event.registration_policy?.buckets ?? []).map((bucket) => bucket.key),
  ]);

  const mainTitle = useMemo(() => {
    separator === '; '
      ? t('events.signupAdmin.emailsSemicolonTitle', 'Emails (semicolon-separated)')
      : t('events.signupAdmin.emailsCommaTitle', 'Emails (comma-separated)');
  }, [separator, t]);

  usePageTitle(`${mainTitle} - ${data.convention.event.title}`);

  return (
    <EmailList
      emails={getEmails({ data: data, includes })}
      separator={separator}
      renderToolbarContent={() => (
        <ChoiceSetFilter
          multiple
          choices={[
            {
              label: t('events.signupAdmin.emailFilters.teamMembers', 'Include {{ teamMemberName }}', {
                teamMemberName: data.convention.event.event_category.teamMemberNamePlural,
              }),
              value: 'teamMembers',
            },
            ...(data.convention.event.registration_policy?.buckets ?? []).map((bucket) => ({
              label: t('events.signupAdmin.emailFilters.confirmedBucket', 'Include {{ bucketName }} (confirmed)', {
                bucketName: bucket.name ?? bucket.key,
              }),
              value: bucket.key,
            })),
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
                  return humanize(snakeCase(data.convention.event.event_category.teamMemberNamePlural));
                }

                return t(`signups.states.${include}`, humanize(snakeCase(include)));
              })
              .join(', ');
          }}
        />
      )}
    />
  );
});
