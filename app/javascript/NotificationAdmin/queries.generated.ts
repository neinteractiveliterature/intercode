/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type NotificationTemplateFieldsFragment = (
  { __typename: 'NotificationTemplate' }
  & Pick<Types.NotificationTemplate, 'id' | 'event_key' | 'subject' | 'body_html' | 'body_text' | 'body_sms'>
);

export type NotificationAdminQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NotificationAdminQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { notification_templates: Array<(
      { __typename: 'NotificationTemplate' }
      & Pick<Types.NotificationTemplate, 'id'>
      & NotificationTemplateFieldsFragment
    )> }
  ) }
);

export const NotificationTemplateFieldsFragmentDoc = gql`
    fragment NotificationTemplateFields on NotificationTemplate {
  id
  event_key
  subject
  body_html
  body_text
  body_sms
}
    `;
export const NotificationAdminQueryDocument = gql`
    query NotificationAdminQuery {
  convention: assertConvention {
    id
    notification_templates {
      id
      ...NotificationTemplateFields
    }
  }
}
    ${NotificationTemplateFieldsFragmentDoc}`;

/**
 * __useNotificationAdminQueryQuery__
 *
 * To run a query within a React component, call `useNotificationAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotificationAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<NotificationAdminQueryQuery, NotificationAdminQueryQueryVariables>) {
        return Apollo.useQuery<NotificationAdminQueryQuery, NotificationAdminQueryQueryVariables>(NotificationAdminQueryDocument, baseOptions);
      }
export function useNotificationAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationAdminQueryQuery, NotificationAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<NotificationAdminQueryQuery, NotificationAdminQueryQueryVariables>(NotificationAdminQueryDocument, baseOptions);
        }
export type NotificationAdminQueryQueryHookResult = ReturnType<typeof useNotificationAdminQueryQuery>;
export type NotificationAdminQueryLazyQueryHookResult = ReturnType<typeof useNotificationAdminQueryLazyQuery>;
export type NotificationAdminQueryQueryResult = Apollo.QueryResult<NotificationAdminQueryQuery, NotificationAdminQueryQueryVariables>;