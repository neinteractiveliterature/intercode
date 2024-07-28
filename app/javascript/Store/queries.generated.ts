/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { AdminOrderFieldsFragmentDoc, OrderEntryFieldsFragmentDoc, CartOrderFieldsFragmentDoc, CouponApplicationFieldsFragmentDoc } from './orderFields.generated';
import { AdminProductFieldsFragmentDoc } from './adminProductFields.generated';
import { PricingStructureFieldsFragmentDoc } from './pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AdminOrdersQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  perPage?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  filters?: Types.InputMaybe<Types.OrderFiltersInput>;
  sort?: Types.InputMaybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type AdminOrdersQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_create_orders: boolean, can_update_orders: boolean }, convention: { __typename: 'Convention', id: string, timezone_name?: string | null, orders_paginated: { __typename: 'OrdersPagination', current_page: number, per_page: number, total_pages: number, entries: Array<{ __typename: 'Order', id: string, status: Types.OrderStatus, submitted_at?: string | null, charge_id?: string | null, payment_note?: string | null, paid_at?: string | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: string, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null } }>, order_entries: Array<{ __typename: 'OrderEntry', id: string, quantity: number, describe_products: string, product: { __typename: 'Product', id: string, name: string }, product_variant?: { __typename: 'ProductVariant', id: string, name: string } | null, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }> } } };

export type AdminProductsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AdminProductsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, products: Array<{ __typename: 'Product', id: string, name: string, description?: string | null, description_html?: string | null, available: boolean, payment_options: Array<string>, clickwrap_agreement?: string | null, clickwrap_agreement_html?: string | null, image?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', id: string, name: string, description?: string | null, position?: number | null, image?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null, override_pricing_structure?: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } | null }>, provides_ticket_type?: { __typename: 'TicketType', id: string, description?: string | null } | null }>, ticket_types: Array<{ __typename: 'TicketType', id: string, description?: string | null }> }, currentAbility: { __typename: 'Ability', can_update_products: boolean } };

export type AdminStoreAbilityQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AdminStoreAbilityQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_update_products: boolean, can_update_orders: boolean }, convention: { __typename: 'Convention', id: string, timezone_name?: string | null } };

export type CartQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CartQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, my_profile?: { __typename: 'UserConProfile', id: string, name_without_nickname: string, current_pending_order?: { __typename: 'Order', id: string, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: string, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null } }>, total_price_before_discounts: { __typename: 'Money', fractional: number, currency_code: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, order_entries: Array<{ __typename: 'OrderEntry', id: string, quantity: number, product: { __typename: 'Product', id: string, name: string, payment_options: Array<string>, provides_ticket_type?: { __typename: 'TicketType', id: string } | null }, product_variant?: { __typename: 'ProductVariant', id: string, name: string } | null, price: { __typename: 'Money', fractional: number, currency_code: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> } | null } | null } };

export type OrderHistoryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrderHistoryQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, timezone_name?: string | null, staff_positions: Array<{ __typename: 'StaffPosition', id: string, name: string, email?: string | null }>, my_profile?: { __typename: 'UserConProfile', id: string, name_without_nickname: string, orders: Array<{ __typename: 'Order', id: string, status: Types.OrderStatus, submitted_at?: string | null, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, coupon_applications: Array<{ __typename: 'CouponApplication', id: string, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: string, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null } }>, order_entries: Array<{ __typename: 'OrderEntry', id: string, quantity: number, product: { __typename: 'Product', id: string, name: string, payment_options: Array<string>, image?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null }, product_variant?: { __typename: 'ProductVariant', id: string, name: string, image?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null } | null, price_per_item: { __typename: 'Money', fractional: number, currency_code: string }, price: { __typename: 'Money', fractional: number, currency_code: string } }> }> } | null } };

export type OrderSummaryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrderSummaryQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, products: Array<{ __typename: 'Product', id: string, name: string, order_quantities_by_status: Array<{ __typename: 'OrderQuantityByStatus', status: string, quantity: number }>, product_variants: Array<{ __typename: 'ProductVariant', id: string, name: string, order_quantities_by_status: Array<{ __typename: 'OrderQuantityByStatus', status: string, quantity: number }> }> }> } };

