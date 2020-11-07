/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type UserActivityAlertsAdminConventionFieldsFragment = (
  { __typename: 'Convention' }
  & Pick<Types.Convention, 'id' | 'ticket_name' | 'ticket_mode'>
  & { staff_positions: Array<(
    { __typename: 'StaffPosition' }
    & Pick<Types.StaffPosition, 'id' | 'name'>
  )> }
);

export type UserActivityAlertFieldsFragment = (
  { __typename: 'UserActivityAlert' }
  & Pick<Types.UserActivityAlert, 'id' | 'email' | 'partial_name' | 'trigger_on_user_con_profile_create' | 'trigger_on_ticket_create'>
  & { user?: Types.Maybe<(
    { __typename: 'User' }
    & Pick<Types.User, 'id' | 'name'>
  )>, notification_destinations: Array<(
    { __typename: 'NotificationDestination' }
    & Pick<Types.NotificationDestination, 'id'>
    & { staff_position?: Types.Maybe<(
      { __typename: 'StaffPosition' }
      & Pick<Types.StaffPosition, 'id' | 'name'>
    )>, user_con_profile?: Types.Maybe<(
      { __typename: 'UserConProfile' }
      & Pick<Types.UserConProfile, 'id' | 'name_without_nickname'>
    )> }
  )> }
);

export type ConventionTicketNameQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ConventionTicketNameQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & UserActivityAlertsAdminConventionFieldsFragment
  ) }
);

export type UserActivityAlertQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type UserActivityAlertQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { user_activity_alert: (
      { __typename: 'UserActivityAlert' }
      & Pick<Types.UserActivityAlert, 'id'>
      & UserActivityAlertFieldsFragment
    ) }
    & UserActivityAlertsAdminConventionFieldsFragment
  ) }
);

export type UserActivityAlertsAdminQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type UserActivityAlertsAdminQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_name' | 'ticket_mode'>
    & { user_activity_alerts: Array<(
      { __typename: 'UserActivityAlert' }
      & Pick<Types.UserActivityAlert, 'id'>
      & UserActivityAlertFieldsFragment
    )> }
  ) }
);

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
 * __useConventionTicketNameQueryQuery__
 *
 * To run a query within a React component, call `useConventionTicketNameQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useConventionTicketNameQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConventionTicketNameQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useConventionTicketNameQueryQuery(baseOptions?: Apollo.QueryHookOptions<ConventionTicketNameQueryQuery, ConventionTicketNameQueryQueryVariables>) {
        return Apollo.useQuery<ConventionTicketNameQueryQuery, ConventionTicketNameQueryQueryVariables>(ConventionTicketNameQueryDocument, baseOptions);
      }
export function useConventionTicketNameQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConventionTicketNameQueryQuery, ConventionTicketNameQueryQueryVariables>) {
          return Apollo.useLazyQuery<ConventionTicketNameQueryQuery, ConventionTicketNameQueryQueryVariables>(ConventionTicketNameQueryDocument, baseOptions);
        }
export type ConventionTicketNameQueryQueryHookResult = ReturnType<typeof useConventionTicketNameQueryQuery>;
export type ConventionTicketNameQueryLazyQueryHookResult = ReturnType<typeof useConventionTicketNameQueryLazyQuery>;
export type ConventionTicketNameQueryQueryResult = Apollo.QueryResult<ConventionTicketNameQueryQuery, ConventionTicketNameQueryQueryVariables>;
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
 * __useUserActivityAlertQueryQuery__
 *
 * To run a query within a React component, call `useUserActivityAlertQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserActivityAlertQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserActivityAlertQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserActivityAlertQueryQuery(baseOptions: Apollo.QueryHookOptions<UserActivityAlertQueryQuery, UserActivityAlertQueryQueryVariables>) {
        return Apollo.useQuery<UserActivityAlertQueryQuery, UserActivityAlertQueryQueryVariables>(UserActivityAlertQueryDocument, baseOptions);
      }
export function useUserActivityAlertQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserActivityAlertQueryQuery, UserActivityAlertQueryQueryVariables>) {
          return Apollo.useLazyQuery<UserActivityAlertQueryQuery, UserActivityAlertQueryQueryVariables>(UserActivityAlertQueryDocument, baseOptions);
        }
export type UserActivityAlertQueryQueryHookResult = ReturnType<typeof useUserActivityAlertQueryQuery>;
export type UserActivityAlertQueryLazyQueryHookResult = ReturnType<typeof useUserActivityAlertQueryLazyQuery>;
export type UserActivityAlertQueryQueryResult = Apollo.QueryResult<UserActivityAlertQueryQuery, UserActivityAlertQueryQueryVariables>;
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
 * __useUserActivityAlertsAdminQueryQuery__
 *
 * To run a query within a React component, call `useUserActivityAlertsAdminQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserActivityAlertsAdminQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserActivityAlertsAdminQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserActivityAlertsAdminQueryQuery(baseOptions?: Apollo.QueryHookOptions<UserActivityAlertsAdminQueryQuery, UserActivityAlertsAdminQueryQueryVariables>) {
        return Apollo.useQuery<UserActivityAlertsAdminQueryQuery, UserActivityAlertsAdminQueryQueryVariables>(UserActivityAlertsAdminQueryDocument, baseOptions);
      }
export function useUserActivityAlertsAdminQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserActivityAlertsAdminQueryQuery, UserActivityAlertsAdminQueryQueryVariables>) {
          return Apollo.useLazyQuery<UserActivityAlertsAdminQueryQuery, UserActivityAlertsAdminQueryQueryVariables>(UserActivityAlertsAdminQueryDocument, baseOptions);
        }
export type UserActivityAlertsAdminQueryQueryHookResult = ReturnType<typeof useUserActivityAlertsAdminQueryQuery>;
export type UserActivityAlertsAdminQueryLazyQueryHookResult = ReturnType<typeof useUserActivityAlertsAdminQueryLazyQuery>;
export type UserActivityAlertsAdminQueryQueryResult = Apollo.QueryResult<UserActivityAlertsAdminQueryQuery, UserActivityAlertsAdminQueryQueryVariables>;