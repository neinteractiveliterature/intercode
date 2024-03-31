/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from '../Store/pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TicketTypeAdmin_TicketTypeFieldsFragment = { __typename: 'TicketType', id: string, name: string, description?: string | null, counts_towards_convention_maximum: boolean, allows_event_signups: boolean, maximum_event_provided_tickets: number, providing_products: Array<{ __typename: 'Product', id: string, name: string, available: boolean, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }> };

export type AdminTicketTypesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AdminTicketTypesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, ticket_types: Array<{ __typename: 'TicketType', id: string, name: string, description?: string | null, counts_towards_convention_maximum: boolean, allows_event_signups: boolean, maximum_event_provided_tickets: number, providing_products: Array<{ __typename: 'Product', id: string, name: string, available: boolean, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }> }> } };

export type EventTicketTypesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type EventTicketTypesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, event: { __typename: 'Event', id: string, title?: string | null, ticket_types: Array<{ __typename: 'TicketType', id: string, name: string, description?: string | null, counts_towards_convention_maximum: boolean, allows_event_signups: boolean, maximum_event_provided_tickets: number, providing_products: Array<{ __typename: 'Product', id: string, name: string, available: boolean, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }> }> } } };

export const TicketTypeAdmin_TicketTypeFieldsFragmentDoc = gql`
    fragment TicketTypeAdmin_TicketTypeFields on TicketType {
  id
  name
  description
  counts_towards_convention_maximum
  allows_event_signups
  maximum_event_provided_tickets
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
  convention: conventionByRequestHost {
    id
    ticket_types {
      id
      ...TicketTypeAdmin_TicketTypeFields
    }
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
export function useAdminTicketTypesQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminTicketTypesQueryData, AdminTicketTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminTicketTypesQueryData, AdminTicketTypesQueryVariables>(AdminTicketTypesQueryDocument, options);
        }
export type AdminTicketTypesQueryHookResult = ReturnType<typeof useAdminTicketTypesQuery>;
export type AdminTicketTypesQueryLazyQueryHookResult = ReturnType<typeof useAdminTicketTypesQueryLazyQuery>;
export type AdminTicketTypesQuerySuspenseQueryHookResult = ReturnType<typeof useAdminTicketTypesQuerySuspenseQuery>;
export type AdminTicketTypesQueryQueryResult = Apollo.QueryResult<AdminTicketTypesQueryData, AdminTicketTypesQueryVariables>;
export const EventTicketTypesQueryDocument = gql`
    query EventTicketTypesQuery($id: ID!) {
  convention: conventionByRequestHost {
    id
    event(id: $id) {
      id
      title
      ticket_types {
        id
        ...TicketTypeAdmin_TicketTypeFields
      }
    }
  }
}
    ${TicketTypeAdmin_TicketTypeFieldsFragmentDoc}`;

/**
 * __useEventTicketTypesQuery__
 *
 * To run a query within a React component, call `useEventTicketTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventTicketTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventTicketTypesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEventTicketTypesQuery(baseOptions: Apollo.QueryHookOptions<EventTicketTypesQueryData, EventTicketTypesQueryVariables> & ({ variables: EventTicketTypesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventTicketTypesQueryData, EventTicketTypesQueryVariables>(EventTicketTypesQueryDocument, options);
      }
export function useEventTicketTypesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventTicketTypesQueryData, EventTicketTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventTicketTypesQueryData, EventTicketTypesQueryVariables>(EventTicketTypesQueryDocument, options);
        }
export function useEventTicketTypesQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<EventTicketTypesQueryData, EventTicketTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<EventTicketTypesQueryData, EventTicketTypesQueryVariables>(EventTicketTypesQueryDocument, options);
        }
export type EventTicketTypesQueryHookResult = ReturnType<typeof useEventTicketTypesQuery>;
export type EventTicketTypesQueryLazyQueryHookResult = ReturnType<typeof useEventTicketTypesQueryLazyQuery>;
export type EventTicketTypesQuerySuspenseQueryHookResult = ReturnType<typeof useEventTicketTypesQuerySuspenseQuery>;
export type EventTicketTypesQueryQueryResult = Apollo.QueryResult<EventTicketTypesQueryData, EventTicketTypesQueryVariables>;