import { createContext, useCallback, useContext, useMemo } from 'react';
import { assertNever } from 'assert-never';
import { Column } from 'react-table';
import { useConfirm, ErrorDisplay, useGraphQLConfirm } from '@neinteractiveliterature/litform';

import AppRootContext from '../AppRootContext';
import { timespanFromRun } from '../TimespanUtils';
import RunCapacityGraph from '../EventsApp/EventPage/RunCapacityGraph';
import { RankedChoiceDecisionValue, SignupAutomationMode, SignupRequestState } from '../graphqlTypes.generated';
import {
  SignupModerationQueuePageQueryData,
  SignupModerationQueueQueryData,
  SignupModerationSignupRequestFieldsFragment,
  useSignupModerationQueuePageQuerySuspenseQuery,
  useSignupModerationQueueQuery,
} from './queries.generated';
import {
  useAcceptSignupRequestMutation,
  useRejectSignupRequestMutation,
  useRerunModeratedRankedChoiceSignupRoundMutation,
} from './mutations.generated';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import TimestampCell from '../Tables/TimestampCell';
import { useFormatRunTimespan } from '../EventsApp/runTimeFormatting';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useApolloClient } from '@apollo/client';
import { ParsedSignupRound, parseSignupRounds } from '../SignupRoundUtils';
import { describeSignupRound } from '../SignupRoundsAdmin/describeSignupRound';
import { describeDecision } from '../SignupRoundsAdmin/RankedChoiceSignupDecisionsPage';
import { sortBy } from 'lodash';

type SignupModerationContextValue = {
  acceptClicked: (signupRequest: SignupModerationSignupRequestFieldsFragment) => void;
  parsedSignupRounds: ParsedSignupRound<SignupModerationQueuePageQueryData['convention']['signup_rounds'][number]>[];
  rejectClicked: (signupRequest: SignupModerationSignupRequestFieldsFragment) => void;
  rerunSignupRound: (id: string) => Promise<void>;
};

const SignupModerationContext = createContext<SignupModerationContextValue>({
  acceptClicked: () => {},
  parsedSignupRounds: [],
  rejectClicked: () => {},
  rerunSignupRound: async () => {},
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

function SignupRankedChoiceCell({ value }: { value: SignupModerationSignupRequestFieldsFragment }) {
  const { t } = useTranslation();
  const { parsedSignupRounds, rerunSignupRound } = useContext(SignupModerationContext);
  const confirm = useGraphQLConfirm();

  const finalDecision = useMemo(() => {
    if (value.signup_ranked_choice?.ranked_choice_decisions) {
      return sortBy(
        value.signup_ranked_choice.ranked_choice_decisions.filter(
          (decision) => decision.decision !== RankedChoiceDecisionValue.SkipChoice,
        ) ?? [],
        (decision) => new Date(decision.created_at).getTime() * -1,
      )[0];
    } else {
      return undefined;
    }
  }, [value.signup_ranked_choice?.ranked_choice_decisions]);

  if (finalDecision == null) {
    return <></>;
  }

  const roundIndex = parsedSignupRounds.findIndex((round) => round.id === finalDecision.signup_round.id);
  const searchParams = new URLSearchParams({
    'filters.decision': Object.values(RankedChoiceDecisionValue).join(','),
    'filters.user_con_profile_name': value.user_con_profile.name_without_nickname,
    'sort.created_at': 'asc',
  });

  return (
    <>
      <div>
        {t('admin.signupModeration.decisionDescription', {
          round: describeSignupRound(parsedSignupRounds, roundIndex, t),
          decision: describeDecision(finalDecision.decision, t),
        })}
      </div>
      <Link to={`/signup_rounds/${finalDecision.signup_round.id}/results?${searchParams.toString()}`} target="_blank">
        {t('admin.signupModeration.viewDecisionLog')} <i className="bi-box-arrow-up-right" />
      </Link>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() =>
          confirm({
            prompt: (
              <Trans
                i18nKey="admin.signupModeration.rerunRoundPrompt"
                values={{ round: describeSignupRound(parsedSignupRounds, roundIndex, t) }}
              />
            ),
            action: () => rerunSignupRound(finalDecision.signup_round.id),
          })
        }
      >
        {t('admin.signupModeration.rerunRound')}
      </button>
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
      id: 'signup_ranked_choice',
      Header: t('admin.signupModeration.headers.signup_ranked_choice'),
      Cell: SignupRankedChoiceCell,
      width: 60,
      accessor: (signupRequest) => signupRequest,
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
  const { data: pageData, error: pageDataError } = useSignupModerationQueuePageQuerySuspenseQuery();
  const [acceptSignupRequest] = useAcceptSignupRequestMutation();
  const [rejectSignupRequest] = useRejectSignupRequestMutation();
  const [rerunModeratedRankedChoiceSignupRound] = useRerunModeratedRankedChoiceSignupRoundMutation();
  const apolloClient = useApolloClient();
  const confirm = useConfirm();
  const getPossibleColumnsWithTranslation = useCallback(() => getPossibleColumns(t), [t]);

  const parsedSignupRounds = useMemo(
    () => parseSignupRounds(pageData.convention.signup_rounds),
    [pageData.convention.signup_rounds],
  );

  const { tableInstance, loading } = useReactTableWithTheWorks({
    useQuery: useSignupModerationQueueQuery,
    storageKeyPrefix: 'signupModerationQueue',
    getData: (result) => result.data.convention.signup_requests_paginated.entries,
    getPages: (result) => result.data.convention.signup_requests_paginated.total_pages,
    getPossibleColumns: getPossibleColumnsWithTranslation,
  });

  const contextValue = useMemo<SignupModerationContextValue>(
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
      parsedSignupRounds,
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
      rerunSignupRound: async (id: string) => {
        await rerunModeratedRankedChoiceSignupRound({ variables: { id } });
        await apolloClient.resetStore();
      },
    }),
    [
      confirm,
      rejectSignupRequest,
      acceptSignupRequest,
      t,
      apolloClient,
      rerunModeratedRankedChoiceSignupRound,
      parsedSignupRounds,
    ],
  );

  if (pageDataError) {
    return <ErrorDisplay graphQLError={pageDataError} />;
  }

  return (
    <SignupModerationContext.Provider value={contextValue}>
      <ReactTableWithTheWorks tableInstance={tableInstance} loading={loading} />
    </SignupModerationContext.Provider>
  );
}

export default SignupModerationQueue;
