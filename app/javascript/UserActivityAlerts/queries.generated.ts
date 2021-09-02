/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type UserActivityAlertsAdminConventionFieldsFragment = { __typename: 'Convention', id: number, ticket_name: string, ticket_mode: Types.TicketMode, staff_positions: Array<{ __typename: 'StaffPosition', id: number, name: string }> };

export type UserActivityAlertFieldsFragment = { __typename: 'UserActivityAlert', id: number, email?: Types.Maybe<string>, partial_name?: Types.Maybe<string>, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, user?: Types.Maybe<{ __typename: 'User', id: number, name?: Types.Maybe<string> }>, notification_destinations: Array<{ __typename: 'NotificationDestination', id: number, staff_position?: Types.Maybe<{ __typename: 'StaffPosition', id: number, name: string }>, user_con_profile?: Types.Maybe<{ __typename: 'UserConProfile', id: number, name_without_nickname: string }> }> };

export type ConventionTicketNameQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ConventionTicketNameQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, ticket_name: string, ticket_mode: Types.TicketMode, staff_positions: Array<{ __typename: 'StaffPosition', id: number, name: string }> } };

export type UserActivityAlertQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserActivityAlertQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, ticket_name: string, ticket_mode: Types.TicketMode, user_activity_alert: { __typename: 'UserActivityAlert', id: number, email?: Types.Maybe<string>, partial_name?: Types.Maybe<string>, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, user?: Types.Maybe<{ __typename: 'User', id: number, name?: Types.Maybe<string> }>, notification_destinations: Array<{ __typename: 'NotificationDestination', id: number, staff_position?: Types.Maybe<{ __typename: 'StaffPosition', id: number, name: string }>, user_con_profile?: Types.Maybe<{ __typename: 'UserConProfile', id: number, name_without_nickname: string }> }> }, staff_positions: Array<{ __typename: 'StaffPosition', id: number, name: string }> } };

export type UserActivityAlertsAdminQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserActivityAlertsAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, ticket_name: string, ticket_mode: Types.TicketMode, user_activity_alerts: Array<{ __typename: 'UserActivityAlert', id: number, email?: Types.Maybe<string>, partial_name?: Types.Maybe<string>, trigger_on_user_con_profile_create: boolean, trigger_on_ticket_create: boolean, user?: Types.Maybe<{ __typename: 'User', id: number, name?: Types.Maybe<string> }>, notification_destinations: Array<{ __typename: 'NotificationDestination', id: number, staff_position?: Types.Maybe<{ __typename: 'StaffPosition', id: number, name: string }>, user_con_profile?: Types.Maybe<{ __typename: 'UserConProfile', id: number, name_without_nickname: string }> }> }> } };

export const UserActivityAlertsAdminConventionFieldsFragmentDoc = gql`
    fragment UserActivityAlertsAdminConventionFields on Convention {
  id
  ticket_name
  ticket_mode
  staff_positions {
    id
    name
  }
}
    `;
export const UserActivityAlertFieldsFragmentDoc = gql`
    fragment UserActivityAlertFields on UserActivityAlert {
  id
  email
  partial_name
  trigger_on_user_con_profile_create
  trigger_on_ticket_create
  user {
    id
    name
  }
  notification_destinations {
    id
    staff_position {
      id
      name
    }
    user_con_profile {
      id
      name_without_nickname
    }
  }
}
    `;
export const ConventionTicketNameQueryDocument = gql`
    query ConventionTicketNameQuery {
  convention: assertConvention {
    id
    ...UserActivityAlertsAdminConventionFields
  }
}
    ${UserActivityAlertsAdminConventionFieldsFragmentDoc}`;

/**
 * __useConventionTicketNameQuery__
 *
 * To run a query within a React component, call `useConventionTicketNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useConventionTicketNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConventionTicketNameQuery({
 *   variables: {
 *   },
 * });
 */
export function useConventionTicketNameQuery(baseOptions?: Apollo.QueryHookOptions<ConventionTicketNameQueryData, ConventionTicketNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConventionTicketNameQueryData, ConventionTicketNameQueryVariables>(ConventionTicketNameQueryDocument, options);
      }
export function useConventionTicketNameQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConventionTicketNameQueryData, ConventionTicketNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConventionTicketNameQueryData, ConventionTicketNameQueryVariables>(ConventionTicketNameQueryDocument, options);
        }
export type ConventionTicketNameQueryHookResult = ReturnType<typeof useConventionTicketNameQuery>;
export type ConventionTicketNameQueryLazyQueryHookResult = ReturnType<typeof useConventionTicketNameQueryLazyQuery>;
export type ConventionTicketNameQueryQueryResult = Apollo.QueryResult<ConventionTicketNameQueryData, ConventionTicketNameQueryVariables>;
export const UserActivityAlertQueryDocument = gql`
    query UserActivityAlertQuery($id: Int!) {
  convention: assertConvention {
    id
    ...UserActivityAlertsAdminConventionFields
    user_activity_alert(id: $id) {
      id
      ...UserActivityAlertFields
    }
  }
}
    ${UserActivityAlertsAdminConventionFieldsFragmentDoc}
${UserActivityAlertFieldsFragmentDoc}`;

/**
 * __useUserActivityAlertQuery__
 *
 * To run a query within a React component, call `useUserActivityAlertQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserActivityAlertQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserActivityAlertQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserActivityAlertQuery(baseOptions: Apollo.QueryHookOptions<UserActivityAlertQueryData, UserActivityAlertQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserActivityAlertQueryData, UserActivityAlertQueryVariables>(UserActivityAlertQueryDocument, options);
      }
export function useUserActivityAlertQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserActivityAlertQueryData, UserActivityAlertQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserActivityAlertQueryData, UserActivityAlertQueryVariables>(UserActivityAlertQueryDocument, options);
        }
export type UserActivityAlertQueryHookResult = ReturnType<typeof useUserActivityAlertQuery>;
export type UserActivityAlertQueryLazyQueryHookResult = ReturnType<typeof useUserActivityAlertQueryLazyQuery>;
export type UserActivityAlertQueryQueryResult = Apollo.QueryResult<UserActivityAlertQueryData, UserActivityAlertQueryVariables>;
export const UserActivityAlertsAdminQueryDocument = gql`
    query UserActivityAlertsAdminQuery {
  convention: assertConvention {
    id
    ticket_name
    ticket_mode
    user_activity_alerts {
      id
      ...UserActivityAlertFields
    }
  }
}
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