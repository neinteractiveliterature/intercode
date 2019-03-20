import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';

import { buildFieldFilterCodecs } from '../Tables/FilterUtils';
import FreeTextFilter from '../Tables/FreeTextFilter';
import TableHeader from '../Tables/TableHeader';
import { UsersTableUsersQuery } from './queries.gql';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({});

function EmailCell({ value }) {
  return (
    <a href={`mailto:${value}`} onClick={(event) => { event.stopPropagation(); }}>
      {value}
    </a>
  );
}

EmailCell.propTypes = {
  value: PropTypes.string,
};

EmailCell.defaultProps = {
  value: null,
};

const getPossibleColumns = () => [
  {
    Header: 'ID',
    id: 'id',
    accessor: 'id',
    filterable: false,
    sortable: false,
    width: 70,
  },
  {
    Header: 'Name',
    id: 'name',
    accessor: user => user.name_inverted,
    Filter: FreeTextFilter,
  },
  {
    Header: 'First name',
    id: 'first_name',
    accessor: 'first_name',
    Filter: FreeTextFilter,
  },
  {
    Header: 'Last name',
    id: 'last_name',
    accessor: 'last_name',
    Filter: FreeTextFilter,
  },
  {
    Header: 'Email',
    id: 'email',
    accessor: 'email',
    Cell: EmailCell,
    Filter: FreeTextFilter,
  },
];

function UsersTable({ history }) {
  const [reactTableProps, { tableHeaderProps }] = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns: ['id', 'first_name', 'last_name', 'email'],
    encodeFilterValue,
    getData: ({ data }) => data.users_paginated.entries,
    getPages: ({ data }) => data.users_paginated.total_pages,
    getPossibleColumns,
    history,
    storageKeyPrefix: 'users',
    query: UsersTableUsersQuery,
  });

  return (
    <div className="mb-4">
      <h1 className="mb-4">Users</h1>

      <TableHeader
        {...tableHeaderProps}
        exportUrl={'' /* todo */}
      />

      <ReactTable
        {...reactTableProps}

        className="-striped -highlight"
        getTrProps={(state, rowInfo) => ({
          style: { cursor: 'pointer' },
          onClick: () => {
            history.push(`${rowInfo.original.id}`);
          },
        })}
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      />
    </div>
  );
}

UsersTable.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(UsersTable);
