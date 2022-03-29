import { useContext, useMemo } from 'react';
import { Column, FilterProps, CellProps } from 'react-table';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform';

import { ageAsOf } from '../../TimeUtils';
import ChoiceSetFilter from '../../Tables/ChoiceSetFilter';
import EmailCell from '../../Tables/EmailCell';
import { buildFieldFilterCodecs, FilterCodecs } from '../../Tables/FilterUtils';
import { formatBucket } from './SignupUtils';
import FreeTextFilter from '../../Tables/FreeTextFilter';
import SignupStateCell, { getSignupStateLabel } from '../../Tables/SignupStateCell';
import TableHeader from '../../Tables/TableHeader';
import ReactTableWithTheWorks from '../../Tables/ReactTableWithTheWorks';
import useReactTableWithTheWorks, { QueryDataContext } from '../../Tables/useReactTableWithTheWorks';
import usePageTitle from '../../usePageTitle';
import UserConProfileWithGravatarCell from '../../Tables/UserConProfileWithGravatarCell';
import {
  RunSignupsTableSignupsQueryData,
  RunSignupsTableSignupsQueryVariables,
  SignupAdminEventQueryData,
  SignupAdminEventQueryVariables,
  useRunSignupsTableSignupsQuery,
} from './queries.generated';
import { useSignupAdminEventQueryFromParams } from './useSignupAdminEventQueryFromParams';
import buildEventUrl from '../buildEventUrl';
import { SignupState } from '../../graphqlTypes.generated';
import EnumTypes from '../../enumTypes.json';
import AppRootContext from '../../AppRootContext';

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({
  state: FilterCodecs.stringArray,
  bucket: FilterCodecs.stringArray,
});

type SignupType = RunSignupsTableSignupsQueryData['convention']['event']['run']['signups_paginated']['entries'][0];

const SignupStateFilter = (props: FilterProps<SignupType>) => {
  const { t } = useTranslation();
  const { ticketName } = useContext(AppRootContext);
  const choices = useMemo(
    () =>
      EnumTypes.SignupState.enumValues.map((value) => ({
        value: value.name,
        label: getSignupStateLabel(value.name as SignupState, t, ticketName),
      })),
    [ticketName, t],
  );

  return <ChoiceSetFilter {...props} multiple choices={choices} />;
};

const AgeRestrictionsCheckCell = ({ value }: CellProps<SignupType, string>) => {
  const { t } = useTranslation();
  let badgeClass = 'bg-danger';
  let text = value;
  if (value === 'OK') {
    badgeClass = 'bg-success';
    text = t('tables.ageRestrictionsCheck.ok', 'OK');
  } else if (value === 'Unknown age') {
    badgeClass = 'bg-warning';
    text = t('tables.ageRestrictionsCheck.unknown', 'Unknown age');
  } else if (value === 'N/A') {
    badgeClass = 'bg-secondary';
    text = t('tables.ageRestrictionsCheck.notApplicable', 'N/A');
  }

  return <span className={`badge ${badgeClass}`}>{text}</span>;
};

const BucketCell = ({ row: { original } }: CellProps<SignupType>) => {
  const { t } = useTranslation();
  const data = useContext(QueryDataContext) as RunSignupsTableSignupsQueryData;
  return <>{formatBucket(original, data.convention.event, t)}</>;
};

const BucketFilter = (props: FilterProps<SignupType>) => {
  const data = useContext(QueryDataContext) as RunSignupsTableSignupsQueryData;
  const choices = useMemo(
    () =>
      data?.convention.event
        ? (data.convention.event.registration_policy?.buckets ?? []).map((bucket) => ({
            label: bucket.name ?? bucket.key,
            value: bucket.key,
          }))
        : [],
    [data],
  );

  return <ChoiceSetFilter {...props} multiple choices={choices} />;
};

