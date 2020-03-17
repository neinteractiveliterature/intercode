import React from 'react';
import ReactTable from 'react-table';
import flatMap from 'lodash/flatMap';

import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import { SignupSpySignupChangesQuery } from './queries.gql';
import RefreshButton from '../EventsApp/ScheduleGrid/RefreshButton';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import ColumnSelector from '../Tables/ColumnSelector';
import ReactTableExportButton from '../Tables/ExportButton';
import FreeTextFilter from '../Tables/FreeTextFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import TimestampCell from '../Tables/TimestampCell';
import SignupChangeActionFilter from '../Tables/SignupChangeActionFilter';
import SignupChoiceCell from '../Tables/SignupChoiceCell';
import SignupChangeCell from '../Tables/SignupChangeCell';
import BucketChangeCell from '../Tables/BucketChangeCell';

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
    columnSelectionProps, queryResult, queryData, tableHeaderProps: { filtered, sorted },
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

  return (
    <QueryDataContext.Provider value={queryData}>
      <ReactTable
        {...reactTableProps}
        className="-striped -highlight"
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      >
        {(state, makeTable) => (
          <div className="mb-4">
            <div className="d-flex mb-2">
              <div className="flex-grow-1">
                <ReactTableExportButton
                  exportUrl="/csv_exports/signup_changes"
                  filtered={filtered}
                  sorted={sorted}
                  columns={flatMap(columnSelectionProps.visibleColumnIds, (columnId) => {
                    if (columnId === 'action') {
                      return ['action', 'prev_state', 'state'];
                    }

                    if (columnId === 'bucket_change') {
                      return ['prev_bucket', 'bucket'];
                    }

                    return columnId;
                  })}
                />
                <RefreshButton refreshData={() => queryResult.refetch()} />
              </div>
              <div>
                <ColumnSelector {...columnSelectionProps} />
              </div>
            </div>
            {makeTable()}
          </div>
        )}
      </ReactTable>
    </QueryDataContext.Provider>
  );
}

export default SignupSpyTable;
