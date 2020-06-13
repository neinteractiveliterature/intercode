import React from 'react';
import ReactTable from 'react-table';

import { AdminCouponsQuery } from './queries.gql';
import describeCoupon from './describeCoupon';
import pluralizeWithCount from '../pluralizeWithCount';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import { SingleLineTimestampCell } from '../Tables/TimestampCell';
import TableHeader from '../Tables/TableHeader';
import useModal from '../ModalDialogs/useModal';
import NewCouponModal from './NewCouponModal';

const getPossibleColumns = () => [
  {
    Header: 'Code',
    id: 'code',
    accessor: 'code',
    width: 100,
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
    accessor: (coupon) => coupon,
    filterable: false,
    sortable: false,
    Cell: (coupon) => (coupon.usage_limit
      ? `${pluralizeWithCount('use', coupon.usage_limit)}`
      : 'Unlimited uses'),
  },
  {
    Header: 'Expiration date',
    id: 'expires_at',
    accessor: 'expires_at',
    width: 150,
    Cell: SingleLineTimestampCell,
  },
];

function CouponAdmin() {
  const newCouponModal = useModal();
  const editCouponModal = useModal();

  const [reactTableProps, { tableHeaderProps }] = useReactTableWithTheWorks({
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
        exportUrl="/csv_exports/coupons"
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
    </>
  );
}

export default CouponAdmin;
