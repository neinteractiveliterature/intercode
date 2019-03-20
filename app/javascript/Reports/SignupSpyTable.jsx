import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { BrowserRouter, withRouter } from 'react-router-dom';
import ReactTable from 'react-table';

import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import { SignupSpySignupsQuery } from './queries.gql';
import TableHeader from '../Tables/TableHeader';
import RefreshButton from '../EventsApp/ScheduleGrid/RefreshButton';

const getPossibleColumns = data => [
  {
    Header: 'Name',
    id: 'name',
    accessor: signup => signup.user_con_profile.name_inverted,
    sortable: false,
    filterable: false,
  },
  {
    Header: 'Event',
    id: 'event_title',
    accessor: signup => signup.run.event.title,
    sortable: false,
    filterable: false,
  },
  {
    Header: 'State',
    id: 'state',
    accessor: 'state',
    width: 130,
    filterable: false,
    sortable: false,
    Cell: props => (
      <div className={`badge bg-signup-state-color-${props.value}`}>
        {props.value}
      </div>
    ),
  },
  {
    Header: 'Timestamp',
    id: 'created_at',
    accessor: 'created_at',
    sortable: false,
    filterable: false,
    Cell: props => moment.tz(props.value, data.convention.timezone_name).format('MMM D, YYYY [at] h:mm:ssa'),
  },
  {
    Header: 'Choice',
    id: 'choice',
    width: 100,
    accessor: 'choice',
    sortable: false,
    filterable: false,
    Cell: (props) => {
      if (props.original.counted) {
        return props.value;
      }

      return 'N/C';
    },
  },
];

function SignupSpyTableContent({ exportUrl, history }) {
  const [reactTableProps, { tableHeaderProps }] = useReactTableWithTheWorks({
    defaultVisibleColumns: ['name', 'event_title', 'state', 'created_at', 'choice'],
    getData: ({ data }) => data.convention.signup_spy_paginated.entries,
    getPages: ({ data }) => data.convention.signup_spy_paginated.total_pages,
    getPossibleColumns,
    history,
    query: SignupSpySignupsQuery,
    storageKeyPrefix: 'signupSpy',
  });

  return (
    <ReactTable
      {...reactTableProps}
      className="-striped -highlight"
    >
      {(state, makeTable, instance) => (
        <div className="mb-4">
          <TableHeader
            {...tableHeaderProps}
            exportUrl={exportUrl}
            renderLeftContent={() => (
              <RefreshButton refreshData={instance.fireFetchData} />
            )}
          />
          {makeTable()}
        </div>
      )}
    </ReactTable>
  );
}

SignupSpyTableContent.propTypes = {
  exportUrl: PropTypes.string.isRequired,
  history: PropTypes.shape({}).isRequired,
};

const SignupSpyTableContentWithRouter = withRouter(SignupSpyTableContent);

function SignupSpyTable({ basename, exportUrl }) {
  return (
    <BrowserRouter basename={basename}>
      <SignupSpyTableContentWithRouter exportUrl={exportUrl} />
    </BrowserRouter>
  );
}

SignupSpyTable.propTypes = {
  basename: PropTypes.string.isRequired,
  exportUrl: PropTypes.string.isRequired,
};

export default SignupSpyTable;
