import {
  SignupRoundRankedChoiceDecisionsTableQueryData,
  SignupRoundRankedChoiceDecisionsTableQueryDocument,
  SignupRoundsAdminQueryData,
  SignupRoundsAdminQueryDocument,
} from './queries.generated';
import { useContext, useMemo } from 'react';
import { LoaderFunction, useLoaderData, useParams } from 'react-router';
import { describeSignupRound } from './describeSignupRound';
import { parseSignupRounds } from '../SignupRoundUtils';
import { useTranslation } from 'react-i18next';
import { describeTimespan } from '../TimespanUtils';
import AppRootContext from '../AppRootContext';
import { DateTime } from 'luxon';
import { useAppDateTimeFormat } from '../TimeUtils';
import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import TableHeader from '../Tables/TableHeader';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { CellContext, Column, createColumnHelper } from '@tanstack/react-table';
import usePageTitle from '../usePageTitle';
import { SingleLineTimestampCell } from '../Tables/TimestampCell';
import FreeTextFilter from '../Tables/FreeTextFilter';
import EnumTypes from '../enumTypes.json';
import { RankedChoiceDecisionReason, RankedChoiceDecisionValue } from '../graphqlTypes.generated';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import { TFunction } from 'i18next';
import assertNever from 'assert-never';
import { FilterCodecs, buildFieldFilterCodecs } from '../Tables/FilterUtils';
import { client } from '../useIntercodeApolloClient';

export function describeDecision(decision: RankedChoiceDecisionValue, t: TFunction): string {
  if (decision === RankedChoiceDecisionValue.Signup) {
    return t('tables.rankedChoiceDecision.decisions.signup');
  }

  if (decision === RankedChoiceDecisionValue.SkipChoice) {
    return t('tables.rankedChoiceDecision.decisions.skipChoice');
  }

  if (decision === RankedChoiceDecisionValue.SkipUser) {
    return t('tables.rankedChoiceDecision.decisions.skipUser');
  }

  if (decision === RankedChoiceDecisionValue.Waitlist) {
    return t('tables.rankedChoiceDecision.decisions.waitlist');
  }

  assertNever(decision, true);
  return decision;
}

const DECISIONS = EnumTypes.RankedChoiceDecisionValue.enumValues.map(
  (value) => value.name as RankedChoiceDecisionValue,
);

function RankedChoiceDecisionFilter<TData, TValue>({ column }: { column: Column<TData, TValue> }): JSX.Element {
  const { t } = useTranslation();
  const choices = useMemo(
    () => DECISIONS.map((decision) => ({ value: decision, label: describeDecision(decision, t) })),
    [t],
  );

  return <ChoiceSetFilter column={column} choices={choices} multiple />;
}
export type RankedChoiceDecisionCellProps = {
  value: RankedChoiceDecisionValue;
};

export function RankedChoiceDecisionCell<TData, TValue extends RankedChoiceDecisionValue>({
  getValue,
}: CellContext<TData, TValue>): JSX.Element {
  const { t } = useTranslation();
  return <>{describeDecision(getValue(), t)}</>;
}

export function describeReason(reason: RankedChoiceDecisionReason, ticketName: string, t: TFunction): string {
  if (reason === RankedChoiceDecisionReason.Conflict) {
    return t('tables.rankedChoiceDecision.decisions.conflict');
  }

  if (reason === RankedChoiceDecisionReason.Full) {
    return t('tables.rankedChoiceDecision.decisions.full');
  }

  if (reason === RankedChoiceDecisionReason.MissingTicket) {
    return t('tables.rankedChoiceDecision.decisions.missingTicket', { ticketName });
  }

  if (reason === RankedChoiceDecisionReason.NoMoreSignupsAllowed) {
    return t('tables.rankedChoiceDecision.decisions.noMoreSignupsAllowed');
  }

  if (reason === RankedChoiceDecisionReason.NoPendingChoices) {
    return t('tables.rankedChoiceDecision.decisions.noPendingChoices');
  }

  if (reason === RankedChoiceDecisionReason.RankedChoiceUserConstraints) {
    return t('tables.rankedChoiceDecision.decisions.noPendingChoices');
  }

  assertNever(reason, true);
  return reason;
}

const REASONS = EnumTypes.RankedChoiceDecisionReason.enumValues.map(
  (value) => value.name as RankedChoiceDecisionReason,
);

function RankedChoiceDecisionReasonFilter<TData, TValue>({ column }: { column: Column<TData, TValue> }): JSX.Element {
  const { t } = useTranslation();
  const { ticketName } = useContext(AppRootContext);
  const choices = useMemo(
    () => REASONS.map((reason) => ({ value: reason, label: describeReason(reason, ticketName ?? 'ticket', t) })),
    [t, ticketName],
  );

  return <ChoiceSetFilter column={column} choices={choices} multiple />;
}
export type RankedChoiceReasonCellProps = {
  value: RankedChoiceDecisionReason | null | undefined;
};

