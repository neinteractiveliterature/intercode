import { useContext, useMemo } from 'react';
import { CellContext, Column, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';

import ArrayToSentenceCell from 'Tables/ArrayToSentenceCell';
import ChoiceSetFilter from 'Tables/ChoiceSetFilter';
import FreeTextFilter from 'Tables/FreeTextFilter';
import MoneyCell from 'Tables/MoneyCell';
import TableHeader from 'Tables/TableHeader';
import useReactTableWithTheWorks, { QueryDataContext } from 'Tables/useReactTableWithTheWorks';
import usePageTitle from 'usePageTitle';
import { buildFieldFilterCodecs, FilterCodecs } from 'Tables/FilterUtils';
import AppRootContext from 'AppRootContext';
import { AdminOrdersQueryData, AdminOrdersQueryDocument } from './queries.generated';
import ReactTableWithTheWorks from 'Tables/ReactTableWithTheWorks';
import { useAppDateTimeFormat } from 'TimeUtils';
import { useTranslation } from 'react-i18next';
import { ActionFunction, json, Outlet, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { CreateOrderDocument, CreateOrderMutationVariables } from './mutations.generated';
import { client } from 'useIntercodeApolloClient';
import { CreateCouponApplicationDocument } from 'Store/mutations.generated';

export type CreateOrderActionInput = {
  createOrderVariables: CreateOrderMutationVariables;
  couponCodes: string[];
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const { createOrderVariables, couponCodes } = (await request.json()) as CreateOrderActionInput;

    const { data } = await client.mutate({
      mutation: CreateOrderDocument,
      variables: createOrderVariables,
    });

    if (!data) {
      return;
    }

    await Promise.all(
      couponCodes.map((code) =>
        client.mutate({
          mutation: CreateCouponApplicationDocument,
          variables: {
            orderId: data.createOrder.order.id,
            couponCode: code,
          },
        }),
      ),
    );

    await client.resetStore();
    return json(data);
  } catch (error) {
    return error;
  }
};

type OrderType = AdminOrdersQueryData['convention']['orders_paginated']['entries'][0];

const fieldFilterCodecs = buildFieldFilterCodecs({
  status: FilterCodecs.stringArray,
});

function StatusFilter({ column }: { column: Column<OrderType, unknown> }) {
  return (
    <ChoiceSetFilter
      column={column}
      choices={[
        { label: 'Paid', value: 'paid' },
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Cancelled', value: 'cancelled' },
      ]}
      multiple
    />
  );
}

function SubmittedAtCell<TData, TValue extends string | undefined | null>({ getValue }: CellContext<TData, TValue>) {
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();
  const value = getValue();

  if (!value) {
    return <></>;
  }

  return <>{format(DateTime.fromISO(value, { zone: timezoneName }), 'shortDateTime')}</>;
}

function OrderAdmin(): JSX.Element {
  const { t } = useTranslation();
  usePageTitle(t('admin.store.orders.title'));
  const navigate = useNavigate();

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<OrderType>();
    return [
      columnHelper.accessor('id', {
        header: t('admin.store.orders.headers.id'),
        id: 'id',
        enableColumnFilter: true,
        enableSorting: true,
        size: 100,
      }),
      columnHelper.accessor('user_con_profile.name_without_nickname', {
        header: t('admin.store.orders.headers.user_name'),
        id: 'user_name',
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('status', {
        header: t('admin.store.orders.headers.status'),
        id: 'status',
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('submitted_at', {
        header: t('admin.store.orders.headers.submitted_at'),
        id: 'submitted_at',
        enableSorting: true,
        cell: SubmittedAtCell,
      }),
      columnHelper.accessor((order) => order.order_entries.map((entry) => entry.describe_products), {
        header: t('admin.store.orders.headers.describe_products'),
        id: 'describe_products',
        cell: ArrayToSentenceCell,
      }),
      columnHelper.accessor('payment_amount', {
        header: t('admin.store.orders.headers.payment_amount'),
        id: 'payment_amount',
        cell: MoneyCell,
      }),
    ];
  }, [t]);

  const {
    tableHeaderProps,
    queryData,
    table: tableInstance,
    loading,
  } = useReactTableWithTheWorks({
    getData: ({ data }) => data?.convention.orders_paginated.entries,
    getPages: ({ data }) => data?.convention.orders_paginated.total_pages,
    columns,
    storageKeyPrefix: 'orderAdmin',
    query: AdminOrdersQueryDocument,
    decodeFilterValue: fieldFilterCodecs.decodeFilterValue,
    encodeFilterValue: fieldFilterCodecs.encodeFilterValue,
  });

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <div className="mb-4">
        <TableHeader
          {...tableHeaderProps}
          exportUrl="/csv_exports/orders"
          renderLeftContent={() =>
            queryData?.currentAbility?.can_create_orders && (
              <Link className="btn btn-outline-primary ms-2" to="./new">
                <i className="bi-plus" /> New order
              </Link>
            )
          }
        />

        <ReactTableWithTheWorks
          table={tableInstance}
          loading={loading}
          onClickRow={
            queryData?.currentAbility.can_update_orders ? (row) => navigate(`./${row.original.id}`) : undefined
          }
          renderFilter={({ column }) => {
            if (column.id === 'id' || column.id === 'user_name') {
              return <FreeTextFilter column={column} />;
            } else if (column.id === 'status') {
              return <StatusFilter column={column} />;
            }
          }}
        />

        <Outlet />
      </div>
    </QueryDataContext.Provider>
  );
}

export const Component = OrderAdmin;
