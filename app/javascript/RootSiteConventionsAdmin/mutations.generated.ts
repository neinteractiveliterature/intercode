/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** An input for creating or modifying Conventions. */
export type ConventionInput = {
  /** Is this convention currently accepting event proposals? */
  accepting_proposals?: boolean | null | undefined;
  /** The ID of the StaffPosition to set as the catch-all for inbound emails. */
  catchAllStaffPositionId?: string | number | null | undefined;
  /** The clickwrap agreement for the convention, in Liquid format. */
  clickwrap_agreement?: string | null | undefined;
  /** The ISO 4217 currency code to use as the default for products in this convention. */
  defaultCurrencyCode?: string | null | undefined;
  /** The ID of the CmsLayout to use as the default layout for pages in this convention. */
  defaultLayoutId?: string | number | null | undefined;
  /** The domain name to use for serving this convention web site. */
  domain?: string | null | undefined;
  /** The default address to send site emails from. */
  email_from?: string | null | undefined;
  /** How this convention site should handle incoming emails to its domain. */
  email_mode?: EmailMode | null | undefined;
  /** When this convention ends. */
  ends_at?: string | null | undefined;
  /** A domain to use to set up forwarding email addresses for event teams. */
  event_mailing_list_domain?: string | null | undefined;
  /** A favicon image to serve to browsers on this site. */
  favicon?: File | null | undefined;
  /** Should this event be hidden from CMS content on the root site? */
  hidden?: boolean | null | undefined;
  /** The language code to use for localized content in this site (e.g. 'en' for English, 'es' for Spanish). */
  language?: string | null | undefined;
  /** The physical location of this convention, in GeoJSON format. */
  location?: string | null | undefined;
  /**
   * The schedule of how many signups are allowed in this convention and when.
   * @deprecated Please use SignupRound instead
   */
  maximum_event_signups?: ScheduledValueInput | null | undefined;
  /** The maximum number of tickets this convention should be able to sell. */
  maximum_tickets?: number | null | undefined;
  /** The name of this convention. */
  name?: string | null | undefined;
  /**
   * The image that should be served from this site using the `<meta property="og:image">` tag.  For more information
   * about OpenGraph, see https://ogp.me/.
   */
  openGraphImage?: File | null | undefined;
  /**
   * How many seconds before the first automated signup round to send a reminder to attendees who have ranked choices
   * queued but no ticket.  If null, no reminders will be sent.
   */
  queue_no_ticket_reminder_advance_seconds?: number | null | undefined;
  /** The ID of the Page to serve at the root path (/) of this convention site. */
  rootPageId?: string | number | null | undefined;
  /** Who should be able to see the event catalog? */
  show_event_list?: ShowSchedule | null | undefined;
  /** Who should be able to see the event schedule? */
  show_schedule?: ShowSchedule | null | undefined;
  /** The type of signup automation to use for this convention. */
  signup_automation_mode?: SignupAutomationMode | null | undefined;
  /** The signup mode to use for this convention. */
  signup_mode?: SignupMode | null | undefined;
  /** In a moderated-signup convention, should signup requests currently be allowed? */
  signup_requests_open?: boolean | null | undefined;
  /** The mode this convention site should operate in. */
  site_mode?: SiteMode | null | undefined;
  /** When this convention starts. */
  starts_at?: string | null | undefined;
  /** The mode to use for ticket behaviors in this convention. */
  ticket_mode?: TicketMode | null | undefined;
  /** The word this convention should use for 'ticket'. */
  ticket_name?: string | null | undefined;
  /** The mode to use for time zone display and time conversion behavior in this site. */
  timezone_mode?: TimezoneMode | null | undefined;
  /** The home time zone for this convention. */
  timezone_name?: string | null | undefined;
};

export type EmailMode =
  /** Forward received emails to staff positions as configured */
  | 'forward'
  /** Forward all received staff emails to catch-all staff position */
  | 'staff_emails_to_catch_all';

