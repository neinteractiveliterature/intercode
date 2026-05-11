/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CouponInput = {
  code?: string | null | undefined;
  expires_at?: string | null | undefined;
  fixed_amount?: MoneyInput | null | undefined;
  percent_discount?: string | null | undefined;
  providesProductId?: string | number | null | undefined;
  usage_limit?: number | null | undefined;
};

export type MoneyInput = {
  currency_code: string;
  fractional: number;
};

export type CreateCouponMutationVariables = Exact<{
  coupon: Types.CouponInput;
}>;


export type CreateCouponMutationData = { __typename: 'Mutation', createCoupon: { __typename: 'CreateCouponPayload', coupon: { __typename: 'Coupon', id: string, usage_limit: number | null, expires_at: string | null, code: string, percent_discount: string | null, fixed_amount: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product: { __typename: 'Product', id: string, name: string } | null } } };

export type UpdateCouponMutationVariables = Exact<{
  id: string | number;
  coupon: Types.CouponInput;
}>;


export type UpdateCouponMutationData = { __typename: 'Mutation', updateCoupon: { __typename: 'UpdateCouponPayload', coupon: { __typename: 'Coupon', id: string, usage_limit: number | null, expires_at: string | null, code: string, percent_discount: string | null, fixed_amount: { __typename: 'Money', fractional: number, currency_code: string } | null, provides_product: { __typename: 'Product', id: string, name: string } | null } } };

export type DeleteCouponMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteCouponMutationData = { __typename: 'Mutation', deleteCoupon: { __typename: 'DeleteCouponPayload', clientMutationId: string | null } };


export const CreateCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coupon"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CouponInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCoupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"coupon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coupon"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coupon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCouponFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"fixed_amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fractional"}},{"kind":"Field","name":{"kind":"Name","value":"currency_code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"percent_discount"}},{"kind":"Field","name":{"kind":"Name","value":"provides_product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CouponFields"}},{"kind":"Field","name":{"kind":"Name","value":"usage_limit"}},{"kind":"Field","name":{"kind":"Name","value":"expires_at"}}]}}]} as unknown as DocumentNode<CreateCouponMutationData, CreateCouponMutationVariables>;
export const UpdateCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coupon"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CouponInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCoupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"coupon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coupon"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coupon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AdminCouponFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"fixed_amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fractional"}},{"kind":"Field","name":{"kind":"Name","value":"currency_code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"percent_discount"}},{"kind":"Field","name":{"kind":"Name","value":"provides_product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AdminCouponFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Coupon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CouponFields"}},{"kind":"Field","name":{"kind":"Name","value":"usage_limit"}},{"kind":"Field","name":{"kind":"Name","value":"expires_at"}}]}}]} as unknown as DocumentNode<UpdateCouponMutationData, UpdateCouponMutationVariables>;
export const DeleteCouponDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCoupon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCoupon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<DeleteCouponMutationData, DeleteCouponMutationVariables>;