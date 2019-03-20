import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { withRouter, Link } from 'react-router-dom';
import ReactTable from 'react-table';

import { breakValueIntoUnitQuantities } from '../FormPresenter/TimespanItemUtils';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import { EventProposalsAdminQuery } from './queries.gql';
import FreeTextFilter from '../Tables/FreeTextFilter';
import useReactTableWithTheWorks from '../Tables/useReactTableWithTheWorks';
import { getEventCategoryStyles } from '../EventsApp/ScheduleGrid/StylingUtils';
import TableHeader from '../Tables/TableHeader';

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

const getPossibleColumns = data => [
  {
    Header: 'Category',
    id: 'event_category',
    accessor: 'event_category',
    width: 100,
    Cell: ({ value }) => (
      <span className="p-1 small rounded" style={getEventCategoryStyles({ eventCategory: value, variant: 'default' })}>
        {value.name}
      </span>
    ),
    Filter: ({ filter, onChange }) => (
      <ChoiceSetFilter
        name="event_category"
        choices={data.convention.event_categories.map(eventCategory => ({
          value: eventCategory.id,
          label: eventCategory.name,
        }))}
        onChange={onChange}
        filter={filter}
        filterCodec={FilterCodecs.integer}
      />
    ),
  },
  {
    Header: 'Title',
    id: 'title',
    accessor: 'title',
  },
  {
    Header: 'Submitted by',
    id: 'owner',
    accessor: eventProposal => eventProposal.owner.name_inverted,
    Filter: FreeTextFilter,
  },
  {
    Header: 'Capacity',
    id: 'capacity',
    width: 80,
    accessor: eventProposal => eventProposal.registration_policy,
    filterable: false,
    sortable: false,
    Cell: ({ value }) => (
      <div className="text-nowrap text-right">
        {formatCapacity(value)}
      </div>
    ),
  },
  {
    Header: 'Duration',
    id: 'duration',
    accessor: 'length_seconds',
    width: 80,
    filterable: false,
    Cell: ({ value }) => {
      const unitQuantities = breakValueIntoUnitQuantities(value);
      const hours = (unitQuantities.find(({ unit }) => unit.name === 'hour') || {}).quantity || 0;
      const minutes = (unitQuantities.find(({ unit }) => unit.name === 'minute') || {}).quantity || 0;

      return (
        <div className="text-nowrap text-right">
          {`${hours}:${minutes.toString().padStart(2, '0')}`}
        </div>
      );
    },
  },
  {
    Header: 'Status',
    id: 'status',
    accessor: 'status',
    width: 80,
    Filter: ({ filter, onChange }) => (
      <ChoiceSetFilter
        name="state"
        choices={STATUS_OPTIONS}
        onChange={onChange}
        filter={filter}
      />
    ),
    Cell: ({ value }) => (
      <div className={`badge ${(STATUS_OPTIONS.find(option => option.value === value) || {}).badgeClass}`}>
        {value}
      </div>
    ),
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
    Cell: ({ original }) => (
      <Link to={`${original.id}`} target="_blank" rel="noopener" onClick={(event) => { event.stopPropagation(); }}>
        <i className="fa fa-external-link">
          <span className="sr-only">Open in new window</span>
        </i>
      </Link>
    ),
  },
];

function EventProposalsAdminTable({ defaultVisibleColumns, exportUrl, history }) {
  const [reactTableProps, { tableHeaderProps }] = useReactTableWithTheWorks({
    decodeFilterValue: FILTER_CODECS.decodeFilterValue,
    defaultVisibleColumns,
    alwaysVisibleColumns: ['_extra'],
    encodeFilterValue: FILTER_CODECS.encodeFilterValue,
    getData: ({ data }) => data.convention.event_proposals_paginated.entries,
    getPages: ({ data }) => data.convention.event_proposals_paginated.total_pages,
    getPossibleColumns,
    history,
    query: EventProposalsAdminQuery,
    storageKeyPrefix: 'eventProposalsAdmin',
  });

  return (
    <div className="mb-4">
      <TableHeader {...tableHeaderProps} exportUrl={exportUrl} />

      <ReactTable
        {...reactTableProps}

        className="-striped -highlight"
        getTrProps={(state, rowInfo) => ({
          style: { cursor: 'pointer' },
          onClick: () => {
            history.push(`${rowInfo.original.id}`);
          },
        })}
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      />
    </div>
  );
}

EventProposalsAdminTable.propTypes = {
  defaultVisibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  exportUrl: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(EventProposalsAdminTable);
