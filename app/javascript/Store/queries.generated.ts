/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { AdminOrderFieldsFragmentDoc } from './orderFields.generated';
import { AdminProductFieldsFragmentDoc } from './adminProductFields.generated';
import { CartOrderFieldsFragmentDoc } from './orderFields.generated';
import { CouponApplicationFieldsFragmentDoc, OrderEntryFieldsFragmentDoc } from './orderFields.generated';
import { PricingStructureFieldsFragmentDoc } from './pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AdminOrdersQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.OrderFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type AdminOrdersQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_create_orders: boolean, can_update_orders: boolean }, convention: { __typename: 'Convention', id: number, timezone_name?: Types.Maybe<string>, orders_paginated: { __typename: 'OrdersPagination', current_page: number, per_page: number, total_pages: number, entries: Array<{ __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: Types.Maybe<any>, charge_id?: Types.Maybe<string>, payment_note?: Types.Maybe<string>, user_con_profile: { __typename: 'UserConProfile', id: number, name_without_nickname: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: Types.Maybe<any>, fixed_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, provides_product?: Types.Maybe<{ __typename: 'Product', id: number, name: string }> } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, describe_products: string, product: { __typename: 'Product', id: number, name: string }, product_variant?: Types.Maybe<{ __typename: 'ProductVariant', id: number, name: string }>, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }> } } };

export type AdminProductsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AdminProductsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, products: Array<{ __typename: 'Product', id: number, name: string, description?: Types.Maybe<string>, description_html?: Types.Maybe<string>, image_url?: Types.Maybe<string>, available: boolean, payment_options: Array<string>, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: Types.Maybe<any>, finish?: Types.Maybe<any>, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, product_variants: Array<{ __typename: 'ProductVariant', id: number, name: string, description?: Types.Maybe<string>, image_url?: Types.Maybe<string>, position?: Types.Maybe<number>, override_pricing_structure?: Types.Maybe<{ __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: Types.Maybe<any>, finish?: Types.Maybe<any>, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }> }>, provides_ticket_type?: Types.Maybe<{ __typename: 'TicketType', id: number, description?: Types.Maybe<string> }> }>, ticket_types: Array<{ __typename: 'TicketType', id: number, description?: Types.Maybe<string> }> }, currentAbility: { __typename: 'Ability', can_update_products: boolean } };

export type AdminStoreAbilityQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AdminStoreAbilityQueryData = { __typename: 'Query', currentAbility: { __typename: 'Ability', can_update_products: boolean, can_update_orders: boolean }, convention: { __typename: 'Convention', id: number, timezone_name?: Types.Maybe<string> } };

export type CartQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CartQueryData = { __typename: 'Query', myProfile?: Types.Maybe<{ __typename: 'UserConProfile', id: number, name_without_nickname: string }>, convention: { __typename: 'Convention', id: number, name: string }, currentPendingOrder?: Types.Maybe<{ __typename: 'Order', id: number, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: Types.Maybe<any>, fixed_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, provides_product?: Types.Maybe<{ __typename: 'Product', id: number, name: string }> } }>, total_price_before_discounts: { __typename: 'Money', fractional: number, currency_code: string }, total_price: { __typename: 'Money', fractional: number, currency_code: string }, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, product: { __typename: 'Product', id: number, name: string, payment_options: Array<string>, provides_ticket_type?: Types.Maybe<{ __typename: 'TicketType', id: number }> }, product_variant?: Types.Maybe<{ __typename: 'ProductVariant', id: number, name: string }>, price: { __typename: 'Money', fractional: number, currency_code: string }, price_per_item: { __typename: 'Money', fractional: number, currency_code: string } }> }> };

