import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import AsyncSelect from 'react-select/lib/Async';

export const DEFAULT_USER_CON_PROFILES_QUERY = gql`
query($name: String) {
  convention {
    user_con_profiles_paginated(filters: { name: $name }, per_page: 50) {
      entries {
        id
        name_without_nickname
      }
    }
  }
}
`;

class UserConProfileSelect extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
    userConProfilesQuery: PropTypes.shape({
      kind: PropTypes.string.isRequired,
      definitions: PropTypes.array.isRequired,
    }),
  };

  static defaultProps = {
    userConProfilesQuery: null,
  };

  loadOptions = async (inputValue) => {
    const variables = { name: inputValue };

    const results = await this.props.client.query({
      query: this.props.userConProfilesQuery || DEFAULT_USER_CON_PROFILES_QUERY,
      variables,
    });

    const userConProfiles = results.data.convention.user_con_profiles_paginated;
    return userConProfiles.entries;
  }

  render = () => (
    <AsyncSelect
      handleInputChange={input => input.toLowerCase().trim()}
      loadOptions={this.loadOptions}
      getOptionValue={option => option.id}
      getOptionLabel={option => option.name_without_nickname}
      {...this.props}
    />
  )
}

export default withApollo(UserConProfileSelect);
export { UserConProfileSelect as PureUserConProfileSelect };
