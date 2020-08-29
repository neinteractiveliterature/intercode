/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type CmsPartialFieldsFragment = (
  { __typename?: 'CmsPartial' }
  & Pick<Types.CmsPartial, 'id' | 'name' | 'content' | 'admin_notes' | 'current_ability_can_update' | 'current_ability_can_delete'>
);

export type CmsPartialsAdminQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CmsPartialsAdminQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
  )>, currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Types.Ability, 'can_create_cms_partials'>
  ), cmsPartials: Array<(
    { __typename?: 'CmsPartial' }
    & Pick<Types.CmsPartial, 'id'>
    & CmsPartialFieldsFragment
  )> }
);

export const CmsPartialFieldsFragmentDoc = gql`
    fragment CmsPartialFields on CmsPartial {
  id
  name
  content
  admin_notes
  current_ability_can_update
  current_ability_can_delete
}
    `;
export const CmsPartialsAdminQueryDocument = gql`
    query CmsPartialsAdminQuery {
  convention {
    id
    name
  }
  currentAbility {
    can_create_cms_partials
  }
  cmsPartials {
    id
    ...CmsPartialFields
  }
}
    ${CmsPartialFieldsFragmentDoc}`;

/**
 * __useCmsPartialsAdminQueryQuery__
 *
 * To run a query within a React component, call `useCmsPartialsAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCmsPartialsAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmsPartialsAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCmsPartialsAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<CmsPartialsAdminQueryQuery, CmsPartialsAdminQueryQueryVariables>) {
        return Apollo.useQuery<CmsPartialsAdminQueryQuery, CmsPartialsAdminQueryQueryVariables>(CmsPartialsAdminQueryDocument, baseOptions);
      }
export function useCmsPartialsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CmsPartialsAdminQueryQuery, CmsPartialsAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<CmsPartialsAdminQueryQuery, CmsPartialsAdminQueryQueryVariables>(CmsPartialsAdminQueryDocument, baseOptions);
        }
export type CmsPartialsAdminQueryQueryHookResult = ReturnType<typeof useCmsPartialsAdminQueryQuery>;
export type CmsPartialsAdminQueryLazyQueryHookResult = ReturnType<typeof useCmsPartialsAdminQueryLazyQuery>;
export type CmsPartialsAdminQueryQueryResult = Apollo.QueryResult<CmsPartialsAdminQueryQuery, CmsPartialsAdminQueryQueryVariables>;