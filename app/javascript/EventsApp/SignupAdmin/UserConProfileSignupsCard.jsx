import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

import { useQuery, useMutation } from 'react-apollo-hooks';
import { useConfirm } from '../../ModalDialogs/Confirm';
import { formatSignupStatus } from './SignupUtils';
import { timespanFromRun } from '../../TimespanUtils';
import { UserConProfileSignupsQuery } from './queries.gql';
import { WithdrawAllUserConProfileSignups } from './mutations.gql';
import buildEventUrl from '../buildEventUrl';
import ErrorDisplay from '../../ErrorDisplay';
import LoadingIndicator from '../../LoadingIndicator';

function filterAndSortSignups(signups) {
  const filteredSignups = signups.filter(({ state }) => state !== 'withdrawn');

  return filteredSignups
    .sort((a, b) => moment(a.run.starts_at).valueOf() - moment(b.run.starts_at).valueOf());
}

function UserConProfileSignupsCard({ userConProfileId }) {
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
              .humanizeInTimezone(convention.timezone_name)}
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
            ? 'You are a team member for the following events, but are not signed up for them:'
            : `${userConProfile.name_without_nickname} is a team member for the following events, but is not signed up for them:`
        )}
        {' '}
        {unSignedUpEvents.map((event) => renderEventLink(event)).reduce((prev, curr) => [prev, ', ', curr])}
      </li>
    );
  };

  return (
    <div className="card">
      <div className="card-header">Signups</div>
      <ul className="list-group list-group-flush">
        {
          signups.length === 0
            ? <li className="list-group-item"><em>No signups</em></li>
            : null
        }
        {signups.map((signup) => renderSignup(signup, data.convention))}
        {renderUnSignedUpTeamMemberEvents(data.userConProfile, data.myProfile)}
      </ul>
      {
        data.myProfile.ability.can_update_signups && signups.length > 0
          ? (
            <div className="card-footer border-top-0">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => confirm({
                  prompt: `Are you sure you want to withdraw ${data.userConProfile.name_without_nickname} from all their events at ${data.convention.name}?`,
                  action: () => withdrawAllSignups({ variables: { userConProfileId } }),
                  renderError: (withdrawError) => <ErrorDisplay graphQLError={withdrawError} />,
                })}
              >
                Withdraw from all
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
