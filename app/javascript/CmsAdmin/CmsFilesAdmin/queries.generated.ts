/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CmsFileFieldsFragment = { __typename: 'CmsFile', filename: string, url: string, content_type: string, size: number, current_ability_can_delete: boolean, id: string };

export type CmsFilesAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsFilesAdminQueryData = { __typename: 'Query', convention?: { __typename: 'Convention', name: string, id: string } | null | undefined, currentAbility: { __typename: 'Ability', can_create_cms_files: boolean }, cmsParent: { __typename: 'Convention', id: string, cmsFiles: Array<{ __typename: 'CmsFile', filename: string, url: string, content_type: string, size: number, current_ability_can_delete: boolean, id: string }> } | { __typename: 'RootSite', id: string, cmsFiles: Array<{ __typename: 'CmsFile', filename: string, url: string, content_type: string, size: number, current_ability_can_delete: boolean, id: string }> } };

export const CmsFileFieldsFragmentDoc = gql`
    fragment CmsFileFields on CmsFile {
  id: transitionalId
  filename
  url
  content_type
  size
  current_ability_can_delete
}
    `;
export const CmsFilesAdminQueryDocument = gql`
    query CmsFilesAdminQuery {
  convention: conventionByRequestHostIfPresent {
    id: transitionalId
    name
  }
  currentAbility {
    can_create_cms_files
  }
  cmsParent: cmsParentByRequestHost {
    id: transitionalId
    cmsFiles {
      id: transitionalId
      ...CmsFileFields
    }
  }
}
    ${CmsFileFieldsFragmentDoc}`;

/**
 * __useCmsFilesAdminQuery__
 *
 * To run a query within a React component, call `useCmsFilesAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsFilesAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsFilesAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsFilesAdminQuery(baseOptions?: Apollo.QueryHookOptions<CmsFilesAdminQueryData, CmsFilesAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CmsFilesAdminQueryData, CmsFilesAdminQueryVariables>(CmsFilesAdminQueryDocument, options);
      }
export function useCmsFilesAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsFilesAdminQueryData, CmsFilesAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CmsFilesAdminQueryData, CmsFilesAdminQueryVariables>(CmsFilesAdminQueryDocument, options);
        }
export type CmsFilesAdminQueryHookResult = ReturnType<typeof useCmsFilesAdminQuery>;
export type CmsFilesAdminQueryLazyQueryHookResult = ReturnType<typeof useCmsFilesAdminQueryLazyQuery>;
export type CmsFilesAdminQueryQueryResult = Apollo.QueryResult<CmsFilesAdminQueryData, CmsFilesAdminQueryVariables>;