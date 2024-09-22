import { ReactNode } from 'react';
import { components, MultiValueGenericProps } from 'react-select';

import GraphQLAsyncSelect, { GraphQLAsyncSelectProps } from './GraphQLAsyncSelect';
import { DefaultUsersQueryDocument } from './selectDefaultQueries.generated';
import { useTranslation } from 'react-i18next';
import { ResultOf, VariablesOf } from '@graphql-typed-document-node/core';

type UserNameLabelProps<OptionType, IsMulti extends boolean> = MultiValueGenericProps<OptionType, IsMulti> & {
  data: {
    name?: string;
  };
  children: ReactNode;
  [x: string]: unknown;
};

function UserNameLabel<OptionType, IsMulti extends boolean>({
  children,
  ...otherProps
}: UserNameLabelProps<OptionType, IsMulti>) {
  return <components.MultiValueLabel {...otherProps}>{otherProps.data.name}</components.MultiValueLabel>;
}

type DQ = typeof DefaultUsersQueryDocument;
type DO<QueryType extends DQ> = NonNullable<ResultOf<QueryType>['users_paginated']>['entries'][0];

export type UserSelectProps<DataType extends DQ, OptionType, IsMulti extends boolean = false> = Omit<
  GraphQLAsyncSelectProps<DataType, OptionType, IsMulti>,
  'isClearable' | 'getOptions' | 'getVariables' | 'getOptionValue' | 'formatOptionLabel' | 'query' | 'components'
> & {
  usersQuery?: DataType;
};

function UserSelect<
  DataType extends DQ = DQ,
  OptionType extends DO<DataType> = DO<DQ>,
  IsMulti extends boolean = false,
>({ usersQuery, ...otherProps }: UserSelectProps<DataType, OptionType, IsMulti>): JSX.Element {
  const { t } = useTranslation();

  return (
    <GraphQLAsyncSelect<DataType, OptionType, IsMulti>
      isClearable
      getOptions={(data) => data.users_paginated.entries as OptionType[]}
      getVariables={(inputValue) => ({ name: inputValue }) as VariablesOf<DataType>}
      getOptionValue={(option: OptionType) => option.id}
      formatOptionLabel={(option: OptionType) => (
        <>
          {option.name} <small className="text-muted">{option.email}</small>
        </>
      )}
      query={usersQuery ?? (DefaultUsersQueryDocument as DataType)}
      components={{ MultiValueLabel: UserNameLabel }}
      placeholder={t('selectors.userSelect.placeholder')}
      noOptionsMessage={({ inputValue }) =>
        inputValue.trim() === ''
          ? t('selectors.userSelect.noInputMessage')
          : t('selectors.userSelect.noResultsMessage', `No users found matching “{{ inputValue }}”`, { inputValue })
      }
      {...otherProps}
    />
  );
}

export default UserSelect;
