import { CellProps, Column, Renderer } from 'react-table';
import { useModal } from '@neinteractiveliterature/litform';

import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import { buildFieldFilterCodecs } from '../Tables/FilterUtils';
import FreeTextFilter from '../Tables/FreeTextFilter';
import TableHeader from '../Tables/TableHeader';
import usePageTitle from '../usePageTitle';
import NewEmailRouteModal from './NewEmailRouteModal';
import EditEmailRouteModal from './EditEmailRouteModal';
import useAuthorizationRequired from '../Authentication/useAuthorizationRequired';
import { RootSiteEmailRoutesAdminTableQueryData, useRootSiteEmailRoutesAdminTableQuery } from './queries.generated';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';

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

  const newEmailRouteModal = useModal();
  const editEmailRouteModal = useModal<{ emailRoute: EmailRouteType }>();
  const { tableInstance, loading, tableHeaderProps } = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns,
    encodeFilterValue,
    getData: ({ data }) => data.email_routes_paginated.entries,
    getPages: ({ data }) => data.email_routes_paginated.total_pages,
    getPossibleColumns,
    storageKeyPrefix: 'email-routes',
    useQuery: useRootSiteEmailRoutesAdminTableQuery,
  });
  usePageTitle('Email routes');

  if (authorizationWarning) return authorizationWarning;

  return (
    <div className="mb-4">
      <h1 className="mb-4">Email routes</h1>

      <TableHeader
        {...tableHeaderProps}
        renderLeftContent={() => (
          <>
            <button type="button" className="btn btn-outline-primary" onClick={newEmailRouteModal.open}>
              New email route
            </button>
          </>
        )}
      />

      <ReactTableWithTheWorks
        tableInstance={tableInstance}
        loading={loading}
        onClickRow={(row) => editEmailRouteModal.open({ emailRoute: row.original })}
      />

      <NewEmailRouteModal visible={newEmailRouteModal.visible} close={newEmailRouteModal.close} />
      <EditEmailRouteModal
        visible={editEmailRouteModal.visible}
        close={editEmailRouteModal.close}
        initialEmailRoute={editEmailRouteModal.state?.emailRoute}
      />
    </div>
  );
}

export const Component = RootSiteEmailRoutesAdminTable;
