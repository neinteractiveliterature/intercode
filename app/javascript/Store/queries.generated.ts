/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { AdminOrderFieldsFragmentFragment, OrderEntryFieldsFragment, CartOrderFieldsFragment, CouponApplicationFieldsFragment } from './orderFields.generated';
import { AdminProductFieldsFragment } from './adminProductFields.generated';
import { PricingStructureFieldsFragment } from './pricingStructureFields.generated';
import { gql } from '@apollo/client';
import { AdminOrderFieldsFragmentFragmentDoc, OrderEntryFieldsFragmentDoc, CartOrderFieldsFragmentDoc, CouponApplicationFieldsFragmentDoc } from './orderFields.generated';
import { AdminProductFieldsFragmentDoc } from './adminProductFields.generated';
import { PricingStructureFieldsFragmentDoc } from './pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
export type AdminOrdersQueryQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.OrderFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput>>;
}>;


export type AdminOrdersQueryQuery = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_create_orders' | 'can_update_orders'>
  ), convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'timezone_name'>
    & { orders_paginated: (
      { __typename: 'OrdersPagination' }
      & Pick<Types.OrdersPagination, 'current_page' | 'per_page' | 'total_pages'>
      & { entries: Array<(
        { __typename: 'Order' }
        & Pick<Types.Order, 'id'>
        & AdminOrderFieldsFragmentFragment
      )> }
    ) }
  ) }
);

export type AdminProductsQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AdminProductsQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { products: Array<(
      { __typename: 'Product' }
      & Pick<Types.Product, 'id'>
      & AdminProductFieldsFragment
    )>, ticket_types: Array<(
      { __typename: 'TicketType' }
      & Pick<Types.TicketType, 'id' | 'description'>
    )> }
  ), currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_update_products'>
  ) }
);

export type AdminStoreAbilityQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AdminStoreAbilityQueryQuery = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_update_products' | 'can_update_orders'>
  ), convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'timezone_name'>
  ) }
);

export type CartQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CartQueryQuery = (
  { __typename: 'Query' }
  & { myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname'>
  )>, convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name'>
  ), currentPendingOrder?: Types.Maybe<(
    { __typename: 'Order' }
    & Pick<Types.Order, 'id'>
    & CartOrderFieldsFragment
  )> }
);

export type OrderHistoryQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrderHistoryQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'name' | 'timezone_name'>
    & { staff_positions: Array<(
      { __typename: 'StaffPosition' }
      & Pick<Types.StaffPosition, 'id' | 'name' | 'email'>
    )> }
  ), myProfile?: Types.Maybe<(
    { __typename: 'UserConProfile' }
    & Pick<Types.UserConProfile, 'id' | 'name_without_nickname'>
    & { orders: Array<(
      { __typename: 'Order' }
      & Pick<Types.Order, 'id' | 'status' | 'submitted_at'>
      & { total_price: (
        { __typename: 'Money' }
        & Pick<Types.Money, 'fractional' | 'currency_code'>
      ), payment_amount?: Types.Maybe<(
        { __typename: 'Money' }
        & Pick<Types.Money, 'fractional' | 'currency_code'>
      )>, coupon_applications: Array<(
        { __typename: 'CouponApplication' }
        & Pick<Types.CouponApplication, 'id'>
        & CouponApplicationFieldsFragment
      )>, order_entries: Array<(
        { __typename: 'OrderEntry' }
        & Pick<Types.OrderEntry, 'id' | 'quantity'>
        & { product: (
          { __typename: 'Product' }
          & Pick<Types.Product, 'id' | 'name' | 'image_url' | 'payment_options'>
        ), product_variant?: Types.Maybe<(
          { __typename: 'ProductVariant' }
          & Pick<Types.ProductVariant, 'id' | 'name' | 'image_url'>
        )>, price_per_item: (
          { __typename: 'Money' }
          & Pick<Types.Money, 'fractional' | 'currency_code'>
        ), price: (
          { __typename: 'Money' }
          & Pick<Types.Money, 'fractional' | 'currency_code'>
        ) }
      )> }
    )> }
  )> }
);

