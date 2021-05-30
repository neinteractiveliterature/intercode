import { useState, useContext, useMemo } from 'react';
import { Column, FilterProps } from 'react-table';
import { DateTime } from 'luxon';

import ArrayToSentenceCell from '../Tables/ArrayToSentenceCell';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import FreeTextFilter from '../Tables/FreeTextFilter';
import MoneyCell from '../Tables/MoneyCell';
import TableHeader from '../Tables/TableHeader';
import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import usePageTitle from '../usePageTitle';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import useModal from '../ModalDialogs/useModal';
import EditOrderModal from './EditOrderModal';
import NewOrderModal from './NewOrderModal';
import AppRootContext from '../AppRootContext';
import { AdminOrdersQueryData, useAdminOrdersQuery } from './queries.generated';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { useAppDateTimeFormat } from '../TimeUtils';

type OrderType = AdminOrdersQueryData['convention']['orders_paginated']['entries'][0];

const fieldFilterCodecs = buildFieldFilterCodecs({
  status: FilterCodecs.stringArray,
});

const StatusFilter = (props: FilterProps<OrderType>) => (
  <ChoiceSetFilter
    {...props}
    choices={[
      { label: 'Paid', value: 'paid' },
      { label: 'Unpaid', value: 'unpaid' },
      { label: 'Cancelled', value: 'cancelled' },
    ]}
    multiple
  />
);

type SubmittedAtCellProps = {
  value?: string | null;
};

const SubmittedAtCell = ({ value }: SubmittedAtCellProps) => {
  const { timezoneName } = useContext(AppRootContext);
  const format = useAppDateTimeFormat();

  if (!value) {
    return <></>;
  }

  return <>{format(DateTime.fromISO(value, { zone: timezoneName }), 'shortDateTime')}</>;
};

function getPossibleColumns(): Column<OrderType>[] {
  return [
    {
      Header: 'ID',
      id: 'id',
      accessor: 'id',
      disableFilters: false,
      disableSortBy: false,
      Filter: FreeTextFilter,
      width: 100,
    },
    {
      Header: 'User',
      id: 'user_name',
      disableFilters: false,
      disableSortBy: false,
      accessor: (order: OrderType) => order.user_con_profile.name_without_nickname,
      Filter: FreeTextFilter,
    },
    {
      Header: 'Status',
      id: 'status',
      accessor: 'status',
      disableFilters: false,
      disableSortBy: false,
      Filter: StatusFilter,
    },
    {
      Header: 'Submitted',
      id: 'submitted_at',
      accessor: 'submitted_at',
      disableSortBy: false,
      Cell: ({ value }: { value: OrderType['submitted_at'] }) => <SubmittedAtCell value={value} />,
    },
    {
      Header: 'Products',
      id: 'describe_products',
      accessor: (order: OrderType) => order.order_entries.map((entry) => entry.describe_products),
      Cell: ArrayToSentenceCell,
    },
    {
      Header: 'Payment amount',
      id: 'payment_amount',
      accessor: 'payment_amount',
      Cell: MoneyCell,
    },
  ];
}

function OrderAdmin() {
  const newOrderModal = useModal();
  const [editingOrderId, setEditingOrderId] = useState<number>();
  usePageTitle('Orders');

  const { tableHeaderProps, queryData, tableInstance, loading } = useReactTableWithTheWorks({
    getData: ({ data }) => data!.convention.orders_paginated.entries,
    getPages: ({ data }) => data!.convention.orders_paginated.total_pages,
    getPossibleColumns,
    storageKeyPrefix: 'orderAdmin',
    useQuery: useAdminOrdersQuery,
    decodeFilterValue: fieldFilterCodecs.decodeFilterValue,
    encodeFilterValue: fieldFilterCodecs.encodeFilterValue,
  });

  // memo to my future self if I get the bright idea to rip this out again:
  // if we don't do it this way, the order doesn't update in the EditOrderModal after it changes
  const editingOrder = useMemo(
    () =>
      editingOrderId
        ? queryData?.convention?.orders_paginated?.entries?.find(
            (order) => order.id === editingOrderId,
          )
        : undefined,
    [queryData, editingOrderId],
  );

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <div className="mb-4">
        <TableHeader
          {...tableHeaderProps}
          exportUrl="/csv_exports/orders"
          renderLeftContent={() =>
            queryData?.currentAbility?.can_create_orders && (
              <button
                type="button"
                className="btn btn-outline-primary ms-2"
                onClick={newOrderModal.open}
              >
                <i className="fa fa-plus" /> New order
              </button>
            )
          }
        />

        <ReactTableWithTheWorks
          tableInstance={tableInstance}
          loading={loading}
          onClickRow={
            queryData?.currentAbility.can_update_orders
              ? (row) => setEditingOrderId(row.original.id)
              : undefined
          }
        />

        <NewOrderModal visible={newOrderModal.visible} close={newOrderModal.close} />
        <EditOrderModal order={editingOrder} closeModal={() => setEditingOrderId(undefined)} />
      </div>
    </QueryDataContext.Provider>
  );
}

export default OrderAdmin;
