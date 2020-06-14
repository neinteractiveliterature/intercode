import React from 'react';
import ReactTable from 'react-table';

import { AdminCouponsQuery } from './queries.gql';
import describeCoupon from '../describeCoupon';
import pluralizeWithCount from '../../pluralizeWithCount';
import useReactTableWithTheWorks from '../../Tables/useReactTableWithTheWorks';
import { SingleLineTimestampCell } from '../../Tables/TimestampCell';
import TableHeader from '../../Tables/TableHeader';
import useModal from '../../ModalDialogs/useModal';
import NewCouponModal from './NewCouponModal';
import EditCouponModal from './EditCouponModal';
import ReactTableExportButtonWithColumnTransform from '../../Tables/ReactTableExportButtonWithColumnTransform';

const transformColumnIdForExport = (columnId) => {
  if (columnId === 'effect') {
    return ['fixed_amount', 'percent_discount', 'provides_product'];
  }

  return columnId;
};

const getPossibleColumns = () => [
  {
    Header: 'Code',
    id: 'code',
    accessor: 'code',
    width: 250,
  },
  {
    Header: 'Effect',
    id: 'effect',
    accessor: (coupon) => coupon,
    Cell: ({ value }) => describeCoupon(value),
    filterable: false,
    sortable: false,
  },
  {
    Header: 'Usage limit',
    id: 'usage_limit',
    accessor: 'usage_limit',
    filterable: false,
    sortable: false,
    // eslint-disable-next-line react/prop-types
    Cell: ({ value }) => (value
      ? `${pluralizeWithCount('use', value)}`
      : <em>Unlimited uses</em>),
  },
  {
    Header: 'Expiration date',
    id: 'expires_at',
    accessor: 'expires_at',
    width: 150,
    Cell: SingleLineTimestampCell,
  },
];

function CouponAdminTable() {
  const newCouponModal = useModal();
  const editCouponModal = useModal();

  const [reactTableProps, { tableHeaderProps, columnSelectionProps }] = useReactTableWithTheWorks({
    getData: ({ data }) => data.convention.coupons_paginated.entries,
    getPages: ({ data }) => data.convention.coupons_paginated.total_pages,
    getPossibleColumns,
    query: AdminCouponsQuery,
    storageKeyPrefix: 'coupons',
  });

  return (
    <>
      <TableHeader
        {...tableHeaderProps}
        renderLeftContent={() => (
          <button
            type="button"
            className="btn btn-outline-primary ml-2"
            onClick={newCouponModal.open}
          >
            <i className="fa fa-plus" />
            {' '}
            New coupon
          </button>
        )}
        exportButton={(
          <ReactTableExportButtonWithColumnTransform
            exportUrl="/csv_exports/coupons"
            filtered={tableHeaderProps.filtered}
            sorted={tableHeaderProps.sorted}
            visibleColumnIds={columnSelectionProps.visibleColumnIds}
            columnTransform={transformColumnIdForExport}
          />
        )}
      />

      <ReactTable
        {...reactTableProps}

        className="-striped -highlight"
        getTrProps={(state, rowInfo) => ({
          style: { cursor: 'pointer' },
          onClick: () => { editCouponModal.open({ initialCoupon: rowInfo.original }); },
        })}
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      />

      <NewCouponModal
        visible={newCouponModal.visible}
        close={newCouponModal.close}
      />

      <EditCouponModal
        initialCoupon={editCouponModal.state?.initialCoupon}
        visible={editCouponModal.visible}
        close={editCouponModal.close}
      />
    </>
  );
}

export default CouponAdminTable;