export type OrderSummaryQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrderSummaryQueryQuery = (
  { __typename: 'Query' }
  & { convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id'>
    & { products: Array<(
      { __typename: 'Product' }
      & Pick<Types.Product, 'id' | 'name'>
      & { order_quantities_by_status: Array<(
        { __typename: 'OrderQuantityByStatus' }
        & Pick<Types.OrderQuantityByStatus, 'status' | 'quantity'>
      )>, product_variants: Array<(
        { __typename: 'ProductVariant' }
        & Pick<Types.ProductVariant, 'id' | 'name'>
        & { order_quantities_by_status: Array<(
          { __typename: 'OrderQuantityByStatus' }
          & Pick<Types.OrderQuantityByStatus, 'status' | 'quantity'>
        )> }
      )> }
    )> }
  ) }
);

export type OrderFormProductQueryQueryVariables = Types.Exact<{
  productId: Types.Scalars['Int'];
}>;


export type OrderFormProductQueryQuery = (
  { __typename: 'Query' }
  & { currentUser?: Types.Maybe<(
    { __typename: 'User' }
    & Pick<Types.User, 'id'>
  )>, product: (
    { __typename: 'Product' }
    & Pick<Types.Product, 'id' | 'image_url' | 'name' | 'description_html'>
    & { pricing_structure: (
      { __typename: 'PricingStructure' }
      & PricingStructureFieldsFragment
    ), provides_ticket_type?: Types.Maybe<(
      { __typename: 'TicketType' }
      & Pick<Types.TicketType, 'id'>
    )>, product_variants: Array<(
      { __typename: 'ProductVariant' }
      & Pick<Types.ProductVariant, 'id' | 'name' | 'position'>
      & { override_pricing_structure?: Types.Maybe<(
        { __typename: 'PricingStructure' }
        & PricingStructureFieldsFragment
      )> }
    )> }
  ) }
);

export type CurrentPendingOrderPaymentIntentClientSecretQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CurrentPendingOrderPaymentIntentClientSecretQueryQuery = (
  { __typename: 'Query' }
  & Pick<Types.Query, 'currentPendingOrderPaymentIntentClientSecret'>
);


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
    ${AdminOrderFieldsFragmentFragmentDoc}`;

/**
 * __useAdminOrdersQueryQuery__
 *
 * To run a query within a React component, call `useAdminOrdersQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminOrdersQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminOrdersQueryQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useAdminOrdersQueryQuery(baseOptions?: Apollo.QueryHookOptions<AdminOrdersQueryQuery, AdminOrdersQueryQueryVariables>) {
        return Apollo.useQuery<AdminOrdersQueryQuery, AdminOrdersQueryQueryVariables>(AdminOrdersQueryDocument, baseOptions);
      }
export function useAdminOrdersQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminOrdersQueryQuery, AdminOrdersQueryQueryVariables>) {
          return Apollo.useLazyQuery<AdminOrdersQueryQuery, AdminOrdersQueryQueryVariables>(AdminOrdersQueryDocument, baseOptions);
        }
export type AdminOrdersQueryQueryHookResult = ReturnType<typeof useAdminOrdersQueryQuery>;
export type AdminOrdersQueryLazyQueryHookResult = ReturnType<typeof useAdminOrdersQueryLazyQuery>;
export type AdminOrdersQueryQueryResult = Apollo.QueryResult<AdminOrdersQueryQuery, AdminOrdersQueryQueryVariables>;
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
 * __useAdminProductsQueryQuery__
 *
 * To run a query within a React component, call `useAdminProductsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminProductsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminProductsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminProductsQueryQuery(baseOptions?: Apollo.QueryHookOptions<AdminProductsQueryQuery, AdminProductsQueryQueryVariables>) {
        return Apollo.useQuery<AdminProductsQueryQuery, AdminProductsQueryQueryVariables>(AdminProductsQueryDocument, baseOptions);
      }
export function useAdminProductsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminProductsQueryQuery, AdminProductsQueryQueryVariables>) {
          return Apollo.useLazyQuery<AdminProductsQueryQuery, AdminProductsQueryQueryVariables>(AdminProductsQueryDocument, baseOptions);
        }
export type AdminProductsQueryQueryHookResult = ReturnType<typeof useAdminProductsQueryQuery>;
export type AdminProductsQueryLazyQueryHookResult = ReturnType<typeof useAdminProductsQueryLazyQuery>;
export type AdminProductsQueryQueryResult = Apollo.QueryResult<AdminProductsQueryQuery, AdminProductsQueryQueryVariables>;
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
 * __useAdminStoreAbilityQueryQuery__
 *
 * To run a query within a React component, call `useAdminStoreAbilityQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminStoreAbilityQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminStoreAbilityQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdminStoreAbilityQueryQuery(baseOptions?: Apollo.QueryHookOptions<AdminStoreAbilityQueryQuery, AdminStoreAbilityQueryQueryVariables>) {
        return Apollo.useQuery<AdminStoreAbilityQueryQuery, AdminStoreAbilityQueryQueryVariables>(AdminStoreAbilityQueryDocument, baseOptions);
      }
