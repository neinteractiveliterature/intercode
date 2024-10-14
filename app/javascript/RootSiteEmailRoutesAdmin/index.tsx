import { CellContext, createColumnHelper } from '@tanstack/react-table';

import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import { buildFieldFilterCodecs } from '../Tables/FilterUtils';
import FreeTextFilter from '../Tables/FreeTextFilter';
import TableHeader from '../Tables/TableHeader';
import usePageTitle from '../usePageTitle';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import {
  RootSiteEmailRoutesAdminTableQueryData,
  RootSiteEmailRoutesAdminTableQueryDocument,
} from './queries.generated';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { Outlet, useNavigate } from 'react-router';
import { useMemo } from 'react';
import { Link } from 'react-router';

type EmailRouteType = RootSiteEmailRoutesAdminTableQueryData['email_routes_paginated']['entries'][0];

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({});

function ForwardAddressesCell({ getValue }: CellContext<EmailRouteType, EmailRouteType['forward_addresses']>) {
  return <>{getValue()?.join(', ')}</>;
}

const defaultVisibleColumns = ['receiver_address', 'forward_addresses'];

function RootSiteEmailRoutesAdminTable(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_email_routes');

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<EmailRouteType>();
    return [
      columnHelper.accessor('receiver_address', {
        header: 'Receiver address',
        id: 'receiver_address',
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('forward_addresses', {
        header: 'Forward addresses',
        id: 'forward_addresses',
        cell: ForwardAddressesCell,
        enableColumnFilter: true,
        enableSorting: true,
      }),
    ];
  }, []);

  const {
    table: tableInstance,
    loading,
    tableHeaderProps,
  } = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data.email_routes_paginated.entries,
    getPages: ({ data }) => data.email_routes_paginated.total_pages,
    columns,
    storageKeyPrefix: 'email-routes',
    query: RootSiteEmailRoutesAdminTableQueryDocument,
  });
  usePageTitle('Email routes');
  const navigate = useNavigate();

  if (authorizationWarning) return authorizationWarning;

  return (
    <div className="mb-4">
      <h1 className="mb-4">Email routes</h1>

      <TableHeader
        {...tableHeaderProps}
        renderLeftContent={() => (
          <>
            <Link to="./new" type="button" className="btn btn-outline-primary">
              New email route
            </Link>
          </>
        )}
      />

      <ReactTableWithTheWorks
        table={tableInstance}
        loading={loading}
        onClickRow={(row) => navigate(`./${row.original.id}`)}
        renderFilter={({ column }) => <FreeTextFilter column={column} />}
      />

      <Outlet />
    </div>
  );
}

export const Component = RootSiteEmailRoutesAdminTable;
