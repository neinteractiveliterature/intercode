import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment-timezone';
import { withRouter, Link } from 'react-router-dom';

import { breakValueIntoUnitQuantities } from '../FormPresenter/TimespanItemUtils';
import ChoiceSetFilter from '../Tables/ChoiceSetFilter';
import { encodeStringArray, decodeStringArray } from '../Tables/FilterUtils';
import FreeTextFilter from '../Tables/FreeTextFilter';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';

const eventProposalsAdminQuery = gql`
query EventProposalsAdminQuery($page: Int, $perPage: Int, $filters: EventProposalFiltersInput, $sort: [SortInput]) {
  convention {
    id
    timezone_name

    event_proposals_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
      total_entries
      total_pages
      current_page
      per_page

      entries {
        id
        title
        length_seconds
        status
        submitted_at
        updated_at

        registration_policy {
          minimum_slots
          total_slots
          slots_limited
        }

        owner {
          id
          name_inverted
        }
      }
    }
  }
}
`;

function encodeFilterValue(field, value) {
  if (field === 'status') {
    return encodeStringArray(value);
  }

  return value;
}

function decodeFilterValue(field, value) {
  if (field === 'status') {
    return decodeStringArray(value);
  }

  return value;
}

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

@withRouter
class EventProposalsAdminTable extends React.Component {
  static propTypes = {
    defaultVisibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    exportUrl: PropTypes.string.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  getPossibleColumns = data => [
    {
      Header: 'Title',
      id: 'title',
      accessor: 'title',
    },
    {
      Header: 'Submitted by',
      id: 'owner',
      accessor: eventProposal => eventProposal.owner.name_inverted,
      Filter: ({ filter, onChange }) => (
        <FreeTextFilter filter={filter} onChange={onChange} />
      ),
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
      accessor: () => {},
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

  render = () => (
    <div className="mb-4">
      <ReactTableWithTheWorks
        decodeFilterValue={decodeFilterValue}
        defaultVisibleColumns={this.props.defaultVisibleColumns}
        alwaysVisibleColumns={['_extra']}
        encodeFilterValue={encodeFilterValue}
        exportUrl={this.props.exportUrl}
        getData={({ data }) => data.convention.event_proposals_paginated.entries}
        getPages={({ data }) => data.convention.event_proposals_paginated.total_pages}
        getPossibleColumns={this.getPossibleColumns}
        query={eventProposalsAdminQuery}
        storageKeyPrefix="eventProposalsAdmin"

        className="-striped -highlight"
        getTrProps={(state, rowInfo) => ({
          style: { cursor: 'pointer' },
          onClick: () => {
            this.props.history.push(`${rowInfo.original.id}`);
          },
        })}
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      />
    </div>
  )
}

export default EventProposalsAdminTable;
