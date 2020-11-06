import ReactTable, { RowInfo } from 'react-table';

import describeCoupon from '../describeCoupon';
import pluralizeWithCount from '../../pluralizeWithCount';
import useReactTableWithTheWorks from '../../Tables/useReactTableWithTheWorks';
import { SingleLineTimestampCell } from '../../Tables/TimestampCell';
import TableHeader from '../../Tables/TableHeader';
import useModal from '../../ModalDialogs/useModal';
import NewCouponModal from './NewCouponModal';
import EditCouponModal from './EditCouponModal';
import ReactTableExportButtonWithColumnTransform from '../../Tables/ReactTableExportButtonWithColumnTransform';
import { AdminCouponsQueryQuery, useAdminCouponsQueryQuery } from './queries.generated';

type CouponType = AdminCouponsQueryQuery['convention']['coupons_paginated']['entries'][0];

const transformColumnIdForExport = (columnId: string) => {
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
    accessor: (coupon: CouponType) => coupon,
    Cell: ({ value }: { value: CouponType }) => describeCoupon(value),
    filterable: false,
    sortable: false,
  },
  {
    Header: 'Usage limit',
    id: 'usage_limit',
    accessor: 'usage_limit',
    filterable: false,
    sortable: false,
    Cell: ({ value }: { value: CouponType['usage_limit'] }) =>
      value ? `${pluralizeWithCount('use', value)}` : <em>Unlimited uses</em>,
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
  const editCouponModal = useModal<{ initialCoupon: CouponType }>();

  const [reactTableProps, { tableHeaderProps, columnSelectionProps }] = useReactTableWithTheWorks({
    getData: ({ data }) => data!.convention.coupons_paginated.entries,
    getPages: ({ data }) => data!.convention.coupons_paginated.total_pages,
    getPossibleColumns,
    useQuery: useAdminCouponsQueryQuery,
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
            <i className="fa fa-plus" /> New coupon
          </button>
        )}
        exportButton={
          <ReactTableExportButtonWithColumnTransform
            exportUrl="/csv_exports/coupons"
            filtered={tableHeaderProps.filtered}
            sorted={tableHeaderProps.sorted}
            visibleColumnIds={columnSelectionProps.visibleColumnIds}
            columnTransform={transformColumnIdForExport}
          />
        }
      />

      <ReactTable
        {...reactTableProps}
        className="-striped -highlight"
        getTrProps={(state: any, rowInfo: RowInfo) => ({
          style: { cursor: 'pointer' },
          onClick: () => {
            editCouponModal.open({ initialCoupon: rowInfo.original });
          },
        })}
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      />

      <NewCouponModal visible={newCouponModal.visible} close={newCouponModal.close} />

      <EditCouponModal
        initialCoupon={editCouponModal.state?.initialCoupon}
        visible={editCouponModal.visible}
        close={editCouponModal.close}
      />
    </>
  );
}

export default CouponAdminTable;
