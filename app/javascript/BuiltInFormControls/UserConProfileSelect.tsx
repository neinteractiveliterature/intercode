import type { DocumentNode } from 'graphql';

import GraphQLAsyncSelect, { GraphQLAsyncSelectProps } from './GraphQLAsyncSelect';
import {
  DefaultUserConProfilesQueryData,
  DefaultUserConProfilesQueryDocument,
  DefaultUserConProfilesQueryVariables,
} from './selectDefaultQueries.generated';
import { useTranslation } from 'react-i18next';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

type DQ = DefaultUserConProfilesQueryData;
type DO<QueryType extends DefaultUserConProfilesQueryData> = NonNullable<
  QueryType['convention']
>['user_con_profiles_paginated']['entries'][0];

/* eslint-disable @typescript-eslint/no-explicit-any */
// TypedDocumentNode<any, any> needed because TypeScript 6 variance checks require it
export type UserConProfileSelectProps<
  QueryType extends TypedDocumentNode<any, any>,
  OptionType,
  IsMulti extends boolean,
> = Omit<
  GraphQLAsyncSelectProps<QueryType, OptionType, IsMulti>,
  'isClearable' | 'getOptions' | 'getVariables' | 'getOptionValue' | 'formatOptionLabel' | 'query'
> & {
  userConProfilesQuery?: DocumentNode;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

function UserConProfileSelect<
  IsMulti extends boolean = false,
  DataType extends DQ = DQ,
  VariablesType extends DefaultUserConProfilesQueryVariables = DefaultUserConProfilesQueryVariables,
  OptionType extends DO<DataType> = DO<DQ>,
>({
  userConProfilesQuery,
  ...otherProps
}: UserConProfileSelectProps<TypedDocumentNode<DataType, VariablesType>, OptionType, IsMulti>): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <GraphQLAsyncSelect<TypedDocumentNode<DataType, VariablesType>, OptionType, IsMulti>
      isClearable
      getOptions={(data) => data.convention.user_con_profiles_paginated.entries as OptionType[]}
      getVariables={(inputValue) => ({ name: inputValue }) as VariablesType}
      getOptionValue={(option: OptionType) => option.id}
      formatOptionLabel={(option: OptionType) => (
        <>
          {option.name_without_nickname} <small className="text-muted">{option.email}</small>
        </>
      )}
      query={userConProfilesQuery ?? DefaultUserConProfilesQueryDocument}
      placeholder={t('selectors.userConProfileSelect.placeholder')}
      noOptionsMessage={({ inputValue }) =>
        inputValue.trim() === ''
          ? t('selectors.userConProfileSelect.noInputMessage')
          : t('selectors.userConProfileSelect.noResultsMessage', `No attendees found matching “{{ inputValue }}”`, {
              inputValue,
            })
      }
      {...otherProps}
    />
  );
}

export default UserConProfileSelect;
