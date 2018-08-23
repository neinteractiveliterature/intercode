import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import ExportButton from '../Tables/ExportButton';
import PopperDropdown from '../UIComponents/PopperDropdown';
import GraphQLReactTableWrapper from '../Tables/GraphQLReactTableWrapper';
import ReactRouterReactTableWrapper from '../Tables/ReactRouterReactTableWrapper';

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
    this.props.history.replace(`${this.props.history.location.pathname}?${params.toString()}`);
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
          <GraphQLReactTableWrapper query={userConProfilesQuery}>
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
                    ((data || {}).convention || { user_con_profiles_paginated: {} }).user_con_profiles_paginated.entries
                  }
                  pages={
                    ((data || {}).convention || { user_con_profiles_paginated: {} }).user_con_profiles_paginated.total_pages
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

export default UserConProfilesTable;
