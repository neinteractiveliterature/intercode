/* eslint-disable */
import * as Types from './graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ClientConfigurationQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ClientConfigurationQueryData = { __typename: 'Query', clientConfiguration: { __typename: 'ClientConfiguration', rails_default_active_storage_service_name: string, rails_direct_uploads_url: string, recaptcha_site_key: string } };


export const ClientConfigurationQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ClientConfigurationQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientConfiguration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rails_default_active_storage_service_name"}},{"kind":"Field","name":{"kind":"Name","value":"rails_direct_uploads_url"}},{"kind":"Field","name":{"kind":"Name","value":"recaptcha_site_key"}}]}}]}}]} as unknown as DocumentNode<ClientConfigurationQueryData, ClientConfigurationQueryVariables>;