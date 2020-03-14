import React from 'react';
import ReactTable from 'react-table';

import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import { buildFieldFilterCodecs } from '../Tables/FilterUtils';
import FreeTextFilter from '../Tables/FreeTextFilter';
import { RootSiteEmailRoutesAdminTableQuery } from './queries.gql';
import TableHeader from '../Tables/TableHeader';
import usePageTitle from '../usePageTitle';
import useModal from '../ModalDialogs/useModal';
import NewEmailRouteModal from './NewEmailRouteModal';
import EditEmailRouteModal from './EditEmailRouteModal';

const { encodeFilterValue, decodeFilterValue } = buildFieldFilterCodecs({});

const getPossibleColumns = () => [
  {
    Header: 'Receiver address',
    id: 'receiver_address',
    accessor: 'receiver_address',
    Filter: FreeTextFilter,
  },
  {
    Header: 'Forward addresses',
    id: 'forward_addresses',
    accessor: 'forward_addresses',
    Filter: FreeTextFilter,
    Cell: ({ value }) => value.join(', '),
  },
];

function RootSiteEmailRoutesAdminTable() {
  const newEmailRouteModal = useModal();
  const editEmailRouteModal = useModal();
  const [reactTableProps, { tableHeaderProps }] = useReactTableWithTheWorks({
    decodeFilterValue,
    defaultVisibleColumns: ['receiver_address', 'forward_addresses'],
    encodeFilterValue,
    getData: ({ data }) => data.email_routes_paginated.entries,
    getPages: ({ data }) => data.email_routes_paginated.total_pages,
    getPossibleColumns,
    storageKeyPrefix: 'email-routes',
    query: RootSiteEmailRoutesAdminTableQuery,
  });
  usePageTitle('Email routes');

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

      <ReactTable
        {...reactTableProps}

        className="-striped -highlight"
        getTrProps={(state, rowInfo) => ({
          style: { cursor: 'pointer' },
          onClick: () => {
            editEmailRouteModal.open({ emailRoute: rowInfo.original });
          },
        })}
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
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

export default RootSiteEmailRoutesAdminTable;
