/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from '../Store/pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type TicketPurchaseFormQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TicketPurchaseFormQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, name: string, ticket_name: string, products: Array<{ __typename: 'Product', id: number, name: string, description_html?: Types.Maybe<string>, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: Types.Maybe<any>, finish?: Types.Maybe<any>, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }>, ticket_types: Array<{ __typename: 'TicketType', id: number, description?: Types.Maybe<string>, providing_products: Array<{ __typename: 'Product', id: number }> }>, my_profile?: Types.Maybe<{ __typename: 'UserConProfile', id: number, name_without_nickname: string, ticket?: Types.Maybe<{ __typename: 'Ticket', id: number }> }> } };

export type MyTicketDisplayQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MyTicketDisplayQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, name: string, ticket_name: string, timezone_name?: Types.Maybe<string>, my_profile?: Types.Maybe<{ __typename: 'UserConProfile', id: number, name_without_nickname: string, ticket?: Types.Maybe<{ __typename: 'Ticket', id: number, created_at: any, updated_at: any, order_entry?: Types.Maybe<{ __typename: 'OrderEntry', id: number, order: { __typename: 'Order', id: number, charge_id?: Types.Maybe<string> }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }>, ticket_type: { __typename: 'TicketType', id: number, description?: Types.Maybe<string> }, provided_by_event?: Types.Maybe<{ __typename: 'Event', id: number, title?: Types.Maybe<string> }> }> }> } };


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