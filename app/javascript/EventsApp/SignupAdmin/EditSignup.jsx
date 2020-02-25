import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { pluralize, humanize, underscore } from 'inflected';
import moment from 'moment';
import classNames from 'classnames';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { AdminSignupQuery } from './queries.gql';
import { ageAsOf } from '../../TimeUtils';
import ChangeBucketModal from './ChangeBucketModal';
import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';
import ForceConfirmSignupModal from './ForceConfirmSignupModal';
import Timespan from '../../Timespan';
import { UpdateSignupCounted } from './mutations.gql';
import useModal from '../../ModalDialogs/useModal';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';
import Gravatar from '../../Gravatar';
import PageLoadingIndicator from '../../PageLoadingIndicator';

function cityState(userConProfile) {
  return [
    userConProfile.city,
    userConProfile.state,
  ].filter((item) => item && item.trim() !== '').join(', ');
}

function cityStateZip(userConProfile) {
  return [
    cityState(userConProfile),
    userConProfile.zipcode,
  ].filter((item) => item && item.trim() !== '').join(' ');
}

function getMakeCountedConfirmPrompt(signup) {
  const { user_con_profile: userConProfile, run } = signup;

  return (
    <div>
      <p>
        Are you sure?  This will make
        {' '}
        {userConProfile.name_without_nickname}
        &apos;s signup count
        towards attendee totals for
        {' '}
        {run.event.title}
        .
        {' '}
        {run.event.title}
        {' '}
        will also count towards
        {userConProfile.name_without_nickname}
        &apos;s signup limit if there is a signup cap in
        place.
      </p>
      <p className="text-danger">
        Caution: this operation does not check whether the signup buckets are already full, and
        therefore may result in overfilling a bucket.
      </p>
    </div>
  );
}

function getMakeNotCountedConfirmPrompt(signup) {
  const { user_con_profile: userConProfile, run } = signup;

  return (
    <div>
      <p>
        Are you sure?  This will make
        {' '}
        {userConProfile.name_without_nickname}
        &apos;s signup not count
        towards attendee totals for
        {' '}
        {run.event.title}
        .  It will also allow
        {userConProfile.name_without_nickname}
        {' '}
        to sign up for an additional event if there is a
        signup cap in place.
      </p>
      <p className="text-danger">
        Caution: this operation will pull additional attendees into the space freed up by making
        this signup not count.
      </p>
    </div>
  );
}

const renderAddressItem = (userConProfile) => {
  const elements = [
    ['header', 'Address:'],
    ['address', userConProfile.address],
    ['cityStateZip', cityStateZip(userConProfile)],
    ['country', userConProfile.country],
  ].filter((pair) => pair[1] && pair[1].trim() !== '');

  const listItems = elements.map(([key, element]) => <li key={key}>{element}</li>);
  return <ul className="list-unstyled">{listItems}</ul>;
};

function getToggleCountedConfirmPrompt(signup) {
  if (signup.counted) {
    return getMakeNotCountedConfirmPrompt(signup);
  }

  return getMakeCountedConfirmPrompt(signup);
}

