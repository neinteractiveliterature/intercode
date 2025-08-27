import { Link, useNavigate } from 'react-router';
import { CellContext, Column, createColumnHelper } from '@tanstack/react-table';

import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import FreeTextFilter from '../Tables/FreeTextFilter';
import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import TableHeader from '../Tables/TableHeader';
import usePageTitle from '../usePageTitle';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import { SingleLineTimestampCell } from '../Tables/TimestampCell';
import { EventProposalsAdminQueryData, EventProposalsAdminQueryDocument } from './queries.generated';
import EventCategoryCell from '../Tables/EventCategoryCell';
import EventCategoryFilter from '../Tables/EventCategoryFilter';
import DurationCell from '../Tables/DurationCell';
import CapacityCell from '../Tables/CapacityCell';
import { useMemo } from 'react';

type EventProposalType = EventProposalsAdminQueryData['convention']['event_proposals_paginated']['entries'][0];

const FILTER_CODECS = buildFieldFilterCodecs({
  status: FilterCodecs.stringArray,
  event_category: FilterCodecs.integerArray,
});

const STATUS_OPTIONS = [
  { value: 'proposed', label: 'Proposed', badgeClass: 'bg-light text-dark' },
  { value: 'reviewing', label: 'Reviewing', badgeClass: 'bg-info' },
  { value: 'tentative_accept', label: 'Tentative accept', badgeClass: 'bg-primary' },
  { value: 'accepted', label: 'Accepted', badgeClass: 'bg-success' },
  { value: 'rejected', label: 'Rejected', badgeClass: 'bg-danger' },
  { value: 'withdrawn', label: 'Withdrawn', badgeClass: 'bg-warning' },
] as const;

function StatusFilter<TData extends Record<string, unknown>, TValue>({ column }: { column: Column<TData, TValue> }) {
  return <ChoiceSetFilter column={column} choices={STATUS_OPTIONS} multiple />;
}

function StatusCell<TData, TValue extends EventProposalType['status']>({ getValue }: CellContext<TData, TValue>) {
  const value = getValue();
  const statusOption = STATUS_OPTIONS.find((option) => option.value === value);
  return <div className={`badge ${statusOption?.badgeClass}`}>{statusOption?.label || value}</div>;
}

function ExtraCell({ row: { original } }: CellContext<EventProposalType, unknown>) {
  return (
    <Link
      to={`/admin_event_proposals/${original.id}`}
      target="_blank"
      rel="noopener"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <i className="bi-box-arrow-up-right">
        <span className="visually-hidden">Open in new window</span>
      </i>
    </Link>
  );
}

const defaultVisibleColumns = [
  'event_category',
  'title',
  'owner',
  'total_slots',
  'length_seconds',
  'status',
  'submitted_at',
  'updated_at',
];
const alwaysVisibleColumns = ['_extra'];

function EventProposalsAdminTable(): React.JSX.Element {
  const navigate = useNavigate();
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<EventProposalType>();

    return [
      columnHelper.accessor('event_category', {
        header: 'Category',
        id: 'event_category',
        size: 100,
        cell: EventCategoryCell,
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        id: 'title',
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('owner', {
        header: 'Submitted by',
        id: 'owner',
        cell: UserConProfileWithGravatarCell,
        enableColumnFilter: true,
        enableSorting: true,
      }),
      columnHelper.accessor('registration_policy', {
        header: 'Capacity',
        id: 'total_slots',
        size: 80,
        cell: CapacityCell,
      }),
      columnHelper.accessor('length_seconds', {
        header: 'Duration',
        id: 'length_seconds',
        size: 80,
        enableSorting: true,
        cell: DurationCell,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        id: 'status',
        size: 85,
        enableColumnFilter: true,
        enableSorting: true,
        cell: StatusCell,
      }),
      columnHelper.accessor('submitted_at', {
        header: 'Submitted',
        id: 'submitted_at',
        size: 150,
        enableSorting: true,
        cell: SingleLineTimestampCell,
      }),
      columnHelper.accessor('updated_at', {
        header: 'Updated',
        id: 'updated_at',
        size: 150,
        enableSorting: true,
        cell: SingleLineTimestampCell,
      }),
      columnHelper.display({
        header: '',
        id: '_extra',
        size: 30,
        cell: ExtraCell,
      }),
    ];
  }, []);

  const {
    tableHeaderProps,
    queryData,
    table: tableInstance,
    loading,
  } = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns,
    alwaysVisibleColumns,
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data: tableData }) => tableData.convention.event_proposals_paginated.entries,
    getPages: ({ data: tableData }) => tableData.convention.event_proposals_paginated.total_pages,
    columns,
    query: EventProposalsAdminQueryDocument,
    storageKeyPrefix: 'eventProposalsAdmin',
  });

  usePageTitle('Event Proposals');

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <h1 className="mb-4">Event Proposals</h1>
      <div className="mb-4">
        <TableHeader {...tableHeaderProps} exportUrl="/csv_exports/event_proposals" />

        <ReactTableWithTheWorks
          table={tableInstance}
          loading={loading}
          onClickRow={(row) => navigate(`/admin_event_proposals/${row.original.id}`)}
          renderFilter={({ column }) => {
            if (column.id === 'event_category') {
              return <EventCategoryFilter column={column} />;
            } else if (column.id === 'title' || column.id === 'owner') {
              return <FreeTextFilter column={column} />;
            } else if (column.id === 'status') {
              return <StatusFilter column={column} />;
            }
          }}
        />
      </div>
    </QueryDataContext.Provider>
  );
}

export const Component = EventProposalsAdminTable;
