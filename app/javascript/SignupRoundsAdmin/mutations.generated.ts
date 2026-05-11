/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** An order to execute ranked-choice signup rounds in. */
export type RankedChoiceOrder =
  /** In lottery number order, lowest number first */
  | 'ASC'
  /** In lottery number order, lowest number first, then highest, then lowest, etc. */
  | 'ASC_SERPENTINE'
  /** In lottery number order, highest number first */
  | 'DESC'
  /** In lottery number order, highest number first, then lowest, then highest, etc. */
  | 'DESC_SERPENTINE';

/** An action to take when a signup round opens. */
export type SignupRoundAutomationAction =
  /** Execute any pending ranked choices as allowed by this signup round */
  | 'EXECUTE_RANKED_CHOICE';

/** An input for creating or modifying SignupRounds. */
export type SignupRoundInput = {
  /** The action to take when this signup round opens. */
  automation_action?: SignupRoundAutomationAction | null | undefined;
  /** The maximum number of signups allowed during this signup round */
  maximum_event_signups?: string | null | undefined;
  /** For ranked-choice conventions, the order to execute signup choices in */
  ranked_choice_order?: RankedChoiceOrder | null | undefined;
  /** If true, the automation will reassign random lottery numbers to all attendees before executing this round */
  rerandomize_lottery_numbers?: boolean | null | undefined;
  /** The time that this signup round starts */
  start?: string | null | undefined;
};

export type CreateSignupRoundMutationVariables = Exact<{
  conventionId: string | number;
  signupRound: Types.SignupRoundInput;
}>;


export type CreateSignupRoundMutationData = { __typename: 'Mutation', createSignupRound: { __typename: 'CreateSignupRoundPayload', signup_round: { __typename: 'SignupRound', id: string, maximum_event_signups: string, automation_action: Types.SignupRoundAutomationAction | null, ranked_choice_order: Types.RankedChoiceOrder | null, rerandomize_lottery_numbers: boolean, start: string | null, executed_at: string | null } } };

export type UpdateSignupRoundMutationVariables = Exact<{
  id: string | number;
  signupRound: Types.SignupRoundInput;
}>;


export type UpdateSignupRoundMutationData = { __typename: 'Mutation', updateSignupRound: { __typename: 'UpdateSignupRoundPayload', signup_round: { __typename: 'SignupRound', id: string, maximum_event_signups: string, automation_action: Types.SignupRoundAutomationAction | null, ranked_choice_order: Types.RankedChoiceOrder | null, rerandomize_lottery_numbers: boolean, start: string | null, executed_at: string | null } } };

export type DeleteSignupRoundMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteSignupRoundMutationData = { __typename: 'Mutation', deleteSignupRound: { __typename: 'DeleteSignupRoundPayload', clientMutationId: string | null } };


export const CreateSignupRoundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSignupRound"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conventionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signupRound"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignupRoundInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSignupRound"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"conventionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conventionId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"signupRound"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signupRound"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup_round"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignupRoundFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignupRoundFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignupRound"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_event_signups"}},{"kind":"Field","name":{"kind":"Name","value":"automation_action"}},{"kind":"Field","name":{"kind":"Name","value":"ranked_choice_order"}},{"kind":"Field","name":{"kind":"Name","value":"rerandomize_lottery_numbers"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"executed_at"}}]}}]} as unknown as DocumentNode<CreateSignupRoundMutationData, CreateSignupRoundMutationVariables>;
export const UpdateSignupRoundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSignupRound"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signupRound"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignupRoundInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSignupRound"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"signupRound"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signupRound"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup_round"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignupRoundFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignupRoundFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignupRound"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_event_signups"}},{"kind":"Field","name":{"kind":"Name","value":"automation_action"}},{"kind":"Field","name":{"kind":"Name","value":"ranked_choice_order"}},{"kind":"Field","name":{"kind":"Name","value":"rerandomize_lottery_numbers"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"executed_at"}}]}}]} as unknown as DocumentNode<UpdateSignupRoundMutationData, UpdateSignupRoundMutationVariables>;
export const DeleteSignupRoundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSignupRound"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSignupRound"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<DeleteSignupRoundMutationData, DeleteSignupRoundMutationVariables>;