export type OrderFormProductQueryVariables = Types.Exact<{
  productId: Types.Scalars['ID']['input'];
}>;


export type OrderFormProductQueryData = { __typename: 'Query', currentUser?: { __typename: 'User', id: string } | null, convention: { __typename: 'Convention', id: string, product: { __typename: 'Product', id: string, name: string, description_html?: string | null, clickwrap_agreement_html?: string | null, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, provides_ticket_type?: { __typename: 'TicketType', id: string } | null, image?: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null, product_variants: Array<{ __typename: 'ProductVariant', id: string, name: string, position?: number | null, override_pricing_structure?: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } | null }> } } };

export type CurrentPendingOrderPaymentIntentClientSecretQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CurrentPendingOrderPaymentIntentClientSecretQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, my_profile?: { __typename: 'UserConProfile', id: string, current_pending_order?: { __typename: 'Order', id: string, payment_intent_client_secret: string } | null } | null } };


export const AdminOrdersQueryDocument = gql`
    query AdminOrdersQuery($page: Int, $perPage: Int, $filters: OrderFiltersInput, $sort: [SortInput!]) {
  currentAbility {
    can_create_orders
    can_update_orders
  }
  convention: conventionByRequestHost {
    id
    timezone_name
    orders_paginated(
      page: $page
      per_page: $perPage
      filters: $filters
      sort: $sort
    ) {
      current_page
      per_page
      total_pages
      entries {
        id
        ...AdminOrderFieldsFragment
      }
    }
  }
}
    ${AdminOrderFieldsFragmentDoc}`;

