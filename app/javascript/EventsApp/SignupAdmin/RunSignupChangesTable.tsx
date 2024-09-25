import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import useReactTableWithTheWorks, { QueryDataContext } from '../../Tables/useReactTableWithTheWorks';
import UserConProfileWithGravatarCell from '../../Tables/UserConProfileWithGravatarCell';
import FreeTextFilter from '../../Tables/FreeTextFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../../Tables/FilterUtils';
import TimestampCell from '../../Tables/TimestampCell';
import SignupChangeActionFilter from '../../Tables/SignupChangeActionFilter';
import SignupChangeCell from '../../Tables/SignupChangeCell';
import BucketChangeCell, { BucketChangeType } from '../../Tables/BucketChangeCell';
import TableHeader from '../../Tables/TableHeader';
import usePageTitle from '../../usePageTitle';
import useValueUnless from '../../useValueUnless';
import SignupChangesTableExportButton from '../../Tables/SignupChangesTableExportButton';
import {
  RunSignupChangesPageQueryDocument,
  RunSignupChangesQueryData,
  RunSignupChangesQueryDocument,
} from './queries.generated';
import ReactTableWithTheWorks from '../../Tables/ReactTableWithTheWorks';
import { useParams } from 'react-router';
import { useSuspenseQuery } from '@apollo/client';

const FILTER_CODECS = buildFieldFilterCodecs({
  action: FilterCodecs.stringArray,
});

export type SignupChangeType = RunSignupChangesQueryData['convention']['run']['signup_changes_paginated']['entries'][0];

const defaultVisibleColumns = ['name', 'action', 'bucket_change', 'created_at'];

function RunSignupChangesTable(): JSX.Element {
  const { t } = useTranslation();
  const { runId } = useParams();

  const pageData = useSuspenseQuery(RunSignupChangesPageQueryDocument, { variables: { runId: runId ?? '' } });

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<SignupChangeType>();
    return [
      columnHelper.accessor('user_con_profile', {
        header: t('events.signupAdmin.history.nameHeader'),
        id: 'name',
        enableColumnFilter: true,
        cell: UserConProfileWithGravatarCell,
      }),
      columnHelper.display({
        header: t('events.signupAdmin.history.changeHeader'),
        id: 'action',
        enableColumnFilter: true,
        cell: SignupChangeCell,
      }),
      columnHelper.accessor(
        (row) => ({ signupChange: row, event: pageData.data.convention.run.event }) satisfies BucketChangeType,
        {
          header: t('events.signupAdmin.history.bucketHeader'),
          id: 'bucket_change',
          cell: BucketChangeCell,
        },
      ),
      columnHelper.accessor('created_at', {
        header: t('events.signupAdmin.history.timestampHeader'),
        id: 'created_at',
        size: 130,
        cell: TimestampCell,
      }),
    ];
  }, [t]);

  const {
    table: tableInstance,
    loading,
    queryData,
    tableHeaderProps,
    columnSelectionProps,
  } = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data }) => data.convention.run.signup_changes_paginated.entries,
    getPages: ({ data }) => data.convention.run.signup_changes_paginated.total_pages,
    columns,
    query: RunSignupChangesQueryDocument,
    storageKeyPrefix: 'signupSpy',
    variables: { runId: runId ?? '' },
  });

  usePageTitle(
    useValueUnless(
      () =>
        t('events.signupAdmin.historyPageTitle', {
          eventTitle: pageData.data.convention.run.event.title,
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
              columnVisibility={columnSelectionProps.columnVisibility}
            />
          }
        />
        <ReactTableWithTheWorks
          table={tableInstance}
          loading={loading}
          renderFilter={({ column }) => {
            if (column.id === 'name') {
              return <FreeTextFilter column={column} />;
            } else if (column.id === 'action') {
              return <SignupChangeActionFilter column={column} />;
            }
          }}
        />
      </div>
    </QueryDataContext.Provider>
  );
}

export default RunSignupChangesTable;
