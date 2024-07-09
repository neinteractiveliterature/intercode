import { LoadQueryWrapper } from '@neinteractiveliterature/litform';
import {
  SignupRoundRankedChoiceDecisionsTableQueryData,
  useSignupRoundRankedChoiceDecisionsTableQuery,
  useSignupRoundsAdminQuery,
} from './queries.generated';
import { useContext, useMemo } from 'react';
import { useParams } from 'react-router';
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
import { Column, FilterProps } from 'react-table';
import usePageTitle from '../usePageTitle';
import { SingleLineTimestampCell } from '../Tables/TimestampCell';
import FreeTextFilter from '../Tables/FreeTextFilter';
import EnumTypes from '../enumTypes.json';
import { RankedChoiceDecisionReason, RankedChoiceDecisionValue } from '../graphqlTypes.generated';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import { TFunction } from 'i18next';
import assertNever from 'assert-never';
import { FilterCodecs, buildFieldFilterCodecs } from '../Tables/FilterUtils';

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

function RankedChoiceDecisionFilter<RowType extends Record<string, unknown>>(props: FilterProps<RowType>): JSX.Element {
  const { t } = useTranslation();
  const choices = useMemo(
    () => DECISIONS.map((decision) => ({ value: decision, label: describeDecision(decision, t) })),
    [t],
  );

  return <ChoiceSetFilter {...props} choices={choices} multiple />;
}
export type RankedChoiceDecisionCellProps = {
  value: RankedChoiceDecisionValue;
};

export function RankedChoiceDecisionCell({ value }: RankedChoiceDecisionCellProps): JSX.Element {
  const { t } = useTranslation();
  return <>{describeDecision(value, t)}</>;
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

function RankedChoiceDecisionReasonFilter<RowType extends Record<string, unknown>>(
  props: FilterProps<RowType>,
): JSX.Element {
  const { t } = useTranslation();
  const { ticketName } = useContext(AppRootContext);
  const choices = useMemo(
    () => REASONS.map((reason) => ({ value: reason, label: describeReason(reason, ticketName ?? 'ticket', t) })),
    [t, ticketName],
  );

  return <ChoiceSetFilter {...props} choices={choices} multiple />;
}
export type RankedChoiceReasonCellProps = {
  value: RankedChoiceDecisionReason | null | undefined;
};

export function RankedChoiceReasonCell({ value }: RankedChoiceReasonCellProps): JSX.Element {
  const { t } = useTranslation();
  const { ticketName } = useContext(AppRootContext);

  if (value == null) {
    return <></>;
  }

  return <>{describeReason(value, ticketName ?? 'ticket', t)}</>;
}

const FILTER_CODECS = buildFieldFilterCodecs({
  decision: FilterCodecs.stringArray,
  reason: FilterCodecs.integerArray,
});

function getPossibleColumns(): Column<
  SignupRoundRankedChoiceDecisionsTableQueryData['convention']['signup_round']['ranked_choice_decisions_paginated']['entries'][number]
>[] {
  return [
    {
      Header: 'Attendee',
      id: 'user_con_profile_name',
      accessor: (row) => row.user_con_profile?.name_without_nickname,
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Event',
      id: 'event_title',
      Filter: FreeTextFilter,
      accessor: (row) => row.signup_ranked_choice?.target_run.event.title,
    },
    {
      Header: 'Decision',
      id: 'decision',
      accessor: 'decision',
      Cell: RankedChoiceDecisionCell,
      Filter: RankedChoiceDecisionFilter,
      width: 100,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Reason',
      id: 'reason',
      accessor: 'reason',
      Cell: RankedChoiceReasonCell,
      Filter: RankedChoiceDecisionReasonFilter,
      width: 100,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Timestamp',
      id: 'created_at',
      accessor: 'created_at',
      Cell: SingleLineTimestampCell,
      disableSortBy: false,
    },
  ];
}

const alwaysVisibleColumns = ['user_con_profile_name', 'event_title', 'decision', 'reason'];

type RankedChoiceSignupDecisionsTableProps = {
  signupRoundId: string;
};

function RankedChoiceSignupDecisionsTable({ signupRoundId }: RankedChoiceSignupDecisionsTableProps) {
  const { t } = useTranslation();

  const { queryData, tableHeaderProps, tableInstance, loading } = useReactTableWithTheWorks({
    alwaysVisibleColumns,
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultState: {
      filters: [{ id: 'decision', value: [RankedChoiceDecisionValue.Signup, RankedChoiceDecisionValue.Waitlist] }],
      sortBy: [{ id: 'created_at', desc: false }],
    },
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: (queryData) => queryData.data.convention.signup_round.ranked_choice_decisions_paginated.entries,
    getPages: (queryData) => queryData.data.convention.signup_round.ranked_choice_decisions_paginated.total_pages,
    getPossibleColumns,
    storageKeyPrefix: `rankedChoiceSignupDecisions-${signupRoundId}`,
    useQuery: useSignupRoundRankedChoiceDecisionsTableQuery,
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

        <ReactTableWithTheWorks tableInstance={tableInstance} loading={loading} />
      </div>
    </QueryDataContext.Provider>
  );
}

const RankedChoiceSignupDecisionsPage = LoadQueryWrapper(useSignupRoundsAdminQuery, ({ data }) => {
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
});

export default RankedChoiceSignupDecisionsPage;
