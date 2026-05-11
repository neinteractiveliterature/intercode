/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ConventionFiltersInput = {
  name?: string | null | undefined;
  organization_name?: string | null | undefined;
};

export type ShowSchedule =
  | 'gms'
  | 'no'
  | 'priv'
  | 'yes';

export type SiteMode =
  /** Site behaves as a convention with multiple events */
  | 'convention'
  /** Site behaves as a series of standalone events */
  | 'event_series'
  /** Site behaves as a single standalone event */
  | 'single_event';

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

export type RootSiteConventionsAdminTableQueryVariables = Exact<{
  page?: number | null | undefined;
  filters?: Types.ConventionFiltersInput | null | undefined;
  sort?: Array<Types.SortInput> | Types.SortInput | null | undefined;
}>;


export type RootSiteConventionsAdminTableQueryData = { __typename: 'Query', conventions_paginated: { __typename: 'ConventionsPagination', total_entries: number, total_pages: number, entries: Array<{ __typename: 'Convention', id: string, name: string, starts_at: string | null, ends_at: string | null, timezone_name: string | null, timezone_mode: Types.TimezoneMode, organization: { __typename: 'Organization', id: string, name: string } | null }> } };

export type ConventionDisplayFieldsFragment = { __typename: 'Convention', id: string, name: string, starts_at: string | null, ends_at: string | null, canceled: boolean, timezone_name: string | null, timezone_mode: Types.TimezoneMode, domain: string | null, site_mode: Types.SiteMode, ticket_mode: Types.TicketMode, show_event_list: Types.ShowSchedule | null, show_schedule: Types.ShowSchedule | null, email_from: string, hidden: boolean, language: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start: string | null, maximum_event_signups: string }>, organization: { __typename: 'Organization', id: string, name: string } | null };

export type ConventionDisplayQueryVariables = Exact<{
  id: string | number;
}>;


export type ConventionDisplayQueryData = { __typename: 'Query', convention: { __typename: 'Convention', id: string, name: string, starts_at: string | null, ends_at: string | null, canceled: boolean, timezone_name: string | null, timezone_mode: Types.TimezoneMode, domain: string | null, site_mode: Types.SiteMode, ticket_mode: Types.TicketMode, show_event_list: Types.ShowSchedule | null, show_schedule: Types.ShowSchedule | null, email_from: string, hidden: boolean, language: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start: string | null, maximum_event_signups: string }>, organization: { __typename: 'Organization', id: string, name: string } | null } };

export type NewConventionModalQueryVariables = Exact<{ [key: string]: never; }>;


export type NewConventionModalQueryData = { __typename: 'Query', organizations: Array<{ __typename: 'Organization', id: string, name: string }> };

export const ConventionDisplayFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConventionDisplayFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"starts_at"}},{"kind":"Field","name":{"kind":"Name","value":"ends_at"}},{"kind":"Field","name":{"kind":"Name","value":"canceled"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_mode"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"site_mode"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_mode"}},{"kind":"Field","name":{"kind":"Name","value":"show_event_list"}},{"kind":"Field","name":{"kind":"Name","value":"show_schedule"}},{"kind":"Field","name":{"kind":"Name","value":"email_from"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"signup_rounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_event_signups"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ConventionDisplayFieldsFragment, unknown>;
export const RootSiteConventionsAdminTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RootSiteConventionsAdminTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ConventionFiltersInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conventions_paginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total_entries"}},{"kind":"Field","name":{"kind":"Name","value":"total_pages"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"starts_at"}},{"kind":"Field","name":{"kind":"Name","value":"ends_at"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_mode"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RootSiteConventionsAdminTableQueryData, RootSiteConventionsAdminTableQueryVariables>;
export const ConventionDisplayQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConventionDisplayQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConventionDisplayFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConventionDisplayFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"starts_at"}},{"kind":"Field","name":{"kind":"Name","value":"ends_at"}},{"kind":"Field","name":{"kind":"Name","value":"canceled"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_mode"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"site_mode"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_mode"}},{"kind":"Field","name":{"kind":"Name","value":"show_event_list"}},{"kind":"Field","name":{"kind":"Name","value":"show_schedule"}},{"kind":"Field","name":{"kind":"Name","value":"email_from"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"signup_rounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_event_signups"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ConventionDisplayQueryData, ConventionDisplayQueryVariables>;
export const NewConventionModalQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NewConventionModalQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<NewConventionModalQueryData, NewConventionModalQueryVariables>;