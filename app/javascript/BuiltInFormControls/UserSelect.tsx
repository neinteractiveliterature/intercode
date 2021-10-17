import { ReactNode } from 'react';
import { components, OptionTypeBase } from 'react-select';
import type { DocumentNode } from 'graphql';
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue';

import GraphQLAsyncSelect, { GraphQLAsyncSelectProps } from './GraphQLAsyncSelect';
import { DefaultUsersQueryData, DefaultUsersQueryDocument } from './selectDefaultQueries.generated';

type UserNameLabelProps<OptionType> = MultiValueGenericProps<OptionType> & {
  data: {
    name?: string;
  };
  children: ReactNode;
  [x: string]: unknown;
};

function UserNameLabel<OptionType>({ children, ...otherProps }: UserNameLabelProps<OptionType>) {
  return (
    <components.MultiValueLabel {...otherProps}>{otherProps.data.name}</components.MultiValueLabel>
  );
}

type DQ = DefaultUsersQueryData;
type DO<QueryType extends DefaultUsersQueryData> = NonNullable<
  QueryType['users_paginated']
>['entries'][0];

export type UserSelectProps<
  DataType,
  OptionType extends OptionTypeBase,
  IsMulti extends boolean = false,
> = Omit<
  GraphQLAsyncSelectProps<DataType, OptionType, IsMulti>,
  | 'isClearable'
  | 'getOptions'
  | 'getVariables'
  | 'getOptionValue'
  | 'formatOptionLabel'
  | 'query'
  | 'components'
> & {
  eventsQuery?: DocumentNode;
};

function UserSelect<DataType extends DQ = DQ, OptionType extends DO<DataType> = DO<DQ>>({
  usersQuery,
  ...otherProps
}: UserSelectProps<DataType, OptionType>): JSX.Element {
  return (
    <GraphQLAsyncSelect<DataType, OptionType>
      isClearable
      getOptions={(data) => data.users_paginated.entries as OptionType[]}
      getVariables={(inputValue) => ({ name: inputValue })}
      getOptionValue={(option: OptionType) => option.id}
      formatOptionLabel={(option: OptionType) => (
        <>
          {option.name} <small className="text-muted">{option.email}</small>
        </>
      )}
      query={usersQuery || DefaultUsersQueryDocument}
      components={{ MultiValueLabel: UserNameLabel }}
      {...otherProps}
    />
  );
}

export default UserSelect;
