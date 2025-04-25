import { useMemo, useContext } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import { formatSignupStatus } from './SignupUtils';
import { timespanFromRun } from '../../TimespanUtils';
import buildEventUrl from '../buildEventUrl';
import AddToCalendarDropdown from './AddToCalendarDropdown';
import AppRootContext from '../../AppRootContext';
import { UserConProfileSignupsQueryData, UserConProfileSignupsQueryDocument } from './queries.generated';
import { joinReact } from '../../RenderingUtils';
import { useFormatRunTimespan } from '../runTimeFormatting';
import { useSuspenseQuery } from '@apollo/client';
import { client } from '../../useIntercodeApolloClient';
import { WithdrawAllUserConProfileSignupsDocument } from './mutations.generated';

function filterAndSortSignups(signups: UserConProfileSignupsQueryData['convention']['user_con_profile']['signups']) {
  const filteredSignups = signups.filter(({ state }) => state !== 'withdrawn');

  return sortBy(filteredSignups, (signup) => DateTime.fromISO(signup.run.starts_at).valueOf());
}

export type UserConProfileSignupsCardProps = {
  userConProfileId: string;
  showWithdrawFromAll?: boolean;
};

export default function UserConProfileSignupsCard({
  userConProfileId,
  showWithdrawFromAll,
}: UserConProfileSignupsCardProps) {
  const { data } = useSuspenseQuery(UserConProfileSignupsQueryDocument, { variables: { id: userConProfileId } });
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const confirm = useConfirm();
  const formatRunTimespan = useFormatRunTimespan();

  const signups = useMemo(
    () => filterAndSortSignups(data.convention.user_con_profile.signups),
    [data.convention.user_con_profile.signups],
  );

  const unSignedUpEvents = useMemo(
    () =>
      (data.convention.user_con_profile.team_members ?? [])
        .filter(
          (teamMember) =>
            !data.convention.user_con_profile.signups.some(
              (signup) => signup.run.event.id === teamMember.event.id && signup.state === 'confirmed',
            ),
        )
        .filter((teamMember) => teamMember.event.status === 'active')
        .map((teamMember) => teamMember.event),
    [data.convention.user_con_profile],
  );

  const renderEventLink = (event: Parameters<typeof buildEventUrl>[0]) => (
    <Link to={buildEventUrl(event)} key={event.id}>
      {event.title}
    </Link>
  );

  const renderSignup = (signup: UserConProfileSignupsQueryData['convention']['user_con_profile']['signups'][0]) => (
    <li className="list-group-item" key={signup.id}>
      <ul className="list-unstyled">
        <li>
          <strong>{renderEventLink(signup.run.event)}</strong>
        </li>
        <li>{formatSignupStatus(signup, signup.run.event, t)}</li>
        <li>
          <small>
            {formatRunTimespan(timespanFromRun(timezoneName, signup.run.event, signup.run), {
              formatType: 'short',
            })}
          </small>
        </li>
        <li>
          <small>
            {signup.run.rooms
              .map((room) => room.name ?? '')
              .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
              .join(', ')}
          </small>
        </li>
      </ul>
    </li>
  );

  const renderUnSignedUpTeamMemberEvents = (
    userConProfile: UserConProfileSignupsQueryData['convention']['user_con_profile'],
    myProfile: UserConProfileSignupsQueryData['convention']['my_profile'],
  ) => {
    if (unSignedUpEvents.length === 0) {
      return null;
    }

    return (
      <li className="list-group-item list-group-item-warning">
        <>
          {userConProfile.id === myProfile?.id
            ? t('admin.userConProfiles.signupsCard.unSignedUpYou')
            : t('admin.userConProfiles.signupsCard.unSignedUpOther', {
                name: userConProfile.name_without_nickname,
              })}{' '}
          {joinReact(
            unSignedUpEvents.map((event) => renderEventLink(event)),
            ', ',
          )}
        </>
      </li>
    );
  };

  const { convention } = data;
  const userConProfile = convention.user_con_profile;
  const myProfile = convention.my_profile;

  return (
    <div className="card">
      <div className="card-header">
        <>
          {userConProfile.ical_secret && (
            <div className="float-end">
              <AddToCalendarDropdown
                icalSecret={userConProfile.ical_secret}
                className="btn btn-outline-secondary btn-sm"
              />
            </div>
          )}
          {t('admin.userConProfiles.signupsCard.header')}
        </>
      </div>
      <ul className="list-group list-group-flush">
        {signups.length === 0 ? (
          <li className="list-group-item">
            <em>{t('admin.userConProfiles.signupsCard.noSignups')}</em>
          </li>
        ) : null}
        {signups.map((signup) => renderSignup(signup))}
        {renderUnSignedUpTeamMemberEvents(userConProfile, myProfile)}
      </ul>
      {showWithdrawFromAll && myProfile?.ability?.can_withdraw_all_user_con_profile_signups && signups.length > 0 && (
        <div className="card-footer border-top-0">
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() =>
              confirm({
                prompt: t('admin.userConProfiles.signupsCard.withdrawFromAllConfirmation', {
                  name: userConProfile.name_without_nickname,
                  conventionName: convention?.name,
                }),
                action: () =>
                  client.mutate({
                    mutation: WithdrawAllUserConProfileSignupsDocument,
                    variables: { userConProfileId },
                  }),
                renderError: (withdrawError) => <ErrorDisplay graphQLError={withdrawError} />,
              })
            }
          >
            {t('admin.userConProfiles.withdrawFromAllButton')}
          </button>
        </div>
      )}
    </div>
  );
}