export type OrderHistoryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrderHistoryQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, name: string, timezone_name?: Types.Maybe<string>, staff_positions: Array<{ __typename: 'StaffPosition', id: number, name: string, email?: Types.Maybe<string> }> }, myProfile?: Types.Maybe<{ __typename: 'UserConProfile', id: number, name_without_nickname: string, orders: Array<{ __typename: 'Order', id: number, status: Types.OrderStatus, submitted_at?: Types.Maybe<any>, total_price: { __typename: 'Money', fractional: number, currency_code: string }, payment_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, coupon_applications: Array<{ __typename: 'CouponApplication', id: number, discount: { __typename: 'Money', fractional: number, currency_code: string }, coupon: { __typename: 'Coupon', id: number, code: string, percent_discount?: Types.Maybe<any>, fixed_amount?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, provides_product?: Types.Maybe<{ __typename: 'Product', id: number, name: string }> } }>, order_entries: Array<{ __typename: 'OrderEntry', id: number, quantity: number, product: { __typename: 'Product', id: number, name: string, image_url?: Types.Maybe<string>, payment_options: Array<string> }, product_variant?: Types.Maybe<{ __typename: 'ProductVariant', id: number, name: string, image_url?: Types.Maybe<string> }>, price_per_item: { __typename: 'Money', fractional: number, currency_code: string }, price: { __typename: 'Money', fractional: number, currency_code: string } }> }> }> };

export type OrderSummaryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrderSummaryQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: number, products: Array<{ __typename: 'Product', id: number, name: string, order_quantities_by_status: Array<{ __typename: 'OrderQuantityByStatus', status: string, quantity: number }>, product_variants: Array<{ __typename: 'ProductVariant', id: number, name: string, order_quantities_by_status: Array<{ __typename: 'OrderQuantityByStatus', status: string, quantity: number }> }> }> } };

export type OrderFormProductQueryVariables = Types.Exact<{
  productId: Types.Scalars['Int'];
}>;


export type OrderFormProductQueryData = { __typename: 'Query', currentUser?: Types.Maybe<{ __typename: 'User', id: number }>, product: { __typename: 'Product', id: number, image_url?: Types.Maybe<string>, name: string, description_html?: Types.Maybe<string>, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: Types.Maybe<any>, finish?: Types.Maybe<any>, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }, provides_ticket_type?: Types.Maybe<{ __typename: 'TicketType', id: number }>, product_variants: Array<{ __typename: 'ProductVariant', id: number, name: string, position?: Types.Maybe<number>, override_pricing_structure?: Types.Maybe<{ __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: Types.Maybe<{ __typename: 'Money', fractional: number, currency_code: string }>, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: Types.Maybe<any>, finish?: Types.Maybe<any>, value: { __typename: 'Money', fractional: number, currency_code: string } }> } }> }> } };

export type CurrentPendingOrderPaymentIntentClientSecretQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CurrentPendingOrderPaymentIntentClientSecretQueryData = { __typename: 'Query', currentPendingOrderPaymentIntentClientSecret: string };


