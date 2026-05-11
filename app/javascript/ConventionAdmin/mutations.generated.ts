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

/** Autogenerated input type of UpdateConvention */
export type UpdateConventionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: string | null | undefined;
  convention: ConventionInput;
  id?: string | number | null | undefined;
};

export type UpdateConventionMutationVariables = Exact<{
  input: Types.UpdateConventionInput;
}>;


export type UpdateConventionMutationData = { __typename: 'Mutation', updateConvention: { __typename: 'UpdateConventionPayload', convention: { __typename: 'Convention', id: string, accepting_proposals: boolean | null, starts_at: string | null, ends_at: string | null, canceled: boolean, name: string, default_currency_code: string | null, domain: string | null, email_from: string, email_mode: Types.EmailMode, event_mailing_list_domain: string | null, location: string | null, language: string, timezone_name: string | null, timezone_mode: Types.TimezoneMode, show_schedule: Types.ShowSchedule | null, show_event_list: Types.ShowSchedule | null, hidden: boolean, maximum_tickets: number | null, ticket_name: string, ticketNamePlural: string, clickwrap_agreement: string | null, ticket_mode: Types.TicketMode, site_mode: Types.SiteMode, signup_mode: Types.SignupMode, signup_automation_mode: Types.SignupAutomationMode, signup_requests_open: boolean, queue_no_ticket_reminder_advance_seconds: number | null, stripe_account_ready_to_charge: boolean, favicon: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null, open_graph_image: { __typename: 'ActiveStorageAttachment', id: string, url: string } | null, stripe_account: { __typename: 'StripeAccount', id: string, email: string | null, charges_enabled: boolean, display_name: string | null } | null, signup_rounds: Array<{ __typename: 'SignupRound', id: string, start: string | null, maximum_event_signups: string, ranked_choice_order: Types.RankedChoiceOrder | null }>, defaultLayout: { __typename: 'CmsLayout', id: string, name: string | null }, cmsLayouts: Array<{ __typename: 'CmsLayout', id: string, name: string | null }>, rootPage: { __typename: 'Page', id: string, name: string | null }, cmsPages: Array<{ __typename: 'Page', id: string, name: string | null }>, staff_positions: Array<{ __typename: 'StaffPosition', id: string, name: string }>, catch_all_staff_position: { __typename: 'StaffPosition', id: string, name: string } | null } } };

export type CreateConventionStripeAccountMutationVariables = Exact<{
  baseUrl: string;
}>;


export type CreateConventionStripeAccountMutationData = { __typename: 'Mutation', createConventionStripeAccount: { __typename: 'CreateConventionStripeAccountPayload', stripe_account: { __typename: 'StripeAccount', id: string, account_onboarding_link: string } } };


export const UpdateConventionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateConvention"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateConventionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateConvention"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"convention"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConventionAdminConventionFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConventionAdminConventionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Convention"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accepting_proposals"}},{"kind":"Field","name":{"kind":"Name","value":"starts_at"}},{"kind":"Field","name":{"kind":"Name","value":"ends_at"}},{"kind":"Field","name":{"kind":"Name","value":"canceled"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"default_currency_code"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"email_from"}},{"kind":"Field","name":{"kind":"Name","value":"email_mode"}},{"kind":"Field","name":{"kind":"Name","value":"event_mailing_list_domain"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_mode"}},{"kind":"Field","name":{"kind":"Name","value":"show_schedule"}},{"kind":"Field","name":{"kind":"Name","value":"show_event_list"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_tickets"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_name"}},{"kind":"Field","name":{"kind":"Name","value":"ticketNamePlural"}},{"kind":"Field","name":{"kind":"Name","value":"clickwrap_agreement"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_mode"}},{"kind":"Field","name":{"kind":"Name","value":"site_mode"}},{"kind":"Field","name":{"kind":"Name","value":"signup_mode"}},{"kind":"Field","name":{"kind":"Name","value":"signup_automation_mode"}},{"kind":"Field","name":{"kind":"Name","value":"signup_requests_open"}},{"kind":"Field","name":{"kind":"Name","value":"queue_no_ticket_reminder_advance_seconds"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account_ready_to_charge"}},{"kind":"Field","name":{"kind":"Name","value":"favicon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"open_graph_image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"charges_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"display_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"signup_rounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_event_signups"}},{"kind":"Field","name":{"kind":"Name","value":"ranked_choice_order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultLayout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cmsLayouts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rootPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cmsPages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"staff_positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"catch_all_staff_position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateConventionMutationData, UpdateConventionMutationVariables>;
export const CreateConventionStripeAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateConventionStripeAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"baseUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createConventionStripeAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe_account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"account_onboarding_link"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"base_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"baseUrl"}}}]}]}}]}}]}}]} as unknown as DocumentNode<CreateConventionStripeAccountMutationData, CreateConventionStripeAccountMutationVariables>;