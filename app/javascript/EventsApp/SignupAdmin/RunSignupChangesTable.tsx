import React, { useMemo } from 'react';
import ReactTable from 'react-table';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import useReactTableWithTheWorks, {
  QueryDataContext,
} from '../../Tables/useReactTableWithTheWorks';
import { RunSignupChangesQuery } from './queries';
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
import {
  RunSignupChangesQueryQuery,
  RunSignupChangesQueryQueryVariables,
} from './queries.generated';

const FILTER_CODECS = buildFieldFilterCodecs({
  action: FilterCodecs.stringArray,
});

type SignupChangeType = RunSignupChangesQueryQuery['run']['signup_changes_paginated']['entries'][0];

const getPossibleColumns = (t: TFunction) => [
  {
    Header: t('events.signupAdmin.history.nameHeader', 'Name'),
    id: 'name',
    accessor: (signupChange: SignupChangeType) => signupChange.user_con_profile,
    sortable: false,
    filterable: true,
    Cell: UserConProfileWithGravatarCell,
    Filter: FreeTextFilter,
  },
  {
    Header: t('events.signupAdmin.history.changeHeader', 'Change'),
    id: 'action',
    accessor: (signupChange: SignupChangeType) => signupChange,
    sortable: false,
    filterable: true,
    Cell: SignupChangeCell,
    Filter: SignupChangeActionFilter,
  },
  {
    Header: t('events.signupAdmin.history.bucketHeader', 'Bucket'),
    id: 'bucket_change',
    accessor: (signupChange: SignupChangeType) => signupChange,
    sortable: false,
    filterable: false,
    Cell: BucketChangeCell,
  },
  {
    Header: t('events.signupAdmin.history.timestampHeader', 'Timestamp'),
    id: 'created_at',
    accessor: 'created_at',
    sortable: false,
    filterable: false,
    width: 130,
    Cell: ({ value }: { value: string }) => <TimestampCell value={value} />,
  },
];

export type RunSignupChangesTableProps = {
  runId: number;
};

function RunSignupChangesTable({ runId }: RunSignupChangesTableProps) {
  const { t } = useTranslation();
  const getPossibleColumnsFunc = useMemo(() => () => getPossibleColumns(t), [t]);
  const [
    reactTableProps,
    { queryData, tableHeaderProps, columnSelectionProps },
  ] = useReactTableWithTheWorks<
    RunSignupChangesQueryQuery,
    SignupChangeType,
    RunSignupChangesQueryQueryVariables
  >({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns: ['name', 'action', 'bucket_change', 'created_at'],
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data }) => data?.run.signup_changes_paginated.entries ?? [],
    getPages: ({ data }) => data?.run.signup_changes_paginated.total_pages ?? 0,
    getPossibleColumns: getPossibleColumnsFunc,
    query: RunSignupChangesQuery,
    storageKeyPrefix: 'signupSpy',
    variables: { runId },
  });

  usePageTitle(
    useValueUnless(
      () =>
        t('events.signupAdmin.historyPageTitle', 'Signup change history - {{ eventTitle }}', {
          eventTitle: queryData?.run.event.title,
        }),
      !queryData,
    ),
  );

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <ReactTable
        {...reactTableProps}
        className="-striped -highlight"
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      >
        {(state, makeTable) => (
          <div className="mb-4">
            <TableHeader
              {...tableHeaderProps}
              exportButton={
                <SignupChangesTableExportButton
                  exportUrl={`/csv_exports/run_signup_changes?run_id=${runId}`}
                  filtered={tableHeaderProps.filtered}
                  sorted={tableHeaderProps.sorted}
                  visibleColumnIds={columnSelectionProps.visibleColumnIds}
                />
              }
            />
            {makeTable()}
          </div>
        )}
      </ReactTable>
    </QueryDataContext.Provider>
  );
}

export default RunSignupChangesTable;
