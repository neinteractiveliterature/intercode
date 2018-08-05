import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment-timezone';
import Select from 'react-select';

import { ageAsOf } from '../TimeUtils';
import GraphQLReactTable from '../GraphQLReactTable';

const signupsQuery = gql`
query($eventId: Int!, $runId: Int!, $page: Int, $perPage: Int, $filters: SignupFiltersInput, $sort: [SortInput]) {
  event(id: $eventId) {
    registration_policy {
      buckets {
        key
        name
      }
    }

    run(id: $runId) {
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

class RunSignupsTable extends React.Component {
  static propTypes = {
    eventId: PropTypes.number.isRequired,
    exportUrl: PropTypes.string.isRequired,
    runId: PropTypes.number.isRequired,
  };

  render = () => (
    <div className="mb-4">
      <GraphQLReactTable
        query={signupsQuery}
        variables={{ eventId: this.props.eventId, runId: this.props.runId }}
        exportUrl={this.props.exportUrl}
        className="-striped -highlight"
        getReactTableProps={({ data }) => ({
          data: (data.event || { run: { signups_paginated: {} } }).run.signups_paginated.entries,
          pages: (data.event || { run: { signups_paginated: {} } })
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
                <Select
                  options={[
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'waitlisted', label: 'Waitlisted' },
                    { value: 'withdrawn', label: 'Withdrawn' },
                  ]}
                  isMulti
                  value={(filter || {}).value}
                  onChange={value => onChange(value)}
                />
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
          style: { cursor: 'pointer' },
          onClick: (event, handleOriginal) => {
            if (handleOriginal) {
              handleOriginal();
            }

            this.setState({ editingOrderId: rowInfo.original.id });
          },
        })}
      />
    </div>
  )
}

export default RunSignupsTable;
