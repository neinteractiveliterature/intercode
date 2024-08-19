import { useNavigate } from 'react-router-dom';
import { Column } from 'react-table';
import { useModal } from '@neinteractiveliterature/litform';

import { buildFieldFilterCodecs } from '../Tables/FilterUtils';
import EmailCell from '../Tables/EmailCell';
import FreeTextFilter from '../Tables/FreeTextFilter';
import MultiUserActionsDropdown from './MultiUserActionsDropdown';
import TableHeader from '../Tables/TableHeader';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import MergeUsersModal from './MergeUsersModal';
import usePageTitle from '../usePageTitle';
import { UsersTableUsersQueryData, UsersTableUsersQueryDocument } from './queries.generated';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useCallback } from 'react';

type UserType = UsersTableUsersQueryData['users_paginated']['entries'][0];

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({});

function getPossibleColumns(t: TFunction): Column<UserType>[] {
  return [
    {
      Header: t('admin.users.table.headers.id'),
      id: 'id',
      accessor: 'id',
      width: 70,
    },
    {
      Header: t('admin.users.table.headers.name'),
      id: 'name',
      accessor: (user: UserType) => user.name_inverted,
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: t('admin.users.table.headers.firstName'),
      id: 'first_name',
      accessor: 'first_name',
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: t('admin.users.table.headers.lastName'),
      id: 'last_name',
      accessor: 'last_name',
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: t('admin.users.table.headers.email'),
      id: 'email',
      accessor: 'email',
      Cell: EmailCell,
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
  ];
}

// eslint-disable-next-line i18next/no-literal-string
const defaultVisibleColumns = ['id', 'first_name', 'last_name', 'email'];

function UsersTable(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mergeModal = useModal<{ userIds: string[] }>();
  usePageTitle(t('navigation.admin.users'));

  const getPossibleColumnsWithTranslation = useCallback(() => getPossibleColumns(t), [t]);

  const { tableInstance, refetch, tableHeaderProps, loading } = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data.users_paginated.entries,
    getPages: ({ data }) => data.users_paginated.total_pages,
    getPossibleColumns: getPossibleColumnsWithTranslation,
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
              selectedUserIds={tableInstance.selectedFlatRows.map((row) => row.original.id)}
              onClickMerge={(userIds) => mergeModal.open({ userIds })}
            />
          </div>
        )}
      />

      <ReactTableWithTheWorks
        tableInstance={tableInstance}
        loading={loading}
        onClickRow={(row) => {
          navigate(`/users/${row.original.id}`);
        }}
      />

      <MergeUsersModal
        visible={mergeModal.visible}
        closeModal={() => {
          mergeModal.close();
          refetch();
          tableInstance.toggleAllRowsSelected(false);
        }}
        userIds={mergeModal.state?.userIds}
      />
    </div>
  );
}

export const Component = UsersTable;
