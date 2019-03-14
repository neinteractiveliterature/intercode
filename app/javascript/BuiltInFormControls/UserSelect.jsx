import React from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';

import { DefaultUsersQuery } from './selectDefaultQueries.gql';
import GraphQLAsyncSelect from './GraphQLAsyncSelect';

function UserNameLabel({ children, ...otherProps }) {
  return (
    <components.MultiValueLabel {...otherProps}>
      {otherProps.data.name}
    </components.MultiValueLabel>
  );
}

UserNameLabel.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

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
      formatOptionLabel={option => (
        <>
          {option.name}
          {' '}
          <small className="text-muted">
            {option.email}
          </small>
        </>
      )}
      query={this.props.usersQuery || DefaultUsersQuery}
      components={{ MultiValueLabel: UserNameLabel }}
      {...this.props}
    />
  )
}

export default UserSelect;
