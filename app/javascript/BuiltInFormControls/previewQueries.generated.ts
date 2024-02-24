/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PreviewLiquidQueryVariables = Types.Exact<{
  liquid: Types.Scalars['String']['input'];
}>;


export type PreviewLiquidQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, previewLiquid: string } | { __typename: 'RootSite', id: string, previewLiquid: string } };

export type PreviewMarkdownQueryVariables = Types.Exact<{
  markdown: Types.Scalars['String']['input'];
  eventId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  eventProposalId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type PreviewMarkdownQueryData = { __typename: 'Query', cmsParent: { __typename: 'Convention', id: string, previewMarkdown: string } | { __typename: 'RootSite', id: string, previewMarkdown: string } };

export type PreviewNotifierLiquidQueryVariables = Types.Exact<{
  eventKey: Types.Scalars['String']['input'];
  liquid: Types.Scalars['String']['input'];
}>;


export type PreviewNotifierLiquidQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, previewLiquid: string } };


export const PreviewLiquidQueryDocument = gql`
    query PreviewLiquidQuery($liquid: String!) {
  cmsParent: cmsParentByRequestHost {
    id
    previewLiquid(content: $liquid)
  }
}
    `;

/**
 * __usePreviewLiquidQuery__
 *
 * To run a query within a React component, call `usePreviewLiquidQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreviewLiquidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreviewLiquidQuery({
 *   variables: {
 *      liquid: // value for 'liquid'
 *   },
 * });
 */
export function usePreviewLiquidQuery(baseOptions: Apollo.QueryHookOptions<PreviewLiquidQueryData, PreviewLiquidQueryVariables> & ({ variables: PreviewLiquidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PreviewLiquidQueryData, PreviewLiquidQueryVariables>(PreviewLiquidQueryDocument, options);
      }
export function usePreviewLiquidQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PreviewLiquidQueryData, PreviewLiquidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PreviewLiquidQueryData, PreviewLiquidQueryVariables>(PreviewLiquidQueryDocument, options);
        }
export function usePreviewLiquidQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PreviewLiquidQueryData, PreviewLiquidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PreviewLiquidQueryData, PreviewLiquidQueryVariables>(PreviewLiquidQueryDocument, options);
        }
export type PreviewLiquidQueryHookResult = ReturnType<typeof usePreviewLiquidQuery>;
export type PreviewLiquidQueryLazyQueryHookResult = ReturnType<typeof usePreviewLiquidQueryLazyQuery>;
export type PreviewLiquidQuerySuspenseQueryHookResult = ReturnType<typeof usePreviewLiquidQuerySuspenseQuery>;
export type PreviewLiquidQueryQueryResult = Apollo.QueryResult<PreviewLiquidQueryData, PreviewLiquidQueryVariables>;
export const PreviewMarkdownQueryDocument = gql`
    query PreviewMarkdownQuery($markdown: String!, $eventId: ID, $eventProposalId: ID) {
  cmsParent: cmsParentByRequestHost {
    id
    previewMarkdown(
      markdown: $markdown
      eventId: $eventId
      eventProposalId: $eventProposalId
    )
  }
}
    `;

/**
 * __usePreviewMarkdownQuery__
 *
 * To run a query within a React component, call `usePreviewMarkdownQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreviewMarkdownQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreviewMarkdownQuery({
 *   variables: {
 *      markdown: // value for 'markdown'
 *      eventId: // value for 'eventId'
 *      eventProposalId: // value for 'eventProposalId'
 *   },
 * });
 */
export function usePreviewMarkdownQuery(baseOptions: Apollo.QueryHookOptions<PreviewMarkdownQueryData, PreviewMarkdownQueryVariables> & ({ variables: PreviewMarkdownQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PreviewMarkdownQueryData, PreviewMarkdownQueryVariables>(PreviewMarkdownQueryDocument, options);
      }
export function usePreviewMarkdownQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PreviewMarkdownQueryData, PreviewMarkdownQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PreviewMarkdownQueryData, PreviewMarkdownQueryVariables>(PreviewMarkdownQueryDocument, options);
        }
export function usePreviewMarkdownQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PreviewMarkdownQueryData, PreviewMarkdownQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PreviewMarkdownQueryData, PreviewMarkdownQueryVariables>(PreviewMarkdownQueryDocument, options);
        }
export type PreviewMarkdownQueryHookResult = ReturnType<typeof usePreviewMarkdownQuery>;
export type PreviewMarkdownQueryLazyQueryHookResult = ReturnType<typeof usePreviewMarkdownQueryLazyQuery>;
export type PreviewMarkdownQuerySuspenseQueryHookResult = ReturnType<typeof usePreviewMarkdownQuerySuspenseQuery>;
export type PreviewMarkdownQueryQueryResult = Apollo.QueryResult<PreviewMarkdownQueryData, PreviewMarkdownQueryVariables>;
export const PreviewNotifierLiquidQueryDocument = gql`
    query PreviewNotifierLiquidQuery($eventKey: String!, $liquid: String!) {
  convention: conventionByRequestHost {
    id
    previewLiquid: preview_notifier_liquid(eventKey: $eventKey, content: $liquid)
  }
}
    `;

/**
 * __usePreviewNotifierLiquidQuery__
 *
 * To run a query within a React component, call `usePreviewNotifierLiquidQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreviewNotifierLiquidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreviewNotifierLiquidQuery({
 *   variables: {
 *      eventKey: // value for 'eventKey'
 *      liquid: // value for 'liquid'
 *   },
 * });
 */
export function usePreviewNotifierLiquidQuery(baseOptions: Apollo.QueryHookOptions<PreviewNotifierLiquidQueryData, PreviewNotifierLiquidQueryVariables> & ({ variables: PreviewNotifierLiquidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PreviewNotifierLiquidQueryData, PreviewNotifierLiquidQueryVariables>(PreviewNotifierLiquidQueryDocument, options);
      }
export function usePreviewNotifierLiquidQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PreviewNotifierLiquidQueryData, PreviewNotifierLiquidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PreviewNotifierLiquidQueryData, PreviewNotifierLiquidQueryVariables>(PreviewNotifierLiquidQueryDocument, options);
        }
export function usePreviewNotifierLiquidQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PreviewNotifierLiquidQueryData, PreviewNotifierLiquidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PreviewNotifierLiquidQueryData, PreviewNotifierLiquidQueryVariables>(PreviewNotifierLiquidQueryDocument, options);
        }
export type PreviewNotifierLiquidQueryHookResult = ReturnType<typeof usePreviewNotifierLiquidQuery>;
export type PreviewNotifierLiquidQueryLazyQueryHookResult = ReturnType<typeof usePreviewNotifierLiquidQueryLazyQuery>;
export type PreviewNotifierLiquidQuerySuspenseQueryHookResult = ReturnType<typeof usePreviewNotifierLiquidQuerySuspenseQuery>;
export type PreviewNotifierLiquidQueryQueryResult = Apollo.QueryResult<PreviewNotifierLiquidQueryData, PreviewNotifierLiquidQueryVariables>;