import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { withRouter } from 'react-router-dom';

import { ageAsOf } from '../../TimeUtils';
import ChoiceSetFilter from '../../Tables/ChoiceSetFilter';
import { encodeStringArray, decodeStringArray } from '../../Tables/FilterUtils';
import { formatBucket } from './SignupUtils';
import FreeTextFilter from '../../Tables/FreeTextFilter';
import ReactTableWithTheWorks from '../../Tables/ReactTableWithTheWorks';
import { RunSignupsTableSignupsQuery } from './queries.gql';

function encodeFilterValue(field, value) {
  if (field === 'state' || field === 'bucket') {
    return encodeStringArray(value);
  }

  return value;
}

function decodeFilterValue(field, value) {
  if (field === 'state' || field === 'bucket') {
    return decodeStringArray(value);
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
    runPath: PropTypes.string.isRequired,
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
      width: 50,
    },
    {
      Header: 'State',
      id: 'state',
      accessor: 'state',
      width: 130,
      Filter: ({ filter, onChange }) => (
        <ChoiceSetFilter
          name="state"
          choices={STATE_OPTIONS}
          onChange={onChange}
          filter={filter}
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
      Filter: ({ filter, onChange }) => (
        <FreeTextFilter filter={filter} onChange={onChange} />
      ),
    },
    {
      Header: 'Bucket',
      id: 'bucket',
      accessor: signup => signup.bucket_key,
      Cell: ({ original }) => formatBucket(original, data.event),
      Filter: ({ filter, onChange }) => (
        <ChoiceSetFilter
          name="bucket"
          choices={(
            (data || {}).event
              ? data.event.registration_policy.buckets
                .map(bucket => ({ label: bucket.name, value: bucket.key }))
              : []
            )}
          onChange={onChange}
          filter={filter}
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
      Filter: ({ filter, onChange }) => (
        <FreeTextFilter filter={filter} onChange={onChange} />
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
        query={RunSignupsTableSignupsQuery}
        variables={{ eventId: this.props.eventId, runId: this.props.runId }}

        className="-striped -highlight"
        getTrProps={(state, rowInfo) => ({
          style: { cursor: 'pointer' },
          onClick: () => {
            const { runPath } = this.props;
            this.props.history.push(`${runPath}/admin_signups/${rowInfo.original.id}/edit`);
          },
        })}
        getTheadFilterThProps={() => ({ className: 'text-left', style: { overflow: 'visible' } })}
      />
    </div>
  )
}

export default RunSignupsTable;
