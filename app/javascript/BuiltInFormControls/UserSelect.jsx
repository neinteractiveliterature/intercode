import React from 'react';
import PropTypes from 'prop-types';

import { DefaultUsersQuery } from './selectDefaultQueries.gql';
import GraphQLAsyncSelect from './GraphQLAsyncSelect';

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
      isClearable
      getOptions={data => data.users_paginated.entries}
      getVariables={inputValue => ({ name: inputValue })}
      getOptionValue={option => option.id}
      getOptionLabel={option => option.name}
      query={this.props.usersQuery || DefaultUsersQuery}
      {...this.props}
    />
  )
}

export default UserSelect;