/**
 * __useAdminOrdersQuery__
 *
 * To run a query within a React component, call `useAdminOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOrdersQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useAdminOrdersQuery(baseOptions?: Apollo.QueryHookOptions<AdminOrdersQueryData, AdminOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminOrdersQueryData, AdminOrdersQueryVariables>(AdminOrdersQueryDocument, options);
      }
export function useAdminOrdersQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminOrdersQueryData, AdminOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminOrdersQueryData, AdminOrdersQueryVariables>(AdminOrdersQueryDocument, options);
        }
export function useAdminOrdersQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminOrdersQueryData, AdminOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminOrdersQueryData, AdminOrdersQueryVariables>(AdminOrdersQueryDocument, options);
        }
export type AdminOrdersQueryHookResult = ReturnType<typeof useAdminOrdersQuery>;
export type AdminOrdersQueryLazyQueryHookResult = ReturnType<typeof useAdminOrdersQueryLazyQuery>;
export type AdminOrdersQuerySuspenseQueryHookResult = ReturnType<typeof useAdminOrdersQuerySuspenseQuery>;
export type AdminOrdersQueryQueryResult = Apollo.QueryResult<AdminOrdersQueryData, AdminOrdersQueryVariables>;
export const AdminProductsQueryDocument = gql`
    query AdminProductsQuery {
  convention: conventionByRequestHost {
    id
    products {
      id
      ...AdminProductFields
    }
    ticket_types {
      id
      description
    }
  }
  currentAbility {
    can_update_products
  }
}
    ${AdminProductFieldsFragmentDoc}`;

/**
 * __useAdminProductsQuery__
 *
 * To run a query within a React component, call `useAdminProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminProductsQuery(baseOptions?: Apollo.QueryHookOptions<AdminProductsQueryData, AdminProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminProductsQueryData, AdminProductsQueryVariables>(AdminProductsQueryDocument, options);
      }
export function useAdminProductsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminProductsQueryData, AdminProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminProductsQueryData, AdminProductsQueryVariables>(AdminProductsQueryDocument, options);
        }
export function useAdminProductsQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminProductsQueryData, AdminProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminProductsQueryData, AdminProductsQueryVariables>(AdminProductsQueryDocument, options);
        }
export type AdminProductsQueryHookResult = ReturnType<typeof useAdminProductsQuery>;
export type AdminProductsQueryLazyQueryHookResult = ReturnType<typeof useAdminProductsQueryLazyQuery>;
export type AdminProductsQuerySuspenseQueryHookResult = ReturnType<typeof useAdminProductsQuerySuspenseQuery>;
export type AdminProductsQueryQueryResult = Apollo.QueryResult<AdminProductsQueryData, AdminProductsQueryVariables>;
export const AdminStoreAbilityQueryDocument = gql`
    query AdminStoreAbilityQuery {
  currentAbility {
    can_update_products
    can_update_orders
  }
  convention: conventionByRequestHost {
    id
    timezone_name
  }
}
    `;

/**
 * __useAdminStoreAbilityQuery__
 *
 * To run a query within a React component, call `useAdminStoreAbilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminStoreAbilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminStoreAbilityQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminStoreAbilityQuery(baseOptions?: Apollo.QueryHookOptions<AdminStoreAbilityQueryData, AdminStoreAbilityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminStoreAbilityQueryData, AdminStoreAbilityQueryVariables>(AdminStoreAbilityQueryDocument, options);
      }
export function useAdminStoreAbilityQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminStoreAbilityQueryData, AdminStoreAbilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminStoreAbilityQueryData, AdminStoreAbilityQueryVariables>(AdminStoreAbilityQueryDocument, options);
        }
export function useAdminStoreAbilityQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AdminStoreAbilityQueryData, AdminStoreAbilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AdminStoreAbilityQueryData, AdminStoreAbilityQueryVariables>(AdminStoreAbilityQueryDocument, options);
        }
export type AdminStoreAbilityQueryHookResult = ReturnType<typeof useAdminStoreAbilityQuery>;
export type AdminStoreAbilityQueryLazyQueryHookResult = ReturnType<typeof useAdminStoreAbilityQueryLazyQuery>;
export type AdminStoreAbilityQuerySuspenseQueryHookResult = ReturnType<typeof useAdminStoreAbilityQuerySuspenseQuery>;
export type AdminStoreAbilityQueryQueryResult = Apollo.QueryResult<AdminStoreAbilityQueryData, AdminStoreAbilityQueryVariables>;
export const CartQueryDocument = gql`
    query CartQuery {
  convention: conventionByRequestHost {
    id
    name
    my_profile {
      id
      name_without_nickname
      current_pending_order {
        id
        ...CartOrderFields
      }
    }
  }
}
    ${CartOrderFieldsFragmentDoc}`;

/**
 * __useCartQuery__
 *
 * To run a query within a React component, call `useCartQuery` and pass it any options that fit your needs.
 * When your component renders, `useCartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCartQuery({
 *   variables: {
 *   },
 * });
 */
export function useCartQuery(baseOptions?: Apollo.QueryHookOptions<CartQueryData, CartQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CartQueryData, CartQueryVariables>(CartQueryDocument, options);
      }
export function useCartQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CartQueryData, CartQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CartQueryData, CartQueryVariables>(CartQueryDocument, options);
        }
export function useCartQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CartQueryData, CartQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CartQueryData, CartQueryVariables>(CartQueryDocument, options);
        }
export type CartQueryHookResult = ReturnType<typeof useCartQuery>;
export type CartQueryLazyQueryHookResult = ReturnType<typeof useCartQueryLazyQuery>;
export type CartQuerySuspenseQueryHookResult = ReturnType<typeof useCartQuerySuspenseQuery>;
export type CartQueryQueryResult = Apollo.QueryResult<CartQueryData, CartQueryVariables>;
export const OrderHistoryQueryDocument = gql`
    query OrderHistoryQuery {
  convention: conventionByRequestHost {
    id
    name
    timezone_name
    staff_positions {
      id
      name
      email
    }
    my_profile {
      id
      name_without_nickname
      orders {
        id
        status
        submitted_at
        total_price {
          fractional
          currency_code
        }
        payment_amount {
          fractional
          currency_code
        }
        coupon_applications {
          id
          ...CouponApplicationFields
        }
        order_entries {
          id
          quantity
          product {
            id
            name
            payment_options
            image {
              id
              url
            }
          }
          product_variant {
            id
            name
            image {
              id
              url
            }
          }
          price_per_item {
            fractional
            currency_code
          }
          price {
            fractional
            currency_code
          }
        }
      }
    }
  }
}
    ${CouponApplicationFieldsFragmentDoc}`;

