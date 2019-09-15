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

function UserSelect({ usersQuery, ...otherProps }) {
  return (
    <GraphQLAsyncSelect
      isClearable
      getOptions={(data) => data.users_paginated.entries}
      getVariables={(inputValue) => ({ name: inputValue })}
      getOptionValue={(option) => option.id}
      formatOptionLabel={(option) => (
        <>
          {option.name}
          {' '}
          <small className="text-muted">
            {option.email}
          </small>
        </>
      )}
      query={usersQuery || DefaultUsersQuery}
      components={{ MultiValueLabel: UserNameLabel }}
      {...otherProps}
    />
  );
}

UserSelect.propTypes = {
  usersQuery: PropTypes.shape({
    kind: PropTypes.string.isRequired,
    definitions: PropTypes.array.isRequired,
  }),
};

UserSelect.defaultProps = {
  usersQuery: null,
};

export default UserSelect;
