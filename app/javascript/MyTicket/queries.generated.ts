/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from '../Store/pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type TicketPurchaseFormQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TicketPurchaseFormQueryData = { __typename: 'Query', convention: { __typename: 'Convention', name: string, ticket_name: string, id: string, products: Array<{ __typename: 'Product', name: string, description_html?: string | null | undefined, id: string, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null | undefined, finish?: string | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }>, ticket_types: Array<{ __typename: 'TicketType', description?: string | null | undefined, id: string, providing_products: Array<{ __typename: 'Product', id: string }> }>, my_profile?: { __typename: 'UserConProfile', name_without_nickname: string, id: string, ticket?: { __typename: 'Ticket', id: string } | null | undefined } | null | undefined } };

export type MyTicketDisplayQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MyTicketDisplayQueryData = { __typename: 'Query', convention: { __typename: 'Convention', name: string, ticket_name: string, timezone_name?: string | null | undefined, id: string, my_profile?: { __typename: 'UserConProfile', name_without_nickname: string, id: string, ticket?: { __typename: 'Ticket', created_at: string, updated_at: string, id: string, order_entry?: { __typename: 'OrderEntry', id: string, order: { __typename: 'Order', charge_id?: string | null | undefined, id: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } | null | undefined, ticket_type: { __typename: 'TicketType', description?: string | null | undefined, id: string }, provided_by_event?: { __typename: 'Event', title?: string | null | undefined, id: string } | null | undefined } | null | undefined } | null | undefined } };


export const TicketPurchaseFormQueryDocument = gql`
    query TicketPurchaseFormQuery {
  convention: conventionByRequestHost {
    id: transitionalId
    name
    ticket_name
    products(only_ticket_providing: true, only_available: true) {
      id: transitionalId
      name
      description_html
      pricing_structure {
        ...PricingStructureFields
      }
    }
    ticket_types {
      id: transitionalId
      description
      providing_products {
        id: transitionalId
      }
    }
    my_profile {
      id: transitionalId
      name_without_nickname
      ticket {
        id: transitionalId
      }
    }
  }
}
    ${PricingStructureFieldsFragmentDoc}`;

/**
 * __useTicketPurchaseFormQuery__
 *
 * To run a query within a React component, call `useTicketPurchaseFormQuery` and pass it any options that fit your needs.
 * When your component renders, `useTicketPurchaseFormQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketPurchaseFormQuery({
 *   variables: {
 *   },
 * });
 */
export function useTicketPurchaseFormQuery(baseOptions?: Apollo.QueryHookOptions<TicketPurchaseFormQueryData, TicketPurchaseFormQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TicketPurchaseFormQueryData, TicketPurchaseFormQueryVariables>(TicketPurchaseFormQueryDocument, options);
      }
export function useTicketPurchaseFormQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TicketPurchaseFormQueryData, TicketPurchaseFormQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TicketPurchaseFormQueryData, TicketPurchaseFormQueryVariables>(TicketPurchaseFormQueryDocument, options);
        }
export type TicketPurchaseFormQueryHookResult = ReturnType<typeof useTicketPurchaseFormQuery>;
export type TicketPurchaseFormQueryLazyQueryHookResult = ReturnType<typeof useTicketPurchaseFormQueryLazyQuery>;
export type TicketPurchaseFormQueryQueryResult = Apollo.QueryResult<TicketPurchaseFormQueryData, TicketPurchaseFormQueryVariables>;
export const MyTicketDisplayQueryDocument = gql`
    query MyTicketDisplayQuery {
  convention: conventionByRequestHost {
    id: transitionalId
    name
    ticket_name
    timezone_name
    my_profile {
      id: transitionalId
      name_without_nickname
      ticket {
        id: transitionalId
        created_at
        updated_at
        order_entry {
          id: transitionalId
          order {
            id: transitionalId
            charge_id
          }
          price_per_item {
            fractional
            currency_code
          }
        }
        ticket_type {
          id: transitionalId
          description
        }
        provided_by_event {
          id: transitionalId
          title
        }
      }
    }
  }
}
    `;

/**
 * __useMyTicketDisplayQuery__
 *
 * To run a query within a React component, call `useMyTicketDisplayQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyTicketDisplayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyTicketDisplayQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyTicketDisplayQuery(baseOptions?: Apollo.QueryHookOptions<MyTicketDisplayQueryData, MyTicketDisplayQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyTicketDisplayQueryData, MyTicketDisplayQueryVariables>(MyTicketDisplayQueryDocument, options);
      }
export function useMyTicketDisplayQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyTicketDisplayQueryData, MyTicketDisplayQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyTicketDisplayQueryData, MyTicketDisplayQueryVariables>(MyTicketDisplayQueryDocument, options);
        }
export type MyTicketDisplayQueryHookResult = ReturnType<typeof useMyTicketDisplayQuery>;
export type MyTicketDisplayQueryLazyQueryHookResult = ReturnType<typeof useMyTicketDisplayQueryLazyQuery>;
export type MyTicketDisplayQueryQueryResult = Apollo.QueryResult<MyTicketDisplayQueryData, MyTicketDisplayQueryVariables>;