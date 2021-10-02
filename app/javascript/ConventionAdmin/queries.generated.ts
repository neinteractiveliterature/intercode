/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ConventionAdminConventionFieldsFragment = { __typename: 'Convention', id: number, accepting_proposals?: boolean | null | undefined, starts_at?: any | null | undefined, ends_at?: any | null | undefined, canceled: boolean, name: string, domain?: string | null | undefined, email_from: string, email_mode: Types.EmailMode, event_mailing_list_domain?: string | null | undefined, location?: any | null | undefined, language: string, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, show_schedule?: Types.ShowSchedule | null | undefined, show_event_list?: Types.ShowSchedule | null | undefined, hidden: boolean, maximum_tickets?: number | null | undefined, ticket_name: string, clickwrap_agreement?: string | null | undefined, ticket_mode: Types.TicketMode, site_mode: Types.SiteMode, signup_mode: Types.SignupMode, signup_requests_open: boolean, stripe_account_ready_to_charge: boolean, stripe_account?: { __typename: 'StripeAccount', id: string, email?: string | null | undefined, charges_enabled: boolean, display_name?: string | null | undefined } | null | undefined, maximum_event_signups?: { __typename: 'ScheduledValue', timespans: Array<{ __typename: 'TimespanWithValue', start?: any | null | undefined, finish?: any | null | undefined, value: string }> } | null | undefined, defaultLayout: { __typename: 'CmsLayout', id: number, name?: string | null | undefined }, cmsLayouts: Array<{ __typename: 'CmsLayout', id: number, name?: string | null | undefined }>, rootPage: { __typename: 'Page', id: number, name?: string | null | undefined }, cmsPages: Array<{ __typename: 'Page', id: number, name?: string | null | undefined }>, staff_positions: Array<{ __typename: 'StaffPosition', id: number, name: string }>, catch_all_staff_position?: { __typename: 'StaffPosition', id: number, name: string } | null | undefined };

export type ConventionAdminConventionQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ConventionAdminConventionQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, accepting_proposals?: boolean | null | undefined, starts_at?: any | null | undefined, ends_at?: any | null | undefined, canceled: boolean, name: string, domain?: string | null | undefined, email_from: string, email_mode: Types.EmailMode, event_mailing_list_domain?: string | null | undefined, location?: any | null | undefined, language: string, timezone_name?: string | null | undefined, timezone_mode: Types.TimezoneMode, show_schedule?: Types.ShowSchedule | null | undefined, show_event_list?: Types.ShowSchedule | null | undefined, hidden: boolean, maximum_tickets?: number | null | undefined, ticket_name: string, clickwrap_agreement?: string | null | undefined, ticket_mode: Types.TicketMode, site_mode: Types.SiteMode, signup_mode: Types.SignupMode, signup_requests_open: boolean, stripe_account_ready_to_charge: boolean, stripe_account?: { __typename: 'StripeAccount', id: string, email?: string | null | undefined, charges_enabled: boolean, display_name?: string | null | undefined } | null | undefined, maximum_event_signups?: { __typename: 'ScheduledValue', timespans: Array<{ __typename: 'TimespanWithValue', start?: any | null | undefined, finish?: any | null | undefined, value: string }> } | null | undefined, defaultLayout: { __typename: 'CmsLayout', id: number, name?: string | null | undefined }, cmsLayouts: Array<{ __typename: 'CmsLayout', id: number, name?: string | null | undefined }>, rootPage: { __typename: 'Page', id: number, name?: string | null | undefined }, cmsPages: Array<{ __typename: 'Page', id: number, name?: string | null | undefined }>, staff_positions: Array<{ __typename: 'StaffPosition', id: number, name: string }>, catch_all_staff_position?: { __typename: 'StaffPosition', id: number, name: string } | null | undefined }, rootSite: { __typename: 'RootSite', id: number, url: string } };

export type StripeAccountOnboardingLinkQueryVariables = Types.Exact<{
  baseUrl: Types.Scalars['String'];
}>;


export type StripeAccountOnboardingLinkQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, stripe_account?: { __typename: 'StripeAccount', id: string, account_onboarding_link: string } | null | undefined } };