function EditSignup({ teamMembersUrl }) {
  const id = Number.parseInt(useParams().id, 10);
  const { data, loading, error } = useQuery(AdminSignupQuery, { variables: { id } });
  const changeBucketModal = useModal();
  const forceConfirmModal = useModal();
  const [updateCountedMutate] = useMutation(UpdateSignupCounted);
  const confirm = useConfirm();

  usePageTitle(
    useValueUnless(
      () => `Editing signup for “${data.signup.user_con_profile.name_without_nickname}” - ${data.signup.run.event.title}`,
      error || loading,
    ),
  );

  const toggleCounted = useCallback(
    (signup) => updateCountedMutate({
      variables: {
        signupId: signup.id,
        counted: !signup.counted,
      },
    }),
    [updateCountedMutate],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  const renderUserSection = () => {
    const { signup } = data;
    const { user_con_profile: userConProfile } = signup;

    return (
      <div className="card mr-2">
        <div className="card-header d-flex align-items-center">
          <div className="mr-2">
            <Gravatar
              url={userConProfile.gravatar_url}
              enabled={userConProfile.gravatar_enabled}
              pixelSize={32}
            />
          </div>
          <div className="lead">
            {userConProfile.name_without_nickname}
          </div>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Nickname:
            {' '}
            {userConProfile.nickname}
          </li>
          <li className="list-group-item">
            Age at
            {' '}
            {signup.run.event.title}
            :
            {' '}
            {ageAsOf(moment(userConProfile.birth_date), moment(signup.run.starts_at))}
          </li>
          <li className={classNames('list-group-item')}>
            Email:
            {' '}
            <a href={`mailto:${userConProfile.email}`}>{userConProfile.email}</a>
          </li>
          <li className="list-group-item">
            Phone:
            {' '}
            <a href={`tel:${userConProfile.mobile_phone}`}>
              {userConProfile.mobile_phone}
            </a>
          </li>
          <li className="list-group-item">
            {renderAddressItem(userConProfile)}
          </li>
        </ul>
      </div>
    );
  };

  const renderForceConfirmButton = () => {
    if (!data.currentAbility.can_force_confirm_signup) {
      return null;
    }

    const { signup } = data;

    if (signup.state !== 'waitlisted') {
      return null;
    }

    return (
      <div>
        <button className="btn btn-link" onClick={forceConfirmModal.open} type="button">
          Force into run
        </button>
      </div>
    );
  };

  const renderCountedToggle = () => {
    const { signup } = data;

    return (
      <button
        className="btn btn-link"
        type="button"
        disabled={!data.currentAbility.can_update_counted_signup}
        onClick={() => confirm({
          prompt: getToggleCountedConfirmPrompt(signup),
          action: () => toggleCounted(signup),
          renderError: (updateCountedError) => <ErrorDisplay graphQLError={updateCountedError} />,
        })}
      >
        {
          signup.counted
            ? <i className="fa fa-toggle-on"><span className="sr-only">Make not counted</span></i>
            : <i className="fa fa-toggle-off"><span className="sr-only">Make counted</span></i>
        }
      </button>
    );
  };

  const renderRunSection = () => {
    const { signup } = data;
    const { run } = signup;
    const { event } = run;
    const { registration_policy: registrationPolicy } = event;
    const timespan = Timespan.fromStrings(run.starts_at, run.ends_at);
    const teamMember = run.event.team_members
      .find((tm) => tm.user_con_profile.id === signup.user_con_profile.id);
    const bucket = (signup.bucket_key
      ? registrationPolicy.buckets.find((b) => b.key === signup.bucket_key)
      : null
    );
    const requestedBucket = (signup.requested_bucket_key
      ? registrationPolicy.buckets.find((b) => b.key === signup.requested_bucket_key)
      : null
    );

    return (
      <div className="card ml-2">
        <div className="card-header">
          {run.event.title}
          <br />
          {timespan.humanizeInTimezone(data.convention.timezone_name)}
          <br />
          {run.rooms.map((room) => room.name).sort().join(', ')}
        </div>

        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex align-items-center">
            <div className="flex-fill">
              Signup state:
              <strong>
                {' '}
                {signup.state}
              </strong>
            </div>
            {renderForceConfirmButton()}
          </li>
          <li className="list-group-item d-flex align-items-center">
            <div className="flex-fill">
              Signup bucket:
              {' '}
              <strong>
                {(bucket || { name: 'none' }).name}
                {(
                  (requestedBucket && (!bucket || bucket.key !== requestedBucket.key))
                    ? ` (requested ${requestedBucket.name})`
                    : ''
                )}
                {(
                  (!teamMember && !requestedBucket)
                    ? ' (no preference)'
                    : ''
                )}
              </strong>
            </div>
            {(
              signup.state === 'confirmed' && data.currentAbility.can_update_bucket_signup
                ? (
                  <button
                    className="btn btn-link"
                    onClick={changeBucketModal.open}
                    type="button"
                  >
                    <i className="fa fa-pencil"><span className="sr-only">Change</span></i>
                  </button>
                )
                : null
            )}
          </li>
          <li className="list-group-item d-flex align-items-center">
            <div className="flex-fill">
              Counts towards totals:
              <strong>{signup.counted ? ' yes' : ' no'}</strong>
            </div>
            {renderCountedToggle()}
          </li>
          <li className="list-group-item d-flex align-items-center">
            <div className="flex-fill">
              {humanize(underscore(run.event.event_category.team_member_name))}
              :
              <strong>{teamMember ? ' yes' : ' no'}</strong>
            </div>
            <Link to={teamMembersUrl} className="btn btn-link">
              Go to
              {' '}
              {pluralize(run.event.event_category.team_member_name)}
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <h1 className="mb-4">
        Edit signup for
        {' '}
        {data.signup.run.event.title}
      </h1>

      <div className="row">
        <div className="col col-md-6">
          {renderUserSection()}
        </div>

        <div className="col col-md-6">
          {renderRunSection()}
        </div>
      </div>

      <ForceConfirmSignupModal
        signup={forceConfirmModal.visible ? data.signup : null}
        onComplete={forceConfirmModal.close}
        onCancel={forceConfirmModal.close}
      />

      <ChangeBucketModal
        signup={changeBucketModal.visible ? data.signup : null}
        onComplete={changeBucketModal.close}
        onCancel={changeBucketModal.close}
      />
    </>
  );
}

EditSignup.propTypes = {
  teamMembersUrl: PropTypes.string.isRequired,
};

export default EditSignup;
