import React from 'react';
import ReactTable from 'react-table';

import useReactTableWithTheWorks, { QueryDataContext } from '../../Tables/useReactTableWithTheWorks';
import { RunSignupChangesQuery } from './queries.gql';
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
];

function RunSignupChangesTable({ runId }) {
  const [reactTableProps, { queryData, tableHeaderProps }] = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns: [
      'name', 'action', 'bucket_change', 'created_at',
    ],
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data }) => data.run.signup_changes_paginated.entries,
    getPages: ({ data }) => data.run.signup_changes_paginated.total_pages,
    getPossibleColumns,
    query: RunSignupChangesQuery,
    storageKeyPrefix: 'signupSpy',
    variables: { runId },
  });

  usePageTitle(useValueUnless(() => `Signup change history - ${queryData.run.event.title}`, !queryData));

  return (
    <QueryDataContext.Provider value={queryData}>
      <ReactTable
        {...reactTableProps}
        className="-striped -highlight"
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      >
        {(state, makeTable) => (
          <div className="mb-4">
            <TableHeader {...tableHeaderProps} />
            {makeTable()}
          </div>
        )}
      </ReactTable>
    </QueryDataContext.Provider>
  );
}

export default RunSignupChangesTable;
