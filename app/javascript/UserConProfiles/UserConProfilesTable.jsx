import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';

import ReactTableWithTheWorks from '../Tables/ReactTableWithTheWorks';

const userConProfilesQuery = gql`
query($page: Int, $perPage: Int, $filters: UserConProfileFiltersInput, $sort: [SortInput]) {
  convention {
    user_con_profiles_paginated(page: $page, per_page: $perPage, filters: $filters, sort: $sort) {
      total_entries
      total_pages
      current_page
      per_page

      entries {
        id
        name_inverted
        email
        privileges

        ticket {
          id
          updated_at
          ticket_type {
            id
            name
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

@withRouter
class UserConProfilesTable extends React.Component {
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
      Header: 'Name',
      id: 'name',
      accessor: userConProfile => userConProfile.name_inverted,
    },
    {
      Header: 'Email',
      id: 'email',
      accessor: 'email',
      Cell: ({ value }) => (
        <a href={`mailto:${value}`} onClick={(event) => { event.stopPropagation(); }}>
          {value}
        </a>
      ),
    },
    // {
    //   Header: 'State',
    //   id: 'state',
    //   accessor: 'state',
    //   width: 130,
    //   Filter: ({ filter, onChange }) => (
    //     <ChoiceSet
    //       name="state"
    //       choices={STATE_OPTIONS}
    //       value={(filter || {}).value || []}
    //       onChange={newValue => onChange(newValue)}
    //       multiple
    //     />
    //   ),
    //   Cell: props => (
    //     <div className={`badge bg-signup-state-color-${props.value}`}>
    //       {props.value}
    //     </div>
    //   ),
    // },

    // {
    //   Header: 'Bucket',
    //   id: 'bucket',
    //   accessor: signup => signup.bucket_key,
    //   Cell: ({ original }) => formatBucket(original, data.event),
    //   Filter: ({ filter, onChange }) => (
    //     <ChoiceSet
    //       name="bucket"
    //       choices={(
    //         (data || {}).event
    //           ? data.event.registration_policy.buckets
    //             .map(bucket => ({ label: bucket.name, value: bucket.key }))
    //           : []
    //         )}
    //       value={(filter || {}).value || []}
    //       onChange={newValue => onChange(newValue)}
    //       multiple
    //     />
    //   ),
    // },
  ];

  render = () => (
    <div className="mb-4">
      <ReactTableWithTheWorks
        decodeFilterValue={decodeFilterValue}
        defaultVisibleColumns={this.props.defaultVisibleColumns}
        encodeFilterValue={encodeFilterValue}
        exportUrl={this.props.exportUrl}
        getData={({ data }) => data.convention.user_con_profiles_paginated.entries}
        getPages={({ data }) => data.convention.user_con_profiles_paginated.total_pages}
        getPossibleColumns={this.getPossibleColumns}
        query={userConProfilesQuery}

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

export default UserConProfilesTable;