export function useAdminStoreAbilityQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminStoreAbilityQueryQuery, AdminStoreAbilityQueryQueryVariables>) {
          return Apollo.useLazyQuery<AdminStoreAbilityQueryQuery, AdminStoreAbilityQueryQueryVariables>(AdminStoreAbilityQueryDocument, baseOptions);
        }
export type AdminStoreAbilityQueryQueryHookResult = ReturnType<typeof useAdminStoreAbilityQueryQuery>;
export type AdminStoreAbilityQueryLazyQueryHookResult = ReturnType<typeof useAdminStoreAbilityQueryLazyQuery>;
export type AdminStoreAbilityQueryQueryResult = Apollo.QueryResult<AdminStoreAbilityQueryQuery, AdminStoreAbilityQueryQueryVariables>;
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
 * __useCartQueryQuery__
 *
 * To run a query within a React component, call `useCartQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCartQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCartQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCartQueryQuery(baseOptions?: Apollo.QueryHookOptions<CartQueryQuery, CartQueryQueryVariables>) {
        return Apollo.useQuery<CartQueryQuery, CartQueryQueryVariables>(CartQueryDocument, baseOptions);
      }
export function useCartQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CartQueryQuery, CartQueryQueryVariables>) {
          return Apollo.useLazyQuery<CartQueryQuery, CartQueryQueryVariables>(CartQueryDocument, baseOptions);
        }
export type CartQueryQueryHookResult = ReturnType<typeof useCartQueryQuery>;
export type CartQueryLazyQueryHookResult = ReturnType<typeof useCartQueryLazyQuery>;
export type CartQueryQueryResult = Apollo.QueryResult<CartQueryQuery, CartQueryQueryVariables>;
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
 * __useOrderHistoryQueryQuery__
 *
 * To run a query within a React component, call `useOrderHistoryQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderHistoryQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderHistoryQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrderHistoryQueryQuery(baseOptions?: Apollo.QueryHookOptions<OrderHistoryQueryQuery, OrderHistoryQueryQueryVariables>) {
        return Apollo.useQuery<OrderHistoryQueryQuery, OrderHistoryQueryQueryVariables>(OrderHistoryQueryDocument, baseOptions);
      }
export function useOrderHistoryQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderHistoryQueryQuery, OrderHistoryQueryQueryVariables>) {
          return Apollo.useLazyQuery<OrderHistoryQueryQuery, OrderHistoryQueryQueryVariables>(OrderHistoryQueryDocument, baseOptions);
        }
