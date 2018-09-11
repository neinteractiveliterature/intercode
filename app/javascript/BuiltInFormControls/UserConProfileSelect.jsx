import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import GraphQLAsyncSelect from './GraphQLAsyncSelect';

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

class UserConProfileSelect extends React.PureComponent {
  static propTypes = {
    userConProfilesQuery: PropTypes.shape({
      kind: PropTypes.string.isRequired,
      definitions: PropTypes.array.isRequired,
    }),
  };

  static defaultProps = {
    userConProfilesQuery: null,
  };

  render = () => (
    <GraphQLAsyncSelect
      getOptions={data => data.convention.user_con_profiles_paginated.entries}
      getOptionValue={option => option.id}
      getOptionLabel={option => option.name_without_nickname}
      query={this.props.userConProfilesQuery || DEFAULT_USER_CON_PROFILES_QUERY}
      {...this.props}
    />
  )
}

export default UserConProfileSelect;
