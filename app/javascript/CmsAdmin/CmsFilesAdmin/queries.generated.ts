/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };


export type CmsFileFieldsFragment = (
  { __typename?: 'CmsFile' }
  & Pick<Types.CmsFile, 'id' | 'filename' | 'url' | 'content_type' | 'size' | 'current_ability_can_delete'>
);

export type CmsFilesAdminQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CmsFilesAdminQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
  )>, currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_create_cms_files'>
  ), cmsFiles?: Types.Maybe<Array<(
    { __typename?: 'CmsFile' }
    & Pick<Types.CmsFile, 'id'>
    & CmsFileFieldsFragment
  )>> }
);

export const CmsFileFieldsFragmentDoc = gql`
    fragment CmsFileFields on CmsFile {
  id
  filename
  url
  content_type
  size
  current_ability_can_delete
}
    `;
export const CmsFilesAdminQueryDocument = gql`
    query CmsFilesAdminQuery {
  convention {
    id
    name
  }
  currentAbility {
    can_create_cms_files
  }
  cmsFiles {
    id
    ...CmsFileFields
  }
}
    ${CmsFileFieldsFragmentDoc}`;

/**
 * __useCmsFilesAdminQueryQuery__
 *
 * To run a query within a React component, call `useCmsFilesAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsFilesAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsFilesAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsFilesAdminQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CmsFilesAdminQueryQuery, CmsFilesAdminQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<CmsFilesAdminQueryQuery, CmsFilesAdminQueryQueryVariables>(CmsFilesAdminQueryDocument, baseOptions);
      }
export function useCmsFilesAdminQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CmsFilesAdminQueryQuery, CmsFilesAdminQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CmsFilesAdminQueryQuery, CmsFilesAdminQueryQueryVariables>(CmsFilesAdminQueryDocument, baseOptions);
        }
export type CmsFilesAdminQueryQueryHookResult = ReturnType<typeof useCmsFilesAdminQueryQuery>;
export type CmsFilesAdminQueryLazyQueryHookResult = ReturnType<typeof useCmsFilesAdminQueryLazyQuery>;
export type CmsFilesAdminQueryQueryResult = ApolloReactCommon.QueryResult<CmsFilesAdminQueryQuery, CmsFilesAdminQueryQueryVariables>;