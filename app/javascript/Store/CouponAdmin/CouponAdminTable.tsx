import { CellContext, createColumnHelper } from '@tanstack/react-table';

import describeCoupon from '../describeCoupon';
import useReactTableWithTheWorks from '../../Tables/useReactTableWithTheWorks';
import { SingleLineTimestampCell } from '../../Tables/TimestampCell';
import TableHeader from '../../Tables/TableHeader';
import ReactTableExportButtonWithColumnTransform from '../../Tables/ReactTableExportButtonWithColumnTransform';
import { AdminCouponsQueryData, AdminCouponsQueryDocument } from './queries.generated';
import ReactTableWithTheWorks from '../../Tables/ReactTableWithTheWorks';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

type CouponType = AdminCouponsQueryData['convention']['coupons_paginated']['entries'][0];

const transformColumnIdForExport = (columnId: string) => {
  if (columnId === 'effect') {
    // eslint-disable-next-line i18next/no-literal-string
    return ['fixed_amount', 'percent_discount', 'provides_product'];
  }

  return columnId;
};

function CouponUsageLimitCell({ getValue }: CellContext<CouponType, CouponType['usage_limit']>) {
  const { t } = useTranslation();
  const value = getValue();
  return value ? t('store.coupons.usageLimitCount', { count: value }) : <em>{t('store.coupons.unlimitedUses')}</em>;
}

function CouponEffectCell({ getValue }: CellContext<CouponType, CouponType>) {
  return describeCoupon(getValue());
}

function CouponAdminTable(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<CouponType>();
    return [
      columnHelper.accessor('code', {
        header: t('admin.store.coupons.table.headers.code'),
        id: 'code',
        size: 250,
        enableSorting: true,
      }),
      columnHelper.accessor((row) => row, {
        header: t('admin.store.coupons.table.headers.effect'),
        id: 'effect',
        cell: CouponEffectCell,
      }),
      columnHelper.accessor('usage_limit', {
        header: t('admin.store.coupons.table.headers.usage_limit'),
        id: 'usage_limit',
        enableSorting: true,
        cell: CouponUsageLimitCell,
      }),
      columnHelper.accessor('expires_at', {
        header: t('admin.store.coupons.table.headers.expires_at'),
        id: 'expires_at',
        size: 150,
        cell: SingleLineTimestampCell,
        enableSorting: true,
      }),
    ];
  }, [t]);

  const {
    tableHeaderProps,
    columnSelectionProps,
    table: tableInstance,
    loading,
  } = useReactTableWithTheWorks({
    getData: ({ data }) => data?.convention.coupons_paginated.entries,
    getPages: ({ data }) => data?.convention.coupons_paginated.total_pages,
    columns,
    query: AdminCouponsQueryDocument,
    storageKeyPrefix: 'coupons',
  });

  return (
    <>
      <TableHeader
        {...tableHeaderProps}
        renderLeftContent={() => (
          <Link to="./new" className="btn btn-outline-primary ms-2">
            <i className="bi-plus" /> New coupon
          </Link>
        )}
        exportButton={
          <ReactTableExportButtonWithColumnTransform
            exportUrl="/csv_exports/coupons"
            filters={tableHeaderProps.filters}
            sortBy={tableHeaderProps.sortBy}
            columnVisibility={columnSelectionProps.columnVisibility}
            columnTransform={transformColumnIdForExport}
          />
        }
      />

      <ReactTableWithTheWorks
        table={tableInstance}
        loading={loading}
        onClickRow={(row) => navigate(`./${row.original.id}`)}
      />

      <Outlet />
    </>
  );
}

export const Component = CouponAdminTable;
