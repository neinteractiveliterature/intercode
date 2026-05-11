/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type FormItemExposeIn =
  | 'event_catalog'
  | 'schedule_popup';

export type FormItemRole =
  | 'admin'
  | 'all_profiles_basic_access'
  | 'confirmed_attendee'
  | 'normal'
  | 'team_member';

export type SchedulingUi =
  | 'recurring'
  | 'regular'
  | 'single_run';

/**
 * The automation behavior to use for event signups in a Convention.  Currently, we only support one type of
 * automated signups, the "ranked choice" behavior.  Conventions can also disable automation entirely using the
 * "none" value.
 */
export type SignupAutomationMode =
  /** Signups are fully manual */
  | 'none'
  /** Attendees make a ranked list of choices and the site attempts to give everyone what they want */
  | 'ranked_choice';

export type SignupMode =
  /** Attendees can request signups and signup changes but con staff must approve them */
  | 'moderated'
  /** Attendees can sign themselves up for events */
  | 'self_service';

/** The processing state of a SignupRankedChoice */
export type SignupRankedChoiceState =
  /** We have not yet attempted to process this choice */
  | 'pending'
  /** The attendee has had a signup request put in (see the result_signup_request field for the actual signup request) */
  | 'requested'
  /** The attendee has been signed up (see the result_signup field for the actual signup) */
  | 'signed_up'
  /** The attendee has been waitlisted (see the result_signup field for the actual signup) */
  | 'waitlisted';

/** The processing state of a SignupRequest */
export type SignupRequestState =
  /** The request has been accepted and the requester has been signed up (see the result_signup field for the actual signup) */
  | 'accepted'
  /** The request has not yet been reviewed by a moderator */
  | 'pending'
  /** The request has been rejected and the requester has not been signed up */
  | 'rejected'
  /** The requester withdrew their request before it was accepted or rejected */
  | 'withdrawn';

export type SignupState =
  /** Attendee's spot is confirmed */
  | 'confirmed'
  /** Attendee's spot is held temporarily while the attendee finishes paying for their ticket */
  | 'ticket_purchase_hold'
  /** Attendee is on the waitlist for this event and may be pulled in automatically */
  | 'waitlisted'
  /** Attendee has withdrawn from this event (and this signup is no longer valid) */
  | 'withdrawn';

export type SiteMode =
  /** Site behaves as a convention with multiple events */
  | 'convention'
  /** Site behaves as a series of standalone events */
  | 'event_series'
  /** Site behaves as a single standalone event */
  | 'single_event';

export type TicketMode =
  /** Tickets are neither sold nor required in this convention */
  | 'disabled'
  /** A valid ticket is required to sign up for events in this convention */
  | 'required_for_signup'
  /** Each event in this convention sells tickets separately */
  | 'ticket_per_event';

export type TimezoneMode =
  /** Display dates and times using convention’s local time zone */
  | 'convention_local'
  /** Display dates and times using user’s local time zone */
  | 'user_local';

export type CommonConventionDataFragment = { __typename: 'Convention', id: string, name: string, starts_at: string | null, ends_at: string | null, signup_mode: Types.SignupMode, signup_automation_mode: Types.SignupAutomationMode, site_mode: Types.SiteMode, timezone_name: string | null, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color: string | null, full_color: string | null, signed_up_color: string | null, team_member_name: string, teamMemberNamePlural: string, event_form: { __typename: 'Form', id: string, form_sections: Array<{ __typename: 'FormSection', id: string, form_items: Array<{ __typename: 'FormItem', id: string, public_description: string | null, default_value: string | null, position: number, identifier: string | null, item_type: string, rendered_properties: string, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in: Array<Types.FormItemExposeIn> | null }> }> } }> };

export type RunBasicSignupDataFragment = { __typename: 'Run', id: string, grouped_signup_counts: Array<{ __typename: 'GroupedSignupCount', bucket_key: string | null, count: number, counted: boolean, state: Types.SignupState, team_member: boolean }>, my_signups: Array<{ __typename: 'Signup', id: string, state: Types.SignupState }>, my_signup_requests: Array<{ __typename: 'SignupRequest', id: string, state: Types.SignupRequestState }>, my_signup_ranked_choices: Array<{ __typename: 'SignupRankedChoice', id: string, state: Types.SignupRankedChoiceState, priority: number }> };

export type CommonConventionDataQueryVariables = Exact<{ [key: string]: never; }>;


