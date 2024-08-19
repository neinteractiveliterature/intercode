/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type DefaultEventsQueryVariables = Types.Exact<{
  title?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type DefaultEventsQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, events_paginated: { __typename: 'EventsPagination', entries: Array<{ __typename: 'Event', id: string, title?: string | null }> } } };

export type DefaultUserConProfilesQueryVariables = Types.Exact<{
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type DefaultUserConProfilesQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, user_con_profiles_paginated: { __typename: 'UserConProfilesPagination', entries: Array<{ __typename: 'UserConProfile', id: string, name_without_nickname: string, email?: string | null }> } } };

export type DefaultUsersQueryVariables = Types.Exact<{
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type DefaultUsersQueryData = { __typename: 'Query', users_paginated: { __typename: 'UsersPagination', entries: Array<{ __typename: 'User', id: string, name?: string | null, email?: string | null }> } };


export const DefaultEventsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefaultEventsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"events_paginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"per_page"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DefaultEventsQueryData, DefaultEventsQueryVariables>;
export const DefaultUserConProfilesQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefaultUserConProfilesQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user_con_profiles_paginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"per_page"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DefaultUserConProfilesQueryData, DefaultUserConProfilesQueryVariables>;
export const DefaultUsersQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefaultUsersQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_paginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"per_page"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<DefaultUsersQueryData, DefaultUsersQueryVariables>;