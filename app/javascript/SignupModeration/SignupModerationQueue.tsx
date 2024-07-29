import { createContext, useCallback, useContext, useMemo } from 'react';
import { assertNever } from 'assert-never';
import { Column } from 'react-table';
import { useConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import AppRootContext from '../AppRootContext';
import { timespanFromRun } from '../TimespanUtils';
import RunCapacityGraph from '../EventsApp/EventPage/RunCapacityGraph';
import { SignupAutomationMode, SignupRequestState } from '../graphqlTypes.generated';
import {
  SignupModerationQueueQueryData,
  SignupModerationSignupRequestFieldsFragment,
  useSignupModerationQueueQuery,
} from './queries.generated';
import { useAcceptSignupRequestMutation, useRejectSignupRequestMutation } from './mutations.generated';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import TimestampCell from '../Tables/TimestampCell';
import { useFormatRunTimespan } from '../EventsApp/runTimeFormatting';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

type SignupModerationContextValue = {
  acceptClicked: (signupRequest: SignupModerationSignupRequestFieldsFragment) => void;
  rejectClicked: (signupRequest: SignupModerationSignupRequestFieldsFragment) => void;
};

const SignupModerationContext = createContext<SignupModerationContextValue>({
  acceptClicked: () => {},
  rejectClicked: () => {},
});

function signupRequestStateBadgeClass(state: SignupRequestState) {
  switch (state) {
    case SignupRequestState.Accepted:
      // eslint-disable-next-line i18next/no-literal-string
      return 'bg-success';
    case SignupRequestState.Rejected:
      // eslint-disable-next-line i18next/no-literal-string
      return 'bg-danger';
    case SignupRequestState.Pending:
      // eslint-disable-next-line i18next/no-literal-string
      return 'bg-info';
    case SignupRequestState.Withdrawn:
      // eslint-disable-next-line i18next/no-literal-string
      return 'bg-dark';
    default:
      assertNever(state, true);
      // eslint-disable-next-line i18next/no-literal-string
      return 'bg-light';
  }
}

function describeRequestedBucket(signupRequest: SignupModerationSignupRequestFieldsFragment, t: TFunction) {
  return signupRequest.requested_bucket_key
    ? (
        signupRequest.target_run.event.registration_policy?.buckets.find(
          (bucket) => bucket.key === signupRequest.requested_bucket_key,
        ) || {}
      ).name
    : t('signups.noPreference');
}

type SignupModerationRunDetailsProps = {
  run: NonNullable<
    SignupModerationQueueQueryData['convention']
  >['signup_requests_paginated']['entries'][0]['target_run'];
  showRequestedBucket?: boolean;
  requestedBucketKey?: string;
};

function SignupModerationRunDetails({ run, showRequestedBucket, requestedBucketKey }: SignupModerationRunDetailsProps) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const runTimespan = timespanFromRun(timezoneName, run.event, run);
  const formatRunTimespan = useFormatRunTimespan();

  return (
    <>
      {run.event.title}
      {run.title_suffix && `(${run.title_suffix})`}
      <br />
      {showRequestedBucket && (
        <>
          <small>
            <strong>{t('admin.signupModeration.bucketHeader')}</strong>{' '}
            {(run.event.registration_policy?.buckets.find((bucket) => bucket.key === requestedBucketKey) || {}).name ||
              t('signups.noPreference')}
          </small>
        </>
      )}
      <small>{formatRunTimespan(runTimespan, { formatType: 'short' })}</small>
    </>
  );
}

function SignupRequestUserConProfileCell({
  value,
}: {
  value: SignupModerationSignupRequestFieldsFragment['user_con_profile'];
}) {
  const { signupAutomationMode } = useContext(AppRootContext);
  const { t } = useTranslation();

  return (
    <>
      <UserConProfileWithGravatarCell value={value} />
      {signupAutomationMode === SignupAutomationMode.RankedChoice && (
        <>
          <br />
          <Link to={`../ranked_choice_queue/${value.id}`}>{t('signupModeration.goToRankedChoiceQueue')}</Link>
        </>
      )}
    </>
  );
}

function SignupRequestCell({ value }: { value: SignupModerationSignupRequestFieldsFragment }) {
  const { t } = useTranslation();

  return (
    <>
      {value.replace_signup && (
        <p>
          <strong className="text-danger">{t('admin.signupModeration.signupRequest.withdrawFrom')}</strong>{' '}
          <SignupModerationRunDetails run={value.replace_signup.run} />
        </p>
      )}
      <strong className="text-success">
        {value.replace_signup
          ? t('admin.signupModeration.signupRequest.signUpForReplacing')
          : t('admin.signupModeration.signupRequest.signUpForNonReplacing')}
      </strong>{' '}
      <SignupModerationRunDetails run={value.target_run} />
      <br />
      <small>
        <strong>{t('admin.signupModeration.signupRequest.requestedBucket')}</strong> {describeRequestedBucket(value, t)}
      </small>
    </>
  );
}