export type CommonConventionDataQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, starts_at: string | null, ends_at: string | null, signup_mode: Types.SignupMode, signup_automation_mode: Types.SignupAutomationMode, site_mode: Types.SiteMode, timezone_name: string | null, timezone_mode: Types.TimezoneMode, ticket_name: string, ticket_mode: Types.TicketMode, event_categories: Array<{ __typename: 'EventCategory', id: string, name: string, scheduling_ui: Types.SchedulingUi, default_color: string | null, full_color: string | null, signed_up_color: string | null, team_member_name: string, teamMemberNamePlural: string, event_form: { __typename: 'Form', id: string, form_sections: Array<{ __typename: 'FormSection', id: string, form_items: Array<{ __typename: 'FormItem', id: string, public_description: string | null, default_value: string | null, position: number, identifier: string | null, item_type: string, rendered_properties: string, visibility: Types.FormItemRole, writeability: Types.FormItemRole, expose_in: Array<Types.FormItemExposeIn> | null }> }> } }> } };

export const CommonConventionDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommonConventionData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"starts_at"}},{"kind":"Field","name":{"kind":"Name","value":"ends_at"}},{"kind":"Field","name":{"kind":"Name","value":"signup_mode"}},{"kind":"Field","name":{"kind":"Name","value":"signup_automation_mode"}},{"kind":"Field","name":{"kind":"Name","value":"site_mode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_mode"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_name"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_mode"}},{"kind":"Field","name":{"kind":"Name","value":"event_categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scheduling_ui"}},{"kind":"Field","name":{"kind":"Name","value":"default_color"}},{"kind":"Field","name":{"kind":"Name","value":"full_color"}},{"kind":"Field","name":{"kind":"Name","value":"signed_up_color"}},{"kind":"Field","name":{"kind":"Name","value":"team_member_name"}},{"kind":"Field","name":{"kind":"Name","value":"teamMemberNamePlural"}},{"kind":"Field","name":{"kind":"Name","value":"event_form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"form_sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"form_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"public_description"}},{"kind":"Field","name":{"kind":"Name","value":"default_value"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommonFormItemFields"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommonFormItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"item_type"}},{"kind":"Field","name":{"kind":"Name","value":"rendered_properties"}},{"kind":"Field","name":{"kind":"Name","value":"default_value"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"writeability"}},{"kind":"Field","name":{"kind":"Name","value":"expose_in"}}]}}]} as unknown as DocumentNode<CommonConventionDataFragment, unknown>;
export const RunBasicSignupDataFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RunBasicSignupData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Run"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grouped_signup_counts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bucket_key"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"counted"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"team_member"}}]}},{"kind":"Field","name":{"kind":"Name","value":"my_signups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"Field","name":{"kind":"Name","value":"my_signup_requests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"Field","name":{"kind":"Name","value":"my_signup_ranked_choices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}}]}}]} as unknown as DocumentNode<RunBasicSignupDataFragment, unknown>;
export const CommonConventionDataQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommonConventionDataQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommonConventionData"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommonFormItemFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"item_type"}},{"kind":"Field","name":{"kind":"Name","value":"rendered_properties"}},{"kind":"Field","name":{"kind":"Name","value":"default_value"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"writeability"}},{"kind":"Field","name":{"kind":"Name","value":"expose_in"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommonConventionData"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"starts_at"}},{"kind":"Field","name":{"kind":"Name","value":"ends_at"}},{"kind":"Field","name":{"kind":"Name","value":"signup_mode"}},{"kind":"Field","name":{"kind":"Name","value":"signup_automation_mode"}},{"kind":"Field","name":{"kind":"Name","value":"site_mode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_mode"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_name"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_mode"}},{"kind":"Field","name":{"kind":"Name","value":"event_categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"scheduling_ui"}},{"kind":"Field","name":{"kind":"Name","value":"default_color"}},{"kind":"Field","name":{"kind":"Name","value":"full_color"}},{"kind":"Field","name":{"kind":"Name","value":"signed_up_color"}},{"kind":"Field","name":{"kind":"Name","value":"team_member_name"}},{"kind":"Field","name":{"kind":"Name","value":"teamMemberNamePlural"}},{"kind":"Field","name":{"kind":"Name","value":"event_form"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"form_sections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"form_items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"public_description"}},{"kind":"Field","name":{"kind":"Name","value":"default_value"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommonFormItemFields"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CommonConventionDataQueryData, CommonConventionDataQueryVariables>;