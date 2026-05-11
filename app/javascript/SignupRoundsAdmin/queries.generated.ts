/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** Filters that can be applied to a paginated table of RankedChoiceDecisions. */
export type RankedChoiceDecisionFiltersInput = {
  /** Filter by the type of decision(s) that were made. */
  decision?: Array<RankedChoiceDecisionValue> | null | undefined;
  /** Filter by the title of the event the decisions pertained to. */
  event_title?: string | null | undefined;
  /** Filter by the reason(s) for the decisions. */
  reason?: Array<RankedChoiceDecisionReason> | null | undefined;
  /** Filter by the name of the user profiles these decisions pertained to. */
  user_con_profile_name?: string | null | undefined;
};

/** The reason the ranked choice automation algorithm made the decision it did when evaluating a particular choice. */
export type RankedChoiceDecisionReason =
  /** This choice would conflict with an existing signup this user has */
  | 'CONFLICT'
  /** This event is full */
  | 'FULL'
  /** Tickets are required in this convention and this user doesn't have one */
  | 'MISSING_TICKET'
  /** This user already has the maximum number of allowed signups at this time */
  | 'NO_MORE_SIGNUPS_ALLOWED'
  /** This user has no more pending ranked choices in their queue */
  | 'NO_PENDING_CHOICES'
  /** The user's personal constraints prohibit signing up for this event (in conjunction with their existing signups) */
  | 'RANKED_CHOICE_USER_CONSTRAINTS'
  /** The user is a team member for this event and should sign up manually. */
  | 'TEAM_MEMBER'
  /** The waitlist position the user would receive exceeds the cap they've set on this choice */
  | 'WAITLIST_POSITION_CAP_EXCEEDED';

/** The decision the ranked choice automation algorithm made when evaluating a particular choice. */
export type RankedChoiceDecisionValue =
  /** Sign the user up for the chosen event */
  | 'SIGNUP'
  /** Skip this choice but continue evaluating this user's ranked choices */
  | 'SKIP_CHOICE'
  /** Skip all remaining choices for this user */
  | 'SKIP_USER'
  /** Sign the user up in the waitlist for the chosen event */
  | 'WAITLIST';

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

export type SignupRoundFieldsFragment = { __typename: 'SignupRound', id: string, maximum_event_signups: string, automation_action: Types.SignupRoundAutomationAction | null, ranked_choice_order: Types.RankedChoiceOrder | null, rerandomize_lottery_numbers: boolean, start: string | null, executed_at: string | null };

export type SignupRoundsAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type SignupRoundsAdminQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, maximum_event_signups: string, automation_action: Types.SignupRoundAutomationAction | null, ranked_choice_order: Types.RankedChoiceOrder | null, rerandomize_lottery_numbers: boolean, start: string | null, executed_at: string | null }> } };

export type SignupRoundRankedChoiceDecisionsTableQueryVariables = Exact<{
  signupRoundId: string | number;
  page?: number | null | undefined;
  perPage?: number | null | undefined;
  filters?: Types.RankedChoiceDecisionFiltersInput | null | undefined;
  sort?: Array<Types.SortInput> | Types.SortInput | null | undefined;
}>;


export type SignupRoundRankedChoiceDecisionsTableQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, signup_round: { __typename: 'SignupRound', id: string, ranked_choice_decisions_paginated: { __typename: 'RankedChoiceDecisionsPagination', total_pages: number, entries: Array<{ __typename: 'RankedChoiceDecision', id: string, created_at: string, decision: Types.RankedChoiceDecisionValue, reason: Types.RankedChoiceDecisionReason | null, user_con_profile: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null, target_run: { __typename: 'Run', id: string, starts_at: string, title_suffix: string | null, event: { __typename: 'Event', id: string, title: string | null } } | null }> } } } };

export const SignupRoundFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignupRoundFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignupRound"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_event_signups"}},{"kind":"Field","name":{"kind":"Name","value":"automation_action"}},{"kind":"Field","name":{"kind":"Name","value":"ranked_choice_order"}},{"kind":"Field","name":{"kind":"Name","value":"rerandomize_lottery_numbers"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"executed_at"}}]}}]} as unknown as DocumentNode<SignupRoundFieldsFragment, unknown>;
export const SignupRoundsAdminQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SignupRoundsAdminQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"signup_rounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignupRoundFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignupRoundFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignupRound"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_event_signups"}},{"kind":"Field","name":{"kind":"Name","value":"automation_action"}},{"kind":"Field","name":{"kind":"Name","value":"ranked_choice_order"}},{"kind":"Field","name":{"kind":"Name","value":"rerandomize_lottery_numbers"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"executed_at"}}]}}]} as unknown as DocumentNode<SignupRoundsAdminQueryData, SignupRoundsAdminQueryVariables>;
export const SignupRoundRankedChoiceDecisionsTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SignupRoundRankedChoiceDecisionsTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signupRoundId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"perPage"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RankedChoiceDecisionFiltersInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"signup_round"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signupRoundId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ranked_choice_decisions_paginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"per_page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"perPage"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"decision"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"user_con_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}}]}},{"kind":"Field","name":{"kind":"Name","value":"target_run"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"starts_at"}},{"kind":"Field","name":{"kind":"Name","value":"title_suffix"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SignupRoundRankedChoiceDecisionsTableQueryData, SignupRoundRankedChoiceDecisionsTableQueryVariables>;