import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { withRouter, Link } from 'react-router-dom';
import ReactTable from 'react-table';

import { breakValueIntoUnitQuantities } from '../FormPresenter/TimespanItemUtils';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import { EventProposalsAdminQuery } from './queries.gql';
import FreeTextFilter from '../Tables/FreeTextFilter';
import useReactTableWithTheWorks, { QueryDataContext } from '../Tables/useReactTableWithTheWorks';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import TableHeader from '../Tables/TableHeader';
import usePageTitle from '../usePageTitle';
import UserConProfileWithGravatarCell from '../Tables/UserConProfileWithGravatarCell';

const FILTER_CODECS = buildFieldFilterCodecs({
  status: FilterCodecs.stringArray,
  event_category: FilterCodecs.integerArray,
});

function formatCapacity(registrationPolicy) {
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
  { value: 'accepted', label: 'Accepted', badgeClass: 'badge-success' },
  { value: 'rejected', label: 'Rejected', badgeClass: 'badge-danger' },
  { value: 'withdrawn', label: 'Withdrawn', badgeClass: 'badge-warning' },
];

function EventCategoryCell({ value }) {
  return (
    <span className="p-1 small rounded" style={getEventCategoryStyles({ eventCategory: value, variant: 'default' })}>
      {value.name}
    </span>
  );
}

EventCategoryCell.propTypes = {
  value: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

function CapacityCell({ value }) {
  return (
    <div className="text-nowrap text-right">
      {formatCapacity(value)}
    </div>
  );
}

CapacityCell.propTypes = {
  value: PropTypes.shape({}).isRequired,
};

function DurationCell({ value }) {
  const unitQuantities = breakValueIntoUnitQuantities(value);
  const hours = (unitQuantities.find(({ unit }) => unit.name === 'hour') || {}).quantity || 0;
  const minutes = (unitQuantities.find(({ unit }) => unit.name === 'minute') || {}).quantity || 0;

  return (
    <div className="text-nowrap text-right">
      {`${hours}:${minutes.toString().padStart(2, '0')}`}
    </div>
  );
}

DurationCell.propTypes = {
  value: PropTypes.number.isRequired,
};

function StatusFilter({ filter, onChange }) {
  return (
    <ChoiceSetFilter
      name="state"
      choices={STATUS_OPTIONS}
      onChange={onChange}
      filter={filter}
    />
  );
}

StatusFilter.propTypes = {
  filter: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

StatusFilter.defaultProps = {
  filter: null,
};

function StatusCell({ value }) {
  return (
    <div className={`badge ${(STATUS_OPTIONS.find((option) => option.value === value) || {}).badgeClass}`}>
      {value}
    </div>
  );
}

StatusCell.propTypes = {
  value: PropTypes.string.isRequired,
};

function EventProposalOwnerCell({ original }) {
  return <UserConProfileWithGravatarCell original={original.owner} />;
}

EventProposalOwnerCell.propTypes = {
  original: PropTypes.shape({
    owner: PropTypes.shape({}).isRequired,
  }).isRequired,
};

function ExtraCell({ original }) {
  return (
    <Link to={`/admin_event_proposals/${original.id}`} target="_blank" rel="noopener" onClick={(event) => { event.stopPropagation(); }}>
      <i className="fa fa-external-link">
        <span className="sr-only">Open in new window</span>
      </i>
    </Link>
  );
}

ExtraCell.propTypes = {
  original: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

const EventCategoryFilter = ({ filter, onChange }) => {
  const data = useContext(QueryDataContext);
  const choices = useMemo(
    () => (
      data
        ? data.convention.event_categories.map((eventCategory) => ({
          value: eventCategory.id.toString(),
          label: eventCategory.name,
        }))
        : []
    ),
    [data],
  );

  return (
    <ChoiceSetFilter
      name="event_category"
      choices={choices}
      onChange={onChange}
      filter={filter}
      filterCodec={FilterCodecs.integer}
    />
  );
};

EventCategoryFilter.propTypes = {
  filter: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
};

EventCategoryFilter.defaultProps = {
  filter: null,
};

const getPossibleColumns = (data) => [
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
    Filter: FreeTextFilter,
    Cell: EventProposalOwnerCell,
  },
  {
    Header: 'Capacity',
    id: 'total_slots',
    width: 80,
    accessor: (eventProposal) => eventProposal.registration_policy,
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
    width: 80,
    Filter: StatusFilter,
    Cell: StatusCell,
  },
  {
    Header: 'Submitted',
    id: 'submitted_at',
    accessor: 'submitted_at',
    width: 150,
    filterable: false,
    Cell: ({ value }) => (
      moment.tz(value, data.convention.timezone_name).format('YYYY-MM-DD HH:mm')
    ),
  },
  {
    Header: 'Updated',
    id: 'updated_at',
    accessor: 'updated_at',
    width: 150,
    filterable: false,
    Cell: ({ value }) => (
      moment.tz(value, data.convention.timezone_name).format('YYYY-MM-DD HH:mm')
    ),
  },
  {
    Header: '',
    id: '_extra',
    accessor: () => { },
    width: 30,
    filterable: false,
    sortable: false,
    Cell: ExtraCell,
  },
];

function EventProposalsAdminTable({ history }) {
  const [reactTableProps, { tableHeaderProps, queryData }] = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns: ['event_category', 'title', 'owner', 'total_slots', 'length_seconds', 'status', 'submitted_at', 'updated_at'],
    alwaysVisibleColumns: ['_extra'],
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data: tableData }) => tableData.convention.event_proposals_paginated.entries,
    getPages: ({ data: tableData }) => tableData.convention.event_proposals_paginated.total_pages,
    getPossibleColumns,
    history,
    query: EventProposalsAdminQuery,
    storageKeyPrefix: 'eventProposalsAdmin',
  });

  usePageTitle('Event Proposals');

  return (
    <QueryDataContext.Provider value={queryData}>
      <h1 className="mb-4">Event Proposals</h1>
      <div className="mb-4">
        <TableHeader {...tableHeaderProps} exportUrl="/admin_event_proposals/export.csv" />

        <ReactTable
          {...reactTableProps}

          className="-striped -highlight"
          getTrProps={(state, rowInfo) => ({
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

EventProposalsAdminTable.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(EventProposalsAdminTable);
