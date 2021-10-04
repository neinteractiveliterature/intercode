/* eslint-disable */
import * as Types from './graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AppRootQueryVariables = Types.Exact<{
  path: Types.Scalars['String'];
}>;


export type AppRootQueryData = { __typename: 'Query', cmsParentByRequestHost: { __typename: 'Convention', id: string, effectiveCmsLayout: { __typename: 'CmsLayout', content_html?: string | null | undefined, id: string }, cmsNavigationItems: Array<{ __typename: 'CmsNavigationItem', position?: number | null | undefined, title?: string | null | undefined, id: string, navigation_section?: { __typename: 'CmsNavigationItem', id: string } | null | undefined, page?: { __typename: 'Page', slug?: string | null | undefined, id: string } | null | undefined }> } | { __typename: 'RootSite', id: string, effectiveCmsLayout: { __typename: 'CmsLayout', content_html?: string | null | undefined, id: string }, cmsNavigationItems: Array<{ __typename: 'CmsNavigationItem', position?: number | null | undefined, title?: string | null | undefined, id: string, navigation_section?: { __typename: 'CmsNavigationItem', id: string } | null | undefined, page?: { __typename: 'Page', slug?: string | null | undefined, id: string } | null | undefined }> }, currentAbility: { __typename: 'Ability', can_read_schedule: boolean, can_read_schedule_with_counts: boolean, can_list_events: boolean, can_read_user_con_profiles: boolean, can_manage_conventions: boolean, can_update_convention: boolean, can_update_departments: boolean, can_manage_email_routes: boolean, can_update_event_categories: boolean, can_read_event_proposals: boolean, can_manage_runs: boolean, can_manage_forms: boolean, can_read_any_mailing_list: boolean, can_update_notification_templates: boolean, can_manage_oauth_applications: boolean, can_read_reports: boolean, can_manage_rooms: boolean, can_manage_signups: boolean, can_manage_any_cms_content: boolean, can_manage_staff_positions: boolean, can_read_orders: boolean, can_manage_ticket_types: boolean, can_read_user_activity_alerts: boolean, can_read_organizations: boolean, can_read_users: boolean }, currentUser?: { __typename: 'User', name?: string | null | undefined, id: string } | null | undefined, assumedIdentityFromProfile?: { __typename: 'UserConProfile', name_without_nickname: string, id: string } | null | undefined, convention?: { __typename: 'Convention', name: string, domain?: string | null | undefined, accepting_proposals?: boolean | null | undefined, canceled: boolean, language: string, site_mode: Types.SiteMode, signup_mode: Types.SignupMode, starts_at?: any | null | undefined, ends_at?: any | null | undefined, ticket_mode: Types.TicketMode, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, clickwrap_agreement?: string | null | undefined, tickets_available_for_purchase: boolean, ticket_name: string, id: string, ticket_types: Array<{ __typename: 'TicketType', id: string, providing_products: Array<{ __typename: 'Product', available: boolean, id: string }> }>, my_profile?: { __typename: 'UserConProfile', name: string, accepted_clickwrap_agreement?: boolean | null | undefined, name_without_nickname: string, first_name: string, last_name: string, gravatar_enabled: boolean, gravatar_url: string, id: string, ticket?: { __typename: 'Ticket', id: string } | null | undefined, current_pending_order?: { __typename: 'Order', id: string, order_entries: Array<{ __typename: 'OrderEntry', quantity: number, id: string }> } | null | undefined } | null | undefined } | null | undefined, rootSite: { __typename: 'RootSite', site_name: string, id: string } };


export const AppRootQueryDocument = gql`
    query AppRootQuery($path: String!) {
  cmsParentByRequestHost {
    id: transitionalId
    effectiveCmsLayout(path: $path) {
      id: transitionalId
      content_html(path: $path)
    }
    cmsNavigationItems {
      id: transitionalId
      position
      title
      navigation_section {
        id: transitionalId
      }
      page {
        id: transitionalId
        slug
      }
    }
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
    id: transitionalId
    name
  }
  assumedIdentityFromProfile {
    id: transitionalId
    name_without_nickname
  }
  convention: conventionByRequestHostIfPresent {
    id: transitionalId
    name
    domain
    accepting_proposals
    canceled
    language
    site_mode
    signup_mode
    starts_at
    ends_at
    ticket_mode
    timezone_name
    timezone_mode
    clickwrap_agreement
    tickets_available_for_purchase
    ticket_name
    ticket_types {
      id: transitionalId
      providing_products {
        id: transitionalId
        available
      }
    }
    my_profile {
      id: transitionalId
      name
      accepted_clickwrap_agreement
      name_without_nickname
      first_name
      last_name
      gravatar_enabled
      gravatar_url
      ticket {
        id: transitionalId
      }
      current_pending_order {
        id: transitionalId
        order_entries {
          id: transitionalId
          quantity
        }
      }
    }
  }
  rootSite {
    id: transitionalId
    site_name
  }
}
    `;

/**
 * __useAppRootQuery__
 *
 * To run a query within a React component, call `useAppRootQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppRootQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppRootQuery({
 *   variables: {
 *      path: // value for 'path'
 *   },
 * });
 */
export function useAppRootQuery(baseOptions: Apollo.QueryHookOptions<AppRootQueryData, AppRootQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AppRootQueryData, AppRootQueryVariables>(AppRootQueryDocument, options);
      }
export function useAppRootQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppRootQueryData, AppRootQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AppRootQueryData, AppRootQueryVariables>(AppRootQueryDocument, options);
        }
export type AppRootQueryHookResult = ReturnType<typeof useAppRootQuery>;
export type AppRootQueryLazyQueryHookResult = ReturnType<typeof useAppRootQueryLazyQuery>;
export type AppRootQueryQueryResult = Apollo.QueryResult<AppRootQueryData, AppRootQueryVariables>;