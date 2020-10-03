import React, { useContext, useMemo } from 'react';
import moment from 'moment-timezone';
import ReactTable, { Filter, RowInfo } from 'react-table';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { ageAsOf } from '../../TimeUtils';
import ChoiceSetFilter from '../../Tables/ChoiceSetFilter';
import EmailCell from '../../Tables/EmailCell';
import { buildFieldFilterCodecs, FilterCodecs } from '../../Tables/FilterUtils';
import { formatBucket } from './SignupUtils';
import FreeTextFilter from '../../Tables/FreeTextFilter';
import { RunSignupsTableSignupsQuery } from './queries';
import SignupStateCell from '../../Tables/SignupStateCell';
import TableHeader from '../../Tables/TableHeader';
import useReactTableWithTheWorks, {
  QueryDataContext,
} from '../../Tables/useReactTableWithTheWorks';
import ErrorDisplay from '../../ErrorDisplay';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import UserConProfileWithGravatarCell from '../../Tables/UserConProfileWithGravatarCell';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import {
  RunSignupsTableSignupsQueryQuery,
  RunSignupsTableSignupsQueryQueryVariables,
  useSignupAdminEventQueryQuery,
} from './queries.generated';

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({
  state: FilterCodecs.stringArray,
  bucket: FilterCodecs.stringArray,
});

type SignupType = RunSignupsTableSignupsQueryQuery['event']['run']['signups_paginated']['entries'][0];

type SignupStateFilterProps = {
  filter?: Filter;
  onChange: (value: string[]) => void;
};

const SignupStateFilter = ({ filter, onChange }: SignupStateFilterProps) => {
  const { t } = useTranslation();
  return (
    <ChoiceSetFilter
      multiple
      choices={[
        { value: 'confirmed', label: t('signups.states.confirmed', 'Confirmed') },
        { value: 'waitlisted', label: t('signups.states.waitlisted', 'Waitlisted') },
        { value: 'withdrawn', label: t('signups.states.withdrawn', 'Withdrawn') },
      ]}
      onChange={onChange}
      filter={filter}
    />
  );
};

type AgeRestrictionsCheckCellProps = {
  value: string;
};

const AgeRestrictionsCheckCell = ({ value }: AgeRestrictionsCheckCellProps) => {
  const { t } = useTranslation();
  let badgeClass = 'badge-danger';
  let text = value;
  if (value === 'OK') {
    badgeClass = 'badge-success';
    text = t('tables.ageRestrictionsCheck.ok', 'OK');
  } else if (value === 'Unknown age') {
    badgeClass = 'badge-warning';
    text = t('tables.ageRestrictionsCheck.unknown', 'Unknown age');
  } else if (value === 'N/A') {
    badgeClass = 'badge-light';
    text = t('tables.ageRestrictionsCheck.notApplicable', 'N/A');
  }

  return <span className={`badge ${badgeClass}`}>{text}</span>;
};

type BucketCellProps = {
  original: SignupType;
};

const BucketCell = ({ original }: BucketCellProps) => {
  const { t } = useTranslation();
  const data = useContext(QueryDataContext) as RunSignupsTableSignupsQueryQuery;
  return <>{formatBucket(original, data.event, t)}</>;
};

type BucketFilterProps = {
  filter?: Filter;
  onChange: (value: string[]) => void;
};

const BucketFilter = ({ filter, onChange }: BucketFilterProps) => {
  const data = useContext(QueryDataContext) as RunSignupsTableSignupsQueryQuery;
  const choices = useMemo(
    () =>
      data?.event
        ? (data.event.registration_policy?.buckets ?? []).map((bucket) => ({
            label: bucket.name ?? bucket.key,
            value: bucket.key,
          }))
        : [],
    [data],
  );

  return <ChoiceSetFilter multiple choices={choices} onChange={onChange} filter={filter} />;
};

const getPossibleColumns = (t: TFunction) => [
  {
    Header: t('events.signupAdmin.sequenceHeader', 'Seq'),
    id: 'id',
    accessor: 'id',
    filterable: false,
    width: 65,
  },
  {
    Header: t('events.signupAdmin.stateHeader', 'State'),
    id: 'state',
    accessor: 'state',
    width: 130,
    Filter: SignupStateFilter,
    Cell: SignupStateCell,
  },
  {
    Header: t('events.signupAdmin.nameHeader', 'Name'),
    id: 'name',
    accessor: (signup: SignupType) => signup.user_con_profile,
    Filter: FreeTextFilter,
    Cell: UserConProfileWithGravatarCell,
  },
  {
    Header: t('events.signupAdmin.bucketHeader', 'Bucket'),
    id: 'bucket',
    accessor: (signup: SignupType) => signup.bucket_key,
    Cell: (props: BucketCellProps) => <BucketCell {...props} />,
    Filter: BucketFilter,
  },
  {
    Header: t('events.signupAdmin.ageCheckHeader', 'Age check'),
    id: 'age_restrictions_check',
    accessor: 'age_restrictions_check',
    width: 100,
    filterable: false,
    Cell: AgeRestrictionsCheckCell,
  },
  {
    Header: t('events.signupAdmin.ageHeader', 'Age'),
    id: 'age',
    width: 40,
    accessor: (signup: SignupType) =>
      ageAsOf(
        signup.user_con_profile.birth_date ? moment(signup.user_con_profile.birth_date) : undefined,
        moment(signup.run.starts_at),
      ),
    filterable: false,
  },
  {
    Header: t('events.signupAdmin.emailHeader', 'Email'),
    id: 'email',
    accessor: (signup: SignupType) => signup.user_con_profile.email,
    Cell: EmailCell,
    Filter: FreeTextFilter,
  },
];

export type RunSignupsTableProps = {
  defaultVisibleColumns: string[];
  eventId: number;
  runId: number;
  runPath: string;
};

function RunSignupsTable({ defaultVisibleColumns, eventId, runId, runPath }: RunSignupsTableProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const { data, loading, error } = useSignupAdminEventQueryQuery({ variables: { eventId } });
  const getPossibleColumnsFunc = useMemo(() => () => getPossibleColumns(t), [t]);

  const [reactTableProps, { tableHeaderProps, queryData }] = useReactTableWithTheWorks<
    RunSignupsTableSignupsQueryQuery,
    SignupType,
    RunSignupsTableSignupsQueryQueryVariables
  >({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data: tableData }) => tableData?.event.run.signups_paginated.entries ?? [],
    getPages: ({ data: tableData }) => tableData?.event.run.signups_paginated.total_pages ?? 0,
    getPossibleColumns: getPossibleColumnsFunc,
    query: RunSignupsTableSignupsQuery,
    storageKeyPrefix: 'adminSignups',
    variables: { eventId, runId },
  });

  usePageTitle(
    useValueUnless(
      () =>
        t('events.signupAdmin.indexPageTitle', 'Signups - {{ eventTitle }}', {
          eventTitle: data?.event.title,
        }),
      error || loading,
    ),
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <div className="mb-4">
        <TableHeader {...tableHeaderProps} exportUrl={`/csv_exports/run_signups?run_id=${runId}`} />
        <ReactTable
          {...reactTableProps}
          className="-striped -highlight"
          getTrProps={(state: any, rowInfo: RowInfo) => ({
            style: { cursor: 'pointer' },
            onClick: () => {
              history.push(`${runPath}/admin_signups/${rowInfo.original.id}/edit`);
            },
          })}
          getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
        />
      </div>
    </QueryDataContext.Provider>
  );
}

export default RunSignupsTable;
