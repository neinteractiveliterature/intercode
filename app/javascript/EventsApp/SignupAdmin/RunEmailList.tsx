import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import snakeCase from 'lodash/snakeCase';

import ChoiceSetFilter from '../../Tables/ChoiceSetFilter';
import EmailList from '../../UIComponents/EmailList';
import usePageTitle from '../../usePageTitle';
import {
  RunSignupsTableSignupsQueryData,
  RunSignupsTableSignupsQueryDocument,
  RunSignupsTableSignupsQueryVariables,
} from './queries.generated';
import humanize from '../../humanize';
import { LoaderFunction, Navigate, useLoaderData, useParams } from 'react-router';
import { client } from '../../useIntercodeApolloClient';

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

export const loader: LoaderFunction = async ({ params: { runId, eventId } }) => {
  const { data } = await client.query<RunSignupsTableSignupsQueryData, RunSignupsTableSignupsQueryVariables>({
    query: RunSignupsTableSignupsQueryDocument,
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
  return data;
};

function RunEmailList() {
  const data = useLoaderData() as RunSignupsTableSignupsQueryData;
  const { separator } = useParams();
  const { t } = useTranslation();
  const [includes, setIncludes] = useState(() => [
    'teamMembers',
    ...(data.convention.event.registration_policy?.buckets ?? []).map((bucket) => bucket.key),
  ]);

  const mainTitle = useMemo(
    () =>
      separator === 'semicolon'
        ? t('events.signupAdmin.emailsSemicolonTitle')
        : t('events.signupAdmin.emailsCommaTitle'),
    [separator, t],
  );

  usePageTitle(`${mainTitle} - ${data.convention.event.title}`);

  if (separator !== 'semicolon' && separator !== 'comma') {
    return <Navigate to="../emails/comma" relative="route" />;
  }

  return (
    <>
      {separator === 'semicolon' && (
        <div className="alert alert-warning mb-2">
          <Trans i18nKey="events.signupAdmin.emailsSemicolonWarning" />
        </div>
      )}
      <EmailList
        emails={getEmails({ data: data, includes })}
        separator={separator === 'semicolon' ? '; ' : ', '}
        renderToolbarContent={() => (
          <ChoiceSetFilter
            multiple
            choices={[
              {
                label: t('events.signupAdmin.emailFilters.teamMembers', {
                  teamMemberName: data.convention.event.event_category.teamMemberNamePlural,
                }),
                value: 'teamMembers',
              },
              ...(data.convention.event.registration_policy?.buckets ?? []).map((bucket) => ({
                label: t('events.signupAdmin.emailFilters.confirmedBucket', {
                  bucketName: bucket.name ?? bucket.key,
                }) as string,
                value: bucket.key,
              })),
              {
                label: t('events.signupAdmin.emailFilters.waitlisted'),
                value: 'waitlisted',
              },
            ]}
            column={{
              setFilterValue: setIncludes,
              getFilterValue: () => includes,
            }}
            renderHeaderCaption={(currentIncludes) => {
              if (currentIncludes.length === 0) {
                return t('events.signupAdmin.emailFilters.nobody');
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
    </>
  );
}

export const Component = RunEmailList;
