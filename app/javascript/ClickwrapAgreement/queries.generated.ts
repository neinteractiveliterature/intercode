/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ClickwrapAgreementQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ClickwrapAgreementQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, clickwrap_agreement_html?: string | null, my_profile?: { __typename: 'UserConProfile', id: string, accepted_clickwrap_agreement?: boolean | null } | null } };


export const ClickwrapAgreementQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClickwrapAgreementQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"clickwrap_agreement_html"}},{"kind":"Field","name":{"kind":"Name","value":"my_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_clickwrap_agreement"}}]}}]}}]}}]} as unknown as DocumentNode<ClickwrapAgreementQueryData, ClickwrapAgreementQueryVariables>;