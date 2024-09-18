import { CellProps, Column, Renderer } from 'react-table';

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
import { Link } from 'react-router-dom';

type EmailRouteType = RootSiteEmailRoutesAdminTableQueryData['email_routes_paginated']['entries'][0];

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({});

const ForwardAddressesCell: Renderer<CellProps<EmailRouteType>> = ({
  value,
}: {
  value: EmailRouteType['forward_addresses'];
}) => <>{value?.join(', ')}</>;

function getPossibleColumns(): Column<EmailRouteType>[] {
  return [
    {
      Header: 'Receiver address',
      id: 'receiver_address',
      accessor: 'receiver_address',
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Forward addresses',
      id: 'forward_addresses',
      accessor: 'forward_addresses',
      Filter: FreeTextFilter,
      Cell: ForwardAddressesCell,
      disableFilters: false,
      disableSortBy: false,
    },
  ];
}

const defaultVisibleColumns = ['receiver_address', 'forward_addresses'];

function RootSiteEmailRoutesAdminTable(): JSX.Element {
  const authorizationWarning = useAuthorizationRequired('can_manage_email_routes');

  const { tableInstance, loading, tableHeaderProps } = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data.email_routes_paginated.entries,
    getPages: ({ data }) => data.email_routes_paginated.total_pages,
    getPossibleColumns,
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
        tableInstance={tableInstance}
        loading={loading}
        onClickRow={(row) => navigate(`./${row.original.id}`)}
      />

      <Outlet />
    </div>
  );
}

export const Component = RootSiteEmailRoutesAdminTable;
