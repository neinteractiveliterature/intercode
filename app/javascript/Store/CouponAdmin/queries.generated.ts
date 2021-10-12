/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { gql } from '@apollo/client';
import { CouponFieldsFragmentDoc } from '../couponFields.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type AdminCouponFieldsFragment = { __typename: 'Coupon', usage_limit?: number | null | undefined, expires_at?: string | null | undefined, code: string, percent_discount?: string | null | undefined, id: string, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', name: string, id: string } | null | undefined };

export type AdminCouponsQueryVariables = Types.Exact<{
  filters?: Types.Maybe<Types.CouponFiltersInput>;
  sort?: Types.Maybe<Array<Types.SortInput> | Types.SortInput>;
  page?: Types.Maybe<Types.Scalars['Int']>;
  per_page?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type AdminCouponsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, coupons_paginated: { __typename: 'CouponsPagination', current_page: number, total_pages: number, entries: Array<{ __typename: 'Coupon', usage_limit?: number | null | undefined, expires_at?: string | null | undefined, code: string, percent_discount?: string | null | undefined, id: string, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null | undefined, provides_product?: { __typename: 'Product', name: string, id: string } | null | undefined }> } } };

export const AdminCouponFieldsFragmentDoc = gql`
    fragment AdminCouponFields on Coupon {
  id: transitionalId
  ...CouponFields
  usage_limit
  expires_at
}
    ${CouponFieldsFragmentDoc}`;
export const AdminCouponsQueryDocument = gql`
    query AdminCouponsQuery($filters: CouponFiltersInput, $sort: [SortInput!], $page: Int, $per_page: Int) {
  convention: conventionByRequestHost {
    id: transitionalId
    coupons_paginated(
      filters: $filters
      sort: $sort
      page: $page
      per_page: $per_page
    ) {
      current_page
      total_pages
      entries {
        id: transitionalId
        ...AdminCouponFields
      }
    }
  }
}
    ${AdminCouponFieldsFragmentDoc}`;

/**
 * __useAdminCouponsQuery__
 *
 * To run a query within a React component, call `useAdminCouponsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdminCouponsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdminCouponsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      sort: // value for 'sort'
 *      page: // value for 'page'
 *      per_page: // value for 'per_page'
 *   },
 * });
 */
export function useAdminCouponsQuery(baseOptions?: Apollo.QueryHookOptions<AdminCouponsQueryData, AdminCouponsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdminCouponsQueryData, AdminCouponsQueryVariables>(AdminCouponsQueryDocument, options);
      }
export function useAdminCouponsQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdminCouponsQueryData, AdminCouponsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdminCouponsQueryData, AdminCouponsQueryVariables>(AdminCouponsQueryDocument, options);
        }
export type AdminCouponsQueryHookResult = ReturnType<typeof useAdminCouponsQuery>;
export type AdminCouponsQueryLazyQueryHookResult = ReturnType<typeof useAdminCouponsQueryLazyQuery>;
export type AdminCouponsQueryQueryResult = Apollo.QueryResult<AdminCouponsQueryData, AdminCouponsQueryVariables>;