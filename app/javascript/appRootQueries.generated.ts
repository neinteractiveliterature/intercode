/* eslint-disable */
import * as Types from './graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type AppRootQueryQueryVariables = Types.Exact<{
  path: Types.Scalars['String'];
}>;


export type AppRootQueryQuery = (
  { __typename: 'Query' }
  & { effectiveCmsLayout: (
    { __typename: 'CmsLayout' }
    & Pick<Types.CmsLayout, 'id' | 'content_html'>
  ), currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_read_schedule' | 'can_read_schedule_with_counts' | 'can_list_events' | 'can_read_user_con_profiles' | 'can_manage_conventions' | 'can_update_convention' | 'can_update_departments' | 'can_manage_email_routes' | 'can_update_event_categories' | 'can_read_event_proposals' | 'can_manage_runs' | 'can_manage_forms' | 'can_read_any_mailing_list' | 'can_update_notification_templates' | 'can_manage_oauth_applications' | 'can_read_reports' | 'can_manage_rooms' | 'can_manage_signups' | 'can_manage_any_cms_content' | 'can_manage_staff_positions' | 'can_read_orders' | 'can_manage_ticket_types' | 'can_read_user_activity_alerts' | 'can_read_organizations' | 'can_read_users'>
  ), currentUser?: Types.Maybe<(
    { __typename: 'User' }
    & Pick<Types.User, 'id' | 'name'>
  )>, currentPendingOrder?: Types.Maybe<(
    { __typename: 'Order' }
    & Pick<Types.Order, 'id'>
    & { order_entries: Array<(
      { __typename: 'OrderEntry' }
      & Pick<Types.OrderEntry, 'id' | 'quantity'>
    )> }
  )>, myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name' | 'accepted_clickwrap_agreement' | 'name_without_nickname' | 'first_name' | 'last_name' | 'gravatar_enabled' | 'gravatar_url'>
    & { ticket?: Types.Maybe<(
      { __typename: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
    )> }
  )>, assumedIdentityFromProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname'>
  )>, convention?: Types.Maybe<(
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'domain' | 'accepting_proposals' | 'canceled' | 'language' | 'site_mode' | 'signup_mode' | 'ticket_mode' | 'timezone_name' | 'timezone_mode' | 'clickwrap_agreement' | 'tickets_available_for_purchase' | 'ticket_name'>
    & { ticket_types: Array<(
      { __typename: 'TicketType' }
      & Pick<Types.TicketType, 'id'>
      & { providing_products: Array<(
        { __typename: 'Product' }
        & Pick<Types.Product, 'id' | 'available'>
      )> }
    )> }
  )>, rootSite: (
    { __typename: 'RootSite' }
    & Pick<Types.RootSite, 'id' | 'site_name'>
  ), cmsNavigationItems: Array<(
    { __typename: 'CmsNavigationItem' }
    & Pick<Types.CmsNavigationItem, 'id' | 'position' | 'title'>
    & { navigation_section?: Types.Maybe<(
      { __typename: 'CmsNavigationItem' }
      & Pick<Types.CmsNavigationItem, 'id'>
    )>, page?: Types.Maybe<(
      { __typename: 'Page' }
      & Pick<Types.Page, 'id' | 'slug'>
    )> }
  )> }
);


export const AppRootQueryDocument = gql`
    query AppRootQuery($path: String!) {
  effectiveCmsLayout(path: $path) {
    id
    content_html(path: $path)
  }
  currentAbility {
    can_read_schedule
    can_read_schedule_with_counts
    can_list_events
    can_read_user_con_profiles
    can_manage_conventions
    can_update_convention
    can_update_departments
    can_manage_email_routes
    can_update_event_categories
    can_read_event_proposals
    can_manage_runs
    can_manage_forms
    can_read_any_mailing_list
    can_update_notification_templates
    can_manage_oauth_applications
    can_read_reports
    can_manage_rooms
    can_manage_signups
    can_manage_any_cms_content
    can_manage_staff_positions
    can_read_orders
    can_manage_ticket_types
    can_read_user_activity_alerts
    can_read_organizations
    can_read_users
  }
  currentUser {
    id
    name
  }
  currentPendingOrder {
    id
    order_entries {
      id
      quantity
    }
  }
  myProfile {
    id
    name
    accepted_clickwrap_agreement
    name_without_nickname
    first_name
    last_name
    gravatar_enabled
    gravatar_url
    ticket {
      id
    }
  }
  assumedIdentityFromProfile {
    id
    name_without_nickname
  }
  convention {
    id
    name
    domain
    accepting_proposals
    canceled
    language
    site_mode
    signup_mode
    ticket_mode
    timezone_name
    timezone_mode
    clickwrap_agreement
    tickets_available_for_purchase
    ticket_name
    ticket_types {
      id
      providing_products {
        id
        available
      }
    }
  }
  rootSite {
    id
    site_name
  }
  cmsNavigationItems {
    id
    position
    title
    navigation_section {
      id
    }
    page {
      id
      slug
    }
  }
}
    `;

/**
 * __useAppRootQueryQuery__
 *
 * To run a query within a React component, call `useAppRootQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppRootQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppRootQueryQuery({
 *   variables: {
 *      path: // value for 'path'
 *   },
 * });
 */
export function useAppRootQueryQuery(baseOptions?: Apollo.QueryHookOptions<AppRootQueryQuery, AppRootQueryQueryVariables>) {
        return Apollo.useQuery<AppRootQueryQuery, AppRootQueryQueryVariables>(AppRootQueryDocument, baseOptions);
      }
export function useAppRootQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppRootQueryQuery, AppRootQueryQueryVariables>) {
          return Apollo.useLazyQuery<AppRootQueryQuery, AppRootQueryQueryVariables>(AppRootQueryDocument, baseOptions);
        }
export type AppRootQueryQueryHookResult = ReturnType<typeof useAppRootQueryQuery>;
export type AppRootQueryLazyQueryHookResult = ReturnType<typeof useAppRootQueryLazyQuery>;
export type AppRootQueryQueryResult = Apollo.QueryResult<AppRootQueryQuery, AppRootQueryQueryVariables>;