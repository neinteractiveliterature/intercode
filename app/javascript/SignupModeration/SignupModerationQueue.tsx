import { createContext, useContext, useMemo } from 'react';
import { assertNever } from 'assert-never';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { useConfirm, ErrorDisplay, useGraphQLConfirm } from '@neinteractiveliterature/litform';

import AppRootContext from '../AppRootContext';
import { timespanFromRun } from '../TimespanUtils';
import RunCapacityGraph from '../EventsApp/EventPage/RunCapacityGraph';
import { RankedChoiceDecisionValue, SignupAutomationMode, SignupRequestState } from '../graphqlTypes.generated';
import {
  SignupModerationQueuePageQueryData,
  SignupModerationQueuePageQueryDocument,
  SignupModerationQueueQueryData,
  SignupModerationQueueQueryDocument,
  SignupModerationSignupRequestFieldsFragment,
} from './queries.generated';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import TimestampCell from '../Tables/TimestampCell';
import { useFormatRunTimespan } from '../EventsApp/runTimeFormatting';
import { Link, useFetcher } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { ParsedSignupRound, parseSignupRounds } from '../SignupRoundUtils';
import { describeSignupRound } from '../SignupRoundsAdmin/describeSignupRound';
import { describeDecision } from '../SignupRoundsAdmin/RankedChoiceSignupDecisionsPage';
import sortBy from 'lodash/sortBy';
import { ApolloError } from '@apollo/client';
import { Route } from './+types/SignupModerationQueue';

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

function SignupRequestUserConProfileCell<
  TData,
  TValue extends SignupModerationSignupRequestFieldsFragment['user_con_profile'],
>(props: CellContext<TData, TValue>) {
  const { signupAutomationMode } = useContext(AppRootContext);
  const { t } = useTranslation();

  return (
    <>
      <UserConProfileWithGravatarCell {...props} />
      {signupAutomationMode === SignupAutomationMode.RankedChoice && (
        <>
          <br />
          <Link to={`../ranked_choice_queue/${props.getValue().id}`}>
            {t('signupModeration.goToRankedChoiceQueue')}
          </Link>
        </>
      )}
    </>
  );
}

function SignupRequestCell<TData, TValue extends SignupModerationSignupRequestFieldsFragment | null | undefined>({
  getValue,
}: CellContext<TData, TValue>) {
  const { t } = useTranslation();
  const value = getValue();

  if (value == null) {
    return <></>;
  }

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

function SignupRequestStateCell<TData, TValue extends SignupRequestState>({ getValue }: CellContext<TData, TValue>) {
  const value = getValue();
  return <div className={`badge ${signupRequestStateBadgeClass(value)}`}>{value}</div>;
}

function SignupRequestActionsCell<
  TData,
  TValue extends SignupModerationSignupRequestFieldsFragment | null | undefined,
>({ getValue }: CellContext<TData, TValue>) {
  const { t } = useTranslation();
  const { acceptClicked, rejectClicked } = useContext(SignupModerationContext);
  const value = getValue();

  if (value == null) {
    return <></>;
  }

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

function SignupRankedChoiceCell<TData, TValue extends SignupModerationSignupRequestFieldsFragment | null | undefined>({
  getValue,
}: CellContext<TData, TValue>) {
  const { t } = useTranslation();
  const { parsedSignupRounds, rerunSignupRound } = useContext(SignupModerationContext);
  const confirm = useGraphQLConfirm();
  const value = getValue();

  const finalDecision = useMemo(() => {
    if (value?.signup_ranked_choice?.ranked_choice_decisions) {
      return sortBy(
        value?.signup_ranked_choice.ranked_choice_decisions.filter(
          (decision) => decision.decision !== RankedChoiceDecisionValue.SkipChoice,
        ) ?? [],
        (decision) => new Date(decision.created_at).getTime() * -1,
      )[0];
    } else {
      return undefined;
    }
  }, [value?.signup_ranked_choice?.ranked_choice_decisions]);

  if (finalDecision == null) {
    return <></>;
  }

  const roundIndex = parsedSignupRounds.findIndex((round) => round.id === finalDecision.signup_round.id);
  const searchParams = new URLSearchParams({
    'filters.decision': Object.values(RankedChoiceDecisionValue).join(','),
    'filters.user_con_profile_name': value?.user_con_profile.name_without_nickname ?? '',
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

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { data } = await context.client.query({ query: SignupModerationQueuePageQueryDocument });
  return data;
};

function SignupModerationQueue({ loaderData: pageData }: Route.ComponentProps): JSX.Element {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;

  const parsedSignupRounds = useMemo(
    () => parseSignupRounds(pageData.convention.signup_rounds),
    [pageData.convention.signup_rounds],
  );

  const columns = useMemo(() => {
    const columnHelper =
      createColumnHelper<
        SignupModerationQueueQueryData['convention']['signup_requests_paginated']['entries'][number]
      >();

    return [
      columnHelper.accessor('user_con_profile', {
        id: 'attendee',
        header: t('admin.signupModeration.headers.user_con_profile'),
        size: 130,
        cell: SignupRequestUserConProfileCell,
      }),
      columnHelper.accessor((signupRequest) => signupRequest, {
        id: 'request',
        header: t('admin.signupModeration.headers.signup_request'),
        cell: SignupRequestCell,
      }),
      columnHelper.accessor('state', {
        id: 'state',
        header: t('admin.signupModeration.headers.state'),
        cell: SignupRequestStateCell,
        size: 60,
      }),
      columnHelper.accessor('created_at', {
        id: 'created_at',
        header: t('admin.signupModeration.headers.created_at'),
        cell: TimestampCell,
        size: 60,
      }),
      columnHelper.accessor((signupRequest) => signupRequest, {
        id: 'signup_ranked_choice',
        header: t('admin.signupModeration.headers.signup_ranked_choice'),
        cell: SignupRankedChoiceCell,
        size: 60,
      }),
      columnHelper.display({
        id: 'actions',
        header: t('admin.signupModeration.headers.actions'),
        size: 100,
        cell: SignupRequestActionsCell,
      }),
    ];
  }, [t]);

  const { table: tableInstance, loading } = useReactTableWithTheWorks({
    query: SignupModerationQueueQueryDocument,
    storageKeyPrefix: 'signupModerationQueue',
    getData: (result) => result.data.convention.signup_requests_paginated.entries,
    getPages: (result) => result.data.convention.signup_requests_paginated.total_pages,
    columns,
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
          action: () =>
            fetcher.submit(null, {
              action: `/signup_moderation/signup_requests/${signupRequest.id}/accept`,
              method: 'PATCH',
            }),
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
          action: () =>
            fetcher.submit(null, {
              action: `/signup_moderation/signup_requests/${signupRequest.id}/reject`,
              method: 'PATCH',
            }),
          renderError: (acceptError) => <ErrorDisplay graphQLError={acceptError} />,
        }),
      rerunSignupRound: async (id: string) => {
        await fetcher.submit(null, {
          action: `/signup_moderation/signup_rounds/${id}/rerun`,
          method: 'PATCH',
        });
      },
    }),
    [confirm, t, parsedSignupRounds, fetcher],
  );

  return (
    <SignupModerationContext.Provider value={contextValue}>
      <ErrorDisplay graphQLError={error as ApolloError} />
      <ReactTableWithTheWorks table={tableInstance} loading={loading} />
    </SignupModerationContext.Provider>
  );
}

export default SignupModerationQueue;
