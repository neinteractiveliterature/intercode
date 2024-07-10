import { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { Link, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { useModal, useConfirm, ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';
import snakeCase from 'lodash/snakeCase';

import { ageAsOf } from '../../TimeUtils';
import ChangeBucketModal from './ChangeBucketModal';
import ForceConfirmSignupModal from './ForceConfirmSignupModal';
import Timespan from '../../Timespan';
import useValueUnless from '../../useValueUnless';
import usePageTitle from '../../usePageTitle';
import Gravatar from '../../Gravatar';
import AppRootContext from '../../AppRootContext';
import { AdminSignupQueryData, SignupFieldsFragment, useAdminSignupQuery } from './queries.generated';
import { useUpdateSignupCountedMutation } from './mutations.generated';
import { useFormatRunTimespan } from '../runTimeFormatting';
import humanize from '../../humanize';
import { getSignupStateLabel } from '../../Tables/SignupStateCell';

function cityState(userConProfile: SignupFieldsFragment['user_con_profile']) {
  return [userConProfile.city, userConProfile.state].filter((item) => item && item.trim() !== '').join(', ');
}

function cityStateZip(userConProfile: SignupFieldsFragment['user_con_profile']) {
  return [cityState(userConProfile), userConProfile.zipcode].filter((item) => item && item.trim() !== '').join(' ');
}

function getMakeCountedConfirmPrompt(signup: SignupFieldsFragment) {
  const { user_con_profile: userConProfile, run } = signup;

  return (
    <Trans
      i18nKey="events.signupAdmin.makeCountedConfirmPrompt"
      values={{ name: userConProfile.name_without_nickname, eventTitle: run.event.title }}
    >
      <p>
        Are you sure? This will make {'{{ name }}’s'} signup count towards attendee totals for {'{{ eventTitle }}'}.{' '}
        {'{{ eventTitle }}'} will also count towards
        {' {{ name }}’s'} signup limit if there is a signup cap in place.
      </p>
      <p className="text-danger">
        Caution: this operation does not check whether the signup buckets are already full, and therefore may result in
        overfilling a bucket.
      </p>
    </Trans>
  );
}

function getMakeNotCountedConfirmPrompt(signup: SignupFieldsFragment) {
  const { user_con_profile: userConProfile, run } = signup;

  return (
    <Trans
      i18nKey="events.signupAdmin.makeNotCountedConfirmPrompt"
      values={{ name: userConProfile.name_without_nickname, eventTitle: run.event.title }}
    >
      <p>
        Are you sure? This will make {'{{ name }}’s'} signup not count towards attendee totals for {'{{ eventTitle }}'}.
        It will also allow
        {' {{ name }}'} to sign up for an additional event if there is a signup cap in place.
      </p>
      <p className="text-danger">
        Caution: this operation will pull additional attendees into the space freed up by making this signup not count.
      </p>
    </Trans>
  );
}

const renderAddressItem = (userConProfile: SignupFieldsFragment['user_con_profile'], t: TFunction) => {
  const elements = (
    [
      ['header', t('events.signupAdmin.addressHeader')],
      ['address', userConProfile.address],
      ['cityStateZip', cityStateZip(userConProfile)],
      ['country', userConProfile.country],
    ] as const
  ).filter((pair) => pair[1] && pair[1].trim() !== '');

  const listItems = elements.map(([key, element]) => <li key={key}>{element}</li>);
  return <ul className="list-unstyled">{listItems}</ul>;
};

function getToggleCountedConfirmPrompt(signup: SignupFieldsFragment) {
  if (signup.counted) {
    return getMakeNotCountedConfirmPrompt(signup);
  }

  return getMakeCountedConfirmPrompt(signup);
}

export type EditSignupProps = {
  teamMembersUrl: string;
};

function EditSignup({ teamMembersUrl }: EditSignupProps): JSX.Element {
  const { timezoneName, ticketName } = useContext(AppRootContext);
  const { id } = useParams<{ id: string }>();
  if (id == null) {
    throw new Error('id not found in URL params');
  }
  const { data, loading, error } = useAdminSignupQuery({ variables: { id } });
  const changeBucketModal = useModal();
  const forceConfirmModal = useModal();
  const [updateCountedMutate] = useUpdateSignupCountedMutation();
  const confirm = useConfirm();
  const { t } = useTranslation();
  const formatRunTimespan = useFormatRunTimespan();

  usePageTitle(
    useValueUnless(
      () =>
        t('events.signupAdmin.editPageTitle', {
          name: data?.convention.signup.user_con_profile.name_without_nickname,
          eventTitle: data?.convention.signup.run.event.title,
        }),
      error || loading,
    ),
  );

  const toggleCounted = useCallback(
    (signup: AdminSignupQueryData['convention']['signup']) =>
      updateCountedMutate({
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
    return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
  }

  const renderUserSection = () => {
    const signup = data?.convention.signup;
    const userConProfile = signup?.user_con_profile;

    if (!signup || !userConProfile) {
      return <></>;
    }

    return (
      <div className="card me-2">
        <div className="card-header d-flex align-items-center">
          <div className="me-2">
            <Gravatar url={userConProfile.gravatar_url} enabled={userConProfile.gravatar_enabled} pixelSize={32} />
          </div>
          <div className="lead">{userConProfile.name_without_nickname}</div>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <>
              {t('events.signupAdmin.nicknameHeader')} {userConProfile.nickname}
            </>
          </li>
          <li className="list-group-item">
            <>
              {t('events.signupAdmin.ageHeader', {
                eventTitle: signup.run.event.title,
              })}{' '}
              {ageAsOf(
                userConProfile.birth_date
                  ? DateTime.fromISO(userConProfile.birth_date, { zone: timezoneName })
                  : undefined,
                DateTime.fromISO(signup.run.starts_at, { zone: timezoneName }),
              )}
            </>
          </li>
          <li className={classNames('list-group-item')}>
            <>
              {t('events.signupAdmin.emailHeader')}{' '}
              <a href={`mailto:${userConProfile.email}`}>{userConProfile.email}</a>
            </>
          </li>
          <li className="list-group-item">
            <>
              {t('events.signupAdmin.phoneHeader')}{' '}
              <a href={`tel:${userConProfile.mobile_phone}`}>{userConProfile.mobile_phone}</a>
            </>
          </li>
          <li className="list-group-item">{renderAddressItem(userConProfile, t)}</li>
        </ul>
      </div>
    );
  };

  const renderForceConfirmButton = () => {
    if (!data || !data.currentAbility.can_force_confirm_signup) {
      return null;
    }

    const { signup } = data.convention;

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
    if (!data) {
      return null;
    }

    const { signup } = data.convention;

    return (
      <button
        className="btn btn-link"
        type="button"
        disabled={!data.currentAbility.can_update_counted_signup}
        onClick={() =>
          confirm({
            prompt: getToggleCountedConfirmPrompt(signup),
            action: () => toggleCounted(signup),
            renderError: (updateCountedError) => <ErrorDisplay graphQLError={updateCountedError} />,
          })
        }
      >
        {signup.counted ? (
          <i className="bi-toggle-on">
            <span className="visually-hidden">Make not counted</span>
          </i>
        ) : (
          <i className="bi-toggle-off">
            <span className="visually-hidden">Make counted</span>
          </i>
        )}
      </button>
    );
  };

  const renderRunSection = () => {
    if (!data) {
      return null;
    }

    const { signup } = data.convention;
    const { run } = signup;
    const { event } = run;
    const { registration_policy: registrationPolicy } = event;
    const timespan = Timespan.finiteFromStrings(run.starts_at, run.ends_at);
    const teamMember = run.event.team_members.find((tm) => tm.user_con_profile.id === signup.user_con_profile.id);
    const bucket = signup.bucket_key ? registrationPolicy?.buckets.find((b) => b.key === signup.bucket_key) : null;
    const requestedBucket = signup.requested_bucket_key
      ? registrationPolicy?.buckets.find((b) => b.key === signup.requested_bucket_key)
      : null;

    return (
      <div className="card ms-2">
        <div className="card-header">
          {run.event.title}
          <br />
          {formatRunTimespan(timespan, { formatType: 'short' })}
          <br />
          {run.rooms
            .map((room) => room.name)
            .sort()
            .join(', ')}
        </div>

        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex align-items-center">
            <div className="flex-fill">
              Signup state:
              <strong> {getSignupStateLabel(signup.state, t, ticketName)}</strong>
            </div>
            {renderForceConfirmButton()}
          </li>
          <li className="list-group-item d-flex align-items-center">
            <div className="flex-fill">
              Signup bucket:{' '}
              <strong>
                {(bucket || { name: 'none' }).name}
                {requestedBucket && (!bucket || bucket.key !== requestedBucket.key)
                  ? ` (requested ${requestedBucket.name})`
                  : ''}
                {!teamMember && !requestedBucket ? ' (no preference)' : ''}
              </strong>
            </div>
            {signup.state === 'confirmed' && data.currentAbility.can_update_bucket_signup ? (
              <button className="btn btn-link" onClick={changeBucketModal.open} type="button">
                <i className="bi-pencil-fill">
                  <span className="visually-hidden">Change</span>
                </i>
              </button>
            ) : null}
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
              {humanize(snakeCase(run.event.event_category.team_member_name))}:
              <strong>{teamMember ? ' yes' : ' no'}</strong>
            </div>
            <Link to={teamMembersUrl} className="btn btn-link">
              Go to {run.event.event_category.teamMemberNamePlural}
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <h1 className="mb-4">
        {t('events.signupAdmin.editPageHeader', {
          eventTitle: data?.convention.signup.run.event.title,
        })}
      </h1>
      <div className="row">
        <div className="col col-md-6">{renderUserSection()}</div>

        <div className="col col-md-6">{renderRunSection()}</div>
      </div>
      <ForceConfirmSignupModal
        signup={forceConfirmModal.visible ? data?.convention.signup : undefined}
        onComplete={forceConfirmModal.close}
        onCancel={forceConfirmModal.close}
      />
      <ChangeBucketModal
        signup={changeBucketModal.visible ? data?.convention.signup : undefined}
        onComplete={changeBucketModal.close}
        onCancel={changeBucketModal.close}
      />
    </>
  );
}

export default EditSignup;
