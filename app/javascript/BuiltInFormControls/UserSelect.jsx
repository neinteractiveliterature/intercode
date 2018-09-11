import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import AsyncSelect from 'react-select/lib/Async';

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

class UserSelect extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    usersQuery: PropTypes.shape({
      kind: PropTypes.string.isRequired,
      definitions: PropTypes.array.isRequired,
    }),
  };

  static defaultProps = {
    usersQuery: null,
  };

  loadOptions = async (inputValue) => {
    const variables = { name: inputValue };

    const results = await this.props.client.query({
      query: this.props.usersQuery || DEFAULT_USERS_QUERY,
      variables,
    });

    const users = results.data.users_paginated;
    return users.entries;
  }

  render = () => (
    <AsyncSelect
      handleInputChange={input => input.toLowerCase().trim()}
      loadOptions={this.loadOptions}
      getOptionValue={option => option.id}
      getOptionLabel={option => option.name}
      {...this.props}
    />
  )
}

export default withApollo(UserSelect);
export { UserSelect as PureUserSelect };
