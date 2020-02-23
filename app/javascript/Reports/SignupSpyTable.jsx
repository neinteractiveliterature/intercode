import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import ReactTable from 'react-table';
import { humanize } from 'inflected';

import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import { SignupSpySignupChangesQuery } from './queries.gql';
import TableHeader from '../Tables/TableHeader';
import RefreshButton from '../EventsApp/ScheduleGrid/RefreshButton';
import SignupStateCell from '../Tables/SignupStateCell';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';

const ChoiceCell = ({ value, original }) => {
  if (original.counted) {
    return value;
  }

  return 'N/C';
};

ChoiceCell.propTypes = {
  value: PropTypes.number,
  original: PropTypes.shape({
    counted: PropTypes.bool,
  }).isRequired,
};

ChoiceCell.defaultProps = {
  value: null,
};

const TimestampCell = ({ value }) => {
  const data = useContext(QueryDataContext);
  return moment.tz(value, data.convention.timezone_name).format('MMM D, YYYY [at] h:mm:ssa');
};

TimestampCell.propTypes = {
  value: PropTypes.string.isRequired,
};

const getPossibleColumns = () => [
  {
    Header: 'Name',
    id: 'name',
    accessor: (signupChange) => signupChange.user_con_profile,
    sortable: false,
    filterable: false,
    Cell: UserConProfileWithGravatarCell,
  },
  {
    Header: 'Event',
    id: 'event_title',
    accessor: (signupChange) => signupChange.run.event.title,
    sortable: false,
    filterable: false,
  },
  {
    Header: 'Action',
    id: 'action',
    accessor: (signupChange) => humanize(signupChange.action),
    width: 130,
    filterable: false,
    sortable: false,
  },
  {
    Header: 'Previous state',
    id: 'prev_state',
    accessor: (signupChange) => signupChange.previous_signup_change?.state,
    width: 130,
    filterable: false,
    sortable: false,
    Cell: SignupStateCell,
  },
  {
    Header: 'State',
    id: 'state',
    accessor: 'state',
    width: 130,
    filterable: false,
    sortable: false,
    Cell: SignupStateCell,
  },
  {
    Header: 'Timestamp',
    id: 'created_at',
    accessor: 'created_at',
    sortable: false,
    filterable: false,
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
    Cell: ChoiceCell,
  },
];

function SignupSpyTableContent({ exportUrl }) {
  const [reactTableProps, {
    tableHeaderProps, queryResult, queryData,
  }] = useReactTableWithTheWorks({
    defaultVisibleColumns: [
      'name', 'event_title', 'action', 'prev_state', 'state', 'created_at', 'choice',
    ],
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
      >
        {(state, makeTable) => (
          <div className="mb-4">
            <TableHeader
              {...tableHeaderProps}
              exportUrl={exportUrl}
              renderLeftContent={() => (
                <RefreshButton refreshData={queryResult.refetch} />
              )}
            />
            {makeTable()}
          </div>
        )}
      </ReactTable>
    </QueryDataContext.Provider>
  );
}

SignupSpyTableContent.propTypes = {
  exportUrl: PropTypes.string.isRequired,
};

export default SignupSpyTableContent;
