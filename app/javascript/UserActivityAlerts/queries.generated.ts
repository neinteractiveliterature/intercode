/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type UserActivityAlertsAdminConventionFieldsFragment = { __typename: 'Convention', ticket_name: string, ticket_mode: Types.TicketMode, id: string, staff_positions: Array<{ __typename: 'StaffPosition', name: string, id: string }> };

export type UserActivityAlertFieldsFragment = { __typename: 'UserActivityAlert', email?: string | null | undefined, partial_name?: string | null | undefined, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, id: string, user?: { __typename: 'User', name?: string | null | undefined, id: string } | null | undefined, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, staff_position?: { __typename: 'StaffPosition', name: string, id: string } | null | undefined, user_con_profile?: { __typename: 'UserConProfile', name_without_nickname: string, id: string } | null | undefined }> };

export type UserActivityAlertsAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserActivityAlertsAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', ticket_name: string, ticket_mode: Types.TicketMode, id: string, user_activity_alerts: Array<{ __typename: 'UserActivityAlert', email?: string | null | undefined, partial_name?: string | null | undefined, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, id: string, user?: { __typename: 'User', name?: string | null | undefined, id: string } | null | undefined, notification_destinations: Array<{ __typename: 'NotificationDestination', id: string, staff_position?: { __typename: 'StaffPosition', name: string, id: string } | null | undefined, user_con_profile?: { __typename: 'UserConProfile', name_without_nickname: string, id: string } | null | undefined }> }>, staff_positions: Array<{ __typename: 'StaffPosition', name: string, id: string }> } };

export const UserActivityAlertsAdminConventionFieldsFragmentDoc = gql`
    fragment UserActivityAlertsAdminConventionFields on Convention {
  id: transitionalId
  ticket_name
  ticket_mode
  staff_positions {
    id: transitionalId
    name
  }
}
    `;
export const UserActivityAlertFieldsFragmentDoc = gql`
    fragment UserActivityAlertFields on UserActivityAlert {
  id: transitionalId
  email
  partial_name
  trigger_on_user_con_profile_create
  trigger_on_ticket_create
  user {
    id: transitionalId
    name
  }
  notification_destinations {
    id: transitionalId
    staff_position {
      id: transitionalId
      name
    }
    user_con_profile {
      id: transitionalId
      name_without_nickname
    }
  }
}
    `;
export const UserActivityAlertsAdminQueryDocument = gql`
    query UserActivityAlertsAdminQuery {
  convention: conventionByRequestHost {
    id: transitionalId
    ...UserActivityAlertsAdminConventionFields
    user_activity_alerts {
      id: transitionalId
      ...UserActivityAlertFields
    }
  }
}
    ${UserActivityAlertsAdminConventionFieldsFragmentDoc}
${UserActivityAlertFieldsFragmentDoc}`;

/**
 * __useUserActivityAlertsAdminQuery__
 *
 * To run a query within a React component, call `useUserActivityAlertsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserActivityAlertsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserActivityAlertsAdminQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserActivityAlertsAdminQuery(baseOptions?: Apollo.QueryHookOptions<UserActivityAlertsAdminQueryData, UserActivityAlertsAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserActivityAlertsAdminQueryData, UserActivityAlertsAdminQueryVariables>(UserActivityAlertsAdminQueryDocument, options);
      }
export function useUserActivityAlertsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserActivityAlertsAdminQueryData, UserActivityAlertsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserActivityAlertsAdminQueryData, UserActivityAlertsAdminQueryVariables>(UserActivityAlertsAdminQueryDocument, options);
        }
export type UserActivityAlertsAdminQueryHookResult = ReturnType<typeof useUserActivityAlertsAdminQuery>;
export type UserActivityAlertsAdminQueryLazyQueryHookResult = ReturnType<typeof useUserActivityAlertsAdminQueryLazyQuery>;
export type UserActivityAlertsAdminQueryQueryResult = Apollo.QueryResult<UserActivityAlertsAdminQueryData, UserActivityAlertsAdminQueryVariables>;