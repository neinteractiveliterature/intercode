/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/**
 * A user-defined constraint on how many events the ranked choice algorithm should sign them up for.  This can be
 * time-bounded, and a user can have as many or as few of these as they like.
 */
export type RankedChoiceUserConstraintInput = {
  /**
   * The time at which this constraint stops applying (non-inclusive).  If null, this constraint is unbounded on the
   * finish side.
   */
  finish?: string | null | undefined;
  /** The maximum number of counted signups to be allowed in the timespan described by this constraint. */
  maximumSignups?: number | null | undefined;
  /**
   * The time at which this constraint starts applying (inclusive).  If null, this constraint is unbounded on the
   * start side.
   */
  start?: string | null | undefined;
};

export type DeleteSignupRankedChoiceMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteSignupRankedChoiceMutationData = { __typename: 'Mutation', deleteSignupRankedChoice: { __typename: 'DeleteSignupRankedChoicePayload', clientMutationId: string | null } };

export type UpdateSignupRankedChoicePriorityMutationVariables = Exact<{
  id: string | number;
  priority: number;
}>;


export type UpdateSignupRankedChoicePriorityMutationData = { __typename: 'Mutation', updateSignupRankedChoicePriority: { __typename: 'UpdateSignupRankedChoicePriorityPayload', clientMutationId: string | null } };

export type SetSignupRankedChoicePrioritizeWaitlistMutationVariables = Exact<{
  id: string | number;
  prioritizeWaitlist: boolean;
  waitlistPositionCap?: number | null | undefined;
}>;


export type SetSignupRankedChoicePrioritizeWaitlistMutationData = { __typename: 'Mutation', setSignupRankedChoicePrioritzeWaitlist: { __typename: 'SetSignupRankedChoicePrioritizeWaitlistPayload', clientMutationId: string | null, signup_ranked_choice: { __typename: 'SignupRankedChoice', id: string, prioritize_waitlist: boolean, waitlist_position_cap: number | null } } };

export type CreateMyRankedChoiceUserConstraintMutationVariables = Exact<{
  rankedChoiceUserConstraint: Types.RankedChoiceUserConstraintInput;
}>;


export type CreateMyRankedChoiceUserConstraintMutationData = { __typename: 'Mutation', createRankedChoiceUserConstraint: { __typename: 'CreateRankedChoiceUserConstraintPayload', ranked_choice_user_constraint: { __typename: 'RankedChoiceUserConstraint', id: string, start: string | null, finish: string | null, maximum_signups: number } } };

export type UpdateRankedChoiceUserConstraintMutationVariables = Exact<{
  id: string | number;
  rankedChoiceUserConstraint: Types.RankedChoiceUserConstraintInput;
}>;


export type UpdateRankedChoiceUserConstraintMutationData = { __typename: 'Mutation', updateRankedChoiceUserConstraint: { __typename: 'UpdateRankedChoiceUserConstraintPayload', ranked_choice_user_constraint: { __typename: 'RankedChoiceUserConstraint', id: string, start: string | null, finish: string | null, maximum_signups: number } } };

export type DeleteRankedChoiceUserConstraintMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteRankedChoiceUserConstraintMutationData = { __typename: 'Mutation', deleteRankedChoiceUserConstraint: { __typename: 'DeleteRankedChoiceUserConstraintPayload', clientMutationId: string | null } };


export const DeleteSignupRankedChoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSignupRankedChoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSignupRankedChoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<DeleteSignupRankedChoiceMutationData, DeleteSignupRankedChoiceMutationVariables>;
export const UpdateSignupRankedChoicePriorityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSignupRankedChoicePriority"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priority"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSignupRankedChoicePriority"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"priority"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priority"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<UpdateSignupRankedChoicePriorityMutationData, UpdateSignupRankedChoicePriorityMutationVariables>;
export const SetSignupRankedChoicePrioritizeWaitlistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetSignupRankedChoicePrioritizeWaitlist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prioritizeWaitlist"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"waitlistPositionCap"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setSignupRankedChoicePrioritzeWaitlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"prioritizeWaitlist"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prioritizeWaitlist"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"waitlistPositionCap"},"value":{"kind":"Variable","name":{"kind":"Name","value":"waitlistPositionCap"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}},{"kind":"Field","name":{"kind":"Name","value":"signup_ranked_choice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prioritize_waitlist"}},{"kind":"Field","name":{"kind":"Name","value":"waitlist_position_cap"}}]}}]}}]}}]} as unknown as DocumentNode<SetSignupRankedChoicePrioritizeWaitlistMutationData, SetSignupRankedChoicePrioritizeWaitlistMutationVariables>;
export const CreateMyRankedChoiceUserConstraintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMyRankedChoiceUserConstraint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rankedChoiceUserConstraint"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RankedChoiceUserConstraintInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRankedChoiceUserConstraint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"rankedChoiceUserConstraint"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rankedChoiceUserConstraint"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ranked_choice_user_constraint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RankedChoiceUserConstraintFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RankedChoiceUserConstraintFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RankedChoiceUserConstraint"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"finish"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_signups"}}]}}]} as unknown as DocumentNode<CreateMyRankedChoiceUserConstraintMutationData, CreateMyRankedChoiceUserConstraintMutationVariables>;
export const UpdateRankedChoiceUserConstraintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRankedChoiceUserConstraint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rankedChoiceUserConstraint"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RankedChoiceUserConstraintInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRankedChoiceUserConstraint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"rankedChoiceUserConstraint"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rankedChoiceUserConstraint"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ranked_choice_user_constraint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RankedChoiceUserConstraintFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RankedChoiceUserConstraintFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RankedChoiceUserConstraint"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"finish"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_signups"}}]}}]} as unknown as DocumentNode<UpdateRankedChoiceUserConstraintMutationData, UpdateRankedChoiceUserConstraintMutationVariables>;
export const DeleteRankedChoiceUserConstraintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRankedChoiceUserConstraint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRankedChoiceUserConstraint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<DeleteRankedChoiceUserConstraintMutationData, DeleteRankedChoiceUserConstraintMutationVariables>;