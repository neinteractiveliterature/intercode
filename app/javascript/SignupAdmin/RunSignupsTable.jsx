import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment-timezone';
import { withRouter } from 'react-router-dom';

import { ageAsOf } from '../TimeUtils';
import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import { formatBucket } from './SignupUtils';
import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';

const signupsQuery = gql`
query($eventId: Int!, $runId: Int!, $page: Int, $perPage: Int, $filters: SignupFiltersInput, $sort: [SortInput]) {
  event(id: $eventId) {
    id
    team_member_name

    team_members {
      id

      user_con_profile {
        id
      }
    }

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

function encodeFilterValue(field, value) {
  if (field === 'state' || field === 'bucket') {
    const encoded = value.join(',');
    if (encoded.length === 0) {
      return null;
    }
    return encoded;
  }

  return value;
}

function decodeFilterValue(field, value) {
  if (field === 'state' || field === 'bucket') {
    const decoded = value.split(',').filter(decodedValue => decodedValue.length > 0);
    if (decoded.length === 0) {
      return null;
    }
    return decoded;
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
      Cell: ({ original }) => formatBucket(original, data.event),
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

  render = () => (
    <div className="mb-4">
      <ReactTableWithTheWorks
        decodeFilterValue={decodeFilterValue}
        defaultVisibleColumns={this.props.defaultVisibleColumns}
        encodeFilterValue={encodeFilterValue}
        exportUrl={this.props.exportUrl}
        getData={({ data }) => data.event.run.signups_paginated.entries}
        getPages={({ data }) => data.event.run.signups_paginated.total_pages}
        getPossibleColumns={this.getPossibleColumns}
        query={signupsQuery}
        variables={{ eventId: this.props.eventId, runId: this.props.runId }}

        className="-striped -highlight"
        getTrProps={(state, rowInfo) => ({
          style: { cursor: 'pointer' },
          onClick: () => {
            this.props.history.push(`${rowInfo.original.id}/edit`);
          },
        })}
        getTheadFilterThProps={() => ({ className: 'text-left' })}
      />
    </div>
  )
}

export default RunSignupsTable;