export type OrderHistoryQueryQueryHookResult = ReturnType<typeof useOrderHistoryQueryQuery>;
export type OrderHistoryQueryLazyQueryHookResult = ReturnType<typeof useOrderHistoryQueryLazyQuery>;
export type OrderHistoryQueryQueryResult = Apollo.QueryResult<OrderHistoryQueryQuery, OrderHistoryQueryQueryVariables>;
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
 * __useOrderSummaryQueryQuery__
 *
 * To run a query within a React component, call `useOrderSummaryQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderSummaryQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderSummaryQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrderSummaryQueryQuery(baseOptions?: Apollo.QueryHookOptions<OrderSummaryQueryQuery, OrderSummaryQueryQueryVariables>) {
        return Apollo.useQuery<OrderSummaryQueryQuery, OrderSummaryQueryQueryVariables>(OrderSummaryQueryDocument, baseOptions);
      }
export function useOrderSummaryQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderSummaryQueryQuery, OrderSummaryQueryQueryVariables>) {
          return Apollo.useLazyQuery<OrderSummaryQueryQuery, OrderSummaryQueryQueryVariables>(OrderSummaryQueryDocument, baseOptions);
        }
export type OrderSummaryQueryQueryHookResult = ReturnType<typeof useOrderSummaryQueryQuery>;
export type OrderSummaryQueryLazyQueryHookResult = ReturnType<typeof useOrderSummaryQueryLazyQuery>;
export type OrderSummaryQueryQueryResult = Apollo.QueryResult<OrderSummaryQueryQuery, OrderSummaryQueryQueryVariables>;
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
 * __useOrderFormProductQueryQuery__
 *
 * To run a query within a React component, call `useOrderFormProductQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderFormProductQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderFormProductQueryQuery({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useOrderFormProductQueryQuery(baseOptions: Apollo.QueryHookOptions<OrderFormProductQueryQuery, OrderFormProductQueryQueryVariables>) {
        return Apollo.useQuery<OrderFormProductQueryQuery, OrderFormProductQueryQueryVariables>(OrderFormProductQueryDocument, baseOptions);
      }
export function useOrderFormProductQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderFormProductQueryQuery, OrderFormProductQueryQueryVariables>) {
          return Apollo.useLazyQuery<OrderFormProductQueryQuery, OrderFormProductQueryQueryVariables>(OrderFormProductQueryDocument, baseOptions);
        }
export type OrderFormProductQueryQueryHookResult = ReturnType<typeof useOrderFormProductQueryQuery>;
export type OrderFormProductQueryLazyQueryHookResult = ReturnType<typeof useOrderFormProductQueryLazyQuery>;
export type OrderFormProductQueryQueryResult = Apollo.QueryResult<OrderFormProductQueryQuery, OrderFormProductQueryQueryVariables>;
export const CurrentPendingOrderPaymentIntentClientSecretQueryDocument = gql`
    query CurrentPendingOrderPaymentIntentClientSecretQuery {
  currentPendingOrderPaymentIntentClientSecret
}
    `;

/**
 * __useCurrentPendingOrderPaymentIntentClientSecretQueryQuery__
 *
 * To run a query within a React component, call `useCurrentPendingOrderPaymentIntentClientSecretQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentPendingOrderPaymentIntentClientSecretQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentPendingOrderPaymentIntentClientSecretQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentPendingOrderPaymentIntentClientSecretQueryQuery(baseOptions?: Apollo.QueryHookOptions<CurrentPendingOrderPaymentIntentClientSecretQueryQuery, CurrentPendingOrderPaymentIntentClientSecretQueryQueryVariables>) {
        return Apollo.useQuery<CurrentPendingOrderPaymentIntentClientSecretQueryQuery, CurrentPendingOrderPaymentIntentClientSecretQueryQueryVariables>(CurrentPendingOrderPaymentIntentClientSecretQueryDocument, baseOptions);
      }
export function useCurrentPendingOrderPaymentIntentClientSecretQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentPendingOrderPaymentIntentClientSecretQueryQuery, CurrentPendingOrderPaymentIntentClientSecretQueryQueryVariables>) {
          return Apollo.useLazyQuery<CurrentPendingOrderPaymentIntentClientSecretQueryQuery, CurrentPendingOrderPaymentIntentClientSecretQueryQueryVariables>(CurrentPendingOrderPaymentIntentClientSecretQueryDocument, baseOptions);
        }
export type CurrentPendingOrderPaymentIntentClientSecretQueryQueryHookResult = ReturnType<typeof useCurrentPendingOrderPaymentIntentClientSecretQueryQuery>;
export type CurrentPendingOrderPaymentIntentClientSecretQueryLazyQueryHookResult = ReturnType<typeof useCurrentPendingOrderPaymentIntentClientSecretQueryLazyQuery>;
export type CurrentPendingOrderPaymentIntentClientSecretQueryQueryResult = Apollo.QueryResult<CurrentPendingOrderPaymentIntentClientSecretQueryQuery, CurrentPendingOrderPaymentIntentClientSecretQueryQueryVariables>;