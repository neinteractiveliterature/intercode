import { useMemo, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Column, FilterProps, CellProps } from 'react-table';

import { breakValueIntoUnitQuantities } from '../FormPresenter/TimespanItemUtils';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import FreeTextFilter from '../Tables/FreeTextFilter';
import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import TableHeader from '../Tables/TableHeader';
import usePageTitle from '../usePageTitle';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import { SingleLineTimestampCell } from '../Tables/TimestampCell';
import { EventProposalsAdminQueryData, useEventProposalsAdminQuery } from './queries.generated';

type EventProposalType =
  EventProposalsAdminQueryData['convention']['event_proposals_paginated']['entries'][0];

const FILTER_CODECS = buildFieldFilterCodecs({
  status: FilterCodecs.stringArray,
  event_category: FilterCodecs.integerArray,
});

function formatCapacity(registrationPolicy: NonNullable<EventProposalType['registration_policy']>) {
  if (!registrationPolicy.slots_limited) {
    return 'unlimited';
  }

  if (registrationPolicy.total_slots === registrationPolicy.minimum_slots) {
    return registrationPolicy.total_slots;
  }

  return `${registrationPolicy.minimum_slots}-${registrationPolicy.total_slots}`;
}

const STATUS_OPTIONS = [
  { value: 'proposed', label: 'Proposed', badgeClass: 'bg-light text-dark' },
  { value: 'reviewing', label: 'Reviewing', badgeClass: 'bg-info' },
  { value: 'tentative_accept', label: 'Tentative accept', badgeClass: 'bg-primary' },
  { value: 'accepted', label: 'Accepted', badgeClass: 'bg-success' },
  { value: 'rejected', label: 'Rejected', badgeClass: 'bg-danger' },
  { value: 'withdrawn', label: 'Withdrawn', badgeClass: 'bg-warning' },
] as const;

function EventCategoryCell({ value }: { value: EventProposalType['event_category'] }) {
  return (
    <span
      className="p-1 small rounded"
      style={getEventCategoryStyles({ eventCategory: value, variant: 'default' })}
    >
      {value.name}
    </span>
  );
}

function CapacityCell({ value }: { value: NonNullable<EventProposalType['registration_policy']> }) {
  return <div className="text-nowrap text-end">{formatCapacity(value)}</div>;
}

function DurationCell({ value }: { value: NonNullable<EventProposalType['length_seconds']> }) {
  const unitQuantities = breakValueIntoUnitQuantities(value);
  const hours = (unitQuantities.find(({ unit }) => unit.name === 'hour') || {}).quantity || 0;
  const minutes = (unitQuantities.find(({ unit }) => unit.name === 'minute') || {}).quantity || 0;

  return (
    <div className="text-nowrap text-end">{`${hours}:${minutes.toString().padStart(2, '0')}`}</div>
  );
}

function StatusFilter(props: FilterProps<EventProposalType>) {
  return <ChoiceSetFilter {...props} choices={STATUS_OPTIONS} multiple />;
}

function StatusCell({ value }: { value: EventProposalType['status'] }) {
  const statusOption = STATUS_OPTIONS.find((option) => option.value === value);
  return <div className={`badge ${statusOption?.badgeClass}`}>{statusOption?.label || value}</div>;
}

function ExtraCell({ row: { original } }: CellProps<EventProposalType>) {
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

const EventCategoryFilter = (props: FilterProps<EventProposalType>) => {
  const data = useContext(QueryDataContext) as EventProposalsAdminQueryData;
  const choices = useMemo(
    () =>
      data
        ? data.convention.event_categories.map((eventCategory) => ({
            value: eventCategory.id.toString(),
            label: eventCategory.name,
          }))
        : [],
    [data],
  );

  return <ChoiceSetFilter {...props} choices={choices} multiple />;
};

function getPossibleColumns(): Column<EventProposalType>[] {
  return [
    {
      Header: 'Category',
      id: 'event_category',
      accessor: 'event_category',
      width: 100,
      Cell: EventCategoryCell,
      Filter: EventCategoryFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Title',
      id: 'title',
      accessor: 'title',
      Filter: FreeTextFilter,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Submitted by',
      id: 'owner',
      accessor: (eventProposal: EventProposalType) => eventProposal.owner,
      Filter: FreeTextFilter,
      Cell: UserConProfileWithGravatarCell,
      disableFilters: false,
      disableSortBy: false,
    },
    {
      Header: 'Capacity',
      id: 'total_slots',
      width: 80,
      accessor: (eventProposal: EventProposalType) => eventProposal.registration_policy,
      Cell: CapacityCell,
    },
    {
      Header: 'Duration',
      id: 'length_seconds',
      accessor: 'length_seconds',
      width: 80,
      disableSortBy: false,
      Cell: DurationCell,
    },
    {
      Header: 'Status',
      id: 'status',
      accessor: 'status',
      width: 85,
      disableFilters: false,
      disableSortBy: false,
      Filter: StatusFilter,
      Cell: StatusCell,
    },
    {
      Header: 'Submitted',
      id: 'submitted_at',
      accessor: 'submitted_at',
      width: 150,
      disableSortBy: false,
      Cell: SingleLineTimestampCell,
    },
    {
      Header: 'Updated',
      id: 'updated_at',
      accessor: 'updated_at',
      width: 150,
      disableSortBy: false,
      Cell: SingleLineTimestampCell,
    },
    {
      Header: '',
      id: '_extra',
      accessor: () => {},
      width: 30,
      Cell: ExtraCell,
    },
  ];
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

function EventProposalsAdminTable(): JSX.Element {
  const history = useHistory();
  const { tableHeaderProps, queryData, tableInstance, loading } = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns,
    alwaysVisibleColumns,
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data: tableData }) => tableData.convention.event_proposals_paginated.entries,
    getPages: ({ data: tableData }) => tableData.convention.event_proposals_paginated.total_pages,
    getPossibleColumns,
    useQuery: useEventProposalsAdminQuery,
    storageKeyPrefix: 'eventProposalsAdmin',
  });

  usePageTitle('Event Proposals');

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <h1 className="mb-4">Event Proposals</h1>
      <div className="mb-4">
        <TableHeader {...tableHeaderProps} exportUrl="/csv_exports/event_proposals" />

        <ReactTableWithTheWorks
          tableInstance={tableInstance}
          loading={loading}
          onClickRow={(row) => history.push(`/admin_event_proposals/${row.original.id}`)}
        />
      </div>
    </QueryDataContext.Provider>
  );
}

export default EventProposalsAdminTable;
