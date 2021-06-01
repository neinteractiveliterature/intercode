/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { AdminOrderFieldsFragment, OrderEntryFieldsFragment, CartOrderFieldsFragment, CouponApplicationFieldsFragment } from './orderFields.generated';
import { AdminProductFieldsFragment } from './adminProductFields.generated';
import { PricingStructureFieldsFragment } from './pricingStructureFields.generated';
import { gql } from '@apollo/client';
import { AdminOrderFieldsFragmentDoc, OrderEntryFieldsFragmentDoc, CartOrderFieldsFragmentDoc, CouponApplicationFieldsFragmentDoc } from './orderFields.generated';
import { AdminProductFieldsFragmentDoc } from './adminProductFields.generated';
import { PricingStructureFieldsFragmentDoc } from './pricingStructureFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AdminOrdersQueryVariables = Types.Exact<{
  page?: Types.Maybe<Types.Scalars['Int']>;
  perPage?: Types.Maybe<Types.Scalars['Int']>;
  filters?: Types.Maybe<Types.OrderFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
}>;


export type AdminOrdersQueryData = (
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
        & AdminOrderFieldsFragment
      )> }
    ) }
  ) }
);

export type AdminProductsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AdminProductsQueryData = (
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

export type AdminStoreAbilityQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AdminStoreAbilityQueryData = (
  { __typename: 'Query' }
  & { currentAbility: (
    { __typename: 'Ability' }
    & Pick<Types.Ability, 'can_update_products' | 'can_update_orders'>
  ), convention: (
    { __typename: 'Convention' }
    & Pick<Types.Convention, 'id' | 'timezone_name'>
  ) }
);

export type CartQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CartQueryData = (
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

export type OrderHistoryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrderHistoryQueryData = (
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

export type OrderSummaryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type OrderSummaryQueryData = (
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

export type OrderFormProductQueryVariables = Types.Exact<{
  productId: Types.Scalars['Int'];
}>;


export type OrderFormProductQueryData = (
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

export type CurrentPendingOrderPaymentIntentClientSecretQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CurrentPendingOrderPaymentIntentClientSecretQueryData = (
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