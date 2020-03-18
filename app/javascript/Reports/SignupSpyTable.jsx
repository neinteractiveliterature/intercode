import React from 'react';
import ReactTable from 'react-table';

import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import { SignupSpySignupChangesQuery } from './queries.gql';
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

const FILTER_CODECS = buildFieldFilterCodecs({
  action: FilterCodecs.stringArray,
});

const getPossibleColumns = () => [
  {
    Header: 'Name',
    id: 'name',
    accessor: (signupChange) => signupChange.user_con_profile,
    sortable: false,
    filterable: true,
    Cell: UserConProfileWithGravatarCell,
    Filter: FreeTextFilter,
  },
  {
    Header: 'Event',
    id: 'event_title',
    accessor: (signupChange) => signupChange.run.event.title,
    sortable: false,
    filterable: true,
    Filter: FreeTextFilter,
  },
  {
    Header: 'Change',
    id: 'action',
    accessor: (signupChange) => signupChange,
    sortable: false,
    filterable: true,
    Cell: SignupChangeCell,
    Filter: SignupChangeActionFilter,
  },
  {
    Header: 'Bucket',
    id: 'bucket_change',
    accessor: (signupChange) => signupChange,
    sortable: false,
    filterable: false,
    Cell: BucketChangeCell,
  },
  {
    Header: 'Timestamp',
    id: 'created_at',
    accessor: 'created_at',
    sortable: false,
    filterable: false,
    width: 130,
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => <TimestampCell value={value} />,
  },
  {
    Header: 'Choice',
    id: 'choice',
    width: 100,
    accessor: (signupChange) => signupChange.signup.choice,
    sortable: false,
    filterable: false,
    Cell: SignupChoiceCell,
  },
];

function SignupSpyTable() {
  const [reactTableProps, {
    columnSelectionProps, queryResult, queryData, tableHeaderProps,
  }] = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns: [
      'name', 'event_title', 'action', 'bucket_change', 'created_at', 'choice',
    ],
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data }) => data.convention.signup_changes_paginated.entries,
    getPages: ({ data }) => data.convention.signup_changes_paginated.total_pages,
    getPossibleColumns,
    query: SignupSpySignupChangesQuery,
    storageKeyPrefix: 'signupSpy',
  });

  const { filtered, sorted } = tableHeaderProps;

  return (
    <QueryDataContext.Provider value={queryData}>
      <ReactTable
        {...reactTableProps}
        className="-striped -highlight"
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      >
        {(state, makeTable) => (
          <div className="mb-4">
            <TableHeader
              {...tableHeaderProps}
              renderLeftContent={() => (
                <RefreshButton refreshData={() => queryResult.refetch()} />
              )}
              exportButton={(
                <SignupChangesTableExportButton
                  exportUrl="/csv_exports/signup_changes"
                  filtered={filtered}
                  sorted={sorted}
                  visibleColumnIds={columnSelectionProps.visibleColumnIds}
                />
              )}
            />
            {makeTable()}
          </div>
        )}
      </ReactTable>
    </QueryDataContext.Provider>
  );
}

export default SignupSpyTable;
