import React, { useMemo, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ReactTable, { RowInfo } from 'react-table';

import { breakValueIntoUnitQuantities } from '../FormPresenter/TimespanItemUtils';
import ChoiceSetFilter, { ChoiceSetFilterMultipleProps } from '../Tables/ChoiceSetFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import FreeTextFilter from '../Tables/FreeTextFilter';
import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import TableHeader from '../Tables/TableHeader';
import usePageTitle from '../usePageTitle';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';
import { SingleLineTimestampCell } from '../Tables/TimestampCell';
import {
  EventProposalsAdminQueryQuery,
  useEventProposalsAdminQueryQuery,
} from './queries.generated';

type EventProposalType = EventProposalsAdminQueryQuery['convention']['event_proposals_paginated']['entries'][0];

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
  { value: 'proposed', label: 'Proposed', badgeClass: 'badge-light' },
  { value: 'reviewing', label: 'Reviewing', badgeClass: 'badge-info' },
  { value: 'tentative_accept', label: 'Tentative accept', badgeClass: 'badge-primary' },
  { value: 'accepted', label: 'Accepted', badgeClass: 'badge-success' },
  { value: 'rejected', label: 'Rejected', badgeClass: 'badge-danger' },
  { value: 'withdrawn', label: 'Withdrawn', badgeClass: 'badge-warning' },
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
  return <div className="text-nowrap text-right">{formatCapacity(value)}</div>;
}

function DurationCell({ value }: { value: NonNullable<EventProposalType['length_seconds']> }) {
  const unitQuantities = breakValueIntoUnitQuantities(value);
  const hours = (unitQuantities.find(({ unit }) => unit.name === 'hour') || {}).quantity || 0;
  const minutes = (unitQuantities.find(({ unit }) => unit.name === 'minute') || {}).quantity || 0;

  return (
    <div className="text-nowrap text-right">
      {`${hours}:${minutes.toString().padStart(2, '0')}`}
    </div>
  );
}

function StatusFilter({
  filter,
  onChange,
}: Pick<ChoiceSetFilterMultipleProps, 'filter' | 'onChange'>) {
  return <ChoiceSetFilter choices={STATUS_OPTIONS} onChange={onChange} filter={filter} multiple />;
}

function StatusCell({ value }: { value: EventProposalType['status'] }) {
  const statusOption = STATUS_OPTIONS.find((option) => option.value === value);
  return <div className={`badge ${statusOption?.badgeClass}`}>{statusOption?.label || value}</div>;
}

function ExtraCell({ original }: { original: EventProposalType }) {
  return (
    <Link
      to={`/admin_event_proposals/${original.id}`}
      target="_blank"
      rel="noopener"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <i className="fa fa-external-link">
        <span className="sr-only">Open in new window</span>
      </i>
    </Link>
  );
}

const EventCategoryFilter = ({
  filter,
  onChange,
}: Pick<ChoiceSetFilterMultipleProps, 'filter' | 'onChange'>) => {
  const data = useContext(QueryDataContext) as EventProposalsAdminQueryQuery;
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

  return <ChoiceSetFilter choices={choices} onChange={onChange} filter={filter} multiple />;
};

const getPossibleColumns = () => [
  {
    Header: 'Category',
    id: 'event_category',
    accessor: 'event_category',
    width: 100,
    Cell: EventCategoryCell,
    Filter: EventCategoryFilter,
  },
  {
    Header: 'Title',
    id: 'title',
    accessor: 'title',
    Filter: FreeTextFilter,
  },
  {
    Header: 'Submitted by',
    id: 'owner',
    accessor: (eventProposal: EventProposalType) => eventProposal.owner,
    Filter: FreeTextFilter,
    Cell: UserConProfileWithGravatarCell,
  },
  {
    Header: 'Capacity',
    id: 'total_slots',
    width: 80,
    accessor: (eventProposal: EventProposalType) => eventProposal.registration_policy,
    filterable: false,
    sortable: false,
    Cell: CapacityCell,
  },
  {
    Header: 'Duration',
    id: 'length_seconds',
    accessor: 'length_seconds',
    width: 80,
    filterable: false,
    Cell: DurationCell,
  },
  {
    Header: 'Status',
    id: 'status',
    accessor: 'status',
    width: 85,
    Filter: StatusFilter,
    Cell: StatusCell,
  },
  {
    Header: 'Submitted',
    id: 'submitted_at',
    accessor: 'submitted_at',
    width: 150,
    filterable: false,
    Cell: SingleLineTimestampCell,
  },
  {
    Header: 'Updated',
    id: 'updated_at',
    accessor: 'updated_at',
    width: 150,
    filterable: false,
    Cell: SingleLineTimestampCell,
  },
  {
    Header: '',
    id: '_extra',
    accessor: () => {},
    width: 30,
    filterable: false,
    sortable: false,
    Cell: ExtraCell,
  },
];

function EventProposalsAdminTable() {
  const history = useHistory();
  const [reactTableProps, { tableHeaderProps, queryData }] = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns: [
      'event_category',
      'title',
      'owner',
      'total_slots',
      'length_seconds',
      'status',
      'submitted_at',
      'updated_at',
    ],
    alwaysVisibleColumns: ['_extra'],
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data: tableData }) => tableData.convention.event_proposals_paginated.entries,
    getPages: ({ data: tableData }) => tableData.convention.event_proposals_paginated.total_pages,
    getPossibleColumns,
    useQuery: useEventProposalsAdminQueryQuery,
    storageKeyPrefix: 'eventProposalsAdmin',
  });

  usePageTitle('Event Proposals');

  return (
    <QueryDataContext.Provider value={queryData ?? {}}>
      <h1 className="mb-4">Event Proposals</h1>
      <div className="mb-4">
        <TableHeader {...tableHeaderProps} exportUrl="/csv_exports/event_proposals" />

        <ReactTable
          {...reactTableProps}
          className="-striped -highlight"
          getTrProps={(state: any, rowInfo: RowInfo) => ({
            style: { cursor: 'pointer' },
            onClick: () => {
              history.push(`/admin_event_proposals/${rowInfo.original.id}`);
            },
          })}
          getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
        />
      </div>
    </QueryDataContext.Provider>
  );
}

export default EventProposalsAdminTable;
