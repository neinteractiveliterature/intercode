import React from 'react';
import PropTypes from 'prop-types';

import { DefaultUserConProfilesQuery } from './selectDefaultQueries.gql';
import GraphQLAsyncSelect from './GraphQLAsyncSelect';

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
      isClearable
      getOptions={data => data.convention.user_con_profiles_paginated.entries}
      getVariables={inputValue => ({ name: inputValue })}
      getOptionValue={option => option.id}
      getOptionLabel={option => option.name_without_nickname}
      query={this.props.userConProfilesQuery || DefaultUserConProfilesQuery}
      {...this.props}
    />
  )
}

export default UserConProfileSelect;
