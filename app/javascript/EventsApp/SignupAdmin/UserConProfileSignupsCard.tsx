import { useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import { ErrorDisplay, useConfirm } from '@neinteractiveliterature/litform';

import { formatSignupStatus } from './SignupUtils';
import { timespanFromRun } from '../../TimespanUtils';
import buildEventUrl from '../buildEventUrl';
import AddToCalendarDropdown from './AddToCalendarDropdown';
import AppRootContext from '../../AppRootContext';
import { UserConProfileSignupsQueryData, useUserConProfileSignupsQuery } from './queries.generated';
import { useWithdrawAllUserConProfileSignupsMutation } from './mutations.generated';
import { joinReact } from '../../RenderingUtils';
import { useFormatRunTimespan } from '../runTimeFormatting';
import { LoadQueryWithVariablesWrapper } from '../../GraphqlLoadingWrappers';

function filterAndSortSignups(signups: UserConProfileSignupsQueryData['convention']['user_con_profile']['signups']) {
  const filteredSignups = signups.filter(({ state }) => state !== 'withdrawn');

  return sortBy(filteredSignups, (signup) => DateTime.fromISO(signup.run.starts_at).valueOf());
}

export type UserConProfileSignupsCardProps = {
  userConProfileId: string;
  showWithdrawFromAll?: boolean;
};

export default LoadQueryWithVariablesWrapper(
  useUserConProfileSignupsQuery,
  ({ userConProfileId }: UserConProfileSignupsCardProps) => ({ id: userConProfileId }),
  function UserConProfileSignupsCard({ userConProfileId, data, showWithdrawFromAll }) {
    const { t } = useTranslation();
    const { timezoneName } = useContext(AppRootContext);
    const [withdrawAllSignups] = useWithdrawAllUserConProfileSignupsMutation();
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
              ? t(
                  'admin.userConProfiles.signupsCard.unSignedUpYou',
                  'You are a team member for the following events, but are not signed up for them:',
                )
              : t(
                  'admin.userConProfiles.signupsCard.unSignedUpOther',
                  '{{ name }} is a team member for the following events, but is not signed up for them:',
                  { name: userConProfile.name_without_nickname },
                )}{' '}
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
            {t('admin.userConProfiles.signupsCard.header', 'Signups')}
          </>
        </div>
        <ul className="list-group list-group-flush">
          {signups.length === 0 ? (
            <li className="list-group-item">
              <em>{t('admin.userConProfiles.signupsCard.noSignups', 'No signups')}</em>
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
                  prompt: t(
                    'admin.userConProfiles.signupsCard.withdrawFromAllConfirmation',
                    'Are you sure you want to withdraw {{ name }} from all their events at {{ conventionName }}?',
                    {
                      name: userConProfile.name_without_nickname,
                      conventionName: convention?.name,
                    },
                  ),
                  action: () => withdrawAllSignups({ variables: { userConProfileId } }),
                  renderError: (withdrawError) => <ErrorDisplay graphQLError={withdrawError} />,
                })
              }
            >
              {t('admin.userConProfiles.withdrawFromAllButton', 'Withdraw from all')}
            </button>
          </div>
        )}
      </div>
    );
  },
);
