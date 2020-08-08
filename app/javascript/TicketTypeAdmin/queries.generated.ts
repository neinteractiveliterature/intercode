/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { PricingStructureFieldsFragment } from '../Store/pricingStructureFields.generated';
import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from '../Store/pricingStructureFields.generated';
import * as Apollo from '@apollo/client';


export type TicketTypeAdmin_TicketTypeFieldsFragment = (
  { __typename?: 'TicketType' }
  & Pick<Types.TicketType, 'id' | 'name' | 'description' | 'counts_towards_convention_maximum' | 'allows_event_signups' | 'maximum_event_provided_tickets'>
  & { pricing_schedule: (
    { __typename?: 'ScheduledMoneyValue' }
    & { timespans: Array<(
      { __typename?: 'TimespanWithMoneyValue' }
      & Pick<Types.TimespanWithMoneyValue, 'start' | 'finish'>
      & { value: (
        { __typename?: 'Money' }
        & Pick<Types.Money, 'fractional' | 'currency_code'>
      ) }
    )> }
  ), providing_products: Array<(
    { __typename?: 'Product' }
    & Pick<Types.Product, 'id' | 'name' | 'available'>
    & { pricing_structure?: Types.Maybe<(
      { __typename?: 'PricingStructure' }
      & PricingStructureFieldsFragment
    )> }
  )> }
);

export type AdminTicketTypesQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AdminTicketTypesQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Types.Maybe<(
    { __typename?: 'Convention' }
    & Pick<Types.Convention, 'id' | 'ticket_name' | 'timezone_name'>
    & { ticket_types: Array<(
      { __typename?: 'TicketType' }
      & Pick<Types.TicketType, 'id'>
      & TicketTypeAdmin_TicketTypeFieldsFragment
    )> }
  )> }
);

export const TicketTypeAdmin_TicketTypeFieldsFragmentDoc = gql`
    fragment TicketTypeAdmin_TicketTypeFields on TicketType {
  id
  name
  description
  counts_towards_convention_maximum
  allows_event_signups
  maximum_event_provided_tickets
  pricing_schedule {
    timespans {
      start
      finish
      value {
        fractional
        currency_code
      }
    }
  }
  providing_products {
    id
    name
    available
    pricing_structure {
      ...PricingStructureFields
    }
  }
}
    ${PricingStructureFieldsFragmentDoc}`;
export const AdminTicketTypesQueryDocument = gql`
    query AdminTicketTypesQuery {
  convention {
    id
    ticket_types {
      id
      ...TicketTypeAdmin_TicketTypeFields
    }
    ticket_name
    timezone_name
  }
}
    ${TicketTypeAdmin_TicketTypeFieldsFragmentDoc}`;

/**
 * __useAdminTicketTypesQueryQuery__
 *
 * To run a query within a React component, call `useAdminTicketTypesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminTicketTypesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminTicketTypesQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminTicketTypesQueryQuery(baseOptions?: Apollo.QueryHookOptions<AdminTicketTypesQueryQuery, AdminTicketTypesQueryQueryVariables>) {
        return Apollo.useQuery<AdminTicketTypesQueryQuery, AdminTicketTypesQueryQueryVariables>(AdminTicketTypesQueryDocument, baseOptions);
      }
export function useAdminTicketTypesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminTicketTypesQueryQuery, AdminTicketTypesQueryQueryVariables>) {
          return Apollo.useLazyQuery<AdminTicketTypesQueryQuery, AdminTicketTypesQueryQueryVariables>(AdminTicketTypesQueryDocument, baseOptions);
        }
export type AdminTicketTypesQueryQueryHookResult = ReturnType<typeof useAdminTicketTypesQueryQuery>;
export type AdminTicketTypesQueryLazyQueryHookResult = ReturnType<typeof useAdminTicketTypesQueryLazyQuery>;
export type AdminTicketTypesQueryQueryResult = Apollo.QueryResult<AdminTicketTypesQueryQuery, AdminTicketTypesQueryQueryVariables>;