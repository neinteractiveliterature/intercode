import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';

import { buildFieldFilterCodecs } from '../Tables/FilterUtils';
import EmailCell from '../Tables/EmailCell';
import FreeTextFilter from '../Tables/FreeTextFilter';
import MultiUserActionsDropdown from './MultiUserActionsDropdown';
import TableHeader from '../Tables/TableHeader';
import { UsersTableUsersQuery } from './queries.gql';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({});

function UsersTable({ exportUrl, history }) {
  const [checkedUserIds, setCheckedUserIds] = useState(new Set());

  function CheckboxCell({ original }) {
    return (
      <input
        type="checkbox"
        value={original.id}
        checked={checkedUserIds.has(original.id)}
        onClick={(event) => { event.stopPropagation(); }}
        onChange={() => {
          const newCheckedUserIds = new Set(checkedUserIds);
          if (checkedUserIds.has(original.id)) {
            newCheckedUserIds.delete(original.id);
          } else {
            newCheckedUserIds.add(original.id);
          }
          setCheckedUserIds(newCheckedUserIds);
        }}
      />
    );
  }

  CheckboxCell.propTypes = {
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  };

  const getPossibleColumns = () => [
    {
      Header: '',
      id: '_checkbox',
      accessor: () => null,
      filterable: false,
      sortable: false,
      width: 30,
      Cell: CheckboxCell,
    },
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

  const [reactTableProps, { tableHeaderProps }] = useReactTableWithTheWorks({
    alwaysVisibleColumns: ['_checkbox'],
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
        exportUrl={exportUrl}
        // renderLeftContent={() => (
        //   <div className="ml-2 mb-2 d-inline-block align-top">
        //     <MultiUserActionsDropdown selectedUserIds={[...checkedUserIds]} />
        //   </div>
        // )}
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
        getTdProps={(state, rowInfo, column) => {
          if (column.id === '_checkbox') {
            return {
              style: { cursor: 'default' },
              onClick: (e) => { e.stopPropagation(); },
            };
          }

          return {};
        }}
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      />
    </div>
  );
}

UsersTable.propTypes = {
  exportUrl: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(UsersTable);
