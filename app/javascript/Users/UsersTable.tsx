import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import ReactTable, { Column, RowInfo } from 'react-table';

import { buildFieldFilterCodecs } from '../Tables/FilterUtils';
import EmailCell from '../Tables/EmailCell';
import FreeTextFilter from '../Tables/FreeTextFilter';
import MultiUserActionsDropdown from './MultiUserActionsDropdown';
import TableHeader from '../Tables/TableHeader';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import useModal from '../ModalDialogs/useModal';
import MergeUsersModal from './MergeUsersModal';
import usePageTitle from '../usePageTitle';
import { UsersTableUsersQueryQuery, useUsersTableUsersQueryQuery } from './queries.generated';

type UserType = UsersTableUsersQueryQuery['users_paginated']['entries'][0];

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({});
const CheckedUserIdsContext = React.createContext<
  [Set<number>, React.Dispatch<React.SetStateAction<Set<number>>>]
>([new Set<number>(), () => {}]);

function CheckboxCell({ original }: { original: UserType }) {
  const [checkedUserIds, setCheckedUserIds] = useContext(CheckedUserIdsContext);
  return (
    <input
      type="checkbox"
      value={original.id}
      checked={checkedUserIds.has(original.id)}
      onClick={(event) => {
        event.stopPropagation();
      }}
      onChange={() => {
        const newCheckedUserIds = new Set(checkedUserIds);
        if (checkedUserIds.has(original.id)) {
          newCheckedUserIds.delete(original.id);
        } else {
          newCheckedUserIds.add(original.id);
        }
        setCheckedUserIds(newCheckedUserIds);
      }}
      aria-label={`${original.first_name} ${original.last_name}`}
    />
  );
}

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
    accessor: (user: UserType) => user.name_inverted,
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

function UsersTable() {
  const history = useHistory();
  const [checkedUserIds, setCheckedUserIds] = useState(new Set<number>());
  const mergeModal = useModal<{ userIds: number[] }>();
  usePageTitle('Users');

  const [reactTableProps, { queryResult, tableHeaderProps }] = useReactTableWithTheWorks({
    alwaysVisibleColumns: ['_checkbox'],
    decodeFilterValue,
    defaultVisibleColumns: ['id', 'first_name', 'last_name', 'email'],
    encodeFilterValue,
    getData: ({ data }) => data.users_paginated.entries,
    getPages: ({ data }) => data.users_paginated.total_pages,
    getPossibleColumns,
    storageKeyPrefix: 'users',
    onFilteredChange: () => {
      setCheckedUserIds(new Set());
    },
    useQuery: useUsersTableUsersQueryQuery,
  });

  return (
    <CheckedUserIdsContext.Provider value={[checkedUserIds, setCheckedUserIds]}>
      <div className="mb-4">
        <h1 className="mb-4">Users</h1>

        <TableHeader
          {...tableHeaderProps}
          exportUrl="/csv_exports/users"
          renderLeftContent={() => (
            <div className="ml-2 mb-2 d-inline-block align-top">
              <MultiUserActionsDropdown
                selectedUserIds={[...checkedUserIds]}
                onClickMerge={() => mergeModal.open({ userIds: [...checkedUserIds] })}
              />
            </div>
          )}
        />

        <ReactTable
          {...reactTableProps}
          className="-striped -highlight"
          getTrProps={(state: any, rowInfo: RowInfo) => ({
            style: { cursor: 'pointer' },
            onClick: () => {
              history.push(`/users/${rowInfo.original.id}`);
            },
          })}
          getTdProps={(state: any, rowInfo: RowInfo, column: Column) => {
            if (column.id === '_checkbox') {
              return {
                style: { cursor: 'default' },
                onClick: (e: React.MouseEvent) => {
                  e.stopPropagation();
                },
              };
            }

            return {};
          }}
          getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
        />

        <MergeUsersModal
          visible={mergeModal.visible}
          closeModal={() => {
            mergeModal.close();
            queryResult.refetch();
            setCheckedUserIds(new Set());
          }}
          userIds={mergeModal.state?.userIds}
        />
      </div>
    </CheckedUserIdsContext.Provider>
  );
}

export default UsersTable;