export type ScheduledValueInput = {
  timespans: Array<TimespanWithValueInput>;
};

export type ShowSchedule =
  | 'gms'
  | 'no'
  | 'priv'
  | 'yes';

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

export type TimespanWithValueInput = {
  finish?: string | null | undefined;
  start?: string | null | undefined;
  string_value?: string | null | undefined;
};

export type TimezoneMode =
  /** Display dates and times using convention’s local time zone */
  | 'convention_local'
  /** Display dates and times using user’s local time zone */
  | 'user_local';

export type CreateConventionMutationVariables = Exact<{
  convention: Types.ConventionInput;
  cloneConventionId?: string | number | null | undefined;
  organizationId?: string | number | null | undefined;
  cmsContentSetName?: string | null | undefined;
}>;


export type CreateConventionMutationData = { __typename: 'Mutation', createConvention: { __typename: 'CreateConventionPayload', convention: { __typename: 'Convention', id: string, name: string, starts_at: string | null, ends_at: string | null, canceled: boolean, timezone_name: string | null, timezone_mode: Types.TimezoneMode, domain: string | null, site_mode: Types.SiteMode, ticket_mode: Types.TicketMode, show_event_list: Types.ShowSchedule | null, show_schedule: Types.ShowSchedule | null, email_from: string, hidden: boolean, language: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start: string | null, maximum_event_signups: string }>, organization: { __typename: 'Organization', id: string, name: string } | null } } };

export type SetConventionCanceledMutationVariables = Exact<{
  id: string | number;
  canceled: boolean;
}>;


export type SetConventionCanceledMutationData = { __typename: 'Mutation', setConventionCanceled: { __typename: 'SetConventionCanceledPayload', convention: { __typename: 'Convention', id: string, name: string, starts_at: string | null, ends_at: string | null, canceled: boolean, timezone_name: string | null, timezone_mode: Types.TimezoneMode, domain: string | null, site_mode: Types.SiteMode, ticket_mode: Types.TicketMode, show_event_list: Types.ShowSchedule | null, show_schedule: Types.ShowSchedule | null, email_from: string, hidden: boolean, language: string, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start: string | null, maximum_event_signups: string }>, organization: { __typename: 'Organization', id: string, name: string } | null } } };


export const CreateConventionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateConvention"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"convention"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConventionInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cloneConventionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cmsContentSetName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createConvention"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"convention"},"value":{"kind":"Variable","name":{"kind":"Name","value":"convention"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"cloneConventionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cloneConventionId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"cms_content_set_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cmsContentSetName"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"convention"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConventionDisplayFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConventionDisplayFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"starts_at"}},{"kind":"Field","name":{"kind":"Name","value":"ends_at"}},{"kind":"Field","name":{"kind":"Name","value":"canceled"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_mode"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"site_mode"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_mode"}},{"kind":"Field","name":{"kind":"Name","value":"show_event_list"}},{"kind":"Field","name":{"kind":"Name","value":"show_schedule"}},{"kind":"Field","name":{"kind":"Name","value":"email_from"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"signup_rounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_event_signups"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateConventionMutationData, CreateConventionMutationVariables>;
export const SetConventionCanceledDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetConventionCanceled"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"canceled"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setConventionCanceled"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"canceled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"canceled"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"convention"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConventionDisplayFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConventionDisplayFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"starts_at"}},{"kind":"Field","name":{"kind":"Name","value":"ends_at"}},{"kind":"Field","name":{"kind":"Name","value":"canceled"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_mode"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"site_mode"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_mode"}},{"kind":"Field","name":{"kind":"Name","value":"show_event_list"}},{"kind":"Field","name":{"kind":"Name","value":"show_schedule"}},{"kind":"Field","name":{"kind":"Name","value":"email_from"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"signup_rounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_event_signups"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SetConventionCanceledMutationData, SetConventionCanceledMutationVariables>;