export function RankedChoiceReasonCell<TData, TValue extends RankedChoiceDecisionReason>({
  getValue,
}: CellContext<TData, TValue>): JSX.Element {
  const { t } = useTranslation();
  const { ticketName } = useContext(AppRootContext);
  const value = getValue();

  if (value == null) {
    return <></>;
  }

  return <>{describeReason(value, ticketName ?? 'ticket', t)}</>;
}

const FILTER_CODECS = buildFieldFilterCodecs({
  decision: FilterCodecs.stringArray,
  reason: FilterCodecs.integerArray,
});

// eslint-disable-next-line i18next/no-literal-string
const alwaysVisibleColumns = ['user_con_profile_name', 'event_title', 'decision', 'reason'];

type RankedChoiceSignupDecisionsTableProps = {
  signupRoundId: string;
};

function RankedChoiceSignupDecisionsTable({ signupRoundId }: RankedChoiceSignupDecisionsTableProps) {
  const { t } = useTranslation();

  const columns = useMemo(() => {
    const columnHelper =
      createColumnHelper<
        SignupRoundRankedChoiceDecisionsTableQueryData['convention']['signup_round']['ranked_choice_decisions_paginated']['entries'][number]
      >();

    return [
      columnHelper.accessor('user_con_profile.name_without_nickname', {
        header: 'Attendee',
        id: 'user_con_profile_name',
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('signup_ranked_choice.target_run.event.title', {
        header: 'Event',
        id: 'event_title',
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('decision', {
        header: 'Decision',
        id: 'decision',
        cell: RankedChoiceDecisionCell,
        size: 100,
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('reason', {
        header: 'Reason',
        id: 'reason',
        cell: RankedChoiceReasonCell,
        size: 100,
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('created_at', {
        header: 'Timestamp',
        id: 'created_at',
        cell: SingleLineTimestampCell,
        enableSorting: true,
      }),
    ];
  }, []);

  const {
    queryData,
    tableHeaderProps,
    table: tableInstance,
    loading,
  } = useReactTableWithTheWorks({
    alwaysVisibleColumns,
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultState: {
      filters: [{ id: 'decision', value: [RankedChoiceDecisionValue.Signup, RankedChoiceDecisionValue.Waitlist] }],
      sortBy: [{ id: 'created_at', desc: false }],
    },
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: (queryData) => queryData.data.convention.signup_round.ranked_choice_decisions_paginated.entries,
    getPages: (queryData) => queryData.data.convention.signup_round.ranked_choice_decisions_paginated.total_pages,
    columns,
    storageKeyPrefix: `rankedChoiceSignupDecisions-${signupRoundId}`,
    query: SignupRoundRankedChoiceDecisionsTableQueryDocument,
    variables: { signupRoundId },
  });

  usePageTitle(t('signups.signupRounds.results'));

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <div className="mb-4">
        <TableHeader
          {...tableHeaderProps}
          exportUrl={`/csv_exports/ranked_choice_decisions?signup_round_id=${encodeURIComponent(signupRoundId)}`}
        />

        <ReactTableWithTheWorks
          table={tableInstance}
          loading={loading}
          renderFilter={({ column }) => {
            if (column.id === 'user_con_profile_name' || column.id === 'event_title') {
              return <FreeTextFilter column={column} />;
            } else if (column.id === 'decision') {
              return <RankedChoiceDecisionFilter column={column} />;
            } else if (column.id === 'reason') {
              return <RankedChoiceDecisionReasonFilter column={column} />;
            }
          }}
        />
      </div>
    </QueryDataContext.Provider>
  );
}

export async function loader() {
  const { data } = await client.query<SignupRoundsAdminQueryData>({ query: SignupRoundsAdminQueryDocument });
  return data;
}

function RankedChoiceSignupDecisionsPage() {
  const data = useLoaderData() as SignupRoundsAdminQueryData;
  const { id } = useParams();
  const { timezoneName } = useContext(AppRootContext);
  const { t } = useTranslation();
  const format = useAppDateTimeFormat();

  const rounds = useMemo(() => parseSignupRounds(data.convention.signup_rounds), [data.convention.signup_rounds]);
  const roundIndex = useMemo(() => rounds.findIndex((round) => round.id === id), [rounds, id]);
  const round = rounds[roundIndex];
  const roundDescription = useMemo(() => describeSignupRound(rounds, roundIndex, t), [rounds, roundIndex, t]);

  return (
    <>
      <h1>
        {roundDescription}:{' '}
        <small className="text-secondary">{describeTimespan(round.timespan, t, 'shortDateTime', timezoneName)}</small>
      </h1>
      {round.executed_at && (
        <p>
          {t('signupRounds.executedAt', {
            executedAt: format(DateTime.fromISO(round.executed_at), 'longWeekdayDateTimeWithZone'),
          })}
        </p>
      )}
      <RankedChoiceSignupDecisionsTable signupRoundId={id ?? ''} />
    </>
  );
}

export default RankedChoiceSignupDecisionsPage;
