import { createContext, useContext, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';

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
      return 'bg-success';
    case SignupRequestState.Rejected:
      return 'bg-danger';
    case SignupRequestState.Pending:
      return 'bg-info';
    case SignupRequestState.Withdrawn:
      return 'bg-dark';
    default:
      assertNever(state, true);
      return 'bg-light';
  }
}

function describeRequestedBucket(signupRequest: SignupModerationSignupRequestFieldsFragment) {
  return signupRequest.requested_bucket_key
    ? (
        signupRequest.target_run.event.registration_policy?.buckets.find(
          (bucket) => bucket.key === signupRequest.requested_bucket_key,
        ) || {}
      ).name
    : 'No preference';
}

type SignupModerationRunDetailsProps = {
  run: NonNullable<
    SignupModerationQueueQueryData['convention']
  >['signup_requests_paginated']['entries'][0]['target_run'];
  showRequestedBucket?: boolean;
  requestedBucketKey?: string;
};

function SignupModerationRunDetails({ run, showRequestedBucket, requestedBucketKey }: SignupModerationRunDetailsProps) {
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
            <strong>Bucket:</strong>{' '}
            {(run.event.registration_policy?.buckets.find((bucket) => bucket.key === requestedBucketKey) || {}).name ||
              'No preference'}
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
          <Link to={`../ranked_choice_queue/${value.id}`}>
            {t('signupModeration.goToRankedChoiceQueue', 'Go to ranked choice queue')}
          </Link>
        </>
      )}
    </>
  );
}

function SignupRequestCell({ value }: { value: SignupModerationSignupRequestFieldsFragment }) {
  return (
    <>
      {value.replace_signup && (
        <p>
          <strong className="text-danger">Withdraw from</strong>{' '}
          <SignupModerationRunDetails run={value.replace_signup.run} />
        </p>
      )}
      <strong className="text-success">{value.replace_signup ? 'And sign up for' : 'Sign up for'}</strong>{' '}
      <SignupModerationRunDetails run={value.target_run} />
      <br />
      <small>
        <strong>Requested bucket:</strong> {describeRequestedBucket(value)}
      </small>
    </>
  );
}

function SignupRequestStateCell({ value }: { value: SignupRequestState }) {
  return <div className={`badge ${signupRequestStateBadgeClass(value)}`}>{value}</div>;
}

function SignupRequestActionsCell({ value }: { value: SignupModerationSignupRequestFieldsFragment }) {
  const { acceptClicked, rejectClicked } = useContext(SignupModerationContext);

  return (
    <>
      {value.state === 'pending' && (
        <>
          <button className="btn btn-sm btn-danger me-2" type="button" onClick={() => rejectClicked(value)}>
            Reject
          </button>

          <button className="btn btn-sm btn-success" type="button" onClick={() => acceptClicked(value)}>
            Accept
          </button>
        </>
      )}
      {value.state === 'rejected' && (
        <button className="btn btn-sm btn-warning" type="button" onClick={() => acceptClicked(value)}>
          Accept after all
        </button>
      )}
    </>
  );
}

function getPossibleColumns(): Column<
  SignupModerationQueueQueryData['convention']['signup_requests_paginated']['entries'][number]
>[] {
  return [
    {
      id: 'attendee',
      Header: 'Attendee',
      accessor: 'user_con_profile',
      width: 130,
      Cell: SignupRequestUserConProfileCell,
    },
    {
      id: 'request',
      Header: 'Request',
      Cell: SignupRequestCell,
      accessor: (signupRequest) => signupRequest,
    },
    {
      id: 'state',
      Header: 'Status',
      Cell: SignupRequestStateCell,
      width: 60,
      accessor: 'state',
    },
    {
      id: 'created_at',
      Header: 'Submitted at',
      Cell: TimestampCell,
      width: 60,
      accessor: 'created_at',
    },
    {
      id: 'actions',
      Header: 'Actions',
      width: 100,
      Cell: SignupRequestActionsCell,
      accessor: (signupRequest) => signupRequest,
    },
  ];
}

function SignupModerationQueue(): JSX.Element {
  const [acceptSignupRequest] = useAcceptSignupRequestMutation();
  const [rejectSignupRequest] = useRejectSignupRequestMutation();
  const confirm = useConfirm();
  const { tableInstance, loading } = useReactTableWithTheWorks({
    useQuery: useSignupModerationQueueQuery,
    storageKeyPrefix: 'signupModerationQueue',
    getData: (result) => result.data.convention.signup_requests_paginated.entries,
    getPages: (result) => result.data.convention.signup_requests_paginated.total_pages,
    getPossibleColumns,
  });

  const contextValue = useMemo(
    () => ({
      acceptClicked: (signupRequest: SignupModerationSignupRequestFieldsFragment) =>
        confirm({
          prompt: (
            <>
              <p>
                Please confirm you want to accept this signup request. This will attempt to sign{' '}
                {signupRequest.user_con_profile.name}
                {' up for '}
                {signupRequest.target_run.event.title}
                {' as '}
                {describeRequestedBucket(signupRequest)}. If there is no space in the requested bucket, the attendee
                will either be signed up in a flex bucket, if possible, or waitlisted.
              </p>

              <div className="mb-2">
                <strong>Current space availability in this event run:</strong>
                <RunCapacityGraph
                  event={signupRequest.target_run.event}
                  run={signupRequest.target_run}
                  signupsAvailable
                />
              </div>

              <p className="mb-0">
                This will automatically email both the attendee and the event team to let them know about the signup.
              </p>
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
              Please confirm you want to reject this signup request. This will <strong>not</strong> automatically email
              anyone. After doing this, you may wish to email the attendee to let them know.
            </p>
          ),
          action: () => rejectSignupRequest({ variables: { id: signupRequest.id } }),
          renderError: (acceptError) => <ErrorDisplay graphQLError={acceptError} />,
        }),
    }),
    [confirm, rejectSignupRequest, acceptSignupRequest],
  );

  return (
    <SignupModerationContext.Provider value={contextValue}>
      <ReactTableWithTheWorks tableInstance={tableInstance} loading={loading} />
    </SignupModerationContext.Provider>
  );
}

export default SignupModerationQueue;