function SignupRequestStateCell({ value }: { value: SignupRequestState }) {
  return <div className={`badge ${signupRequestStateBadgeClass(value)}`}>{value}</div>;
}

function SignupRequestActionsCell({ value }: { value: SignupModerationSignupRequestFieldsFragment }) {
  const { t } = useTranslation();
  const { acceptClicked, rejectClicked } = useContext(SignupModerationContext);

  return (
    <>
      {value.state === 'pending' && (
        <>
          <button className="btn btn-sm btn-danger me-2" type="button" onClick={() => rejectClicked(value)}>
            {t('admin.signupModeration.reject')}
          </button>

          <button className="btn btn-sm btn-success" type="button" onClick={() => acceptClicked(value)}>
            {t('admin.signupModeration.accept')}
          </button>
        </>
      )}
      {value.state === 'rejected' && (
        <button className="btn btn-sm btn-warning" type="button" onClick={() => acceptClicked(value)}>
          {t('admin.signupModeration.acceptPreviouslyRejected')}
        </button>
      )}
    </>
  );
}

function getPossibleColumns(
  t: TFunction,
): Column<SignupModerationQueueQueryData['convention']['signup_requests_paginated']['entries'][number]>[] {
  return [
    {
      id: 'attendee',
      Header: t('admin.signupModeration.headers.user_con_profile'),
      accessor: 'user_con_profile',
      width: 130,
      Cell: SignupRequestUserConProfileCell,
    },
    {
      id: 'request',
      Header: t('admin.signupModeration.headers.signup_request'),
      Cell: SignupRequestCell,
      accessor: (signupRequest) => signupRequest,
    },
    {
      id: 'state',
      Header: t('admin.signupModeration.headers.state'),
      Cell: SignupRequestStateCell,
      width: 60,
      accessor: 'state',
    },
    {
      id: 'created_at',
      Header: t('admin.signupModeration.headers.created_at'),
      Cell: TimestampCell,
      width: 60,
      accessor: 'created_at',
    },
    {
      id: 'actions',
      Header: t('admin.signupModeration.headers.actions'),
      width: 100,
      Cell: SignupRequestActionsCell,
      accessor: (signupRequest) => signupRequest,
    },
  ];
}

function SignupModerationQueue(): JSX.Element {
  const { t } = useTranslation();
  const [acceptSignupRequest] = useAcceptSignupRequestMutation();
  const [rejectSignupRequest] = useRejectSignupRequestMutation();
  const confirm = useConfirm();
  const getPossibleColumnsWithTranslation = useCallback(() => getPossibleColumns(t), [t]);

  const { tableInstance, loading } = useReactTableWithTheWorks({
    useQuery: useSignupModerationQueueQuery,
    storageKeyPrefix: 'signupModerationQueue',
    getData: (result) => result.data.convention.signup_requests_paginated.entries,
    getPages: (result) => result.data.convention.signup_requests_paginated.total_pages,
    getPossibleColumns: getPossibleColumnsWithTranslation,
  });

  const contextValue = useMemo(
    () => ({
      acceptClicked: (signupRequest: SignupModerationSignupRequestFieldsFragment) =>
        confirm({
          prompt: (
            <>
              <p>
                {t('admin.signupModeration.acceptPrompt', {
                  name: signupRequest.user_con_profile.name,
                  eventTitle: signupRequest.target_run.event.title,
                  bucketDescription: describeRequestedBucket(signupRequest, t),
                })}
              </p>

              <div className="mb-2">
                <strong>{t('admin.signupModeration.runCapacityGraphHeader')}</strong>
                <RunCapacityGraph
                  event={signupRequest.target_run.event}
                  run={signupRequest.target_run}
                  signupsAvailable
                />
              </div>

              <p className="mb-0">{t('admin.signupModeration.acceptPromptActions')}</p>
            </>
          ),
          action: () => acceptSignupRequest({ variables: { id: signupRequest.id } }),
          renderError: (acceptError) => <ErrorDisplay graphQLError={acceptError} />,
        }),
      rejectClicked: (
        signupRequest: NonNullable<
          SignupModerationQueueQueryData['convention']
        >['signup_requests_paginated']['entries'][0],
      ) =>
        confirm({
          prompt: (
            <p className="mb-0">
              <Trans i18nKey="admin.signupModeration.rejectPrompt" />
            </p>
          ),
          action: () => rejectSignupRequest({ variables: { id: signupRequest.id } }),
          renderError: (acceptError) => <ErrorDisplay graphQLError={acceptError} />,
        }),
    }),
    [confirm, rejectSignupRequest, acceptSignupRequest, t],
  );

  return (
    <SignupModerationContext.Provider value={contextValue}>
      <ReactTableWithTheWorks tableInstance={tableInstance} loading={loading} />
    </SignupModerationContext.Provider>
  );
}

export default SignupModerationQueue;
