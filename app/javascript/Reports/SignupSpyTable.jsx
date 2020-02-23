import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import ReactTable from 'react-table';
import { humanize } from 'inflected';
import flatMap from 'lodash/flatMap';

import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import { SignupSpySignupChangesQuery } from './queries.gql';
import RefreshButton from '../EventsApp/ScheduleGrid/RefreshButton';
import SignupStateCell from '../Tables/SignupStateCell';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import ColumnSelector from '../Tables/ColumnSelector';
import ReactTableExportButton from '../Tables/ExportButton';

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

const SignupChangeCell = ({ value }) => {
  return (
    <>
      {value.previous_signup_change
        ? (
          <>
            <SignupStateCell value={value.previous_signup_change.state} strikeThrough/>
            {' → '}
          </>
        )
        : (value.action === 'unknown' && <span className="text-muted">unknown → </span>)}
      <SignupStateCell value={value.state} />
      {value.action !== 'unknown' && (
        <>
          <br />
          <small className="text-muted">
            via
            {' '}
            {humanize(value.action).toLowerCase()}
          </small>
        </>
      )}
    </>
  );
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
    Header: 'Change',
    id: 'change',
    accessor: (signupChange) => signupChange,
    sortable: false,
    filterable: false,
    Cell: SignupChangeCell,
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
    columnSelectionProps, queryResult, queryData, tableHeaderProps: { filtered, sorted },
  }] = useReactTableWithTheWorks({
    defaultVisibleColumns: [
      'name', 'event_title', 'change', 'created_at', 'choice',
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
            <div className="d-flex">
              <div className="flex-grow-1">
                <ReactTableExportButton
                  exportUrl={exportUrl}
                  filtered={filtered}
                  sorted={sorted}
                  columns={flatMap(columnSelectionProps.visibleColumnIds, (columnId) => {
                    if (columnId === 'change') {
                      return ['action', 'prev_state', 'state'];
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

SignupSpyTableContent.propTypes = {
  exportUrl: PropTypes.string.isRequired,
};

export default SignupSpyTableContent;
