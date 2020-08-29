/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type ConventionAdminConventionFieldsFragment = (
  { __typename?: 'Convention' }
  & Pick<Types.Convention, 'id' | 'accepting_proposals' | 'starts_at' | 'ends_at' | 'canceled' | 'name' | 'domain' | 'email_from' | 'email_mode' | 'event_mailing_list_domain' | 'location' | 'language' | 'timezone_name' | 'timezone_mode' | 'show_schedule' | 'show_event_list' | 'hidden' | 'maximum_tickets' | 'ticket_name' | 'stripe_publishable_key' | 'masked_stripe_secret_key' | 'clickwrap_agreement' | 'ticket_mode' | 'site_mode' | 'signup_mode' | 'signup_requests_open'>
  & { maximum_event_signups?: Types.Maybe<(
    { __typename?: 'ScheduledValue' }
    & { timespans: Array<(
      { __typename?: 'TimespanWithValue' }
      & Pick<Types.TimespanWithValue, 'start' | 'finish' | 'value'>
    )> }
  )>, default_layout?: Types.Maybe<(
    { __typename?: 'CmsLayout' }
    & Pick<Types.CmsLayout, 'id' | 'name'>
  )>, cms_layouts?: Types.Maybe<Array<(
    { __typename?: 'CmsLayout' }
    & Pick<Types.CmsLayout, 'id' | 'name'>
  )>>, root_page?: Types.Maybe<(
    { __typename?: 'Page' }
    & Pick<Types.Page, 'id' | 'name'>
  )>, pages: Array<(
    { __typename?: 'Page' }
    & Pick<Types.Page, 'id' | 'name'>
  )>, staff_positions?: Types.Maybe<Array<(
    { __typename?: 'StaffPosition' }
    & Pick<Types.StaffPosition, 'id' | 'name'>
  )>>, catch_all_staff_position?: Types.Maybe<(
    { __typename?: 'StaffPosition' }
    & Pick<Types.StaffPosition, 'id' | 'name'>
  )> }
);

export type ConventionAdminConventionQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ConventionAdminConventionQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & ConventionAdminConventionFieldsFragment
  )>, rootSite: (
    { __typename?: 'RootSite' }
    & Pick<Types.RootSite, 'id' | 'url'>
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
  stripe_publishable_key
  masked_stripe_secret_key
  clickwrap_agreement
  ticket_mode
  site_mode
  signup_mode
  signup_requests_open
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
  convention {
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
 * __useConventionAdminConventionQueryQuery__
 *
 * To run a query within a React component, call `useConventionAdminConventionQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useConventionAdminConventionQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConventionAdminConventionQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useConventionAdminConventionQueryQuery(baseOptions?: Apollo.QueryHookOptions<ConventionAdminConventionQueryQuery, ConventionAdminConventionQueryQueryVariables>) {
        return Apollo.useQuery<ConventionAdminConventionQueryQuery, ConventionAdminConventionQueryQueryVariables>(ConventionAdminConventionQueryDocument, baseOptions);
      }
export function useConventionAdminConventionQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConventionAdminConventionQueryQuery, ConventionAdminConventionQueryQueryVariables>) {
          return Apollo.useLazyQuery<ConventionAdminConventionQueryQuery, ConventionAdminConventionQueryQueryVariables>(ConventionAdminConventionQueryDocument, baseOptions);
        }
export type ConventionAdminConventionQueryQueryHookResult = ReturnType<typeof useConventionAdminConventionQueryQuery>;
export type ConventionAdminConventionQueryLazyQueryHookResult = ReturnType<typeof useConventionAdminConventionQueryLazyQuery>;
export type ConventionAdminConventionQueryQueryResult = Apollo.QueryResult<ConventionAdminConventionQueryQuery, ConventionAdminConventionQueryQueryVariables>;