import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment-timezone';
import { withRouter } from 'react-router-dom';

import { ageAsOf } from '../TimeUtils';
import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import GraphQLReactTable from '../GraphQLReactTable';

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

function encodeSearchParams({
  page,
  pageSize,
  filtered,
  sorted,
}) {
  const params = new URLSearchParams();

  if (page != null && page > 0) {
    params.append('page', page);
  }

  if (pageSize != null && pageSize !== 20) {
    params.append('pageSize', pageSize);
  }

  filtered.forEach(({ id, value }) => {
    params.append(`filters.${id}`, encodeFilterValue(id, value));
  });

  sorted.forEach(({ id, desc }) => {
    params.append(`sort.${id}`, desc ? 'desc' : 'asc');
  });

  return params.toString();
}

function decodeFilterValue(field, value) {
  if (field === 'state' || field === 'bucket') {
    return value.split(',');
  }

  return value;
}

function decodeSearchParams(search) {
  const state = {
    page: 0,
    pageSize: 20,
    filtered: [],
    sorted: [],
  };

  const params = new URLSearchParams(search);

  Array.from(params.entries()).forEach(([key, value]) => {
    if (key === 'page') {
      state.page = Number.parseInt(value, 10);
      return;
    }

    if (key === 'pageSize') {
      state.pageSize = Number.parseInt(value, 10);
      return;
    }

    const filterMatch = key.match(/^filters\.(.*)$/);
    if (filterMatch) {
      state.filtered.push({ id: filterMatch[1], value: decodeFilterValue(filterMatch[1], value) });
      return;
    }

    const sortMatch = key.match(/^sort\.(.*)$/);
    if (sortMatch) {
      state.sorted.push({ id: sortMatch[1], desc: value === 'desc' });
    }
  });

  return state;
}

const STATE_OPTIONS = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

@withRouter
class RunSignupsTable extends React.Component {
  static propTypes = {
    eventId: PropTypes.number.isRequired,
    exportUrl: PropTypes.string.isRequired,
    runId: PropTypes.number.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  updateSearch = (newState) => {
    const oldState = decodeSearchParams(this.props.history.location.search);
    const newSearch = encodeSearchParams({ ...oldState, ...newState });
    this.props.history.replace(`${this.props.history.location.pathname}?${newSearch}`);
  }

  render = () => {
    const tableState = decodeSearchParams(this.props.history.location.search);

    // initialFiltered={[{ id: 'state', value: ['confirmed', 'waitlisted'] }]}
    // initialSorted={[{ id: 'id', desc: false }]}

    return (
      <div className="mb-4">
        <GraphQLReactTable
          query={signupsQuery}
          variables={{ eventId: this.props.eventId, runId: this.props.runId }}
          className="-striped -highlight"
          exportUrl={this.props.exportUrl}
          page={tableState.page}
          pageSize={tableState.pageSize}
          filtered={tableState.filtered}
          sorted={tableState.sorted}
          onPageChange={(page) => { this.updateSearch({ page }); }}
          onPageSizeChange={(pageSize) => { this.updateSearch({ pageSize }); }}
          onFilteredChange={(filtered) => { this.updateSearch({ filtered }); }}
          onSortedChange={(sorted) => { this.updateSearch({ sorted }); }}
          getReactTableProps={({ data }) => ({
            data: ((data || {}).event || { run: { signups_paginated: {} } }).run.signups_paginated.entries,
            pages: ((data || {}).event || { run: { signups_paginated: {} } })
              .run.signups_paginated.total_pages,
            columns: [
              {
                Header: 'Seq',
                accessor: 'id',
                filterable: false,
                width: 40,
              },
              {
                Header: 'State',
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
            ],
          })}
          getTrProps={(state, rowInfo) => ({
            // ...(
            //   rowInfo
            //     ? { className: `bg-signup-state-color-${rowInfo.row.state}` }
            //     : {}
            // ),
            style: { cursor: 'pointer' },
            onClick: () => {
              this.props.history.push(`${rowInfo.original.id}/edit`);
            },
          })}
          getTheadFilterThProps={() => ({ className: 'text-left' })}
        />
      </div>
    );
  }
}

export default RunSignupsTable;
