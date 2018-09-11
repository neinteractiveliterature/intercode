import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import GraphQLAsyncSelect from './GraphQLAsyncSelect';

export const DEFAULT_USERS_QUERY = gql`
query($name: String) {
  users_paginated(filters: { name: $name }, per_page: 50) {
    entries {
      id
      name
    }
  }
}
`;

class UserSelect extends React.PureComponent {
  static propTypes = {
    usersQuery: PropTypes.shape({
      kind: PropTypes.string.isRequired,
      definitions: PropTypes.array.isRequired,
    }),
  };

  static defaultProps = {
    usersQuery: null,
  };

  render = () => (
    <GraphQLAsyncSelect
      getOptions={data => data.users_paginated.entries}
      getOptionValue={option => option.id}
      getOptionLabel={option => option.name}
      query={this.props.usersQuery || DEFAULT_USERS_QUERY}
      {...this.props}
    />
  )
}

export default UserSelect;
