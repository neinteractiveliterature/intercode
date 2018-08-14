import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment-timezone';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';

import { ageAsOf } from '../TimeUtils';
import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import ExportButton from '../Tables/ExportButton';
import PopperDropdown from '../UIComponents/PopperDropdown';
import GraphQLReactTableWrapper from '../Tables/GraphQLReactTableWrapper';
import ReactRouterReactTableWrapper from '../Tables/ReactRouterReactTableWrapper';

const signupsQuery = gql`
query($eventId: Int!, $runId: Int!, $page: Int, $perPage: Int, $filters: SignupFiltersInput, $sort: [SortInput]) {
  event(id: $eventId) {
    id

    registration_policy {
      buckets {
        key
        name
      }
    }

    run(id: $runId) {
      id

      signups_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
        total_entries
        total_pages
        current_page
        per_page

        entries {
          id
          state
          counted
          bucket_key
          requested_bucket_key

          run {
            starts_at
          }

          user_con_profile {
            id
            name_inverted
            email
            birth_date
          }
        }
      }
    }
  }
}
`;

function findBucket(bucketKey, event) {
  return event.registration_policy.buckets.find(bucket => bucket.key === bucketKey);
}

function formatBucket({ value: bucketKey, original: signup }, event) {
  if (!signup.counted) {
    if (bucketKey) {
      return `${findBucket(bucketKey, event).name} (not counted)`;
    }
    return 'Not counted';
  }

  const bucket = findBucket(bucketKey, event);
  const requestedBucket = findBucket(signup.requested_bucket_key, event);

  if (bucket && requestedBucket && bucket.name === requestedBucket.name) {
    return bucket.name;
  }

  if (requestedBucket) {
    return `${(bucket || {}).name || 'None'} (requested ${requestedBucket.name})`;
  }

  if (bucket) {
    return `${bucket.name} (no preference)`;
  }

  return 'None';
}

function encodeFilterValue(field, value) {
  if (field === 'state' || field === 'bucket') {
    return value.join(',');
  }

  return value;
}

function decodeFilterValue(field, value) {
  if (field === 'state' || field === 'bucket') {
    return value.split(',');
  }

  return value;
}

const STATE_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

@withRouter
class RunSignupsTable extends React.Component {
  static propTypes = {
    defaultVisibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    eventId: PropTypes.number.isRequired,
    exportUrl: PropTypes.string.isRequired,
    runId: PropTypes.number.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };

  getPossibleColumns = data => [
    {
      Header: 'Seq',
      id: 'id',
      accessor: 'id',
      filterable: false,
      width: 40,
    },
    {
      Header: 'State',
      id: 'state',
      accessor: 'state',
      width: 130,
      Filter: ({ filter, onChange }) => (
        <ChoiceSet
          name="state"
          choices={STATE_OPTIONS}
          value={(filter || {}).value || []}
          onChange={newValue => onChange(newValue)}
          multiple
        />
      ),
      Cell: props => (
        <div className={`badge bg-signup-state-color-${props.value}`}>
          {props.value}
        </div>
      ),
    },
    {
      Header: 'Name',
      id: 'name',
      accessor: signup => signup.user_con_profile.name_inverted,
    },
    {
      Header: 'Bucket',
      id: 'bucket',
      accessor: signup => signup.bucket_key,
      Cell: props => formatBucket(props, data.event),
      Filter: ({ filter, onChange }) => (
        <ChoiceSet
          name="bucket"
          choices={(
            (data || {}).event
              ? data.event.registration_policy.buckets
                .map(bucket => ({ label: bucket.name, value: bucket.key }))
              : []
            )}
          value={(filter || {}).value || []}
          onChange={newValue => onChange(newValue)}
          multiple
        />
      ),
    },
    {
      Header: 'Age',
      id: 'age',
      width: 40,
      accessor: signup => ageAsOf(
        moment(signup.user_con_profile.birth_date),
        moment(signup.run.starts_at),
      ),
      filterable: false,
    },
    {
      Header: 'Email',
      id: 'email',
      accessor: signup => signup.user_con_profile.email,
      Cell: ({ value }) => (
        <a href={`mailto:${value}`} onClick={(event) => { event.stopPropagation(); }}>
          {value}
        </a>
      ),
    },
  ];

  getVisibleColumnIds = () => {
    const params = new URLSearchParams(this.props.history.location.search);
    if (params.get('columns')) {
      return params.get('columns').split(',');
    }
    return this.props.defaultVisibleColumns;
  }

  getVisibleColumns = (data) => {
    const visibleColumnIds = this.getVisibleColumnIds();
    return this.getPossibleColumns(data)
      .filter(column => visibleColumnIds.includes(column.id));
  }

  setColumnVisibility = (columns) => {
    const params = new URLSearchParams(this.props.history.location.search);
    params.set('columns', columns.join(','));
    this.props.history.replace(`${this.props.history.location.pathname}?${params.toString()}`)
  }

  renderColumnSelector = () => (
    <PopperDropdown
      placement="bottom-end"
      renderReference={({ ref, toggle }) => (
        <button type="button" className="btn btn-outline-primary dropdown-toggle" ref={ref} onClick={toggle}>
          Columns
        </button>
      )}
    >
      <div className="px-2">
        <ChoiceSet
          name="columns"
          multiple
          choices={
            this.getPossibleColumns()
              .map(column => ({ label: column.Header, value: column.id }))
          }
          value={this.getVisibleColumnIds()}
          onChange={this.setColumnVisibility}
        />
      </div>
    </PopperDropdown>
  )

  render = () => (
    <div className="mb-4">
      <ReactRouterReactTableWrapper
        decodeFilterValue={decodeFilterValue}
        encodeFilterValue={encodeFilterValue}
      >
        {tableStateProps => (
          <GraphQLReactTableWrapper
            query={signupsQuery}
            variables={{ eventId: this.props.eventId, runId: this.props.runId }}
          >
            {(graphQLProps, { data }) => (
              <div>
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <ExportButton
                      exportUrl={this.props.exportUrl}
                      filtered={tableStateProps.filtered}
                      sorted={tableStateProps.sorted}
                      columns={this.getVisibleColumnIds()}
                    />
                  </div>
                  <div>
                    {this.renderColumnSelector()}
                  </div>
                </div>
                <ReactTable
                  {...tableStateProps}
                  {...graphQLProps}
                  className="-striped -highlight"
                  data={
                    ((data || {}).event || { run: { signups_paginated: {} } }).run.signups_paginated.entries
                  }
                  pages={
                    ((data || {}).event || { run: { signups_paginated: {} } }).run.signups_paginated.total_pages
                  }
                  columns={this.getVisibleColumns(data)}
                  getTrProps={(state, rowInfo) => ({
                    style: { cursor: 'pointer' },
                    onClick: () => {
                      this.props.history.push(`${rowInfo.original.id}/edit`);
                    },
                  })}
                  getTheadFilterThProps={() => ({ className: 'text-left' })}
                />
              </div>
            )}
          </GraphQLReactTableWrapper>
        )}
      </ReactRouterReactTableWrapper>
    </div>
  )
}

export default RunSignupsTable;
