/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AcceptClickwrapAgreementMutationVariables = Exact<{ [key: string]: never; }>;


export type AcceptClickwrapAgreementMutationData = { __typename: 'Mutation', acceptClickwrapAgreement: { __typename: 'AcceptClickwrapAgreementPayload', my_profile: { __typename: 'UserConProfile', id: string, accepted_clickwrap_agreement: boolean | null } } };


export const AcceptClickwrapAgreementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptClickwrapAgreement"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptClickwrapAgreement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"my_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_clickwrap_agreement"}}]}}]}}]}}]} as unknown as DocumentNode<AcceptClickwrapAgreementMutationData, AcceptClickwrapAgreementMutationVariables>;