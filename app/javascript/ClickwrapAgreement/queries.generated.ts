/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type ClickwrapAgreementQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ClickwrapAgreementQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'clickwrap_agreement_html'>
  ), myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'accepted_clickwrap_agreement'>
  )> }
);


export const ClickwrapAgreementQueryDocument = gql`
    query ClickwrapAgreementQuery {
  convention: assertConvention {
    id
    name
    clickwrap_agreement_html
  }
  myProfile {
    id
    accepted_clickwrap_agreement
  }
}
    `;

/**
 * __useClickwrapAgreementQueryQuery__
 *
 * To run a query within a React component, call `useClickwrapAgreementQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useClickwrapAgreementQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClickwrapAgreementQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useClickwrapAgreementQueryQuery(baseOptions?: Apollo.QueryHookOptions<ClickwrapAgreementQueryQuery, ClickwrapAgreementQueryQueryVariables>) {
        return Apollo.useQuery<ClickwrapAgreementQueryQuery, ClickwrapAgreementQueryQueryVariables>(ClickwrapAgreementQueryDocument, baseOptions);
      }
export function useClickwrapAgreementQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClickwrapAgreementQueryQuery, ClickwrapAgreementQueryQueryVariables>) {
          return Apollo.useLazyQuery<ClickwrapAgreementQueryQuery, ClickwrapAgreementQueryQueryVariables>(ClickwrapAgreementQueryDocument, baseOptions);
        }
export type ClickwrapAgreementQueryQueryHookResult = ReturnType<typeof useClickwrapAgreementQueryQuery>;
export type ClickwrapAgreementQueryLazyQueryHookResult = ReturnType<typeof useClickwrapAgreementQueryLazyQuery>;
export type ClickwrapAgreementQueryQueryResult = Apollo.QueryResult<ClickwrapAgreementQueryQuery, ClickwrapAgreementQueryQueryVariables>;