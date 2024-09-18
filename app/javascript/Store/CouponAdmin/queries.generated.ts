/* eslint-disable */
import * as Types from '../../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AdminCouponFieldsFragment = { __typename: 'Coupon', id: string, usage_limit?: number | null, expires_at?: string | null, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null };

export type AdminCouponsQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.CouponFiltersInput>;
  sort?: Types.InputMaybe<Array<Types.SortInput> | Types.SortInput>;
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  per_page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type AdminCouponsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, coupons_paginated: { __typename: 'CouponsPagination', current_page: number, total_pages: number, entries: Array<{ __typename: 'Coupon', id: string, usage_limit?: number | null, expires_at?: string | null, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null }> } } };

export type AdminSingleCouponQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type AdminSingleCouponQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, coupon: { __typename: 'Coupon', id: string, usage_limit?: number | null, expires_at?: string | null, code: string, percent_discount?: string | null, fixed_amount?: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product?: { __typename: 'Product', id: string, name: string } | null } } };

export const AdminCouponFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CouponFields"}},{"kind":"Field","name":{"kind":"Name","value":"usage_limit"}},{"kind":"Field","name":{"kind":"Name","value":"expires_at"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"fixed_amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fractional"}},{"kind":"Field","name":{"kind":"Name","value":"currency_code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"percent_discount"}},{"kind":"Field","name":{"kind":"Name","value":"provides_product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AdminCouponFieldsFragment, unknown>;
export const AdminCouponsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminCouponsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CouponFiltersInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"per_page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"coupons_paginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"per_page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"per_page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current_page"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCouponFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"fixed_amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fractional"}},{"kind":"Field","name":{"kind":"Name","value":"currency_code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"percent_discount"}},{"kind":"Field","name":{"kind":"Name","value":"provides_product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CouponFields"}},{"kind":"Field","name":{"kind":"Name","value":"usage_limit"}},{"kind":"Field","name":{"kind":"Name","value":"expires_at"}}]}}]} as unknown as DocumentNode<AdminCouponsQueryData, AdminCouponsQueryVariables>;
export const AdminSingleCouponQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminSingleCouponQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"coupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCouponFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"fixed_amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fractional"}},{"kind":"Field","name":{"kind":"Name","value":"currency_code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"percent_discount"}},{"kind":"Field","name":{"kind":"Name","value":"provides_product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CouponFields"}},{"kind":"Field","name":{"kind":"Name","value":"usage_limit"}},{"kind":"Field","name":{"kind":"Name","value":"expires_at"}}]}}]} as unknown as DocumentNode<AdminSingleCouponQueryData, AdminSingleCouponQueryVariables>;