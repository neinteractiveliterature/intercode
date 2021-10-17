/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from '../Store/pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type TicketTypeAdmin_TicketTypeFieldsFragment = { __typename: 'TicketType', name: string, description?: string | null | undefined, counts_towards_convention_maximum: boolean, allows_event_signups: boolean, maximum_event_provided_tickets: number, id: string, providing_products: Array<{ __typename: 'Product', name: string, available: boolean, id: string, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null | undefined, finish?: string | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }> };

export type AdminTicketTypesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AdminTicketTypesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', ticket_name: string, timezone_name?: string | null | undefined, id: string, ticket_types: Array<{ __typename: 'TicketType', name: string, description?: string | null | undefined, counts_towards_convention_maximum: boolean, allows_event_signups: boolean, maximum_event_provided_tickets: number, id: string, providing_products: Array<{ __typename: 'Product', name: string, available: boolean, id: string, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null | undefined, finish?: string | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }> }> } };

export const TicketTypeAdmin_TicketTypeFieldsFragmentDoc = gql`
    fragment TicketTypeAdmin_TicketTypeFields on TicketType {
  id: transitionalId
  name
  description
  counts_towards_convention_maximum
  allows_event_signups
  maximum_event_provided_tickets
  providing_products {
    id: transitionalId
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
  convention: conventionByRequestHost {
    id: transitionalId
    ticket_types {
      id: transitionalId
      ...TicketTypeAdmin_TicketTypeFields
    }
    ticket_name
    timezone_name
  }
}
    ${TicketTypeAdmin_TicketTypeFieldsFragmentDoc}`;

/**
 * __useAdminTicketTypesQuery__
 *
 * To run a query within a React component, call `useAdminTicketTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminTicketTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminTicketTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminTicketTypesQuery(baseOptions?: Apollo.QueryHookOptions<AdminTicketTypesQueryData, AdminTicketTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminTicketTypesQueryData, AdminTicketTypesQueryVariables>(AdminTicketTypesQueryDocument, options);
      }
export function useAdminTicketTypesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminTicketTypesQueryData, AdminTicketTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminTicketTypesQueryData, AdminTicketTypesQueryVariables>(AdminTicketTypesQueryDocument, options);
        }
export type AdminTicketTypesQueryHookResult = ReturnType<typeof useAdminTicketTypesQuery>;
export type AdminTicketTypesQueryLazyQueryHookResult = ReturnType<typeof useAdminTicketTypesQueryLazyQuery>;
export type AdminTicketTypesQueryQueryResult = Apollo.QueryResult<AdminTicketTypesQueryData, AdminTicketTypesQueryVariables>;