/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from '../Store/pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type TicketPurchaseFormQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TicketPurchaseFormQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, ticket_name: string, products: Array<{ __typename: 'Product', id: string, name: string, description_html?: string | null | undefined, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null | undefined, finish?: string | null | undefined, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }>, ticket_types: Array<{ __typename: 'TicketType', id: string, description?: string | null | undefined, providing_products: Array<{ __typename: 'Product', id: string }> }>, my_profile?: { __typename: 'UserConProfile', id: string, name_without_nickname: string, ticket?: { __typename: 'Ticket', id: string } | null | undefined } | null | undefined } };

export type MyTicketDisplayQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MyTicketDisplayQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, ticket_name: string, timezone_name?: string | null | undefined, my_profile?: { __typename: 'UserConProfile', id: string, name_without_nickname: string, ticket?: { __typename: 'Ticket', id: string, created_at: string, updated_at: string, order_entry?: { __typename: 'OrderEntry', id: string, order: { __typename: 'Order', id: string, charge_id?: string | null | undefined }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } } | null | undefined, ticket_type: { __typename: 'TicketType', id: string, description?: string | null | undefined }, provided_by_event?: { __typename: 'Event', id: string, title?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined } };


export const TicketPurchaseFormQueryDocument = gql`
    query TicketPurchaseFormQuery {
  convention: conventionByRequestHost {
    id
    name
    ticket_name
    products(only_ticket_providing: true, only_available: true) {
      id
      name
      description_html
      pricing_structure {
        ...PricingStructureFields
      }
    }
    ticket_types {
      id
      description
      providing_products {
        id
      }
    }
    my_profile {
      id
      name_without_nickname
      ticket {
        id
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
    id
    name
    ticket_name
    timezone_name
    my_profile {
      id
      name_without_nickname
      ticket {
        id
        created_at
        updated_at
        order_entry {
          id
          order {
            id
            charge_id
          }
          price_per_item {
            fractional
            currency_code
          }
        }
        ticket_type {
          id
          description
        }
        provided_by_event {
          id
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