import { useMemo } from 'react';
import { Column } from 'react-table';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import useReactTableWithTheWorks, { QueryDataContext } from '../../Tables/useReactTableWithTheWorks';
import UserConProfileWithGravatarCell from '../../Tables/UserConProfileWithGravatarCell';
import FreeTextFilter from '../../Tables/FreeTextFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../../Tables/FilterUtils';
import TimestampCell from '../../Tables/TimestampCell';
import SignupChangeActionFilter from '../../Tables/SignupChangeActionFilter';
import SignupChangeCell from '../../Tables/SignupChangeCell';
import BucketChangeCell from '../../Tables/BucketChangeCell';
import TableHeader from '../../Tables/TableHeader';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import SignupChangesTableExportButton from '../../Tables/SignupChangesTableExportButton';
import { RunSignupChangesQueryData, useRunSignupChangesQuery } from './queries.generated';
import ReactTableWithTheWorks from '../../Tables/ReactTableWithTheWorks';

const FILTER_CODECS = buildFieldFilterCodecs({
  action: FilterCodecs.stringArray,
});

type SignupChangeType = RunSignupChangesQueryData['convention']['run']['signup_changes_paginated']['entries'][0];

const getPossibleColumns: (t: TFunction) => Column<SignupChangeType>[] = (t) => [
  {
    Header: <>{t('events.signupAdmin.history.nameHeader', 'Name')}</>,
    id: 'name',
    accessor: (signupChange: SignupChangeType) => signupChange.user_con_profile,
    disableFilters: false,
    Cell: UserConProfileWithGravatarCell,
    Filter: FreeTextFilter,
  },
  {
    Header: <>{t('events.signupAdmin.history.changeHeader', 'Change')}</>,
    id: 'action',
    accessor: (signupChange: SignupChangeType) => signupChange,
    disableFilters: false,
    Cell: ({ value }: { value: SignupChangeType }) => <SignupChangeCell value={value} />,
    Filter: SignupChangeActionFilter,
  },
  {
    Header: <>{t('events.signupAdmin.history.bucketHeader', 'Bucket')}</>,
    id: 'bucket_change',
    accessor: (signupChange: SignupChangeType) => signupChange,
    Cell: ({ value }: { value: SignupChangeType }) => <BucketChangeCell value={value} />,
  },
  {
    Header: <>{t('events.signupAdmin.history.timestampHeader', 'Timestamp')}</>,
    id: 'created_at',
    accessor: 'created_at',
    width: 130,
    Cell: ({ value }: { value: string }) => <TimestampCell value={value} />,
  },
];

export type RunSignupChangesTableProps = {
  runId: string;
};

const defaultVisibleColumns = ['name', 'action', 'bucket_change', 'created_at'];

function RunSignupChangesTable({ runId }: RunSignupChangesTableProps): JSX.Element {
  const { t } = useTranslation();
  const getPossibleColumnsFunc = useMemo(() => () => getPossibleColumns(t), [t]);
  const { tableInstance, loading, queryData, tableHeaderProps, columnSelectionProps } = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data }) => data.convention.run.signup_changes_paginated.entries,
    getPages: ({ data }) => data.convention.run.signup_changes_paginated.total_pages,
    getPossibleColumns: getPossibleColumnsFunc,
    useQuery: useRunSignupChangesQuery,
    storageKeyPrefix: 'signupSpy',
    variables: { runId },
  });

  usePageTitle(
    useValueUnless(
      () =>
        t('events.signupAdmin.historyPageTitle', 'Signup change history - {{ eventTitle }}', {
          eventTitle: queryData?.convention.run.event.title,
        }),
      !queryData,
    ),
  );

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <div className="mb-4">
        <TableHeader
          {...tableHeaderProps}
          exportButton={
            <SignupChangesTableExportButton
              exportUrl={`/csv_exports/run_signup_changes?run_id=${runId}`}
              filters={tableHeaderProps.filters}
              sortBy={tableHeaderProps.sortBy}
              visibleColumnIds={columnSelectionProps.visibleColumnIds}
            />
          }
        />
        <ReactTableWithTheWorks tableInstance={tableInstance} loading={loading} />
      </div>
    </QueryDataContext.Provider>
  );
}

export default RunSignupChangesTable;