export const ConventionAdminConventionFieldsFragmentDoc = gql`
    fragment ConventionAdminConventionFields on Convention {
  id
  accepting_proposals
  starts_at
  ends_at
  canceled
  name
  domain
  email_from
  email_mode
  event_mailing_list_domain
  location
  language
  timezone_name
  timezone_mode
  show_schedule
  show_event_list
  hidden
  maximum_tickets
  ticket_name
  clickwrap_agreement
  ticket_mode
  site_mode
  signup_mode
  signup_requests_open
  stripe_account_ready_to_charge
  stripe_account {
    id
    email
    charges_enabled
    display_name
  }
  maximum_event_signups {
    timespans {
      start
      finish
      value
    }
  }
  defaultLayout {
    id
    name
  }
  cmsLayouts {
    id
    name
  }
  rootPage {
    id
    name
  }
  cmsPages {
    id
    name
  }
  staff_positions {
    id
    name
  }
  catch_all_staff_position {
    id
    name
  }
}
    `;
export const ConventionAdminConventionQueryDocument = gql`
    query ConventionAdminConventionQuery {
  convention: conventionByRequestHost {
    id
    ...ConventionAdminConventionFields
  }
  rootSite {
    id
    url
  }
}
    ${ConventionAdminConventionFieldsFragmentDoc}`;

/**
 * __useConventionAdminConventionQuery__
 *
 * To run a query within a React component, call `useConventionAdminConventionQuery` and pass it any options that fit your needs.
 * When your component renders, `useConventionAdminConventionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConventionAdminConventionQuery({
 *   variables: {
 *   },
 * });
 */
export function useConventionAdminConventionQuery(baseOptions?: Apollo.QueryHookOptions<ConventionAdminConventionQueryData, ConventionAdminConventionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConventionAdminConventionQueryData, ConventionAdminConventionQueryVariables>(ConventionAdminConventionQueryDocument, options);
      }
export function useConventionAdminConventionQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConventionAdminConventionQueryData, ConventionAdminConventionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConventionAdminConventionQueryData, ConventionAdminConventionQueryVariables>(ConventionAdminConventionQueryDocument, options);
        }
export type ConventionAdminConventionQueryHookResult = ReturnType<typeof useConventionAdminConventionQuery>;
export type ConventionAdminConventionQueryLazyQueryHookResult = ReturnType<typeof useConventionAdminConventionQueryLazyQuery>;
export type ConventionAdminConventionQueryQueryResult = Apollo.QueryResult<ConventionAdminConventionQueryData, ConventionAdminConventionQueryVariables>;
export const StripeAccountOnboardingLinkQueryDocument = gql`
    query StripeAccountOnboardingLinkQuery($baseUrl: String!) {
  convention: conventionByRequestHost {
    id
    stripe_account {
      id
      account_onboarding_link(base_url: $baseUrl)
    }
  }
}
    `;

/**
 * __useStripeAccountOnboardingLinkQuery__
 *
 * To run a query within a React component, call `useStripeAccountOnboardingLinkQuery` and pass it any options that fit your needs.
 * When your component renders, `useStripeAccountOnboardingLinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStripeAccountOnboardingLinkQuery({
 *   variables: {
 *      baseUrl: // value for 'baseUrl'
 *   },
 * });
 */
export function useStripeAccountOnboardingLinkQuery(baseOptions: Apollo.QueryHookOptions<StripeAccountOnboardingLinkQueryData, StripeAccountOnboardingLinkQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StripeAccountOnboardingLinkQueryData, StripeAccountOnboardingLinkQueryVariables>(StripeAccountOnboardingLinkQueryDocument, options);
      }
export function useStripeAccountOnboardingLinkQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StripeAccountOnboardingLinkQueryData, StripeAccountOnboardingLinkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StripeAccountOnboardingLinkQueryData, StripeAccountOnboardingLinkQueryVariables>(StripeAccountOnboardingLinkQueryDocument, options);
        }
export type StripeAccountOnboardingLinkQueryHookResult = ReturnType<typeof useStripeAccountOnboardingLinkQuery>;
export type StripeAccountOnboardingLinkQueryLazyQueryHookResult = ReturnType<typeof useStripeAccountOnboardingLinkQueryLazyQuery>;
export type StripeAccountOnboardingLinkQueryQueryResult = Apollo.QueryResult<StripeAccountOnboardingLinkQueryData, StripeAccountOnboardingLinkQueryVariables>;