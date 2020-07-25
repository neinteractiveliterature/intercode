import React from 'react';
import PropTypes from 'prop-types';
import { components, OptionTypeBase } from 'react-select';
import type { DocumentNode } from 'graphql';

import GraphQLAsyncSelect, { GraphQLAsyncSelectProps } from './GraphQLAsyncSelect';
import { DefaultUsersQueryQuery, DefaultUsersQueryDocument } from './selectDefaultQueries.generated';

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

type DQ = DefaultUsersQueryQuery;
type DO<QueryType extends DefaultUsersQueryQuery> = (
  NonNullable<QueryType['users_paginated']>['entries'][0]
);

export type UserSelectProps<DataType, OptionType extends OptionTypeBase> = (
  Omit<GraphQLAsyncSelectProps<DataType, OptionType>,
  'isClearable' | 'getOptions' | 'getVariables' | 'getOptionValue' | 'formatOptionLabel' | 'query' | 'components'
  > & {
    eventsQuery?: DocumentNode,
  }
);

function UserSelect<DataType extends DQ = DQ, OptionType extends DO<DataType> = DO<DQ>>(
  { usersQuery, ...otherProps }: UserSelectProps<DataType, OptionType>,
) {
  return (
    <GraphQLAsyncSelect<DataType, OptionType>
      isClearable
      getOptions={(data) => (data.users_paginated.entries as OptionType[])}
      getVariables={(inputValue) => ({ name: inputValue })}
      getOptionValue={(option: OptionType) => option.id}
      formatOptionLabel={(option: OptionType) => (
        <>
          {option.name}
          {' '}
          <small className="text-muted">
            {option.email}
          </small>
        </>
      )}
      query={usersQuery || DefaultUsersQueryDocument}
      components={{ MultiValueLabel: UserNameLabel }}
      {...otherProps}
    />
  );
}

export default UserSelect;
