/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AcceptClickwrapAgreementMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type AcceptClickwrapAgreementMutationData = { __typename: 'Mutation', acceptClickwrapAgreement: { __typename: 'AcceptClickwrapAgreementPayload', my_profile: { __typename: 'UserConProfile', id: string, accepted_clickwrap_agreement?: boolean | null } } };


export const AcceptClickwrapAgreementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptClickwrapAgreement"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptClickwrapAgreement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"my_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_clickwrap_agreement"}}]}}]}}]}}]} as unknown as DocumentNode<AcceptClickwrapAgreementMutationData, AcceptClickwrapAgreementMutationVariables>;