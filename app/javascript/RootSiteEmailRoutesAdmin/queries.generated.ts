/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type EmailRouteFiltersInput = {
  forward_addresses?: string | null | undefined;
  receiver_address?: string | null | undefined;
};

/**
 * A description of a field to sort a result set by. This is typically used in pagination
 * fields to specify how the results should be ordered.
 */
export type SortInput = {
  /**
   * If true, the field will be sorted in descending order. If false, it will be sorted in
   * ascending order.
   */
  desc: boolean;
  /** The name of the field to sort by. */
  field: string;
};

export type EmailRouteFieldsFragment = { __typename: 'EmailRoute', id: string, receiver_address: string, forward_addresses: Array<string> | null };

export type RootSiteEmailRoutesAdminTableQueryVariables = Exact<{
  page?: number | null | undefined;
  filters?: Types.EmailRouteFiltersInput | null | undefined;
  sort?: Array<Types.SortInput> | Types.SortInput | null | undefined;
}>;


export type RootSiteEmailRoutesAdminTableQueryData = { __typename: 'Query', email_routes_paginated: { __typename: 'EmailRoutesPagination', total_entries: number, total_pages: number, entries: Array<{ __typename: 'EmailRoute', id: string, receiver_address: string, forward_addresses: Array<string> | null }> } };

export type RootSiteSingleEmailRouteQueryVariables = Exact<{
  id: string | number;
}>;


export type RootSiteSingleEmailRouteQueryData = { __typename: 'Query', email_route: { __typename: 'EmailRoute', id: string, receiver_address: string, forward_addresses: Array<string> | null } };

export const EmailRouteFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EmailRouteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmailRoute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"receiver_address"}},{"kind":"Field","name":{"kind":"Name","value":"forward_addresses"}}]}}]} as unknown as DocumentNode<EmailRouteFieldsFragment, unknown>;
export const RootSiteEmailRoutesAdminTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RootSiteEmailRoutesAdminTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailRouteFiltersInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email_routes_paginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total_entries"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EmailRouteFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EmailRouteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmailRoute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"receiver_address"}},{"kind":"Field","name":{"kind":"Name","value":"forward_addresses"}}]}}]} as unknown as DocumentNode<RootSiteEmailRoutesAdminTableQueryData, RootSiteEmailRoutesAdminTableQueryVariables>;
export const RootSiteSingleEmailRouteQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RootSiteSingleEmailRouteQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email_route"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"EmailRouteFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EmailRouteFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmailRoute"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"receiver_address"}},{"kind":"Field","name":{"kind":"Name","value":"forward_addresses"}}]}}]} as unknown as DocumentNode<RootSiteSingleEmailRouteQueryData, RootSiteSingleEmailRouteQueryVariables>;