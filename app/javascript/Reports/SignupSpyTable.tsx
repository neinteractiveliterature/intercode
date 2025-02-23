import { createColumnHelper } from '@tanstack/react-table';

import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import RefreshButton from '../EventsApp/ScheduleGrid/RefreshButton';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import FreeTextFilter from '../Tables/FreeTextFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import TimestampCell from '../Tables/TimestampCell';
import SignupChangeActionFilter from '../Tables/SignupChangeActionFilter';
import SignupChoiceCell from '../Tables/SignupChoiceCell';
import SignupChangeCell from '../Tables/SignupChangeCell';
import BucketChangeCell from '../Tables/BucketChangeCell';
import TableHeader from '../Tables/TableHeader';
import SignupChangesTableExportButton from '../Tables/SignupChangesTableExportButton';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { SignupSpySignupChangesQueryData, SignupSpySignupChangesQueryDocument } from './queries.generated';
import { useMemo } from 'react';

type SignupChangeType = SignupSpySignupChangesQueryData['convention']['signup_changes_paginated']['entries'][0];

const FILTER_CODECS = buildFieldFilterCodecs({
  action: FilterCodecs.stringArray,
});

// eslint-disable-next-line i18next/no-literal-string
const defaultVisibleColumns = ['name', 'event_title', 'action', 'bucket_change', 'created_at', 'choice'];

const defaultState = {
  sortBy: [{ id: 'created_at', desc: true }],
};

function SignupSpyTable(): JSX.Element {
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<SignupChangeType>();
    return [
      columnHelper.accessor('user_con_profile', {
        header: 'Name',
        id: 'name',
        cell: UserConProfileWithGravatarCell,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('run.event.title', {
        header: 'Event',
        id: 'event_title',
        enableColumnFilter: true,
      }),
      columnHelper.accessor((signupChange) => signupChange, {
        header: 'Change',
        id: 'action',
        cell: SignupChangeCell,
        enableColumnFilter: true,
      }),
      columnHelper.accessor((signupChange) => ({ signupChange, event: signupChange.run.event }), {
        header: 'Bucket',
        id: 'bucket_change',
        cell: BucketChangeCell,
      }),
      columnHelper.accessor('created_at', {
        header: 'Timestamp',
        id: 'created_at',
        size: 130,
        cell: TimestampCell,
        enableSorting: true,
      }),
      columnHelper.accessor('signup.choice', {
        header: 'Choice',
        id: 'choice',
        size: 100,
        cell: SignupChoiceCell,
      }),
    ];
  }, []);

  const {
    columnSelectionProps,
    refetch,
    queryData,
    loading,
    tableHeaderProps,
    table: tableInstance,
  } = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultState,
    defaultVisibleColumns,
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data }) => data.convention.signup_changes_paginated.entries,
    getPages: ({ data }) => data.convention.signup_changes_paginated.total_pages,
    columns,
    query: SignupSpySignupChangesQueryDocument,
    storageKeyPrefix: 'signupSpy',
  });

  const { filters, sortBy } = tableHeaderProps;

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <div className="mb-4">
        <TableHeader
          {...tableHeaderProps}
          renderLeftContent={() => <RefreshButton refreshData={() => refetch()} />}
          exportButton={
            <SignupChangesTableExportButton
              exportUrl="/csv_exports/signup_changes"
              filters={filters}
              sortBy={sortBy}
              columnVisibility={columnSelectionProps.columnVisibility}
            />
          }
        />
        <ReactTableWithTheWorks
          table={tableInstance}
          loading={loading}
          renderFilter={({ column }) => {
            if (column.id === 'name' || column.id === 'event_title') {
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

export default SignupSpyTable;
