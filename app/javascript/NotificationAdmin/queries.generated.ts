/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type NotificationTemplateFieldsFragment = (
  { __typename: 'NotificationTemplate' }
  & Pick<Types.NotificationTemplate, 'id' | 'event_key' | 'subject' | 'body_html' | 'body_text' | 'body_sms'>
);

export type NotificationAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type NotificationAdminQueryData = (
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
 * __useNotificationAdminQuery__
 *
 * To run a query within a React component, call `useNotificationAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificationAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useNotificationAdminQuery(baseOptions?: Apollo.QueryHookOptions<NotificationAdminQueryData, NotificationAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificationAdminQueryData, NotificationAdminQueryVariables>(NotificationAdminQueryDocument, options);
      }
export function useNotificationAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificationAdminQueryData, NotificationAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificationAdminQueryData, NotificationAdminQueryVariables>(NotificationAdminQueryDocument, options);
        }
export type NotificationAdminQueryHookResult = ReturnType<typeof useNotificationAdminQuery>;
export type NotificationAdminQueryLazyQueryHookResult = ReturnType<typeof useNotificationAdminQueryLazyQuery>;
export type NotificationAdminQueryDataResult = Apollo.QueryResult<NotificationAdminQueryData, NotificationAdminQueryVariables>;
