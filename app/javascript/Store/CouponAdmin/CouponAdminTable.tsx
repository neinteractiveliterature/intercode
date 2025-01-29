import { Column } from '@tanstack/react-table';

import describeCoupon from '../describeCoupon';
import useReactTableWithTheWorks from '../../Tables/useReactTableWithTheWorks';
import { SingleLineTimestampCell } from '../../Tables/TimestampCell';
import TableHeader from '../../Tables/TableHeader';
import ReactTableExportButtonWithColumnTransform from '../../Tables/ReactTableExportButtonWithColumnTransform';
import { AdminCouponsQueryData, AdminCouponsQueryDocument } from './queries.generated';
import ReactTableWithTheWorks from '../../Tables/ReactTableWithTheWorks';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useCallback } from 'react';
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

function CouponUsageLimitCell({ value }: { value: CouponType['usage_limit'] }) {
  const { t } = useTranslation();
  return value ? (
    <>{t('store.coupons.usageLimitCount', { count: value })}</>
  ) : (
    <em>{t('store.coupons.unlimitedUses')}</em>
  );
}

const CouponEffectCell = ({ value }: { value: CouponType }) => <>{describeCoupon(value)}</>;

function getPossibleColumns(t: TFunction): Column<CouponType>[] {
  return [
    {
      Header: t('admin.store.coupons.table.headers.code'),
      id: 'code',
      accessor: 'code',
      width: 250,
      disableSortBy: false,
    },
    {
      Header: t('admin.store.coupons.table.headers.effect'),
      id: 'effect',
      accessor: (coupon: CouponType) => coupon,
      Cell: CouponEffectCell,
    },
    {
      Header: t('admin.store.coupons.table.headers.usage_limit'),
      id: 'usage_limit',
      accessor: 'usage_limit',
      disableSortBy: false,
      Cell: CouponUsageLimitCell,
    },
    {
      Header: t('admin.store.coupons.table.headers.expires_at'),
      id: 'expires_at',
      accessor: 'expires_at',
      width: 150,
      Cell: SingleLineTimestampCell,
      disableSortBy: false,
    },
  ];
}

function CouponAdminTable(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getPossibleColumnsWithTranslation = useCallback(() => getPossibleColumns(t), [t]);

  const {
    tableHeaderProps,
    columnSelectionProps,
    table: tableInstance,
    loading,
  } = useReactTableWithTheWorks({
    getData: ({ data }) => data?.convention.coupons_paginated.entries,
    getPages: ({ data }) => data?.convention.coupons_paginated.total_pages,
    getPossibleColumns: getPossibleColumnsWithTranslation,
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
            visibleColumnIds={columnSelectionProps.visibleColumnIds}
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