/**
 * __useOrderHistoryQuery__
 *
 * To run a query within a React component, call `useOrderHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderHistoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrderHistoryQuery(baseOptions?: Apollo.QueryHookOptions<OrderHistoryQueryData, OrderHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderHistoryQueryData, OrderHistoryQueryVariables>(OrderHistoryQueryDocument, options);
      }
export function useOrderHistoryQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderHistoryQueryData, OrderHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderHistoryQueryData, OrderHistoryQueryVariables>(OrderHistoryQueryDocument, options);
        }
export function useOrderHistoryQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrderHistoryQueryData, OrderHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrderHistoryQueryData, OrderHistoryQueryVariables>(OrderHistoryQueryDocument, options);
        }
export type OrderHistoryQueryHookResult = ReturnType<typeof useOrderHistoryQuery>;
export type OrderHistoryQueryLazyQueryHookResult = ReturnType<typeof useOrderHistoryQueryLazyQuery>;
export type OrderHistoryQuerySuspenseQueryHookResult = ReturnType<typeof useOrderHistoryQuerySuspenseQuery>;
export type OrderHistoryQueryQueryResult = Apollo.QueryResult<OrderHistoryQueryData, OrderHistoryQueryVariables>;
export const OrderSummaryQueryDocument = gql`
    query OrderSummaryQuery {
  convention: conventionByRequestHost {
    id
    products {
      id
      name
      order_quantities_by_status {
        status
        quantity
      }
      product_variants {
        id
        name
        order_quantities_by_status {
          status
          quantity
        }
      }
    }
  }
}
    `;

/**
 * __useOrderSummaryQuery__
 *
 * To run a query within a React component, call `useOrderSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderSummaryQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrderSummaryQuery(baseOptions?: Apollo.QueryHookOptions<OrderSummaryQueryData, OrderSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderSummaryQueryData, OrderSummaryQueryVariables>(OrderSummaryQueryDocument, options);
      }
export function useOrderSummaryQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderSummaryQueryData, OrderSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderSummaryQueryData, OrderSummaryQueryVariables>(OrderSummaryQueryDocument, options);
        }
export function useOrderSummaryQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrderSummaryQueryData, OrderSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrderSummaryQueryData, OrderSummaryQueryVariables>(OrderSummaryQueryDocument, options);
        }
export type OrderSummaryQueryHookResult = ReturnType<typeof useOrderSummaryQuery>;
export type OrderSummaryQueryLazyQueryHookResult = ReturnType<typeof useOrderSummaryQueryLazyQuery>;
export type OrderSummaryQuerySuspenseQueryHookResult = ReturnType<typeof useOrderSummaryQuerySuspenseQuery>;
export type OrderSummaryQueryQueryResult = Apollo.QueryResult<OrderSummaryQueryData, OrderSummaryQueryVariables>;
export const OrderFormProductQueryDocument = gql`
    query OrderFormProductQuery($productId: ID!) {
  currentUser {
    id
  }
  convention: conventionByRequestHost {
    id
    product(id: $productId) {
      id
      name
      pricing_structure {
        ...PricingStructureFields
      }
      description_html
      provides_ticket_type {
        id
      }
      image {
        id
        url
      }
      clickwrap_agreement_html
      product_variants {
        id
        name
        position
        override_pricing_structure {
          ...PricingStructureFields
        }
      }
    }
  }
}
    ${PricingStructureFieldsFragmentDoc}`;

/**
 * __useOrderFormProductQuery__
 *
 * To run a query within a React component, call `useOrderFormProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderFormProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderFormProductQuery({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useOrderFormProductQuery(baseOptions: Apollo.QueryHookOptions<OrderFormProductQueryData, OrderFormProductQueryVariables> & ({ variables: OrderFormProductQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderFormProductQueryData, OrderFormProductQueryVariables>(OrderFormProductQueryDocument, options);
      }
export function useOrderFormProductQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderFormProductQueryData, OrderFormProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderFormProductQueryData, OrderFormProductQueryVariables>(OrderFormProductQueryDocument, options);
        }
export function useOrderFormProductQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<OrderFormProductQueryData, OrderFormProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<OrderFormProductQueryData, OrderFormProductQueryVariables>(OrderFormProductQueryDocument, options);
        }
export type OrderFormProductQueryHookResult = ReturnType<typeof useOrderFormProductQuery>;
export type OrderFormProductQueryLazyQueryHookResult = ReturnType<typeof useOrderFormProductQueryLazyQuery>;
export type OrderFormProductQuerySuspenseQueryHookResult = ReturnType<typeof useOrderFormProductQuerySuspenseQuery>;
export type OrderFormProductQueryQueryResult = Apollo.QueryResult<OrderFormProductQueryData, OrderFormProductQueryVariables>;
export const CurrentPendingOrderPaymentIntentClientSecretQueryDocument = gql`
    query CurrentPendingOrderPaymentIntentClientSecretQuery {
  convention: conventionByRequestHost {
    id
    my_profile {
      id
      current_pending_order {
        id
        payment_intent_client_secret
      }
    }
  }
}
    `;

/**
 * __useCurrentPendingOrderPaymentIntentClientSecretQuery__
 *
 * To run a query within a React component, call `useCurrentPendingOrderPaymentIntentClientSecretQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentPendingOrderPaymentIntentClientSecretQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentPendingOrderPaymentIntentClientSecretQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentPendingOrderPaymentIntentClientSecretQuery(baseOptions?: Apollo.QueryHookOptions<CurrentPendingOrderPaymentIntentClientSecretQueryData, CurrentPendingOrderPaymentIntentClientSecretQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentPendingOrderPaymentIntentClientSecretQueryData, CurrentPendingOrderPaymentIntentClientSecretQueryVariables>(CurrentPendingOrderPaymentIntentClientSecretQueryDocument, options);
      }
export function useCurrentPendingOrderPaymentIntentClientSecretQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentPendingOrderPaymentIntentClientSecretQueryData, CurrentPendingOrderPaymentIntentClientSecretQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentPendingOrderPaymentIntentClientSecretQueryData, CurrentPendingOrderPaymentIntentClientSecretQueryVariables>(CurrentPendingOrderPaymentIntentClientSecretQueryDocument, options);
        }
export function useCurrentPendingOrderPaymentIntentClientSecretQuerySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CurrentPendingOrderPaymentIntentClientSecretQueryData, CurrentPendingOrderPaymentIntentClientSecretQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CurrentPendingOrderPaymentIntentClientSecretQueryData, CurrentPendingOrderPaymentIntentClientSecretQueryVariables>(CurrentPendingOrderPaymentIntentClientSecretQueryDocument, options);
        }
export type CurrentPendingOrderPaymentIntentClientSecretQueryHookResult = ReturnType<typeof useCurrentPendingOrderPaymentIntentClientSecretQuery>;
export type CurrentPendingOrderPaymentIntentClientSecretQueryLazyQueryHookResult = ReturnType<typeof useCurrentPendingOrderPaymentIntentClientSecretQueryLazyQuery>;
export type CurrentPendingOrderPaymentIntentClientSecretQuerySuspenseQueryHookResult = ReturnType<typeof useCurrentPendingOrderPaymentIntentClientSecretQuerySuspenseQuery>;
export type CurrentPendingOrderPaymentIntentClientSecretQueryQueryResult = Apollo.QueryResult<CurrentPendingOrderPaymentIntentClientSecretQueryData, CurrentPendingOrderPaymentIntentClientSecretQueryVariables>;