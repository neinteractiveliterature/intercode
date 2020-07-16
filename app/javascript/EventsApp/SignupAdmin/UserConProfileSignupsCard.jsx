import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { useConfirm } from '../../ModalDialogs/Confirm';
import { formatSignupStatus } from './SignupUtils';
import { timespanFromRun } from '../../TimespanUtils';
import { UserConProfileSignupsQuery } from './queries.gql';
import { WithdrawAllUserConProfileSignups } from './mutations.gql';
import buildEventUrl from '../buildEventUrl';
import ErrorDisplay from '../../ErrorDisplay';
import LoadingIndicator from '../../LoadingIndicator';
import AddToCalendarDropdown from './AddToCalendarDropdown';
import AppRootContext from '../../AppRootContext';

function filterAndSortSignups(signups) {
  const filteredSignups = signups.filter(({ state }) => state !== 'withdrawn');

  return filteredSignups
    .sort((a, b) => moment(a.run.starts_at).valueOf() - moment(b.run.starts_at).valueOf());
}

function UserConProfileSignupsCard({ userConProfileId }) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const { data, error, loading } = useQuery(UserConProfileSignupsQuery, {
    variables: { id: userConProfileId },
  });
  const [withdrawAllSignups] = useMutation(WithdrawAllUserConProfileSignups);
  const confirm = useConfirm();

  const signups = useMemo(
    () => (loading || error
      ? []
      : filterAndSortSignups(data.userConProfile.signups)
    ),
    [data, error, loading],
  );

  const unSignedUpEvents = useMemo(
    () => (loading || error
      ? []
      : data.userConProfile.team_members
        .filter((teamMember) => !data.userConProfile.signups
          .some((signup) => signup.run.event.id === teamMember.event.id && signup.state === 'confirmed'))
        .filter((teamMember) => teamMember.event.status === 'active')
        .map((teamMember) => teamMember.event)
    ),
    [data, error, loading],
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const renderEventLink = (event) => (
    <Link to={buildEventUrl(event)}>
      {event.title}
    </Link>
  );

  const renderSignup = (signup, convention) => (
    <li className="list-group-item" key={signup.id}>
      <ul className="list-unstyled">
        <li><strong>{renderEventLink(signup.run.event)}</strong></li>
        <li>{formatSignupStatus(signup, signup.run.event)}</li>
        <li>
          <small>
            {timespanFromRun(convention, signup.run.event, signup.run)
              .humanizeInTimezone(timezoneName)}
          </small>
        </li>
        <li>
          <small>
            {
              signup.run.rooms.map((room) => room.name)
                .sort((a, b) => a.localeCompare(b, { sensitivity: 'base' })).join(', ')
            }
          </small>
        </li>
      </ul>
    </li>
  );

  const renderUnSignedUpTeamMemberEvents = (userConProfile, myProfile) => {
    if (unSignedUpEvents.length === 0) {
      return null;
    }

    return (
      <li className="list-group-item list-group-item-warning">
        {(
          userConProfile.id === myProfile.id
            ? t(
              'admin.userConProfiles.signupsCard.unSignedUpYou',
              'You are a team member for the following events, but are not signed up for them:',
            )
            : t(
              'admin.userConProfiles.signupsCard.unSignedUpOther',
              '{{ name }} is a team member for the following events, but is not signed up for them:',
              { name: userConProfile.name_without_nickname },
            )
        )}
        {' '}
        {unSignedUpEvents.map((event) => renderEventLink(event)).reduce((prev, curr) => [prev, ', ', curr])}
      </li>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        {data.userConProfile.ical_secret && (
          <div className="float-right">
            <AddToCalendarDropdown
              icalSecret={data.userConProfile.ical_secret}
              className="btn btn-outline-secondary btn-sm"
            />
          </div>
        )}
        {t('admin.userConProfiles.signupsCard.header', 'Signups')}
      </div>
      <ul className="list-group list-group-flush">
        {
          signups.length === 0
            ? (
              <li className="list-group-item">
                <em>
                  {t('admin.userConProfiles.signupsCard.noSignups', 'No signups')}
                </em>
              </li>
            )
            : null
        }
        {signups.map((signup) => renderSignup(signup, data.convention))}
        {renderUnSignedUpTeamMemberEvents(data.userConProfile, data.myProfile)}
      </ul>
      {
        data.myProfile.ability.can_withdraw_all_user_con_profile_signups && signups.length > 0
          ? (
            <div className="card-footer border-top-0">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => confirm({
                  prompt: t(
                    'admin.userConProfiles.signupsCard.withdrawFromAllConfirmation',
                    'Are you sure you want to withdraw {{ name }} from all their events at {{ conventionName }}?',
                    {
                      name: data.userConProfile.name_without_nickname,
                      conventionName: data.convention.name,
                    },
                  ),
                  action: () => withdrawAllSignups({ variables: { userConProfileId } }),
                  renderError: (withdrawError) => <ErrorDisplay graphQLError={withdrawError} />,
                })}
              >
                {t('admin.userConProfiles.withdrawFromAllButton', 'Withdraw from all')}
              </button>
            </div>
          ) : null
      }
    </div>
  );
}

UserConProfileSignupsCard.propTypes = {
  userConProfileId: PropTypes.number.isRequired,
};

export default UserConProfileSignupsCard;
