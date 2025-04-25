import { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { data, Link, Outlet, useRouteLoaderData, useSubmit } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';
import snakeCase from 'lodash/snakeCase';
import { AdminSignupQueryData, AdminSignupQueryDocument, SignupFieldsFragment } from '../queries.generated';
import { UpdateSignupCountedDocument } from '../mutations.generated';
import AppRootContext from '../../../AppRootContext';
import { useFormatRunTimespan } from '../../runTimeFormatting';
import usePageTitle from '../../../usePageTitle';
import Gravatar from '../../../Gravatar';
import { ageAsOf } from '../../../TimeUtils';
import Timespan from '../../../Timespan';
import { getSignupStateLabel } from '../../../Tables/SignupStateCell';
import humanize from '../../../humanize';
import { Route, Info } from './+types/route';
import { NamedRoute } from 'routes';
import { apolloClientContext } from 'AppContexts';

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

export const loader = async ({ context, params: { id } }: Route.LoaderArgs) => {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({
    query: AdminSignupQueryDocument,
    variables: { id: id ?? '' },
  });
  return data;
};

export const action = async ({ context, request, params: { id } }: Route.ActionArgs) => {
  const client = context.get(apolloClientContext);
  const formData = await request.formData();
  const result = await client.mutate({
    mutation: UpdateSignupCountedDocument,
    variables: {
      signupId: id,
      counted: formData.get('counted')?.toString() === 'true',
    },
  });
  return data(result.data);
};

export function useSingleSignupLoader() {
  return useRouteLoaderData(NamedRoute.EditSignup) as Info['loaderData'];
}

function EditSignup({ loaderData: data }: Route.ComponentProps): JSX.Element {
  const { timezoneName, ticketName } = useContext(AppRootContext);
  const confirm = useConfirm();
  const { t } = useTranslation();
  const formatRunTimespan = useFormatRunTimespan();
  const submit = useSubmit();

  usePageTitle(
    t('events.signupAdmin.editPageTitle', {
      name: data.convention.signup.user_con_profile.name_without_nickname,
      eventTitle: data.convention.signup.run.event.title,
    }),
  );

  const toggleCounted = useCallback(
    (signup: AdminSignupQueryData['convention']['signup']) =>
      submit({ counted: !signup.counted }, { action: '.', method: 'PATCH' }),
    [submit],
  );

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
        <Link className="btn btn-link" to="./force_confirm" type="button">
          Force into run
        </Link>
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
              <Link
                className="btn btn-link"
                to="./change_bucket"
                type="button"
                aria-label={t('events.signupAdmin.changeBucketHeader')}
              >
                <i className="bi-pencil-fill" />
              </Link>
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
            <Link to="../../../team_members" className="btn btn-link">
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
      <Outlet />
    </>
  );
}

export default EditSignup;
