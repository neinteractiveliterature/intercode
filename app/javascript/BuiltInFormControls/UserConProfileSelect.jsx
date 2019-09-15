import React from 'react';
import PropTypes from 'prop-types';

import { DefaultUserConProfilesQuery } from './selectDefaultQueries.gql';
import GraphQLAsyncSelect from './GraphQLAsyncSelect';

function UserConProfileSelect({ userConProfilesQuery, ...otherProps }) {
  return (
    <GraphQLAsyncSelect
      isClearable
      getOptions={(data) => data.convention.user_con_profiles_paginated.entries}
      getVariables={(inputValue) => ({ name: inputValue })}
      getOptionValue={(option) => option.id}
      formatOptionLabel={(option) => (
        <>
          {option.name_without_nickname}
          {' '}
          <small className="text-muted">
            {option.email}
          </small>
        </>
      )}
      query={userConProfilesQuery || DefaultUserConProfilesQuery}
      {...otherProps}
    />
  );
}

UserConProfileSelect.propTypes = {
  userConProfilesQuery: PropTypes.shape({
    kind: PropTypes.string.isRequired,
    definitions: PropTypes.array.isRequired,
  }),
};

UserConProfileSelect.defaultProps = {
  userConProfilesQuery: null,
};

export default UserConProfileSelect;