function getPossibleColumns(t: TFunction): Column<SignupType>[] {
  return [
    {
      Header: <>{t('events.signupAdmin.sequenceHeader', 'Seq')}</>,
      id: 'id',
      accessor: 'id',
      disableSortBy: false,
      width: 65,
    },
    {
      Header: <>{t('events.signupAdmin.stateHeader', 'State')}</>,
      id: 'state',
      accessor: 'state',
      width: 130,
      disableFilters: false,
      disableSortBy: false,
      Filter: SignupStateFilter,
      Cell: SignupStateCell,
    },
    {
      Header: <>{t('events.signupAdmin.nameHeader', 'Name')}</>,
      id: 'name',
      accessor: (signup: SignupType) => signup.user_con_profile,
      disableFilters: false,
      disableSortBy: false,
      Filter: FreeTextFilter,
      Cell: UserConProfileWithGravatarCell,
    },
    {
      Header: <>{t('events.signupAdmin.bucketHeader', 'Bucket')}</>,
      id: 'bucket',
      accessor: (signup: SignupType) => signup.bucket_key,
      Cell: BucketCell,
      disableFilters: false,
      disableSortBy: false,
      Filter: BucketFilter,
    },
    {
      Header: <>{t('events.signupAdmin.ageCheckHeader', 'Age check')}</>,
      id: 'age_restrictions_check',
      accessor: 'age_restrictions_check',
      width: 100,
      disableSortBy: false,
      Cell: AgeRestrictionsCheckCell,
    },
    {
      Header: <>{t('events.signupAdmin.ageTableHeader', 'Age')}</>,
      id: 'age',
      width: 40,
      accessor: (signup: SignupType) =>
        ageAsOf(
          signup.user_con_profile.birth_date ? DateTime.fromISO(signup.user_con_profile.birth_date) : undefined,
          DateTime.fromISO(signup.run.starts_at),
        ),
      disableSortBy: false,
    },
    {
      Header: <>{t('events.signupAdmin.emailTableHeader', 'Email')}</>,
      id: 'email',
      accessor: (signup: SignupType) => signup.user_con_profile.email,
      Cell: EmailCell,
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
  ];
}

export type RunSignupsTableProps = {
  defaultVisibleColumns: string[];
};

export default LoadQueryWrapper<SignupAdminEventQueryData, SignupAdminEventQueryVariables, RunSignupsTableProps>(
  useSignupAdminEventQueryFromParams,
  function RunSignupsTable({ data, defaultVisibleColumns }): JSX.Element {
    const { runId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const getPossibleColumnsFunc = useMemo(() => () => getPossibleColumns(t), [t]);

    const {
      tableInstance,
      loading: tableLoading,
      tableHeaderProps,
      queryData,
    } = useReactTableWithTheWorks<
      RunSignupsTableSignupsQueryData,
      RunSignupsTableSignupsQueryData['convention']['event']['run']['signups_paginated']['entries'][number],
      RunSignupsTableSignupsQueryVariables
    >({
      decodeFilterValue,
      defaultVisibleColumns,
      encodeFilterValue,
      getData: ({ data: tableData }) => tableData.convention.event.run.signups_paginated.entries,
      getPages: ({ data: tableData }) => tableData.convention.event.run.signups_paginated.total_pages,
      getPossibleColumns: getPossibleColumnsFunc,
      useQuery: useRunSignupsTableSignupsQuery,
      storageKeyPrefix: 'adminSignups',
      variables: { eventId: data.convention.event.id, runId: runId ?? '' },
    });

    usePageTitle(
      t('events.signupAdmin.indexPageTitle', 'Signups - {{ eventTitle }}', {
        eventTitle: data?.convention.event.title,
      }),
    );

    return (
      <QueryDataContext.Provider value={queryData ?? {}}>
        <div className="mb-4">
          <TableHeader {...tableHeaderProps} exportUrl={`/csv_exports/run_signups?run_id=${runId}`} />
          <ReactTableWithTheWorks
            tableInstance={tableInstance}
            loading={tableLoading}
            onClickRow={(row) =>
              navigate(`${buildEventUrl(data.convention.event)}/runs/${runId}/admin_signups/${row.original.id}/edit`)
            }
          />
        </div>
      </QueryDataContext.Provider>
    );
  },
);
