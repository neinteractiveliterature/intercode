import type { DocumentNode } from 'graphql';
import type { OptionTypeBase } from 'react-select';

import { DefaultUserConProfilesQuery } from './selectDefaultQueries';
import GraphQLAsyncSelect, { GraphQLAsyncSelectProps } from './GraphQLAsyncSelect';
import { DefaultUserConProfilesQueryData } from './selectDefaultQueries.generated';

type DQ = DefaultUserConProfilesQueryData;
type DO<QueryType extends DefaultUserConProfilesQueryData> = NonNullable<
  QueryType['convention']
>['user_con_profiles_paginated']['entries'][0];

export type UserConProfileSelectProps<
  DataType,
  OptionType extends OptionTypeBase,
  IsMulti extends boolean,
> = Omit<
  GraphQLAsyncSelectProps<DataType, OptionType, IsMulti>,
  'isClearable' | 'getOptions' | 'getVariables' | 'getOptionValue' | 'formatOptionLabel' | 'query'
> & {
  userConProfilesQuery?: DocumentNode;
};

function UserConProfileSelect<
  IsMulti extends boolean = false,
  DataType extends DQ = DQ,
  OptionType extends DO<DataType> = DO<DQ>,
>({
  userConProfilesQuery,
  ...otherProps
}: UserConProfileSelectProps<DataType, OptionType, IsMulti>): JSX.Element {
  return (
    <GraphQLAsyncSelect<DataType, OptionType>
      isClearable
      getOptions={(data) => data.convention.user_con_profiles_paginated.entries as OptionType[]}
      getVariables={(inputValue) => ({ name: inputValue })}
      getOptionValue={(option: OptionType) => option.id}
      formatOptionLabel={(option: OptionType) => (
        <>
          {option.name_without_nickname} <small className="text-muted">{option.email}</small>
        </>
      )}
      query={userConProfilesQuery ?? DefaultUserConProfilesQuery}
      {...otherProps}
    />
  );
}

export default UserConProfileSelect;
