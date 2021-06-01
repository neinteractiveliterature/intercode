/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { PricingStructureFieldsFragment } from '../Store/pricingStructureFields.generated';
import { gql } from '@apollo/client';
import { PricingStructureFieldsFragmentDoc } from '../Store/pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type TicketPurchaseFormQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type TicketPurchaseFormQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'ticket_name'>
    & { products: Array<(
      { __typename: 'Product' }
      & Pick<Types.Product, 'id' | 'name' | 'description_html'>
      & { pricing_structure: (
        { __typename: 'PricingStructure' }
        & PricingStructureFieldsFragment
      ) }
    )>, ticket_types: Array<(
      { __typename: 'TicketType' }
      & Pick<Types.TicketType, 'id' | 'description'>
      & { providing_products: Array<(
        { __typename: 'Product' }
        & Pick<Types.Product, 'id'>
      )> }
    )> }
  ), myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname'>
    & { ticket?: Types.Maybe<(
      { __typename: 'Ticket' }
      & Pick<Types.Ticket, 'id'>
    )> }
  )> }
);

export type MyTicketDisplayQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MyTicketDisplayQueryData = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'ticket_name' | 'timezone_name'>
  ), myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname'>
    & { ticket?: Types.Maybe<(
      { __typename: 'Ticket' }
      & Pick<Types.Ticket, 'id' | 'created_at' | 'updated_at'>
      & { order_entry?: Types.Maybe<(
        { __typename: 'OrderEntry' }
        & Pick<Types.OrderEntry, 'id'>
        & { order: (
          { __typename: 'Order' }
          & Pick<Types.Order, 'id' | 'charge_id'>
        ), price_per_item: (
          { __typename: 'Money' }
          & Pick<Types.Money, 'fractional' | 'currency_code'>
        ) }
      )>, ticket_type: (
        { __typename: 'TicketType' }
        & Pick<Types.TicketType, 'id' | 'description'>
      ), provided_by_event?: Types.Maybe<(
        { __typename: 'Event' }
        & Pick<Types.Event, 'id' | 'title'>
      )> }
    )> }
  )> }
);


export const TicketPurchaseFormQueryDocument = gql`
    query TicketPurchaseFormQuery {
  convention: assertConvention {
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
  }
  myProfile {
    id
    name_without_nickname
    ticket {
      id
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
  convention: assertConvention {
    id
    name
    ticket_name
    timezone_name
  }
  myProfile {
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