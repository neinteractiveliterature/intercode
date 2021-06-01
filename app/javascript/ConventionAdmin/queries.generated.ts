/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type ConventionAdminConventionFieldsFragment = (
  { __typename: 'Convention' }
  & Pick<Types.Convention, 'id' | 'accepting_proposals' | 'starts_at' | 'ends_at' | 'canceled' | 'name' | 'domain' | 'email_from' | 'email_mode' | 'event_mailing_list_domain' | 'location' | 'language' | 'timezone_name' | 'timezone_mode' | 'show_schedule' | 'show_event_list' | 'hidden' | 'maximum_tickets' | 'ticket_name' | 'clickwrap_agreement' | 'ticket_mode' | 'site_mode' | 'signup_mode' | 'signup_requests_open' | 'stripe_account_ready_to_charge'>
  & { stripe_account?: Types.Maybe<(
    { __typename: 'StripeAccount' }
    & Pick<Types.StripeAccount, 'id' | 'email' | 'charges_enabled' | 'display_name'>
  )>, maximum_event_signups?: Types.Maybe<(
    { __typename: 'ScheduledValue' }
    & { timespans: Array<(
      { __typename: 'TimespanWithValue' }
      & Pick<Types.TimespanWithValue, 'start' | 'finish' | 'value'>
    )> }
  )>, default_layout?: Types.Maybe<(
    { __typename: 'CmsLayout' }
    & Pick<Types.CmsLayout, 'id' | 'name'>
  )>, cms_layouts: Array<(
    { __typename: 'CmsLayout' }
    & Pick<Types.CmsLayout, 'id' | 'name'>
  )>, root_page?: Types.Maybe<(
    { __typename: 'Page' }
    & Pick<Types.Page, 'id' | 'name'>
  )>, pages: Array<(
    { __typename: 'Page' }
    & Pick<Types.Page, 'id' | 'name'>
  )>, staff_positions: Array<(
    { __typename: 'StaffPosition' }
    & Pick<Types.StaffPosition, 'id' | 'name'>
  )>, catch_all_staff_position?: Types.Maybe<(
    { __typename: 'StaffPosition' }
    & Pick<Types.StaffPosition, 'id' | 'name'>
  )> }
);

export type ConventionAdminConventionQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ConventionAdminConventionQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & ConventionAdminConventionFieldsFragment
  ), rootSite: (
    { __typename: 'RootSite' }
    & Pick<Types.RootSite, 'id' | 'url'>
  ) }
);

export type StripeAccountOnboardingLinkQueryVariables = Types.Exact<{
  baseUrl: Types.Scalars['String'];
}>;


export type StripeAccountOnboardingLinkQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { stripe_account?: Types.Maybe<(
      { __typename: 'StripeAccount' }
      & Pick<Types.StripeAccount, 'id' | 'account_onboarding_link'>
    )> }
  ) }
);

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
  default_layout {
    id
    name
  }
  cms_layouts {
    id
    name
  }
  root_page {
    id
    name
  }
  pages {
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
  convention: assertConvention {
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
  convention: assertConvention {
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