import { Column } from 'react-table';
import { useModal } from '@neinteractiveliterature/litform';

import describeCoupon from '../describeCoupon';
import useReactTableWithTheWorks from '../../Tables/useReactTableWithTheWorks';
import { SingleLineTimestampCell } from '../../Tables/TimestampCell';
import TableHeader from '../../Tables/TableHeader';
import NewCouponModal from './NewCouponModal';
import EditCouponModal from './EditCouponModal';
import ReactTableExportButtonWithColumnTransform from '../../Tables/ReactTableExportButtonWithColumnTransform';
import { AdminCouponsQueryData, useAdminCouponsQuery } from './queries.generated';
import ReactTableWithTheWorks from '../../Tables/ReactTableWithTheWorks';
import { useTranslation } from 'react-i18next';

type CouponType = AdminCouponsQueryData['convention']['coupons_paginated']['entries'][0];

const transformColumnIdForExport = (columnId: string) => {
  if (columnId === 'effect') {
    return ['fixed_amount', 'percent_discount', 'provides_product'];
  }

  return columnId;
};

function CouponUsageLimitCell({ value }: { value: CouponType['usage_limit'] }) {
  const { t } = useTranslation();
  return value ? (
    <>{t('store.coupons.usageLimitCount', { count: value })}</>
  ) : (
    <em>{t('store.coupons.unlimitedUses')}</em>
  );
}

const CouponEffectCell = ({ value }: { value: CouponType }) => <>{describeCoupon(value)}</>;

function getPossibleColumns(): Column<CouponType>[] {
  return [
    {
      Header: 'Code',
      id: 'code',
      accessor: 'code',
      width: 250,
      disableSortBy: false,
    },
    {
      Header: 'Effect',
      id: 'effect',
      accessor: (coupon: CouponType) => coupon,
      Cell: CouponEffectCell,
    },
    {
      Header: 'Usage limit',
      id: 'usage_limit',
      accessor: 'usage_limit',
      disableSortBy: false,
      Cell: CouponUsageLimitCell,
    },
    {
      Header: 'Expiration date',
      id: 'expires_at',
      accessor: 'expires_at',
      width: 150,
      Cell: SingleLineTimestampCell,
      disableSortBy: false,
    },
  ];
}

function CouponAdminTable(): JSX.Element {
  const newCouponModal = useModal();
  const editCouponModal = useModal<{ initialCoupon: CouponType }>();

  const { tableHeaderProps, columnSelectionProps, tableInstance, loading } = useReactTableWithTheWorks({
    getData: ({ data }) => data?.convention.coupons_paginated.entries,
    getPages: ({ data }) => data?.convention.coupons_paginated.total_pages,
    getPossibleColumns,
    useQuery: useAdminCouponsQuery,
    storageKeyPrefix: 'coupons',
  });

  return (
    <>
      <TableHeader
        {...tableHeaderProps}
        renderLeftContent={() => (
          <button type="button" className="btn btn-outline-primary ms-2" onClick={newCouponModal.open}>
            <i className="bi-plus" /> New coupon
          </button>
        )}
        exportButton={
          <ReactTableExportButtonWithColumnTransform
            exportUrl="/csv_exports/coupons"
            filters={tableHeaderProps.filters}
            sortBy={tableHeaderProps.sortBy}
            visibleColumnIds={columnSelectionProps.visibleColumnIds}
            columnTransform={transformColumnIdForExport}
          />
        }
      />

      <ReactTableWithTheWorks
        tableInstance={tableInstance}
        loading={loading}
        onClickRow={(row) => editCouponModal.open({ initialCoupon: row.original })}
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
