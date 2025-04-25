import { Outlet, useNavigate } from 'react-router';
import { createColumnHelper } from '@tanstack/react-table';

import { buildFieldFilterCodecs } from '../Tables/FilterUtils';
import EmailCell from '../Tables/EmailCell';
import FreeTextFilter from '../Tables/FreeTextFilter';
import MultiUserActionsDropdown from './MultiUserActionsDropdown';
import TableHeader from '../Tables/TableHeader';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import usePageTitle from '../usePageTitle';
import { UsersTableUsersQueryData, UsersTableUsersQueryDocument } from './queries.generated';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type UserType = UsersTableUsersQueryData['users_paginated']['entries'][0];

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({});

// eslint-disable-next-line i18next/no-literal-string
const defaultVisibleColumns = ['id', 'first_name', 'last_name', 'email'];

function UsersTable(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  usePageTitle(t('navigation.admin.users'));

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<UserType>();
    return [
      columnHelper.accessor('id', {
        id: 'id',
        header: t('admin.users.table.headers.id'),
        size: 70,
        enableSorting: true,
      }),
      columnHelper.accessor('name_inverted', {
        id: 'name',
        header: t('admin.users.table.headers.name'),
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('first_name', {
        id: 'first_name',
        header: t('admin.users.table.headers.firstName'),
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('last_name', {
        id: 'last_name',
        header: t('admin.users.table.headers.lastName'),
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('email', {
        id: 'email',
        header: t('admin.users.table.headers.email'),
        cell: EmailCell,
        enableColumnFilter: true,
        enableSorting: true,
      }),
    ];
  }, [t]);

  const { table, tableHeaderProps, loading } = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data.users_paginated.entries,
    getPages: ({ data }) => data.users_paginated.total_pages,
    columns,
    rowSelect: true,
    storageKeyPrefix: 'users',
    query: UsersTableUsersQueryDocument,
  });

  return (
    <div className="mb-4">
      <h1 className="mb-4">{t('admin.users.table.title')}</h1>

      <TableHeader
        {...tableHeaderProps}
        exportUrl="/csv_exports/users"
        renderLeftContent={() => (
          <div className="ms-2 mb-2 d-inline-block align-top">
            <MultiUserActionsDropdown
              selectedUserIds={table.getSelectedRowModel().flatRows.map((row) => row.original.id)}
              onClickMerge={(userIds) => navigate(`merge/${userIds.join(',')}`)}
            />
          </div>
        )}
      />

      <ReactTableWithTheWorks
        table={table}
        loading={loading}
        onClickRow={(row) => {
          navigate(`/users/${row.original.id}`);
        }}
        renderFilter={({ column }) => {
          // all columns in this table are text filters
          return <FreeTextFilter column={column} />;
        }}
      />

      <Outlet />
    </div>
  );
}

export const Component = UsersTable;