export const AdminOrdersQueryDocument = gql`
    query AdminOrdersQuery($page: Int, $perPage: Int, $filters: OrderFiltersInput, $sort: [SortInput!]) {
  currentAbility {
    can_create_orders
    can_update_orders
  }
  convention: assertConvention {
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
export type AdminOrdersQueryHookResult = ReturnType<typeof useAdminOrdersQuery>;
export type AdminOrdersQueryLazyQueryHookResult = ReturnType<typeof useAdminOrdersQueryLazyQuery>;
export type AdminOrdersQueryQueryResult = Apollo.QueryResult<AdminOrdersQueryData, AdminOrdersQueryVariables>;
export const AdminProductsQueryDocument = gql`
    query AdminProductsQuery {
  convention: assertConvention {
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
export type AdminProductsQueryHookResult = ReturnType<typeof useAdminProductsQuery>;
export type AdminProductsQueryLazyQueryHookResult = ReturnType<typeof useAdminProductsQueryLazyQuery>;
export type AdminProductsQueryQueryResult = Apollo.QueryResult<AdminProductsQueryData, AdminProductsQueryVariables>;
export const AdminStoreAbilityQueryDocument = gql`
    query AdminStoreAbilityQuery {
  currentAbility {
    can_update_products
    can_update_orders
  }
  convention: assertConvention {
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
export type AdminStoreAbilityQueryHookResult = ReturnType<typeof useAdminStoreAbilityQuery>;
export type AdminStoreAbilityQueryLazyQueryHookResult = ReturnType<typeof useAdminStoreAbilityQueryLazyQuery>;
export type AdminStoreAbilityQueryQueryResult = Apollo.QueryResult<AdminStoreAbilityQueryData, AdminStoreAbilityQueryVariables>;
export const CartQueryDocument = gql`
    query CartQuery {
  myProfile {
    id
    name_without_nickname
  }
  convention: assertConvention {
    id
    name
  }
  currentPendingOrder {
    id
    ...CartOrderFields
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
export type CartQueryHookResult = ReturnType<typeof useCartQuery>;
export type CartQueryLazyQueryHookResult = ReturnType<typeof useCartQueryLazyQuery>;
export type CartQueryQueryResult = Apollo.QueryResult<CartQueryData, CartQueryVariables>;
export const OrderHistoryQueryDocument = gql`
    query OrderHistoryQuery {
  convention: assertConvention {
    id
    name
    timezone_name
    staff_positions {
      id
      name
      email
    }
  }
  myProfile {
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
          image_url
          payment_options
        }
        product_variant {
          id
          name
          image_url
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
export type OrderHistoryQueryHookResult = ReturnType<typeof useOrderHistoryQuery>;
export type OrderHistoryQueryLazyQueryHookResult = ReturnType<typeof useOrderHistoryQueryLazyQuery>;
export type OrderHistoryQueryQueryResult = Apollo.QueryResult<OrderHistoryQueryData, OrderHistoryQueryVariables>;
export const OrderSummaryQueryDocument = gql`
    query OrderSummaryQuery {
  convention: assertConvention {
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
export type OrderSummaryQueryHookResult = ReturnType<typeof useOrderSummaryQuery>;
export type OrderSummaryQueryLazyQueryHookResult = ReturnType<typeof useOrderSummaryQueryLazyQuery>;
export type OrderSummaryQueryQueryResult = Apollo.QueryResult<OrderSummaryQueryData, OrderSummaryQueryVariables>;
export const OrderFormProductQueryDocument = gql`
    query OrderFormProductQuery($productId: Int!) {
  currentUser {
    id
  }
  product(id: $productId) {
    id
    image_url
    name
    pricing_structure {
      ...PricingStructureFields
    }
    description_html
    provides_ticket_type {
      id
    }
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
export function useOrderFormProductQuery(baseOptions: Apollo.QueryHookOptions<OrderFormProductQueryData, OrderFormProductQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderFormProductQueryData, OrderFormProductQueryVariables>(OrderFormProductQueryDocument, options);
      }
export function useOrderFormProductQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderFormProductQueryData, OrderFormProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderFormProductQueryData, OrderFormProductQueryVariables>(OrderFormProductQueryDocument, options);
        }
export type OrderFormProductQueryHookResult = ReturnType<typeof useOrderFormProductQuery>;
export type OrderFormProductQueryLazyQueryHookResult = ReturnType<typeof useOrderFormProductQueryLazyQuery>;
export type OrderFormProductQueryQueryResult = Apollo.QueryResult<OrderFormProductQueryData, OrderFormProductQueryVariables>;
export const CurrentPendingOrderPaymentIntentClientSecretQueryDocument = gql`
    query CurrentPendingOrderPaymentIntentClientSecretQuery {
  currentPendingOrderPaymentIntentClientSecret
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
export type CurrentPendingOrderPaymentIntentClientSecretQueryHookResult = ReturnType<typeof useCurrentPendingOrderPaymentIntentClientSecretQuery>;
export type CurrentPendingOrderPaymentIntentClientSecretQueryLazyQueryHookResult = ReturnType<typeof useCurrentPendingOrderPaymentIntentClientSecretQueryLazyQuery>;
export type CurrentPendingOrderPaymentIntentClientSecretQueryQueryResult = Apollo.QueryResult<CurrentPendingOrderPaymentIntentClientSecretQueryData, CurrentPendingOrderPaymentIntentClientSecretQueryVariables>;