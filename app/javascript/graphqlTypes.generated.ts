/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: string; output: string; }
  /** Date in ISO8601 format */
  Date: { input: string; output: string; }
  /** Represents untyped JSON */
  JSON: { input: unknown; output: unknown; }
  /** An arbitrary object, serialized as JSON */
  Json: { input: string; output: string; }
  Upload: { input: File; output: File; }
};

export type Ability = {
  __typename: 'Ability';
  can_become_user_con_profile: Scalars['Boolean']['output'];
  can_create_cms_content_groups: Scalars['Boolean']['output'];
  can_create_cms_files: Scalars['Boolean']['output'];
  can_create_cms_graphql_queries: Scalars['Boolean']['output'];
  can_create_cms_layouts: Scalars['Boolean']['output'];
  can_create_cms_navigation_items: Scalars['Boolean']['output'];
  can_create_cms_partials: Scalars['Boolean']['output'];
  can_create_cms_variables: Scalars['Boolean']['output'];
  can_create_orders: Scalars['Boolean']['output'];
  can_create_pages: Scalars['Boolean']['output'];
  can_create_tickets: Scalars['Boolean']['output'];
  can_create_user_con_profiles: Scalars['Boolean']['output'];
  /** @deprecated Deleting events is never allowed; this always returns false */
  can_delete_event: Scalars['Boolean']['output'];
  can_delete_event_proposal: Scalars['Boolean']['output'];
  can_delete_ticket: Scalars['Boolean']['output'];
  can_delete_user_con_profile: Scalars['Boolean']['output'];
  can_force_confirm_signup: Scalars['Boolean']['output'];
  can_list_events: Scalars['Boolean']['output'];
  can_manage_any_cms_content: Scalars['Boolean']['output'];
  can_manage_conventions: Scalars['Boolean']['output'];
  can_manage_email_routes: Scalars['Boolean']['output'];
  can_manage_forms: Scalars['Boolean']['output'];
  can_manage_oauth_applications: Scalars['Boolean']['output'];
  can_manage_rooms: Scalars['Boolean']['output'];
  can_manage_runs: Scalars['Boolean']['output'];
  can_manage_signups: Scalars['Boolean']['output'];
  can_manage_staff_positions: Scalars['Boolean']['output'];
  can_manage_ticket_types: Scalars['Boolean']['output'];
  can_override_maximum_event_provided_tickets: Scalars['Boolean']['output'];
  can_read_admin_notes_on_event_proposal: Scalars['Boolean']['output'];
  can_read_any_mailing_list: Scalars['Boolean']['output'];
  can_read_event_proposals: Scalars['Boolean']['output'];
  can_read_event_signups: Scalars['Boolean']['output'];
  can_read_orders: Scalars['Boolean']['output'];
  can_read_organizations: Scalars['Boolean']['output'];
  can_read_reports: Scalars['Boolean']['output'];
  can_read_schedule: Scalars['Boolean']['output'];
  can_read_schedule_with_counts: Scalars['Boolean']['output'];
  can_read_signups: Scalars['Boolean']['output'];
  can_read_user_activity_alerts: Scalars['Boolean']['output'];
  can_read_user_con_profiles: Scalars['Boolean']['output'];
  can_read_users: Scalars['Boolean']['output'];
  can_update_admin_notes_on_event_proposal: Scalars['Boolean']['output'];
  can_update_bucket_signup: Scalars['Boolean']['output'];
  can_update_convention: Scalars['Boolean']['output'];
  can_update_counted_signup: Scalars['Boolean']['output'];
  can_update_departments: Scalars['Boolean']['output'];
  can_update_event: Scalars['Boolean']['output'];
  can_update_event_categories: Scalars['Boolean']['output'];
  can_update_event_proposal: Scalars['Boolean']['output'];
  can_update_notification_templates: Scalars['Boolean']['output'];
  can_update_orders: Scalars['Boolean']['output'];
  can_update_products: Scalars['Boolean']['output'];
  can_update_signup: Scalars['Boolean']['output'];
  can_update_signups: Scalars['Boolean']['output'];
  can_update_ticket: Scalars['Boolean']['output'];
  can_update_user_con_profile: Scalars['Boolean']['output'];
  can_withdraw_all_user_con_profile_signups: Scalars['Boolean']['output'];
};


export type AbilityCan_Become_User_Con_ProfileArgs = {
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Delete_EventArgs = {
  eventId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Delete_Event_ProposalArgs = {
  eventProposalId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Delete_TicketArgs = {
  ticketId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Delete_User_Con_ProfileArgs = {
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Force_Confirm_SignupArgs = {
  signupId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Read_Admin_Notes_On_Event_ProposalArgs = {
  eventProposalId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Read_Event_SignupsArgs = {
  eventId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Update_Admin_Notes_On_Event_ProposalArgs = {
  eventProposalId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Update_Bucket_SignupArgs = {
  signupId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Update_Counted_SignupArgs = {
  signupId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Update_EventArgs = {
  eventId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Update_Event_ProposalArgs = {
  eventProposalId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Update_SignupArgs = {
  signupId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Update_TicketArgs = {
  ticketId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Update_User_Con_ProfileArgs = {
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};


export type AbilityCan_Withdraw_All_User_Con_Profile_SignupsArgs = {
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated input type of AcceptClickwrapAgreement */
export type AcceptClickwrapAgreementInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Autogenerated return type of AcceptClickwrapAgreement. */
export type AcceptClickwrapAgreementPayload = {
  __typename: 'AcceptClickwrapAgreementPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  my_profile: UserConProfile;
};

/** Autogenerated input type of AcceptSignupRequest */
export type AcceptSignupRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of AcceptSignupRequest. */
export type AcceptSignupRequestPayload = {
  __typename: 'AcceptSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  signup: Signup;
  signup_request: SignupRequest;
};

export type ActiveStorageAttachment = {
  __typename: 'ActiveStorageAttachment';
  byte_size: Scalars['Int']['output'];
  content_type: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  resized_url?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};


export type ActiveStorageAttachmentResized_UrlArgs = {
  maxHeight: Scalars['Int']['input'];
  maxWidth: Scalars['Int']['input'];
};

/** Autogenerated input type of AddOrderEntryToCurrentPendingOrder */
export type AddOrderEntryToCurrentPendingOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  order_entry: OrderEntryInput;
  pay_what_you_want_amount?: InputMaybe<MoneyInput>;
};

/** Autogenerated return type of AddOrderEntryToCurrentPendingOrder. */
export type AddOrderEntryToCurrentPendingOrderPayload = {
  __typename: 'AddOrderEntryToCurrentPendingOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order_entry: OrderEntry;
};

/** Autogenerated input type of AttachImageToEvent */
export type AttachImageToEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  signedBlobId: Scalars['ID']['input'];
};

/** Autogenerated return type of AttachImageToEvent. */
export type AttachImageToEventPayload = {
  __typename: 'AttachImageToEventPayload';
  attachment: ActiveStorageAttachment;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event: Event;
};

/** Autogenerated input type of AttachImageToEventProposal */
export type AttachImageToEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  signedBlobId: Scalars['ID']['input'];
};

/** Autogenerated return type of AttachImageToEventProposal. */
export type AttachImageToEventProposalPayload = {
  __typename: 'AttachImageToEventProposalPayload';
  attachment: ActiveStorageAttachment;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event_proposal: EventProposal;
};

export type AuthorizedApplication = {
  __typename: 'AuthorizedApplication';
  name: Scalars['String']['output'];
  scopes: Array<Scalars['String']['output']>;
  uid: Scalars['ID']['output'];
};

/** Autogenerated input type of CancelOrder */
export type CancelOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  skip_refund?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Autogenerated return type of CancelOrder. */
export type CancelOrderPayload = {
  __typename: 'CancelOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order: Order;
};

export type ChoiceCount = {
  __typename: 'ChoiceCount';
  choice: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  state: SignupState;
};

export type CmsContent = CmsLayout | CmsPartial | Page;

export type CmsContentGroup = {
  __typename: 'CmsContentGroup';
  contents: Array<CmsContent>;
  current_ability_can_delete: Scalars['Boolean']['output'];
  current_ability_can_update: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Permission>;
};

export type CmsContentGroupInput = {
  contents?: InputMaybe<Array<CmsContentInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CmsContentInput = {
  content_type: CmsContentTypeIndicator;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export enum CmsContentTypeIndicator {
  CmsLayout = 'CmsLayout',
  CmsPartial = 'CmsPartial',
  Page = 'Page'
}

export type CmsFile = {
  __typename: 'CmsFile';
  current_ability_can_delete: Scalars['Boolean']['output'];
  file: ActiveStorageAttachment;
  id: Scalars['ID']['output'];
};

export type CmsGraphqlQuery = {
  __typename: 'CmsGraphqlQuery';
  admin_notes?: Maybe<Scalars['String']['output']>;
  current_ability_can_delete: Scalars['Boolean']['output'];
  current_ability_can_update: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  query: Scalars['String']['output'];
};

export type CmsGraphqlQueryInput = {
  admin_notes?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type CmsLayout = {
  __typename: 'CmsLayout';
  admin_notes?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  content_html?: Maybe<Scalars['String']['output']>;
  content_html_with_placeholders?: Maybe<Scalars['String']['output']>;
  current_ability_can_delete: Scalars['Boolean']['output'];
  current_ability_can_update: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  navbar_classes?: Maybe<Scalars['String']['output']>;
};


export type CmsLayoutContent_HtmlArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


export type CmsLayoutContent_Html_With_PlaceholdersArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

export type CmsLayoutInput = {
  admin_notes?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  navbar_classes?: InputMaybe<Scalars['String']['input']>;
};

export type CmsNavigationItem = {
  __typename: 'CmsNavigationItem';
  id: Scalars['ID']['output'];
  navigation_section?: Maybe<CmsNavigationItem>;
  page?: Maybe<Page>;
  position?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type CmsNavigationItemInput = {
  navigationSectionId?: InputMaybe<Scalars['ID']['input']>;
  pageId?: InputMaybe<Scalars['ID']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such
 * as pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries.
 *
 * Most CMS parents are conventions, so their content will be convention-specific and scoped to
 * that convention's domain name. The exception to this is the root site, which is what Intercode
 * renders when there is no convention associated with the current domain name. (See the RootSite
 * object for more details about this.)
 */
export type CmsParent = {
  blockPartial?: Maybe<CmsPartial>;
  /**
   * Finds a CMS content group by ID within the domain name of this HTTP request. If there is no
   * CMS content group with that ID, or the CMS content group is associated with a different
   * domain name, errors out.
   */
  cmsContentGroup: CmsContentGroup;
  /** Returns all CMS content groups within the current domain. */
  cmsContentGroups: Array<CmsContentGroup>;
  /** Returns all CMS files within the current domain. */
  cmsFiles: Array<CmsFile>;
  /** Returns all CMS GraphQL queries within the current domain. */
  cmsGraphqlQueries: Array<CmsGraphqlQuery>;
  /** Returns all CMS layouts within the current domain. */
  cmsLayouts: Array<CmsLayout>;
  /** Returns all CMS navigation items within the current domain. */
  cmsNavigationItems: Array<CmsNavigationItem>;
  /**
   * Finds a CMS page within the domain name of this HTTP request. Exactly one of the three
   * optional arguments (`id`, `slug`, and `rootPage`) must be specified. These each represent a
   * different way of finding a page. If the desired page can't be found within the current
   * domain name, errors out.
   */
  cmsPage: Page;
  /** Returns all CMS pages within the current domain. */
  cmsPages: Array<Page>;
  /** Returns all CMS partials within the current domain. */
  cmsPartials: Array<CmsPartial>;
  /** Returns all CMS variables within the current domain. */
  cmsVariables: Array<CmsVariable>;
  /** Returns the default CMS layout used in this domain. */
  defaultLayout: CmsLayout;
  /**
   * Returns the CMS layout to be used for a particular URL path within the current domain. (This
   * will be the page-specific layout if the URL corresponds to a page with a layout override, or
   * the default layout for the domain otherwise.)
   */
  effectiveCmsLayout: CmsLayout;
  /** Does a full-text search within this domain. */
  fullTextSearch: SearchResult;
  /** The ID of this object. */
  id: Scalars['ID']['output'];
  /**
   * Returns all the Liquid assigns for regular CMS page rendering in the current domain name.
   * This is a combination of globally-accessible Liquid assigns and domain-specific user-defined
   * CMS variables.
   */
  liquidAssigns: Array<LiquidAssign>;
  /** Given a Liquid text string, renders it to HTML and returns the result. */
  previewLiquid: Scalars['String']['output'];
  /** Given a Markdown text string, renders it to HTML and returns the result. */
  previewMarkdown: Scalars['String']['output'];
  /** The CMS page used for the root path (/) of this domain. */
  rootPage: Page;
  /**
   * Finds CMS content by partial name, case-insensitive, within the current domain's CMS content.
   * For example, in a convention that has a partial called `attendee_profile` and a page called
   * `info_for_attendees`, a search for `attendee` would return both of these.
   *
   * This query is always limited to a maximum of 10 results.
   */
  typeaheadSearchCmsContent: Array<CmsContent>;
};


/**
 * A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such
 * as pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries.
 *
 * Most CMS parents are conventions, so their content will be convention-specific and scoped to
 * that convention's domain name. The exception to this is the root site, which is what Intercode
 * renders when there is no convention associated with the current domain name. (See the RootSite
 * object for more details about this.)
 */
export type CmsParentBlockPartialArgs = {
  name: CmsPartialBlockName;
};


/**
 * A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such
 * as pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries.
 *
 * Most CMS parents are conventions, so their content will be convention-specific and scoped to
 * that convention's domain name. The exception to this is the root site, which is what Intercode
 * renders when there is no convention associated with the current domain name. (See the RootSite
 * object for more details about this.)
 */
export type CmsParentCmsContentGroupArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such
 * as pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries.
 *
 * Most CMS parents are conventions, so their content will be convention-specific and scoped to
 * that convention's domain name. The exception to this is the root site, which is what Intercode
 * renders when there is no convention associated with the current domain name. (See the RootSite
 * object for more details about this.)
 */
export type CmsParentCmsPageArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  rootPage?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


/**
 * A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such
 * as pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries.
 *
 * Most CMS parents are conventions, so their content will be convention-specific and scoped to
 * that convention's domain name. The exception to this is the root site, which is what Intercode
 * renders when there is no convention associated with the current domain name. (See the RootSite
 * object for more details about this.)
 */
export type CmsParentEffectiveCmsLayoutArgs = {
  path: Scalars['String']['input'];
};


/**
 * A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such
 * as pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries.
 *
 * Most CMS parents are conventions, so their content will be convention-specific and scoped to
 * that convention's domain name. The exception to this is the root site, which is what Intercode
 * renders when there is no convention associated with the current domain name. (See the RootSite
 * object for more details about this.)
 */
export type CmsParentFullTextSearchArgs = {
  query: Scalars['String']['input'];
};


/**
 * A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such
 * as pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries.
 *
 * Most CMS parents are conventions, so their content will be convention-specific and scoped to
 * that convention's domain name. The exception to this is the root site, which is what Intercode
 * renders when there is no convention associated with the current domain name. (See the RootSite
 * object for more details about this.)
 */
export type CmsParentPreviewLiquidArgs = {
  content: Scalars['String']['input'];
};


/**
 * A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such
 * as pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries.
 *
 * Most CMS parents are conventions, so their content will be convention-specific and scoped to
 * that convention's domain name. The exception to this is the root site, which is what Intercode
 * renders when there is no convention associated with the current domain name. (See the RootSite
 * object for more details about this.)
 */
export type CmsParentPreviewMarkdownArgs = {
  eventId?: InputMaybe<Scalars['ID']['input']>;
  eventProposalId?: InputMaybe<Scalars['ID']['input']>;
  markdown: Scalars['String']['input'];
};


/**
 * A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such
 * as pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries.
 *
 * Most CMS parents are conventions, so their content will be convention-specific and scoped to
 * that convention's domain name. The exception to this is the root site, which is what Intercode
 * renders when there is no convention associated with the current domain name. (See the RootSite
 * object for more details about this.)
 */
export type CmsParentTypeaheadSearchCmsContentArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CmsPartial = {
  __typename: 'CmsPartial';
  admin_notes?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  /** The rendered content of this partial, in HTML format */
  content_html: Scalars['String']['output'];
  current_ability_can_delete: Scalars['Boolean']['output'];
  current_ability_can_update: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

/** Reserved names for partials that will automatically be shown on certain pages if present */
export enum CmsPartialBlockName {
  /**
   * Content shown on top of the "update your account" and "create your account" forms. This is used by the "update your
   * account" pages as a way to clarify that your account is shared between multiple conventions.
   */
  AccountFormText = 'ACCOUNT_FORM_TEXT',
  /** Content shown on top of the "my signup queue" page. */
  MySignupQueueText = 'MY_SIGNUP_QUEUE_TEXT'
}

export type CmsPartialInput = {
  admin_notes?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CmsVariable = {
  __typename: 'CmsVariable';
  current_ability_can_delete: Scalars['Boolean']['output'];
  current_ability_can_update: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  value_json: Scalars['String']['output'];
};

export type CmsVariableInput = {
  key: Scalars['String']['input'];
  value_json: Scalars['String']['input'];
};

export type ContactEmail = {
  __typename: 'ContactEmail';
  email: Scalars['String']['output'];
  formatted_address: Scalars['String']['output'];
  metadata_json: Scalars['Json']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type Convention = CmsParent & {
  __typename: 'Convention';
  /** Is this convention currently accepting event proposals? */
  accepting_proposals?: Maybe<Scalars['Boolean']['output']>;
  /** User profiles in this convention that can have a bio (because they're staff or event team members). */
  bio_eligible_user_con_profiles: Array<UserConProfile>;
  blockPartial?: Maybe<CmsPartial>;
  /** Is this convention canceled? */
  canceled: Scalars['Boolean']['output'];
  /**
   * If this convention's email_mode is set to staff_emails_to_catch_all, all email sent to staff position email
   * addresses at this convention will be forwarded to this staff position.
   */
  catch_all_staff_position?: Maybe<StaffPosition>;
  /**
   * A clickwrap agreement, in Liquid format.  If present, users will have to agree to this before they're allowed to
   * use the web site.
   */
  clickwrap_agreement?: Maybe<Scalars['String']['output']>;
  /** The value of clickwrap_agreement, rendered as HTML. */
  clickwrap_agreement_html?: Maybe<Scalars['String']['output']>;
  /**
   * Finds a CMS content group by ID within the domain name of this HTTP request. If there is no
   * CMS content group with that ID, or the CMS content group is associated with a different
   * domain name, errors out.
   */
  cmsContentGroup: CmsContentGroup;
  /** Returns all CMS content groups within the current domain. */
  cmsContentGroups: Array<CmsContentGroup>;
  /** Returns all CMS files within the current domain. */
  cmsFiles: Array<CmsFile>;
  /** Returns all CMS GraphQL queries within the current domain. */
  cmsGraphqlQueries: Array<CmsGraphqlQuery>;
  /** Returns all CMS layouts within the current domain. */
  cmsLayouts: Array<CmsLayout>;
  /** Returns all CMS navigation items within the current domain. */
  cmsNavigationItems: Array<CmsNavigationItem>;
  /**
   * Finds a CMS page within the domain name of this HTTP request. Exactly one of the three
   * optional arguments (`id`, `slug`, and `rootPage`) must be specified. These each represent a
   * different way of finding a page. If the desired page can't be found within the current
   * domain name, errors out.
   */
  cmsPage: Page;
  /** Returns all CMS pages within the current domain. */
  cmsPages: Array<Page>;
  /** Returns all CMS partials within the current domain. */
  cmsPartials: Array<CmsPartial>;
  /** Returns all CMS variables within the current domain. */
  cmsVariables: Array<CmsVariable>;
  /** Find a coupon by ID. */
  coupon: Coupon;
  coupons_paginated: CouponsPagination;
  /** When this convention was created. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** Returns the default CMS layout used in this domain. */
  defaultLayout: CmsLayout;
  /** The ISO 4217 currency code used by default for products in this convention.  If null, defaults to USD. */
  default_currency_code?: Maybe<Scalars['String']['output']>;
  /** All the departments in this convention. */
  departments: Array<Department>;
  /** The domain name used for serving this convention web site. */
  domain?: Maybe<Scalars['String']['output']>;
  /**
   * Returns the CMS layout to be used for a particular URL path within the current domain. (This
   * will be the page-specific layout if the URL corresponds to a page with a layout override, or
   * the default layout for the domain otherwise.)
   */
  effectiveCmsLayout: CmsLayout;
  /** The default address that site emails will be sent from. */
  email_from: Scalars['String']['output'];
  /** How this convention site will handle incoming emails to its domain. */
  email_mode: EmailMode;
  /** When this convention ends. */
  ends_at?: Maybe<Scalars['Date']['output']>;
  /**
   * Finds an active event by ID in this convention. If there is no event with that ID in this
   * convention, or the event is no longer active, errors out.
   */
  event: Event;
  /** All the EventCategories in this convention. */
  event_categories: Array<EventCategory>;
  /**
   * If present, the site will automatically offer to set up forwarding email addresses for event teams under this
   * domain.
   */
  event_mailing_list_domain?: Maybe<Scalars['String']['output']>;
  /**
   * Finds an event proposal by ID in this convention. If there is no event proposal with that ID
   * in this convention, errors out.
   */
  event_proposal: EventProposal;
  event_proposals_paginated: EventProposalsPagination;
  /**
   * Returns all active events in convention associated with the domain name of this HTTP request.
   * Filterable by a range of start/finish times.
   *
   * **CAUTION:** this query can return a lot of data and take a long time. Please be careful
   * when using it.
   */
  events: Array<Event>;
  events_paginated: EventsPagination;
  /** The favicon that will be served to browsers on this site. */
  favicon?: Maybe<ActiveStorageAttachment>;
  /** @deprecated Please use the favicon field instead. */
  favicon_url?: Maybe<Scalars['String']['output']>;
  /**
   * Finds a form by ID in this convention. If there is no form with that ID in this convention,
   * errors out.
   */
  form: Form;
  /** All the forms in this convention. */
  forms: Array<Form>;
  /** Does a full-text search within this domain. */
  fullTextSearch: SearchResult;
  /** If true, this convention will not be listed in CMS content on the root site. */
  hidden: Scalars['Boolean']['output'];
  /** The ID of this convention. */
  id: Scalars['ID']['output'];
  /** The language to use for localized content in this site. */
  language: Scalars['String']['output'];
  /**
   * Returns all the Liquid assigns for regular CMS page rendering in the current domain name.
   * This is a combination of globally-accessible Liquid assigns and domain-specific user-defined
   * CMS variables.
   */
  liquidAssigns: Array<LiquidAssign>;
  /** The physical location of the convention, in GeoJSON format. */
  location?: Maybe<Scalars['Json']['output']>;
  /** A sub-object for accessing this convention's autogenerated mailing lists. */
  mailing_lists: MailingLists;
  /**
   * The schedule of how many signups are allowed in this convention and when.
   * @deprecated Please use SignupRound instead
   */
  maximum_event_signups?: Maybe<ScheduledValue>;
  /** The maximum number of tickets this convention can sell. */
  maximum_tickets?: Maybe<Scalars['Int']['output']>;
  /**
   * Returns the convention-specific profile for the current user within this convention. If no
   * user is signed in, returns null.
   */
  my_profile?: Maybe<UserConProfile>;
  /**
   * Returns all signup ranked choices for the current user within this convention. If no user is signed in,
   * returns an empty array.
   */
  my_signup_ranked_choices: Array<SignupRankedChoice>;
  /**
   * Returns all signup requests for the current user within this convention. If no user is signed in,
   * returns an empty array.
   */
  my_signup_requests: Array<SignupRequest>;
  /**
   * Returns all signups for the current user within this convention. If no user is signed in,
   * returns an empty array.
   */
  my_signups: Array<Signup>;
  /** The name of this convention. */
  name: Scalars['String']['output'];
  /** All the NotificationTemplates in this convention. */
  notification_templates: Array<NotificationTemplate>;
  /**
   * Returns all the Liquid assigns for rendering a particular notification event in this
   * convention. This is a combination of globally-accessible Liquid assigns, values specific
   * to that notification event, and convention-specific user-defined CMS variables.
   */
  notifier_liquid_assigns: Array<LiquidAssign>;
  /**
   * The image that will be served from this site using the `<meta property="og:image">` tag.  For more information
   * about OpenGraph, see https://ogp.me/.
   */
  open_graph_image?: Maybe<ActiveStorageAttachment>;
  /** @deprecated Please use the open_graph_image field instead. */
  open_graph_image_url?: Maybe<Scalars['String']['output']>;
  /** Find an order by ID. */
  order: Order;
  orders_paginated: OrdersPagination;
  /** The organization in charge of this convention. */
  organization?: Maybe<Organization>;
  /** If present, a block of HTML content to show above the schedule on various schedule pages. */
  pre_schedule_content_html?: Maybe<Scalars['String']['output']>;
  /** Given a Liquid text string, renders it to HTML and returns the result. */
  previewLiquid: Scalars['String']['output'];
  /** Given a Markdown text string, renders it to HTML and returns the result. */
  previewMarkdown: Scalars['String']['output'];
  /**
   * Given a Liquid text string and a notification event, renders the Liquid to HTML using the
   * current domain's CMS context as if it were the content for that notification type.
   */
  preview_notifier_liquid: Scalars['String']['output'];
  /**
   * Finds a product by ID in this convention. If there is no product with that ID in this
   * convention, errors out.
   */
  product: Product;
  /** Returns the products in this convention. */
  products: Array<Product>;
  /** A sub-object containing various reports that can be generated for this convention. */
  reports: ConventionReports;
  /** All the rooms in this convention. */
  rooms: Array<Room>;
  /** The CMS page used for the root path (/) of this domain. */
  rootPage: Page;
  /**
   * Finds an active run by ID in this convention. If there is no run with that ID in this
   * convention, or the run's event is no longer active, errors out.
   */
  run: Run;
  runs_paginated: RunsPagination;
  /** Who can currently see the event catalog? */
  show_event_list?: Maybe<ShowSchedule>;
  /** Who can currently see the event schedule? */
  show_schedule?: Maybe<ShowSchedule>;
  /**
   * Finds a signup by ID in this convention. If there is no signup with that ID in this
   * convention, errors out.
   */
  signup: Signup;
  /** The type of signup automation used for this convention. */
  signup_automation_mode: SignupAutomationMode;
  signup_changes_paginated: SignupChangesPagination;
  signup_counts_by_state: Array<SignupCountByState>;
  /** The signup mode used for this convention. */
  signup_mode: SignupMode;
  /** In a moderated-signup convention, are signup requests currently allowed? */
  signup_requests_open: Scalars['Boolean']['output'];
  signup_requests_paginated: SignupRequestsPagination;
  /**
   * Finds a signup round by ID in this convention. If there is no signup round with that ID in this convention,
   * errors out.
   */
  signup_round: SignupRound;
  /** The signup rounds in this convention. */
  signup_rounds: Array<SignupRound>;
  /** The mode this convention site is operating in. */
  site_mode: SiteMode;
  /**
   * Finds a staff position by ID in this convention. If there is no staff position with that ID
   * in this convention, errors out.
   */
  staff_position: StaffPosition;
  /** All the staff positions in this convention. */
  staff_positions: Array<StaffPosition>;
  /** When this convention starts. */
  starts_at?: Maybe<Scalars['Date']['output']>;
  /** The Stripe account this convention uses for payments. */
  stripe_account?: Maybe<StripeAccount>;
  /** The ID of the Stripe account this convention uses for payments. */
  stripe_account_id?: Maybe<Scalars['String']['output']>;
  /** Is this convention's Stripe account in a state where the convention can accept payments? */
  stripe_account_ready_to_charge: Scalars['Boolean']['output'];
  /** The publishable key of this convention's Stripe account. */
  stripe_publishable_key?: Maybe<Scalars['String']['output']>;
  /** The word this convention uses for 'tickets'. */
  ticketNamePlural: Scalars['String']['output'];
  /** The mode used for ticket behaviors in this convention. */
  ticket_mode: TicketMode;
  /** The word this convention uses for 'ticket'. */
  ticket_name: Scalars['String']['output'];
  /** All the ticket types in this convention. */
  ticket_types: Array<TicketType>;
  /** Can users currently buy tickets to this convention? */
  tickets_available_for_purchase: Scalars['Boolean']['output'];
  /** The mode used for time zone display and time conversion behavior in this site. */
  timezone_mode: TimezoneMode;
  /** The home time zone of this convention. */
  timezone_name?: Maybe<Scalars['String']['output']>;
  /**
   * Finds CMS content by partial name, case-insensitive, within the current domain's CMS content.
   * For example, in a convention that has a partial called `attendee_profile` and a page called
   * `info_for_attendees`, a search for `attendee` would return both of these.
   *
   * This query is always limited to a maximum of 10 results.
   */
  typeaheadSearchCmsContent: Array<CmsContent>;
  /** When this convention was last modified. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** Find a UserActivityAlert by ID. */
  user_activity_alert: UserActivityAlert;
  /** All the UserActivityAlerts in this convention. */
  user_activity_alerts: Array<UserActivityAlert>;
  /**
   * Finds a UserConProfile by ID in the convention associated with this convention. If there is
   * no UserConProfile with that ID in this convention, errors out.
   */
  user_con_profile: UserConProfile;
  /**
   * Finds a UserConProfile by user ID in the convention associated with this convention. If
   * there is no UserConProfile with that user ID in this convention, errors out.
   */
  user_con_profile_by_user_id: UserConProfile;
  /** The form used for user profiles in this convention. */
  user_con_profile_form: Form;
  user_con_profiles_paginated: UserConProfilesPagination;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionBlockPartialArgs = {
  name: CmsPartialBlockName;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionCmsContentGroupArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionCmsPageArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  rootPage?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionCouponArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionCoupons_PaginatedArgs = {
  filters?: InputMaybe<CouponFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionEffectiveCmsLayoutArgs = {
  path: Scalars['String']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionEventArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionEvent_CategoriesArgs = {
  current_ability_can_read_event_proposals?: InputMaybe<Scalars['Boolean']['input']>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionEvent_ProposalArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionEvent_Proposals_PaginatedArgs = {
  filters?: InputMaybe<EventProposalFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionEventsArgs = {
  filters?: InputMaybe<EventFiltersInput>;
  finish?: InputMaybe<Scalars['Date']['input']>;
  includeDropped?: InputMaybe<Scalars['Boolean']['input']>;
  start?: InputMaybe<Scalars['Date']['input']>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionEvents_PaginatedArgs = {
  filters?: InputMaybe<EventFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionFormArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionFullTextSearchArgs = {
  query: Scalars['String']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionNotifier_Liquid_AssignsArgs = {
  eventKey: Scalars['String']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionOrderArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionOrders_PaginatedArgs = {
  filters?: InputMaybe<OrderFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionPreviewLiquidArgs = {
  content: Scalars['String']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionPreviewMarkdownArgs = {
  eventId?: InputMaybe<Scalars['ID']['input']>;
  eventProposalId?: InputMaybe<Scalars['ID']['input']>;
  markdown: Scalars['String']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionPreview_Notifier_LiquidArgs = {
  content: Scalars['String']['input'];
  eventKey: Scalars['String']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionProductArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionProductsArgs = {
  only_available?: InputMaybe<Scalars['Boolean']['input']>;
  only_ticket_providing?: InputMaybe<Scalars['Boolean']['input']>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionRunArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionRuns_PaginatedArgs = {
  filters?: InputMaybe<RunFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionSignupArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionSignup_Changes_PaginatedArgs = {
  filters?: InputMaybe<SignupChangeFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionSignup_Requests_PaginatedArgs = {
  filters?: InputMaybe<SignupRequestFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionSignup_RoundArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionStaff_PositionArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionTypeaheadSearchCmsContentArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionUser_Activity_AlertArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionUser_Con_ProfileArgs = {
  id: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionUser_Con_Profile_By_User_IdArgs = {
  userId: Scalars['ID']['input'];
};


/**
 * A Convention in Intercode is essentially a web site hosted by Intercode.  A Convention can represent an actual,
 * real-world convention (and this is probably the most common use case), but it can also represent a single event
 * (if the site_mode is set to single_event) or a series of events over time (if the site_mode is set to event_series).
 *
 * They're called Convention for historical reasons, because naming is hard.  Sorry.  It's probably best to think of
 * them as "web site."
 */
export type ConventionUser_Con_Profiles_PaginatedArgs = {
  filters?: InputMaybe<UserConProfileFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type ConventionFiltersInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  organization_name?: InputMaybe<Scalars['String']['input']>;
};

/** An input for creating or modifying Conventions. */
export type ConventionInput = {
  /** Is this convention currently accepting event proposals? */
  accepting_proposals?: InputMaybe<Scalars['Boolean']['input']>;
  /** The ID of the StaffPosition to set as the catch-all for inbound emails. */
  catchAllStaffPositionId?: InputMaybe<Scalars['ID']['input']>;
  /** The clickwrap agreement for the convention, in Liquid format. */
  clickwrap_agreement?: InputMaybe<Scalars['String']['input']>;
  /** The ISO 4217 currency code to use as the default for products in this convention. */
  defaultCurrencyCode?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the CmsLayout to use as the default layout for pages in this convention. */
  defaultLayoutId?: InputMaybe<Scalars['ID']['input']>;
  /** The domain name to use for serving this convention web site. */
  domain?: InputMaybe<Scalars['String']['input']>;
  /** The default address to send site emails from. */
  email_from?: InputMaybe<Scalars['String']['input']>;
  /** How this convention site should handle incoming emails to its domain. */
  email_mode?: InputMaybe<EmailMode>;
  /** When this convention ends. */
  ends_at?: InputMaybe<Scalars['Date']['input']>;
  /** A domain to use to set up forwarding email addresses for event teams. */
  event_mailing_list_domain?: InputMaybe<Scalars['String']['input']>;
  /** A favicon image to serve to browsers on this site. */
  favicon?: InputMaybe<Scalars['Upload']['input']>;
  /** Should this event be hidden from CMS content on the root site? */
  hidden?: InputMaybe<Scalars['Boolean']['input']>;
  /** The language code to use for localized content in this site (e.g. 'en' for English, 'es' for Spanish). */
  language?: InputMaybe<Scalars['String']['input']>;
  /** The physical location of this convention, in GeoJSON format. */
  location?: InputMaybe<Scalars['Json']['input']>;
  /**
   * The schedule of how many signups are allowed in this convention and when.
   * @deprecated Please use SignupRound instead
   */
  maximum_event_signups?: InputMaybe<ScheduledValueInput>;
  /** The maximum number of tickets this convention should be able to sell. */
  maximum_tickets?: InputMaybe<Scalars['Int']['input']>;
  /** The name of this convention. */
  name?: InputMaybe<Scalars['String']['input']>;
  /**
   * The image that should be served from this site using the `<meta property="og:image">` tag.  For more information
   * about OpenGraph, see https://ogp.me/.
   */
  openGraphImage?: InputMaybe<Scalars['Upload']['input']>;
  /** The ID of the Page to serve at the root path (/) of this convention site. */
  rootPageId?: InputMaybe<Scalars['ID']['input']>;
  /** Who should be able to see the event catalog? */
  show_event_list?: InputMaybe<ShowSchedule>;
  /** Who should be able to see the event schedule? */
  show_schedule?: InputMaybe<ShowSchedule>;
  /** The type of signup automation to use for this convention. */
  signup_automation_mode?: InputMaybe<SignupAutomationMode>;
  /** The signup mode to use for this convention. */
  signup_mode?: InputMaybe<SignupMode>;
  /** In a moderated-signup convention, should signup requests currently be allowed? */
  signup_requests_open?: InputMaybe<Scalars['Boolean']['input']>;
  /** The mode this convention site should operate in. */
  site_mode?: InputMaybe<SiteMode>;
  /** When this convention starts. */
  starts_at?: InputMaybe<Scalars['Date']['input']>;
  /** The mode to use for ticket behaviors in this convention. */
  ticket_mode?: InputMaybe<TicketMode>;
  /** The word this convention should use for 'ticket'. */
  ticket_name?: InputMaybe<Scalars['String']['input']>;
  /** The mode to use for time zone display and time conversion behavior in this site. */
  timezone_mode?: InputMaybe<TimezoneMode>;
  /** The home time zone for this convention. */
  timezone_name?: InputMaybe<Scalars['String']['input']>;
};

/** Reports that can be queried against a convention. */
export type ConventionReports = {
  __typename: 'ConventionReports';
  /** A report of all tickets provided by events at this convention. */
  event_provided_tickets: Array<EventProvidedTicketList>;
  /** A report of events people signed up for along with which numbered choice they were for that person. */
  events_by_choice: Array<EventWithChoiceCounts>;
  /** A breakdown of all product and ticket sales in this convention. */
  sales_count_by_product_and_payment_amount: Array<SalesCountByProductAndPaymentAmount>;
  /** The total revenue taken in by this convention, optionally filtered by various parameters. */
  sum_revenue: Money;
  /** @deprecated This only takes ticket sales into account.  Please use the sales_count_by_product_and_payment_amount field instead. */
  ticket_count_by_type_and_payment_amount: Array<TicketCountByTypeAndPaymentAmount>;
  /** @deprecated This only takes ticket sales into account.  Please use the sum_revenue field instead. */
  total_revenue: Money;
};


/** Reports that can be queried against a convention. */
export type ConventionReportsSum_RevenueArgs = {
  orderStatuses?: InputMaybe<Array<OrderStatus>>;
  productIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type ConventionsPagination = PaginationInterface & {
  __typename: 'ConventionsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<Convention>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

/** Autogenerated input type of ConvertTicketToEventProvided */
export type ConvertTicketToEventProvidedInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  ticketTypeId?: InputMaybe<Scalars['ID']['input']>;
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of ConvertTicketToEventProvided. */
export type ConvertTicketToEventProvidedPayload = {
  __typename: 'ConvertTicketToEventProvidedPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The ticket we deleted in order to provide a new ticket */
  deleted_ticket: Ticket;
  refund_status: RefundStatus;
  /** The new ticket we just provided */
  ticket: Ticket;
};

export type Coupon = {
  __typename: 'Coupon';
  code: Scalars['String']['output'];
  convention: Convention;
  expires_at?: Maybe<Scalars['Date']['output']>;
  fixed_amount?: Maybe<Money>;
  id: Scalars['ID']['output'];
  percent_discount?: Maybe<Scalars['BigDecimal']['output']>;
  provides_product?: Maybe<Product>;
  usage_limit?: Maybe<Scalars['Int']['output']>;
};

export type CouponApplication = {
  __typename: 'CouponApplication';
  coupon: Coupon;
  discount: Money;
  id: Scalars['ID']['output'];
  order: Order;
};

export type CouponFiltersInput = {
  code?: InputMaybe<Scalars['String']['input']>;
};

export type CouponInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  expires_at?: InputMaybe<Scalars['Date']['input']>;
  fixed_amount?: InputMaybe<MoneyInput>;
  percent_discount?: InputMaybe<Scalars['BigDecimal']['input']>;
  providesProductId?: InputMaybe<Scalars['ID']['input']>;
  usage_limit?: InputMaybe<Scalars['Int']['input']>;
};

export type CouponsPagination = PaginationInterface & {
  __typename: 'CouponsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<Coupon>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

/** Autogenerated input type of CreateCmsContentGroup */
export type CreateCmsContentGroupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cms_content_group: CmsContentGroupInput;
  permissions?: InputMaybe<Array<PermissionInput>>;
};

/** Autogenerated return type of CreateCmsContentGroup. */
export type CreateCmsContentGroupPayload = {
  __typename: 'CreateCmsContentGroupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_content_group: CmsContentGroup;
};

/** Autogenerated input type of CreateCmsFile */
export type CreateCmsFileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** @deprecated Migrating to ActiveStorage direct uploads; please use signed_blob_id instead */
  file?: InputMaybe<Scalars['Upload']['input']>;
  signedBlobId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateCmsFile. */
export type CreateCmsFilePayload = {
  __typename: 'CreateCmsFilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_file: CmsFile;
};

/** Autogenerated input type of CreateCmsGraphqlQuery */
export type CreateCmsGraphqlQueryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  query: CmsGraphqlQueryInput;
};

/** Autogenerated return type of CreateCmsGraphqlQuery. */
export type CreateCmsGraphqlQueryPayload = {
  __typename: 'CreateCmsGraphqlQueryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  query: CmsGraphqlQuery;
};

/** Autogenerated input type of CreateCmsLayout */
export type CreateCmsLayoutInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cms_layout: CmsLayoutInput;
};

/** Autogenerated return type of CreateCmsLayout. */
export type CreateCmsLayoutPayload = {
  __typename: 'CreateCmsLayoutPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_layout: CmsLayout;
};

/** Autogenerated input type of CreateCmsNavigationItem */
export type CreateCmsNavigationItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cms_navigation_item: CmsNavigationItemInput;
};

/** Autogenerated return type of CreateCmsNavigationItem. */
export type CreateCmsNavigationItemPayload = {
  __typename: 'CreateCmsNavigationItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_navigation_item: CmsNavigationItem;
};

/** Autogenerated input type of CreateCmsPartial */
export type CreateCmsPartialInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cms_partial: CmsPartialInput;
  partial_block_name?: InputMaybe<CmsPartialBlockName>;
};

/** Autogenerated return type of CreateCmsPartial. */
export type CreateCmsPartialPayload = {
  __typename: 'CreateCmsPartialPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_partial: CmsPartial;
};

/** Autogenerated input type of CreateConvention */
export type CreateConventionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cloneConventionId?: InputMaybe<Scalars['ID']['input']>;
  cms_content_set_name?: InputMaybe<Scalars['String']['input']>;
  convention: ConventionInput;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateConvention. */
export type CreateConventionPayload = {
  __typename: 'CreateConventionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  convention: Convention;
};

/** Autogenerated input type of CreateConventionStripeAccount */
export type CreateConventionStripeAccountInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Autogenerated return type of CreateConventionStripeAccount. */
export type CreateConventionStripeAccountPayload = {
  __typename: 'CreateConventionStripeAccountPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  stripe_account: StripeAccount;
};

/** Autogenerated input type of CreateCouponApplication */
export type CreateCouponApplicationInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  coupon_code: Scalars['String']['input'];
  orderId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateCouponApplication. */
export type CreateCouponApplicationPayload = {
  __typename: 'CreateCouponApplicationPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  coupon_application: CouponApplication;
};

/** Autogenerated input type of CreateCoupon */
export type CreateCouponInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  coupon: CouponInput;
};

/** Autogenerated return type of CreateCoupon. */
export type CreateCouponPayload = {
  __typename: 'CreateCouponPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  coupon: Coupon;
};

/** Autogenerated input type of CreateDepartment */
export type CreateDepartmentInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  department: DepartmentInput;
};

/** Autogenerated return type of CreateDepartment. */
export type CreateDepartmentPayload = {
  __typename: 'CreateDepartmentPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  department: Department;
};

/** Autogenerated input type of CreateEmailRoute */
export type CreateEmailRouteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email_route: EmailRouteInput;
};

/** Autogenerated return type of CreateEmailRoute. */
export type CreateEmailRoutePayload = {
  __typename: 'CreateEmailRoutePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  email_route: EmailRoute;
};

/** Autogenerated input type of CreateEventCategory */
export type CreateEventCategoryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  event_category: EventCategoryInput;
};

/** Autogenerated return type of CreateEventCategory. */
export type CreateEventCategoryPayload = {
  __typename: 'CreateEventCategoryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event_category: EventCategory;
};

/** Autogenerated input type of CreateEvent */
export type CreateEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  event: EventInput;
  signedImageBlobIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Autogenerated return type of CreateEvent. */
export type CreateEventPayload = {
  __typename: 'CreateEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event: Event;
};

/** Autogenerated input type of CreateEventProposal */
export type CreateEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cloneEventProposalId?: InputMaybe<Scalars['ID']['input']>;
  eventCategoryId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateEventProposal. */
export type CreateEventProposalPayload = {
  __typename: 'CreateEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of CreateFillerEvent */
export type CreateFillerEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  event: EventInput;
  run?: InputMaybe<RunInput>;
  signedImageBlobIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Autogenerated return type of CreateFillerEvent. */
export type CreateFillerEventPayload = {
  __typename: 'CreateFillerEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event: Event;
};

/** Autogenerated input type of CreateForm */
export type CreateFormInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The properties for the form to create. */
  form: FormInput;
  /** The type of form to create. */
  form_type: FormType;
};

/** Autogenerated input type of CreateFormItem */
export type CreateFormItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  formSectionId?: InputMaybe<Scalars['ID']['input']>;
  form_item: FormItemInput;
};

/** Autogenerated return type of CreateFormItem. */
export type CreateFormItemPayload = {
  __typename: 'CreateFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  form_item: FormItem;
};

/** Autogenerated return type of CreateForm. */
export type CreateFormPayload = {
  __typename: 'CreateFormPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The form that has just been created. */
  form: Form;
};

/** Autogenerated input type of CreateFormSection */
export type CreateFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  formId?: InputMaybe<Scalars['ID']['input']>;
  form_section: FormSectionInput;
};

/** Autogenerated return type of CreateFormSection. */
export type CreateFormSectionPayload = {
  __typename: 'CreateFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  form_section: FormSection;
};

/** Autogenerated input type of CreateFormWithJSON */
export type CreateFormWithJsonInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  form_json: Scalars['String']['input'];
  form_type: FormType;
};

/** Autogenerated return type of CreateFormWithJSON. */
export type CreateFormWithJsonPayload = {
  __typename: 'CreateFormWithJSONPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  form: Form;
};

/** Autogenerated input type of CreateMaximumEventProvidedTicketsOverride */
export type CreateMaximumEventProvidedTicketsOverrideInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  override_value: Scalars['Int']['input'];
  ticketTypeId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateMaximumEventProvidedTicketsOverride. */
export type CreateMaximumEventProvidedTicketsOverridePayload = {
  __typename: 'CreateMaximumEventProvidedTicketsOverridePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  maximum_event_provided_tickets_override: MaximumEventProvidedTicketsOverride;
};

/** Autogenerated input type of CreateMultipleRuns */
export type CreateMultipleRunsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  runs: Array<RunInput>;
};

/** Autogenerated return type of CreateMultipleRuns. */
export type CreateMultipleRunsPayload = {
  __typename: 'CreateMultipleRunsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  runs: Array<Run>;
};

/** Autogenerated input type of CreateMySignup */
export type CreateMySignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  no_requested_bucket?: InputMaybe<Scalars['Boolean']['input']>;
  requested_bucket_key?: InputMaybe<Scalars['String']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateMySignup. */
export type CreateMySignupPayload = {
  __typename: 'CreateMySignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  signup: Signup;
};

/** Autogenerated input type of CreateOrderEntry */
export type CreateOrderEntryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  orderId?: InputMaybe<Scalars['ID']['input']>;
  order_entry: OrderEntryInput;
};

/** Autogenerated return type of CreateOrderEntry. */
export type CreateOrderEntryPayload = {
  __typename: 'CreateOrderEntryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order_entry: OrderEntry;
};

/** Autogenerated input type of CreateOrder */
export type CreateOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  order: OrderInput;
  order_entries?: InputMaybe<Array<OrderEntryInput>>;
  status: OrderStatus;
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateOrder. */
export type CreateOrderPayload = {
  __typename: 'CreateOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order: Order;
};

/** Autogenerated input type of CreateOrganizationRole */
export type CreateOrganizationRoleInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
  organization_role: OrganizationRoleInput;
  permissions: Array<PermissionInput>;
  userIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Autogenerated return type of CreateOrganizationRole. */
export type CreateOrganizationRolePayload = {
  __typename: 'CreateOrganizationRolePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  organization_role: OrganizationRole;
};

/** Autogenerated input type of CreatePage */
export type CreatePageInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  page: PageInput;
};

/** Autogenerated return type of CreatePage. */
export type CreatePagePayload = {
  __typename: 'CreatePagePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  page: Page;
};

/** Autogenerated input type of CreateProduct */
export type CreateProductInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  product: ProductInput;
};

/** Autogenerated return type of CreateProduct. */
export type CreateProductPayload = {
  __typename: 'CreateProductPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  product: Product;
};

/** Autogenerated input type of CreateRankedChoiceUserConstraint */
export type CreateRankedChoiceUserConstraintInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The constraint to create. */
  rankedChoiceUserConstraint: RankedChoiceUserConstraintInput;
  /** The user profile to apply this constraint to.  If not specified, will use the current user profile. */
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateRankedChoiceUserConstraint. */
export type CreateRankedChoiceUserConstraintPayload = {
  __typename: 'CreateRankedChoiceUserConstraintPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The RankedChoiceUserConstraint that has just been created. */
  ranked_choice_user_constraint: RankedChoiceUserConstraint;
};

/** Autogenerated input type of CreateRoom */
export type CreateRoomInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  room: RoomInput;
};

/** Autogenerated return type of CreateRoom. */
export type CreateRoomPayload = {
  __typename: 'CreateRoomPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  room: Room;
};

/** Autogenerated input type of CreateRun */
export type CreateRunInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  run: RunInput;
};

/** Autogenerated return type of CreateRun. */
export type CreateRunPayload = {
  __typename: 'CreateRunPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  run: Run;
};

/** Autogenerated input type of CreateSignupRankedChoice */
export type CreateSignupRankedChoiceInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The bucket key to queue a signup ranked choice in, or null to queue a no-preference choice */
  requested_bucket_key?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the run to queue a signup ranked choice for */
  targetRunId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateSignupRankedChoice. */
export type CreateSignupRankedChoicePayload = {
  __typename: 'CreateSignupRankedChoicePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The SignupRankedChoice that has been created */
  signup_ranked_choice: SignupRankedChoice;
};

/** Autogenerated input type of CreateSignupRequest */
export type CreateSignupRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  replaceSignupId?: InputMaybe<Scalars['ID']['input']>;
  requested_bucket_key?: InputMaybe<Scalars['String']['input']>;
  targetRunId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateSignupRequest. */
export type CreateSignupRequestPayload = {
  __typename: 'CreateSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  signup_request: SignupRequest;
};

/** Autogenerated input type of CreateSignupRound */
export type CreateSignupRoundInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the Convention to create a SignupRound in */
  conventionId: Scalars['ID']['input'];
  /** The data for the SignupRound to create */
  signupRound?: InputMaybe<SignupRoundInput>;
};

/** Autogenerated return type of CreateSignupRound. */
export type CreateSignupRoundPayload = {
  __typename: 'CreateSignupRoundPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The SignupRound that has been created */
  signup_round: SignupRound;
};

/** Autogenerated input type of CreateStaffPosition */
export type CreateStaffPositionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  staff_position: StaffPositionInput;
};

/** Autogenerated return type of CreateStaffPosition. */
export type CreateStaffPositionPayload = {
  __typename: 'CreateStaffPositionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of CreateTeamMember */
export type CreateTeamMemberInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  provideTicketTypeId?: InputMaybe<Scalars['ID']['input']>;
  team_member: TeamMemberInput;
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateTeamMember. */
export type CreateTeamMemberPayload = {
  __typename: 'CreateTeamMemberPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  converted_signups: Array<Signup>;
  move_results: Array<SignupMoveResult>;
  team_member: TeamMember;
  ticket?: Maybe<Ticket>;
};

/** Autogenerated input type of CreateTicket */
export type CreateTicketInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  ticket: TicketInput;
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateTicket. */
export type CreateTicketPayload = {
  __typename: 'CreateTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  ticket: Ticket;
};

/** Autogenerated input type of CreateTicketType */
export type CreateTicketTypeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  ticket_type: TicketTypeInput;
};

/** Autogenerated return type of CreateTicketType. */
export type CreateTicketTypePayload = {
  __typename: 'CreateTicketTypePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  ticket_type: TicketType;
};

/** Autogenerated input type of CreateUserActivityAlert */
export type CreateUserActivityAlertInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  notification_destinations: Array<NotificationDestinationInput>;
  user_activity_alert: UserActivityAlertInput;
};

/** Autogenerated return type of CreateUserActivityAlert. */
export type CreateUserActivityAlertPayload = {
  __typename: 'CreateUserActivityAlertPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user_activity_alert: UserActivityAlert;
};

/** Autogenerated input type of CreateUserConProfile */
export type CreateUserConProfileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
  user_con_profile: UserConProfileInput;
};

/** Autogenerated return type of CreateUserConProfile. */
export type CreateUserConProfilePayload = {
  __typename: 'CreateUserConProfilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user_con_profile: UserConProfile;
};

/** Autogenerated input type of CreateUserSignup */
export type CreateUserSignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  no_requested_bucket?: InputMaybe<Scalars['Boolean']['input']>;
  requested_bucket_key?: InputMaybe<Scalars['String']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
  suppress_confirmation?: InputMaybe<Scalars['Boolean']['input']>;
  suppress_notifications?: InputMaybe<Scalars['Boolean']['input']>;
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of CreateUserSignup. */
export type CreateUserSignupPayload = {
  __typename: 'CreateUserSignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  signup: Signup;
};

/** Autogenerated input type of DeleteCmsContentGroup */
export type DeleteCmsContentGroupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteCmsContentGroup. */
export type DeleteCmsContentGroupPayload = {
  __typename: 'DeleteCmsContentGroupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_content_group: CmsContentGroup;
};

/** Autogenerated input type of DeleteCmsFile */
export type DeleteCmsFileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteCmsFile. */
export type DeleteCmsFilePayload = {
  __typename: 'DeleteCmsFilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_file: CmsFile;
};

/** Autogenerated input type of DeleteCmsGraphqlQuery */
export type DeleteCmsGraphqlQueryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteCmsGraphqlQuery. */
export type DeleteCmsGraphqlQueryPayload = {
  __typename: 'DeleteCmsGraphqlQueryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  query: CmsGraphqlQuery;
};

/** Autogenerated input type of DeleteCmsLayout */
export type DeleteCmsLayoutInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteCmsLayout. */
export type DeleteCmsLayoutPayload = {
  __typename: 'DeleteCmsLayoutPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_layout: CmsLayout;
};

/** Autogenerated input type of DeleteCmsNavigationItem */
export type DeleteCmsNavigationItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteCmsNavigationItem. */
export type DeleteCmsNavigationItemPayload = {
  __typename: 'DeleteCmsNavigationItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_navigation_item: CmsNavigationItem;
};

/** Autogenerated input type of DeleteCmsPartial */
export type DeleteCmsPartialInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteCmsPartial. */
export type DeleteCmsPartialPayload = {
  __typename: 'DeleteCmsPartialPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_partial: CmsPartial;
};

/** Autogenerated input type of DeleteCmsVariable */
export type DeleteCmsVariableInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
};

/** Autogenerated return type of DeleteCmsVariable. */
export type DeleteCmsVariablePayload = {
  __typename: 'DeleteCmsVariablePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_variable: CmsVariable;
};

/** Autogenerated input type of DeleteCouponApplication */
export type DeleteCouponApplicationInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteCouponApplication. */
export type DeleteCouponApplicationPayload = {
  __typename: 'DeleteCouponApplicationPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  coupon_application: CouponApplication;
};

/** Autogenerated input type of DeleteCoupon */
export type DeleteCouponInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteCoupon. */
export type DeleteCouponPayload = {
  __typename: 'DeleteCouponPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  coupon: Coupon;
};

/** Autogenerated input type of DeleteDepartment */
export type DeleteDepartmentInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteDepartment. */
export type DeleteDepartmentPayload = {
  __typename: 'DeleteDepartmentPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  department: Department;
};

/** Autogenerated input type of DeleteEmailRoute */
export type DeleteEmailRouteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteEmailRoute. */
export type DeleteEmailRoutePayload = {
  __typename: 'DeleteEmailRoutePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  email_route: EmailRoute;
};

/** Autogenerated input type of DeleteEventCategory */
export type DeleteEventCategoryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteEventCategory. */
export type DeleteEventCategoryPayload = {
  __typename: 'DeleteEventCategoryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event_category: EventCategory;
};

/** Autogenerated input type of DeleteEventProposal */
export type DeleteEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteEventProposal. */
export type DeleteEventProposalPayload = {
  __typename: 'DeleteEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of DeleteForm */
export type DeleteFormInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated input type of DeleteFormItem */
export type DeleteFormItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteFormItem. */
export type DeleteFormItemPayload = {
  __typename: 'DeleteFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

/** Autogenerated return type of DeleteForm. */
export type DeleteFormPayload = {
  __typename: 'DeleteFormPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  form: Form;
};

/** Autogenerated input type of DeleteFormSection */
export type DeleteFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteFormSection. */
export type DeleteFormSectionPayload = {
  __typename: 'DeleteFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

/** Autogenerated input type of DeleteMaximumEventProvidedTicketsOverride */
export type DeleteMaximumEventProvidedTicketsOverrideInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteMaximumEventProvidedTicketsOverride. */
export type DeleteMaximumEventProvidedTicketsOverridePayload = {
  __typename: 'DeleteMaximumEventProvidedTicketsOverridePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  maximum_event_provided_tickets_override: MaximumEventProvidedTicketsOverride;
};

/** Autogenerated input type of DeleteOrderEntry */
export type DeleteOrderEntryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteOrderEntry. */
export type DeleteOrderEntryPayload = {
  __typename: 'DeleteOrderEntryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order_entry: OrderEntry;
};

/** Autogenerated input type of DeleteOrganizationRole */
export type DeleteOrganizationRoleInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteOrganizationRole. */
export type DeleteOrganizationRolePayload = {
  __typename: 'DeleteOrganizationRolePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

/** Autogenerated input type of DeletePage */
export type DeletePageInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeletePage. */
export type DeletePagePayload = {
  __typename: 'DeletePagePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  page: Page;
};

/** Autogenerated input type of DeleteProduct */
export type DeleteProductInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteProduct. */
export type DeleteProductPayload = {
  __typename: 'DeleteProductPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  product: Product;
};

/** Autogenerated input type of DeleteRankedChoiceUserConstraint */
export type DeleteRankedChoiceUserConstraintInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the constraint to delete. */
  id: Scalars['ID']['input'];
};

/** Autogenerated return type of DeleteRankedChoiceUserConstraint. */
export type DeleteRankedChoiceUserConstraintPayload = {
  __typename: 'DeleteRankedChoiceUserConstraintPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The constraint that has just been deleted. */
  ranked_choice_user_constraint: RankedChoiceUserConstraint;
};

/** Autogenerated input type of DeleteRoom */
export type DeleteRoomInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteRoom. */
export type DeleteRoomPayload = {
  __typename: 'DeleteRoomPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  room: Room;
};

/** Autogenerated input type of DeleteRun */
export type DeleteRunInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteRun. */
export type DeleteRunPayload = {
  __typename: 'DeleteRunPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  run: Run;
};

/** Autogenerated input type of DeleteSignupRankedChoice */
export type DeleteSignupRankedChoiceInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the SignupRankedChoice to delete */
  id: Scalars['ID']['input'];
};

/** Autogenerated return type of DeleteSignupRankedChoice. */
export type DeleteSignupRankedChoicePayload = {
  __typename: 'DeleteSignupRankedChoicePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The SignupRankedChoice that has been deleted */
  signup_ranked_choice: SignupRankedChoice;
};

/** Autogenerated input type of DeleteSignupRound */
export type DeleteSignupRoundInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the SignupRound to delete */
  id: Scalars['ID']['input'];
};

/** Autogenerated return type of DeleteSignupRound. */
export type DeleteSignupRoundPayload = {
  __typename: 'DeleteSignupRoundPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The SignupRound that has been deleted */
  signup_round: SignupRound;
};

/** Autogenerated input type of DeleteStaffPosition */
export type DeleteStaffPositionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteStaffPosition. */
export type DeleteStaffPositionPayload = {
  __typename: 'DeleteStaffPositionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of DeleteTeamMember */
export type DeleteTeamMemberInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteTeamMember. */
export type DeleteTeamMemberPayload = {
  __typename: 'DeleteTeamMemberPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  team_member: TeamMember;
};

/** Autogenerated input type of DeleteTicket */
export type DeleteTicketInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  refund?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Autogenerated return type of DeleteTicket. */
export type DeleteTicketPayload = {
  __typename: 'DeleteTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  ticket: Ticket;
};

/** Autogenerated input type of DeleteTicketType */
export type DeleteTicketTypeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteTicketType. */
export type DeleteTicketTypePayload = {
  __typename: 'DeleteTicketTypePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  ticket_type: TicketType;
};

/** Autogenerated input type of DeleteUserActivityAlert */
export type DeleteUserActivityAlertInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteUserActivityAlert. */
export type DeleteUserActivityAlertPayload = {
  __typename: 'DeleteUserActivityAlertPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user_activity_alert: UserActivityAlert;
};

/** Autogenerated input type of DeleteUserConProfile */
export type DeleteUserConProfileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DeleteUserConProfile. */
export type DeleteUserConProfilePayload = {
  __typename: 'DeleteUserConProfilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user_con_profile: UserConProfile;
};

export type Department = {
  __typename: 'Department';
  event_categories: Array<EventCategory>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  proposal_description?: Maybe<Scalars['String']['output']>;
};

export type DepartmentInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  proposal_description?: InputMaybe<Scalars['String']['input']>;
};

/** Autogenerated input type of DropEvent */
export type DropEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of DropEvent. */
export type DropEventPayload = {
  __typename: 'DropEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event: Event;
};

export enum EmailMode {
  /** Forward received emails to staff positions as configured */
  Forward = 'forward',
  /** Forward all received staff emails to catch-all staff position */
  StaffEmailsToCatchAll = 'staff_emails_to_catch_all'
}

export type EmailRoute = {
  __typename: 'EmailRoute';
  forward_addresses?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['ID']['output'];
  receiver_address: Scalars['String']['output'];
};

export type EmailRouteFiltersInput = {
  forward_addresses?: InputMaybe<Scalars['String']['input']>;
  receiver_address?: InputMaybe<Scalars['String']['input']>;
};

export type EmailRouteInput = {
  forward_addresses?: InputMaybe<Array<Scalars['String']['input']>>;
  receiver_address?: InputMaybe<Scalars['String']['input']>;
};

export type EmailRoutesPagination = PaginationInterface & {
  __typename: 'EmailRoutesPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<EmailRoute>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

export type Event = {
  __typename: 'Event';
  admin_notes?: Maybe<Scalars['String']['output']>;
  /** @deprecated Has not worked correctly in a long time.  Please use form_response_attrs or form_response_attrs_json. */
  age_restrictions?: Maybe<Scalars['String']['output']>;
  author?: Maybe<Scalars['String']['output']>;
  can_play_concurrently: Scalars['Boolean']['output'];
  con_mail_destination?: Maybe<Scalars['String']['output']>;
  content_warnings?: Maybe<Scalars['String']['output']>;
  convention: Convention;
  created_at?: Maybe<Scalars['Date']['output']>;
  current_user_form_item_viewer_role: FormItemRole;
  current_user_form_item_writer_role: FormItemRole;
  description?: Maybe<Scalars['String']['output']>;
  description_html?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  event_category: EventCategory;
  form?: Maybe<Form>;
  form_response_attrs_json?: Maybe<Scalars['Json']['output']>;
  form_response_attrs_json_with_rendered_markdown?: Maybe<Scalars['Json']['output']>;
  form_response_changes: Array<FormResponseChange>;
  id: Scalars['ID']['output'];
  images: Array<ActiveStorageAttachment>;
  length_seconds: Scalars['Int']['output'];
  maximum_event_provided_tickets_overrides: Array<MaximumEventProvidedTicketsOverride>;
  my_rating?: Maybe<Scalars['Int']['output']>;
  organization?: Maybe<Scalars['String']['output']>;
  participant_communications?: Maybe<Scalars['String']['output']>;
  private_signup_list?: Maybe<Scalars['Boolean']['output']>;
  provided_tickets: Array<Ticket>;
  registration_policy?: Maybe<RegistrationPolicy>;
  run: Run;
  runs: Array<Run>;
  short_blurb?: Maybe<Scalars['String']['output']>;
  short_blurb_html?: Maybe<Scalars['String']['output']>;
  slots_limited?: Maybe<Scalars['Boolean']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  team_members: Array<TeamMember>;
  ticket_types: Array<TicketType>;
  title?: Maybe<Scalars['String']['output']>;
  total_slots?: Maybe<Scalars['Int']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};


export type EventForm_Response_Attrs_JsonArgs = {
  itemIdentifiers?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type EventForm_Response_Attrs_Json_With_Rendered_MarkdownArgs = {
  itemIdentifiers?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type EventRunArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type EventRunsArgs = {
  excludeConflicts?: InputMaybe<Scalars['Boolean']['input']>;
  finish?: InputMaybe<Scalars['Date']['input']>;
  start?: InputMaybe<Scalars['Date']['input']>;
};

export type EventCategory = {
  __typename: 'EventCategory';
  can_provide_tickets: Scalars['Boolean']['output'];
  convention: Convention;
  default_color?: Maybe<Scalars['String']['output']>;
  department?: Maybe<Department>;
  event_form: Form;
  event_proposal_form?: Maybe<Form>;
  events_paginated: EventsPagination;
  full_color?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  proposable: Scalars['Boolean']['output'];
  proposal_description?: Maybe<Scalars['String']['output']>;
  scheduling_ui: SchedulingUi;
  signed_up_color?: Maybe<Scalars['String']['output']>;
  teamMemberNamePlural: Scalars['String']['output'];
  team_member_name: Scalars['String']['output'];
};


export type EventCategoryEvents_PaginatedArgs = {
  filters?: InputMaybe<EventFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type EventCategoryInput = {
  can_provide_tickets?: InputMaybe<Scalars['Boolean']['input']>;
  default_color?: InputMaybe<Scalars['String']['input']>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  eventFormId?: InputMaybe<Scalars['ID']['input']>;
  eventProposalFormId?: InputMaybe<Scalars['ID']['input']>;
  full_color?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  proposal_description?: InputMaybe<Scalars['String']['input']>;
  scheduling_ui?: InputMaybe<SchedulingUi>;
  signed_up_color?: InputMaybe<Scalars['String']['input']>;
  team_member_name?: InputMaybe<Scalars['String']['input']>;
};

export type EventFiltersInput = {
  category?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  form_items?: InputMaybe<Scalars['JSON']['input']>;
  my_rating?: InputMaybe<Array<Scalars['Int']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_prefix?: InputMaybe<Scalars['String']['input']>;
};

export type EventInput = {
  addImageBlobIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  eventCategoryId?: InputMaybe<Scalars['ID']['input']>;
  form_response_attrs_json?: InputMaybe<Scalars['String']['input']>;
  removeImageBlobIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type EventProposal = {
  __typename: 'EventProposal';
  admin_notes?: Maybe<Scalars['String']['output']>;
  convention: Convention;
  created_at: Scalars['Date']['output'];
  current_user_form_item_viewer_role: FormItemRole;
  current_user_form_item_writer_role: FormItemRole;
  event?: Maybe<Event>;
  event_category: EventCategory;
  form?: Maybe<Form>;
  form_response_attrs_json?: Maybe<Scalars['Json']['output']>;
  form_response_attrs_json_with_rendered_markdown?: Maybe<Scalars['Json']['output']>;
  form_response_changes: Array<FormResponseChange>;
  id: Scalars['ID']['output'];
  images: Array<ActiveStorageAttachment>;
  length_seconds?: Maybe<Scalars['Int']['output']>;
  owner: UserConProfile;
  registration_policy?: Maybe<RegistrationPolicy>;
  status: Scalars['String']['output'];
  submitted_at?: Maybe<Scalars['Date']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['Date']['output'];
};


export type EventProposalForm_Response_Attrs_JsonArgs = {
  itemIdentifiers?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type EventProposalForm_Response_Attrs_Json_With_Rendered_MarkdownArgs = {
  itemIdentifiers?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type EventProposalFiltersInput = {
  event_category?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type EventProposalInput = {
  addImageBlobIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  form_response_attrs_json?: InputMaybe<Scalars['String']['input']>;
  removeImageBlobIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type EventProposalsPagination = PaginationInterface & {
  __typename: 'EventProposalsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<EventProposal>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

export type EventProvidedTicketList = {
  __typename: 'EventProvidedTicketList';
  provided_by_event: Event;
  tickets: Array<Ticket>;
};

export type EventWithChoiceCounts = {
  __typename: 'EventWithChoiceCounts';
  choice_counts: Array<ChoiceCount>;
  event: Event;
};

export type EventsPagination = PaginationInterface & {
  __typename: 'EventsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<Event>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

/** Autogenerated input type of ForceConfirmSignup */
export type ForceConfirmSignupInput = {
  bucket_key: Scalars['String']['input'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of ForceConfirmSignup. */
export type ForceConfirmSignupPayload = {
  __typename: 'ForceConfirmSignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  signup: Signup;
};

export type Form = {
  __typename: 'Form';
  event_categories: Array<EventCategory>;
  export_json: Scalars['Json']['output'];
  form_section: FormSection;
  form_sections: Array<FormSection>;
  form_type: FormType;
  id: Scalars['ID']['output'];
  proposal_event_categories: Array<EventCategory>;
  title: Scalars['String']['output'];
  user_con_profile_conventions: Array<Convention>;
};


export type FormForm_SectionArgs = {
  id: Scalars['ID']['input'];
};

export type FormInput = {
  title?: InputMaybe<Scalars['String']['input']>;
};

export type FormItem = {
  __typename: 'FormItem';
  admin_description?: Maybe<Scalars['String']['output']>;
  default_value?: Maybe<Scalars['Json']['output']>;
  expose_in?: Maybe<Array<FormItemExposeIn>>;
  form_section: FormSection;
  id: Scalars['ID']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  item_type: Scalars['String']['output'];
  position: Scalars['Int']['output'];
  properties: Scalars['Json']['output'];
  public_description?: Maybe<Scalars['String']['output']>;
  rendered_properties: Scalars['Json']['output'];
  visibility: FormItemRole;
  writeability: FormItemRole;
};

export enum FormItemExposeIn {
  EventCatalog = 'event_catalog',
  SchedulePopup = 'schedule_popup'
}

export type FormItemInput = {
  admin_description?: InputMaybe<Scalars['String']['input']>;
  default_value?: InputMaybe<Scalars['Json']['input']>;
  expose_in?: InputMaybe<Array<FormItemExposeIn>>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  item_type?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<Scalars['Json']['input']>;
  public_description?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<FormItemRole>;
  writeability?: InputMaybe<FormItemRole>;
};

export enum FormItemRole {
  Admin = 'admin',
  AllProfilesBasicAccess = 'all_profiles_basic_access',
  ConfirmedAttendee = 'confirmed_attendee',
  Normal = 'normal',
  TeamMember = 'team_member'
}

export type FormResponseChange = {
  __typename: 'FormResponseChange';
  compacted: Scalars['Boolean']['output'];
  created_at: Scalars['Date']['output'];
  field_identifier: Scalars['String']['output'];
  new_value?: Maybe<Scalars['Json']['output']>;
  notified_at?: Maybe<Scalars['Date']['output']>;
  previous_value?: Maybe<Scalars['Json']['output']>;
  updated_at: Scalars['Date']['output'];
  user_con_profile: UserConProfile;
};

export type FormSection = {
  __typename: 'FormSection';
  form: Form;
  form_items: Array<FormItem>;
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  /**
   * Given a FormItemInput, returns a preview version of that form item within this section. This
   * does not actually save the form item. This is mostly useful because of the
   * `rendered_properties` field inside FormItem, which lets clients retrieve
   * a rendered HTML version of the Liquid-enabled properties of the form item.
   */
  preview_form_item: FormItem;
  title?: Maybe<Scalars['String']['output']>;
};


export type FormSectionPreview_Form_ItemArgs = {
  formItem: FormItemInput;
};

export type FormSectionInput = {
  title?: InputMaybe<Scalars['String']['input']>;
};

export enum FormType {
  /** Event form */
  Event = 'event',
  /** Event proposal form */
  EventProposal = 'event_proposal',
  /** User profile form */
  UserConProfile = 'user_con_profile'
}

/** Autogenerated input type of FreezeBucketAssignments */
export type FreezeBucketAssignmentsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the event to freeze bucket assignments for. */
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of FreezeBucketAssignments. */
export type FreezeBucketAssignmentsPayload = {
  __typename: 'FreezeBucketAssignmentsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The event after freeing bucket assignments. */
  event: Event;
};

export type GroupedSignupCount = {
  __typename: 'GroupedSignupCount';
  bucket_key?: Maybe<Scalars['String']['output']>;
  count: Scalars['Int']['output'];
  counted: Scalars['Boolean']['output'];
  requested_bucket_key?: Maybe<Scalars['String']['output']>;
  state: SignupState;
  team_member: Scalars['Boolean']['output'];
};

export type LiquidAssign = {
  __typename: 'LiquidAssign';
  cms_variable_value_json?: Maybe<Scalars['String']['output']>;
  drop_class_name: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type MailingLists = {
  __typename: 'MailingLists';
  event_proposers: MailingListsResult;
  team_members: MailingListsResult;
  ticketed_attendees: MailingListsResult;
  users_with_pending_bio: MailingListsResult;
  waitlists: Array<MailingListsWaitlistsResult>;
  whos_free: MailingListsResult;
};


export type MailingListsWhos_FreeArgs = {
  finish: Scalars['Date']['input'];
  start: Scalars['Date']['input'];
};

export type MailingListsResult = {
  __typename: 'MailingListsResult';
  emails: Array<ContactEmail>;
  metadata_fields: Array<Scalars['String']['output']>;
};

export type MailingListsWaitlistsResult = {
  __typename: 'MailingListsWaitlistsResult';
  emails: Array<ContactEmail>;
  metadata_fields: Array<Scalars['String']['output']>;
  run: Run;
};

/** Autogenerated input type of MarkOrderPaid */
export type MarkOrderPaidInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of MarkOrderPaid. */
export type MarkOrderPaidPayload = {
  __typename: 'MarkOrderPaidPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order: Order;
};

export type MaximumEventProvidedTicketsOverride = {
  __typename: 'MaximumEventProvidedTicketsOverride';
  event: Event;
  id: Scalars['ID']['output'];
  override_value: Scalars['Int']['output'];
  ticket_type: TicketType;
};

/** Autogenerated input type of MergeUsers */
export type MergeUsersInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The user IDs to merge. */
  userIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  winningUserConProfiles: Array<WinningUserConProfileInput>;
  winningUserId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of MergeUsers. */
export type MergeUsersPayload = {
  __typename: 'MergeUsersPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type Money = {
  __typename: 'Money';
  currency_code: Scalars['String']['output'];
  fractional: Scalars['Int']['output'];
};

export type MoneyInput = {
  currency_code: Scalars['String']['input'];
  fractional: Scalars['Int']['input'];
};

/** Autogenerated input type of MoveFormItem */
export type MoveFormItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  destination_index?: InputMaybe<Scalars['Int']['input']>;
  formSectionId?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of MoveFormItem. */
export type MoveFormItemPayload = {
  __typename: 'MoveFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  form_item: FormItem;
  form_section: FormSection;
};

/** Autogenerated input type of MoveFormSection */
export type MoveFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  destination_index: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of MoveFormSection. */
export type MoveFormSectionPayload = {
  __typename: 'MoveFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  form: Form;
  form_section: FormSection;
};

export type Mutation = {
  __typename: 'Mutation';
  acceptClickwrapAgreement: AcceptClickwrapAgreementPayload;
  acceptSignupRequest: AcceptSignupRequestPayload;
  addOrderEntryToCurrentPendingOrder: AddOrderEntryToCurrentPendingOrderPayload;
  attachImageToEvent: AttachImageToEventPayload;
  attachImageToEventProposal: AttachImageToEventProposalPayload;
  cancelOrder: CancelOrderPayload;
  convertTicketToEventProvided: ConvertTicketToEventProvidedPayload;
  createCmsContentGroup: CreateCmsContentGroupPayload;
  createCmsFile: CreateCmsFilePayload;
  createCmsGraphqlQuery: CreateCmsGraphqlQueryPayload;
  createCmsLayout: CreateCmsLayoutPayload;
  createCmsNavigationItem: CreateCmsNavigationItemPayload;
  createCmsPartial: CreateCmsPartialPayload;
  createConvention: CreateConventionPayload;
  createConventionStripeAccount: CreateConventionStripeAccountPayload;
  createCoupon: CreateCouponPayload;
  createCouponApplication: CreateCouponApplicationPayload;
  createDepartment: CreateDepartmentPayload;
  createEmailRoute: CreateEmailRoutePayload;
  createEvent: CreateEventPayload;
  createEventCategory: CreateEventCategoryPayload;
  createEventProposal: CreateEventProposalPayload;
  createFillerEvent: CreateFillerEventPayload;
  /** Create a new form in a convention. */
  createForm: CreateFormPayload;
  createFormItem: CreateFormItemPayload;
  createFormSection: CreateFormSectionPayload;
  createFormWithJSON: CreateFormWithJsonPayload;
  createMaximumEventProvidedTicketsOverride: CreateMaximumEventProvidedTicketsOverridePayload;
  createMultipleRuns: CreateMultipleRunsPayload;
  createMySignup: CreateMySignupPayload;
  createOrder: CreateOrderPayload;
  createOrderEntry: CreateOrderEntryPayload;
  createOrganizationRole: CreateOrganizationRolePayload;
  createPage: CreatePagePayload;
  createProduct: CreateProductPayload;
  /** Create a new RankedChoiceUserConstraint */
  createRankedChoiceUserConstraint: CreateRankedChoiceUserConstraintPayload;
  createRoom: CreateRoomPayload;
  createRun: CreateRunPayload;
  /** Create a new SignupRankedChoice in a user's signup queue */
  createSignupRankedChoice: CreateSignupRankedChoicePayload;
  createSignupRequest: CreateSignupRequestPayload;
  /** Create a new SignupRound in a convention */
  createSignupRound: CreateSignupRoundPayload;
  createStaffPosition: CreateStaffPositionPayload;
  createTeamMember: CreateTeamMemberPayload;
  createTicket: CreateTicketPayload;
  createTicketType: CreateTicketTypePayload;
  createUserActivityAlert: CreateUserActivityAlertPayload;
  createUserConProfile: CreateUserConProfilePayload;
  createUserSignup: CreateUserSignupPayload;
  deleteCmsContentGroup: DeleteCmsContentGroupPayload;
  deleteCmsFile: DeleteCmsFilePayload;
  deleteCmsGraphqlQuery: DeleteCmsGraphqlQueryPayload;
  deleteCmsLayout: DeleteCmsLayoutPayload;
  deleteCmsNavigationItem: DeleteCmsNavigationItemPayload;
  deleteCmsPartial: DeleteCmsPartialPayload;
  deleteCmsVariable: DeleteCmsVariablePayload;
  deleteCoupon: DeleteCouponPayload;
  deleteCouponApplication: DeleteCouponApplicationPayload;
  deleteDepartment: DeleteDepartmentPayload;
  deleteEmailRoute: DeleteEmailRoutePayload;
  deleteEventCategory: DeleteEventCategoryPayload;
  deleteEventProposal: DeleteEventProposalPayload;
  deleteForm: DeleteFormPayload;
  deleteFormItem: DeleteFormItemPayload;
  deleteFormSection: DeleteFormSectionPayload;
  deleteMaximumEventProvidedTicketsOverride: DeleteMaximumEventProvidedTicketsOverridePayload;
  deleteOrderEntry: DeleteOrderEntryPayload;
  deleteOrganizationRole: DeleteOrganizationRolePayload;
  deletePage: DeletePagePayload;
  deleteProduct: DeleteProductPayload;
  /** Delete a RankedChoiceUserConstraint from a user's profile. */
  deleteRankedChoiceUserConstraint: DeleteRankedChoiceUserConstraintPayload;
  deleteRoom: DeleteRoomPayload;
  deleteRun: DeleteRunPayload;
  /** Deletes a SignupRankedChoice from a user's signup queue */
  deleteSignupRankedChoice: DeleteSignupRankedChoicePayload;
  /** Deletes a SignupRound from a convention */
  deleteSignupRound: DeleteSignupRoundPayload;
  deleteStaffPosition: DeleteStaffPositionPayload;
  deleteTeamMember: DeleteTeamMemberPayload;
  deleteTicket: DeleteTicketPayload;
  deleteTicketType: DeleteTicketTypePayload;
  deleteUserActivityAlert: DeleteUserActivityAlertPayload;
  deleteUserConProfile: DeleteUserConProfilePayload;
  dropEvent: DropEventPayload;
  forceConfirmSignup: ForceConfirmSignupPayload;
  /**
   * Freeze the existing bucket assignments for an event as they currently are.  After doing this, any signups in flex
   * buckets that had a requested bucket will be moved into their requested buckets, and those buckets will be expanded to
   * include them (and the flex bucket shrunk accordingly).  Additionally, this will set the flag on the event that
   * prevents no-preference signups from being moved.
   */
  freezeBucketAssignments: FreezeBucketAssignmentsPayload;
  markOrderPaid: MarkOrderPaidPayload;
  mergeUsers: MergeUsersPayload;
  moveFormItem: MoveFormItemPayload;
  moveFormSection: MoveFormSectionPayload;
  provideEventTicket: ProvideEventTicketPayload;
  rateEvent: RateEventPayload;
  rejectSignupRequest: RejectSignupRequestPayload;
  renameCmsFile: RenameCmsFilePayload;
  /**
   * In a moderated-signup convention with ranked-choice signups, this operation can be used to undo whatever signup
   * requests from a round haven't yet been accepted or rejected, and rerun the round from wherever that leaves it.  Any
   * undone signup requests will be moved back to the top of the user's queue, so the algorithm will attempt to re-place
   * them in that event if possible.
   */
  rerunModeratedRankedChoiceSignupRound: RerunModeratedRankedChoiceSignupRoundPayload;
  restoreDroppedEvent: RestoreDroppedEventPayload;
  revokeAuthorizedApplication: RevokeAuthorizedApplicationPayload;
  /** Sends a preview of a given notification template to a given user. */
  sendNotificationPreview: SendNotificationPreviewPayload;
  setCmsVariable: SetCmsVariablePayload;
  setConventionCanceled: SetConventionCanceledPayload;
  /** Set whether or not a SignupRankedChoice should prioritize itself if an event is full */
  setSignupRankedChoicePrioritzeWaitlist: SetSignupRankedChoicePrioritizeWaitlistPayload;
  sortCmsNavigationItems: SortCmsNavigationItemsPayload;
  submitEventProposal: SubmitEventProposalPayload;
  /** Submit an order.  This triggers payment, unless the order is free. */
  submitOrder: SubmitOrderPayload;
  transitionEventProposal: TransitionEventProposalPayload;
  updateCmsContentGroup: UpdateCmsContentGroupPayload;
  updateCmsGraphqlQuery: UpdateCmsGraphqlQueryPayload;
  updateCmsLayout: UpdateCmsLayoutPayload;
  updateCmsNavigationItem: UpdateCmsNavigationItemPayload;
  updateCmsPartial: UpdateCmsPartialPayload;
  updateConvention: UpdateConventionPayload;
  updateCoupon: UpdateCouponPayload;
  updateDepartment: UpdateDepartmentPayload;
  updateEmailRoute: UpdateEmailRoutePayload;
  updateEvent: UpdateEventPayload;
  updateEventAdminNotes: UpdateEventAdminNotesPayload;
  updateEventCategory: UpdateEventCategoryPayload;
  updateEventProposal: UpdateEventProposalPayload;
  updateEventProposalAdminNotes: UpdateEventProposalAdminNotesPayload;
  updateForm: UpdateFormPayload;
  updateFormItem: UpdateFormItemPayload;
  updateFormSection: UpdateFormSectionPayload;
  updateFormWithJSON: UpdateFormWithJsonPayload;
  updateMaximumEventProvidedTicketsOverride: UpdateMaximumEventProvidedTicketsOverridePayload;
  updateNotificationTemplate: UpdateNotificationTemplatePayload;
  updateOrder: UpdateOrderPayload;
  updateOrderEntry: UpdateOrderEntryPayload;
  updateOrganizationRole: UpdateOrganizationRolePayload;
  updatePage: UpdatePagePayload;
  updateProduct: UpdateProductPayload;
  /** Update a RankedChoiceUserConstraint by ID. */
  updateRankedChoiceUserConstraint: UpdateRankedChoiceUserConstraintPayload;
  updateRoom: UpdateRoomPayload;
  updateRootSite: UpdateRootSitePayload;
  updateRun: UpdateRunPayload;
  updateSignupBucket: UpdateSignupBucketPayload;
  updateSignupCounted: UpdateSignupCountedPayload;
  /** Change the priority of a SignupRankedChoice in a user's queue */
  updateSignupRankedChoicePriority: UpdateSignupRankedChoicePriorityPayload;
  /** Modify an existing SignupRound */
  updateSignupRound: UpdateSignupRoundPayload;
  updateStaffPosition: UpdateStaffPositionPayload;
  updateStaffPositionPermissions: UpdateStaffPositionPermissionsPayload;
  updateTeamMember: UpdateTeamMemberPayload;
  updateTicket: UpdateTicketPayload;
  updateTicketType: UpdateTicketTypePayload;
  updateUserActivityAlert: UpdateUserActivityAlertPayload;
  updateUserConProfile: UpdateUserConProfilePayload;
  withdrawAllUserConProfileSignups: WithdrawAllUserConProfileSignupsPayload;
  withdrawMySignup: WithdrawMySignupPayload;
  withdrawSignupRequest: WithdrawSignupRequestPayload;
  withdrawUserSignup: WithdrawUserSignupPayload;
};


export type MutationAcceptClickwrapAgreementArgs = {
  input: AcceptClickwrapAgreementInput;
};


export type MutationAcceptSignupRequestArgs = {
  input: AcceptSignupRequestInput;
};


export type MutationAddOrderEntryToCurrentPendingOrderArgs = {
  input: AddOrderEntryToCurrentPendingOrderInput;
};


export type MutationAttachImageToEventArgs = {
  input: AttachImageToEventInput;
};


export type MutationAttachImageToEventProposalArgs = {
  input: AttachImageToEventProposalInput;
};


export type MutationCancelOrderArgs = {
  input: CancelOrderInput;
};


export type MutationConvertTicketToEventProvidedArgs = {
  input: ConvertTicketToEventProvidedInput;
};


export type MutationCreateCmsContentGroupArgs = {
  input: CreateCmsContentGroupInput;
};


export type MutationCreateCmsFileArgs = {
  input: CreateCmsFileInput;
};


export type MutationCreateCmsGraphqlQueryArgs = {
  input: CreateCmsGraphqlQueryInput;
};


export type MutationCreateCmsLayoutArgs = {
  input: CreateCmsLayoutInput;
};


export type MutationCreateCmsNavigationItemArgs = {
  input: CreateCmsNavigationItemInput;
};


export type MutationCreateCmsPartialArgs = {
  input: CreateCmsPartialInput;
};


export type MutationCreateConventionArgs = {
  input: CreateConventionInput;
};


export type MutationCreateConventionStripeAccountArgs = {
  input: CreateConventionStripeAccountInput;
};


export type MutationCreateCouponArgs = {
  input: CreateCouponInput;
};


export type MutationCreateCouponApplicationArgs = {
  input: CreateCouponApplicationInput;
};


export type MutationCreateDepartmentArgs = {
  input: CreateDepartmentInput;
};


export type MutationCreateEmailRouteArgs = {
  input: CreateEmailRouteInput;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateEventCategoryArgs = {
  input: CreateEventCategoryInput;
};


export type MutationCreateEventProposalArgs = {
  input: CreateEventProposalInput;
};


export type MutationCreateFillerEventArgs = {
  input: CreateFillerEventInput;
};


export type MutationCreateFormArgs = {
  input: CreateFormInput;
};


export type MutationCreateFormItemArgs = {
  input: CreateFormItemInput;
};


export type MutationCreateFormSectionArgs = {
  input: CreateFormSectionInput;
};


export type MutationCreateFormWithJsonArgs = {
  input: CreateFormWithJsonInput;
};


export type MutationCreateMaximumEventProvidedTicketsOverrideArgs = {
  input: CreateMaximumEventProvidedTicketsOverrideInput;
};


export type MutationCreateMultipleRunsArgs = {
  input: CreateMultipleRunsInput;
};


export type MutationCreateMySignupArgs = {
  input: CreateMySignupInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreateOrderEntryArgs = {
  input: CreateOrderEntryInput;
};


export type MutationCreateOrganizationRoleArgs = {
  input: CreateOrganizationRoleInput;
};


export type MutationCreatePageArgs = {
  input: CreatePageInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateRankedChoiceUserConstraintArgs = {
  input: CreateRankedChoiceUserConstraintInput;
};


export type MutationCreateRoomArgs = {
  input: CreateRoomInput;
};


export type MutationCreateRunArgs = {
  input: CreateRunInput;
};


export type MutationCreateSignupRankedChoiceArgs = {
  input: CreateSignupRankedChoiceInput;
};


export type MutationCreateSignupRequestArgs = {
  input: CreateSignupRequestInput;
};


export type MutationCreateSignupRoundArgs = {
  input: CreateSignupRoundInput;
};


export type MutationCreateStaffPositionArgs = {
  input: CreateStaffPositionInput;
};


export type MutationCreateTeamMemberArgs = {
  input: CreateTeamMemberInput;
};


export type MutationCreateTicketArgs = {
  input: CreateTicketInput;
};


export type MutationCreateTicketTypeArgs = {
  input: CreateTicketTypeInput;
};


export type MutationCreateUserActivityAlertArgs = {
  input: CreateUserActivityAlertInput;
};


export type MutationCreateUserConProfileArgs = {
  input: CreateUserConProfileInput;
};


export type MutationCreateUserSignupArgs = {
  input: CreateUserSignupInput;
};


export type MutationDeleteCmsContentGroupArgs = {
  input: DeleteCmsContentGroupInput;
};


export type MutationDeleteCmsFileArgs = {
  input: DeleteCmsFileInput;
};


export type MutationDeleteCmsGraphqlQueryArgs = {
  input: DeleteCmsGraphqlQueryInput;
};


export type MutationDeleteCmsLayoutArgs = {
  input: DeleteCmsLayoutInput;
};


export type MutationDeleteCmsNavigationItemArgs = {
  input: DeleteCmsNavigationItemInput;
};


export type MutationDeleteCmsPartialArgs = {
  input: DeleteCmsPartialInput;
};


export type MutationDeleteCmsVariableArgs = {
  input: DeleteCmsVariableInput;
};


export type MutationDeleteCouponArgs = {
  input: DeleteCouponInput;
};


export type MutationDeleteCouponApplicationArgs = {
  input: DeleteCouponApplicationInput;
};


export type MutationDeleteDepartmentArgs = {
  input: DeleteDepartmentInput;
};


export type MutationDeleteEmailRouteArgs = {
  input: DeleteEmailRouteInput;
};


export type MutationDeleteEventCategoryArgs = {
  input: DeleteEventCategoryInput;
};


export type MutationDeleteEventProposalArgs = {
  input: DeleteEventProposalInput;
};


export type MutationDeleteFormArgs = {
  input: DeleteFormInput;
};


export type MutationDeleteFormItemArgs = {
  input: DeleteFormItemInput;
};


export type MutationDeleteFormSectionArgs = {
  input: DeleteFormSectionInput;
};


export type MutationDeleteMaximumEventProvidedTicketsOverrideArgs = {
  input: DeleteMaximumEventProvidedTicketsOverrideInput;
};


export type MutationDeleteOrderEntryArgs = {
  input: DeleteOrderEntryInput;
};


export type MutationDeleteOrganizationRoleArgs = {
  input: DeleteOrganizationRoleInput;
};


export type MutationDeletePageArgs = {
  input: DeletePageInput;
};


export type MutationDeleteProductArgs = {
  input: DeleteProductInput;
};


export type MutationDeleteRankedChoiceUserConstraintArgs = {
  input: DeleteRankedChoiceUserConstraintInput;
};


export type MutationDeleteRoomArgs = {
  input: DeleteRoomInput;
};


export type MutationDeleteRunArgs = {
  input: DeleteRunInput;
};


export type MutationDeleteSignupRankedChoiceArgs = {
  input: DeleteSignupRankedChoiceInput;
};


export type MutationDeleteSignupRoundArgs = {
  input: DeleteSignupRoundInput;
};


export type MutationDeleteStaffPositionArgs = {
  input: DeleteStaffPositionInput;
};


export type MutationDeleteTeamMemberArgs = {
  input: DeleteTeamMemberInput;
};


export type MutationDeleteTicketArgs = {
  input: DeleteTicketInput;
};


export type MutationDeleteTicketTypeArgs = {
  input: DeleteTicketTypeInput;
};


export type MutationDeleteUserActivityAlertArgs = {
  input: DeleteUserActivityAlertInput;
};


export type MutationDeleteUserConProfileArgs = {
  input: DeleteUserConProfileInput;
};


export type MutationDropEventArgs = {
  input: DropEventInput;
};


export type MutationForceConfirmSignupArgs = {
  input: ForceConfirmSignupInput;
};


export type MutationFreezeBucketAssignmentsArgs = {
  input: FreezeBucketAssignmentsInput;
};


export type MutationMarkOrderPaidArgs = {
  input: MarkOrderPaidInput;
};


export type MutationMergeUsersArgs = {
  input: MergeUsersInput;
};


export type MutationMoveFormItemArgs = {
  input: MoveFormItemInput;
};


export type MutationMoveFormSectionArgs = {
  input: MoveFormSectionInput;
};


export type MutationProvideEventTicketArgs = {
  input: ProvideEventTicketInput;
};


export type MutationRateEventArgs = {
  input: RateEventInput;
};


export type MutationRejectSignupRequestArgs = {
  input: RejectSignupRequestInput;
};


export type MutationRenameCmsFileArgs = {
  input: RenameCmsFileInput;
};


export type MutationRerunModeratedRankedChoiceSignupRoundArgs = {
  input: RerunModeratedRankedChoiceSignupRoundInput;
};


export type MutationRestoreDroppedEventArgs = {
  input: RestoreDroppedEventInput;
};


export type MutationRevokeAuthorizedApplicationArgs = {
  input: RevokeAuthorizedApplicationInput;
};


export type MutationSendNotificationPreviewArgs = {
  input: SendNotificationPreviewInput;
};


export type MutationSetCmsVariableArgs = {
  input: SetCmsVariableInput;
};


export type MutationSetConventionCanceledArgs = {
  input: SetConventionCanceledInput;
};


export type MutationSetSignupRankedChoicePrioritzeWaitlistArgs = {
  input: SetSignupRankedChoicePrioritizeWaitlistInput;
};


export type MutationSortCmsNavigationItemsArgs = {
  input: SortCmsNavigationItemsInput;
};


export type MutationSubmitEventProposalArgs = {
  input: SubmitEventProposalInput;
};


export type MutationSubmitOrderArgs = {
  input: SubmitOrderInput;
};


export type MutationTransitionEventProposalArgs = {
  input: TransitionEventProposalInput;
};


export type MutationUpdateCmsContentGroupArgs = {
  input: UpdateCmsContentGroupInput;
};


export type MutationUpdateCmsGraphqlQueryArgs = {
  input: UpdateCmsGraphqlQueryInput;
};


export type MutationUpdateCmsLayoutArgs = {
  input: UpdateCmsLayoutInput;
};


export type MutationUpdateCmsNavigationItemArgs = {
  input: UpdateCmsNavigationItemInput;
};


export type MutationUpdateCmsPartialArgs = {
  input: UpdateCmsPartialInput;
};


export type MutationUpdateConventionArgs = {
  input: UpdateConventionInput;
};


export type MutationUpdateCouponArgs = {
  input: UpdateCouponInput;
};


export type MutationUpdateDepartmentArgs = {
  input: UpdateDepartmentInput;
};


export type MutationUpdateEmailRouteArgs = {
  input: UpdateEmailRouteInput;
};


export type MutationUpdateEventArgs = {
  input: UpdateEventInput;
};


export type MutationUpdateEventAdminNotesArgs = {
  input: UpdateEventAdminNotesInput;
};


export type MutationUpdateEventCategoryArgs = {
  input: UpdateEventCategoryInput;
};


export type MutationUpdateEventProposalArgs = {
  input: UpdateEventProposalInput;
};


export type MutationUpdateEventProposalAdminNotesArgs = {
  input: UpdateEventProposalAdminNotesInput;
};


export type MutationUpdateFormArgs = {
  input: UpdateFormInput;
};


export type MutationUpdateFormItemArgs = {
  input: UpdateFormItemInput;
};


export type MutationUpdateFormSectionArgs = {
  input: UpdateFormSectionInput;
};


export type MutationUpdateFormWithJsonArgs = {
  input: UpdateFormWithJsonInput;
};


export type MutationUpdateMaximumEventProvidedTicketsOverrideArgs = {
  input: UpdateMaximumEventProvidedTicketsOverrideInput;
};


export type MutationUpdateNotificationTemplateArgs = {
  input: UpdateNotificationTemplateInput;
};


export type MutationUpdateOrderArgs = {
  input: UpdateOrderInput;
};


export type MutationUpdateOrderEntryArgs = {
  input: UpdateOrderEntryInput;
};


export type MutationUpdateOrganizationRoleArgs = {
  input: UpdateOrganizationRoleInput;
};


export type MutationUpdatePageArgs = {
  input: UpdatePageInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateRankedChoiceUserConstraintArgs = {
  input: UpdateRankedChoiceUserConstraintInput;
};


export type MutationUpdateRoomArgs = {
  input: UpdateRoomInput;
};


export type MutationUpdateRootSiteArgs = {
  input: UpdateRootSiteInput;
};


export type MutationUpdateRunArgs = {
  input: UpdateRunInput;
};


export type MutationUpdateSignupBucketArgs = {
  input: UpdateSignupBucketInput;
};


export type MutationUpdateSignupCountedArgs = {
  input: UpdateSignupCountedInput;
};


export type MutationUpdateSignupRankedChoicePriorityArgs = {
  input: UpdateSignupRankedChoicePriorityInput;
};


export type MutationUpdateSignupRoundArgs = {
  input: UpdateSignupRoundInput;
};


export type MutationUpdateStaffPositionArgs = {
  input: UpdateStaffPositionInput;
};


export type MutationUpdateStaffPositionPermissionsArgs = {
  input: UpdateStaffPositionPermissionsInput;
};


export type MutationUpdateTeamMemberArgs = {
  input: UpdateTeamMemberInput;
};


export type MutationUpdateTicketArgs = {
  input: UpdateTicketInput;
};


export type MutationUpdateTicketTypeArgs = {
  input: UpdateTicketTypeInput;
};


export type MutationUpdateUserActivityAlertArgs = {
  input: UpdateUserActivityAlertInput;
};


export type MutationUpdateUserConProfileArgs = {
  input: UpdateUserConProfileInput;
};


export type MutationWithdrawAllUserConProfileSignupsArgs = {
  input: WithdrawAllUserConProfileSignupsInput;
};


export type MutationWithdrawMySignupArgs = {
  input: WithdrawMySignupInput;
};


export type MutationWithdrawSignupRequestArgs = {
  input: WithdrawSignupRequestInput;
};


export type MutationWithdrawUserSignupArgs = {
  input: WithdrawUserSignupInput;
};

export type NotificationDestination = {
  __typename: 'NotificationDestination';
  id: Scalars['ID']['output'];
  source: NotificationSource;
  staff_position?: Maybe<StaffPosition>;
  user_con_profile?: Maybe<UserConProfile>;
};

export type NotificationDestinationInput = {
  staffPositionId?: InputMaybe<Scalars['ID']['input']>;
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

export type NotificationSource = UserActivityAlert;

export type NotificationTemplate = {
  __typename: 'NotificationTemplate';
  body_html?: Maybe<Scalars['String']['output']>;
  body_sms?: Maybe<Scalars['String']['output']>;
  body_text?: Maybe<Scalars['String']['output']>;
  event_key: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  subject?: Maybe<Scalars['String']['output']>;
};

export type NotificationTemplateInput = {
  body_html?: InputMaybe<Scalars['String']['input']>;
  body_sms?: InputMaybe<Scalars['String']['input']>;
  body_text?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type Order = {
  __typename: 'Order';
  charge_id?: Maybe<Scalars['String']['output']>;
  coupon_applications: Array<CouponApplication>;
  id: Scalars['ID']['output'];
  order_entries: Array<OrderEntry>;
  paid_at?: Maybe<Scalars['Date']['output']>;
  payment_amount?: Maybe<Money>;
  /**
   * Generates a Stripe PaymentIntent for this order and returns the client secret from that
   * PaymentIntent. This can be used to start a payment on the client side, for example using
   * Apple Pay or Google Pay.
   */
  payment_intent_client_secret: Scalars['String']['output'];
  payment_note?: Maybe<Scalars['String']['output']>;
  status: OrderStatus;
  submitted_at?: Maybe<Scalars['Date']['output']>;
  total_price: Money;
  total_price_before_discounts: Money;
  user_con_profile: UserConProfile;
};

export type OrderEntry = {
  __typename: 'OrderEntry';
  describe_products: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  order: Order;
  price: Money;
  price_per_item: Money;
  product: Product;
  product_variant?: Maybe<ProductVariant>;
  quantity: Scalars['Int']['output'];
  run?: Maybe<Run>;
};

export type OrderEntryInput = {
  price_per_item?: InputMaybe<MoneyInput>;
  productId?: InputMaybe<Scalars['ID']['input']>;
  productVariantId?: InputMaybe<Scalars['ID']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
  ticketId?: InputMaybe<Scalars['ID']['input']>;
};

export type OrderFiltersInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Array<Scalars['String']['input']>>;
  user_name?: InputMaybe<Scalars['String']['input']>;
};

export type OrderInput = {
  payment_amount?: InputMaybe<MoneyInput>;
  payment_note?: InputMaybe<Scalars['String']['input']>;
};

export type OrderQuantityByStatus = {
  __typename: 'OrderQuantityByStatus';
  quantity: Scalars['Int']['output'];
  status: Scalars['String']['output'];
};

export enum OrderStatus {
  /** Order has been cancelled */
  Cancelled = 'cancelled',
  /** Order has been submitted and paid */
  Paid = 'paid',
  /** Order has not yet been submitted */
  Pending = 'pending',
  /** Order is submitted but not yet paid */
  Unpaid = 'unpaid'
}

export type OrdersPagination = PaginationInterface & {
  __typename: 'OrdersPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<Order>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

export type Organization = {
  __typename: 'Organization';
  conventions: Array<Convention>;
  current_ability_can_manage_access: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization_roles: Array<OrganizationRole>;
};

export type OrganizationRole = {
  __typename: 'OrganizationRole';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization: Organization;
  permissions: Array<Permission>;
  users: Array<User>;
};

export type OrganizationRoleInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

/** A CMS page, viewable at a location under `/pages/`. */
export type Page = {
  __typename: 'Page';
  /** Notes on this page that will be visible to site admins */
  admin_notes?: Maybe<Scalars['String']['output']>;
  /**
   * If present, the layout to use for rendering this page.  If not, this page will use the default layout for its CMS
   * parent.
   */
  cms_layout?: Maybe<CmsLayout>;
  /** The content of this page, in Liquid format */
  content?: Maybe<Scalars['String']['output']>;
  /** The rendered content of this page, in HTML format */
  content_html: Scalars['String']['output'];
  /** Is the user making this request allowed to delete this page? */
  current_ability_can_delete: Scalars['Boolean']['output'];
  /** Is the user making this request allowed to update this page? */
  current_ability_can_update: Scalars['Boolean']['output'];
  /** If true, this page will not be indexed for full-text search. */
  hidden_from_search: Scalars['Boolean']['output'];
  /** The ID of this page. */
  id: Scalars['ID']['output'];
  /**
   * If present, this value will be used in the `<meta property="og:description">` and
   * `<meta name="description">` tags in the `<head>` of this page, which are used as the
   * preview text for links to this page on web sites such as Facebook, Twitter, etc.
   *
   * If absent, the description text will be automatically generated from the page content.
   */
  meta_description?: Maybe<Scalars['String']['output']>;
  /** The title of this page */
  name?: Maybe<Scalars['String']['output']>;
  /** An automatically-generated list of CMS partials referenced by this page (and any partials referenced by those, etc.) */
  referenced_partials: Array<CmsPartial>;
  /**
   * If true, this page will not require the user to agree to the site's clickwrap agreement (if applicable) in order to
   * view it.  This should be used on any pages referenced in the clickwrap agreement, such as site policies.
   */
  skip_clickwrap_agreement?: Maybe<Scalars['Boolean']['output']>;
  /** The URL portion after `/pages/` at which this page can be viewed */
  slug?: Maybe<Scalars['String']['output']>;
};

/** A CMS page. */
export type PageInput = {
  /** Notes on this page that will be visible to site admins */
  admin_notes?: InputMaybe<Scalars['String']['input']>;
  /**
   * If present, the ID of the layout to use for rendering this page.  If not, this page will use the default layout for
   * its CMS parent.
   */
  cmsLayoutId?: InputMaybe<Scalars['ID']['input']>;
  /** The content of this page, in Liquid format */
  content?: InputMaybe<Scalars['String']['input']>;
  /** If true, this page will not be indexed for full-text search. */
  hidden_from_search?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * If present, this value will be used in the `<meta property="og:description">` and
   * `<meta name="description">` tags in the `<head>` of this page, which are used as the
   * preview text for links to this page on web sites such as Facebook, Twitter, etc.
   *
   * If absent, the description text will be automatically generated from the page content.
   */
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  /** The title of this page */
  name?: InputMaybe<Scalars['String']['input']>;
  /**
   * If true, this page will not require the user to agree to the site's clickwrap agreement (if applicable) in order to
   * view it.  This should be used on any pages referenced in the clickwrap agreement, such as site policies.
   */
  skip_clickwrap_agreement?: InputMaybe<Scalars['Boolean']['input']>;
  /** The URL portion after `/pages/` at which this page can be viewed */
  slug?: InputMaybe<Scalars['String']['input']>;
};

/**
 * PaginationInterface provides a way to use offset-based pagination on a list of objects. This
 * is useful for UIs such as Intercode's table views, which provide a way to jump between numbered
 * pages.
 *
 * Page numbers in PaginationInterface are 1-based (so, the first page is page 1, then page 2,
 * etc.) The number of items per page can be controlled via the per_page argument on paginated
 * fields. It defaults to 20, and can go up to 200.
 *
 * Offset-based pagination is different from
 * [Relay's cursor-based pagination](https://relay.dev/graphql/connections.htm) that is more
 * commonly used in GraphQL APIs. We chose to go with an offset-based approach due to our UI
 * needs, but if a cursor-based approach is desirable in the future, we may also implement Relay
 * connections alongside our existing pagination fields.
 */
export type PaginationInterface = {
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

export type PayWhatYouWantInput = {
  allowedCurrencyCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  maximumAmount?: InputMaybe<MoneyInput>;
  minimumAmount?: InputMaybe<MoneyInput>;
  suggestedAmount?: InputMaybe<MoneyInput>;
};

export type PayWhatYouWantValue = {
  __typename: 'PayWhatYouWantValue';
  allowed_currency_codes?: Maybe<Array<Scalars['String']['output']>>;
  maximum_amount?: Maybe<Money>;
  minimum_amount?: Maybe<Money>;
  suggested_amount?: Maybe<Money>;
};

/** How should an order be paid for? */
export enum PaymentMode {
  Free = 'free',
  Later = 'later',
  /** @deprecated Please use payment_intent instead */
  Now = 'now',
  PaymentIntent = 'payment_intent'
}

export type Permission = {
  __typename: 'Permission';
  id: Scalars['ID']['output'];
  model: PermissionedModel;
  permission: Scalars['String']['output'];
  role: PermissionedRole;
};

export type PermissionInput = {
  modelId?: InputMaybe<Scalars['ID']['input']>;
  model_type?: InputMaybe<PermissionedModelTypeIndicator>;
  permission: Scalars['String']['input'];
  roleId?: InputMaybe<Scalars['ID']['input']>;
  role_type?: InputMaybe<PermissionedRoleTypeIndicator>;
};

export type PermissionedModel = CmsContentGroup | Convention | EventCategory;

export enum PermissionedModelTypeIndicator {
  CmsContentGroup = 'CmsContentGroup',
  Convention = 'Convention',
  EventCategory = 'EventCategory'
}

export type PermissionedRole = OrganizationRole | StaffPosition;

export enum PermissionedRoleTypeIndicator {
  OrganizationRole = 'OrganizationRole',
  StaffPosition = 'StaffPosition'
}

export enum PricingStrategy {
  /** Fixed price */
  Fixed = 'fixed',
  /** Pay-what-you-want price */
  PayWhatYouWant = 'pay_what_you_want',
  /** Price that changes over time */
  ScheduledValue = 'scheduled_value'
}

export type PricingStructure = {
  __typename: 'PricingStructure';
  price?: Maybe<Money>;
  pricing_strategy: PricingStrategy;
  value: PricingStructureValue;
};


export type PricingStructurePriceArgs = {
  time?: InputMaybe<Scalars['Date']['input']>;
};

export type PricingStructureInput = {
  fixed_value?: InputMaybe<MoneyInput>;
  pay_what_you_want_value?: InputMaybe<PayWhatYouWantInput>;
  pricing_strategy: PricingStrategy;
  scheduled_value?: InputMaybe<ScheduledMoneyValueInput>;
};

export type PricingStructureValue = Money | PayWhatYouWantValue | ScheduledMoneyValue;

export type Product = {
  __typename: 'Product';
  available: Scalars['Boolean']['output'];
  clickwrap_agreement?: Maybe<Scalars['String']['output']>;
  clickwrap_agreement_html?: Maybe<Scalars['String']['output']>;
  convention: Convention;
  description?: Maybe<Scalars['String']['output']>;
  description_html?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<ActiveStorageAttachment>;
  /** @deprecated Please use the image field instead. */
  image_url?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  order_quantities_by_status: Array<OrderQuantityByStatus>;
  payment_options: Array<Scalars['String']['output']>;
  pricing_structure: PricingStructure;
  product_variants: Array<ProductVariant>;
  provides_ticket_type?: Maybe<TicketType>;
};

export type ProductInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  clickwrapAgreement?: InputMaybe<Scalars['String']['input']>;
  deleteVariantIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payment_options?: InputMaybe<Array<Scalars['String']['input']>>;
  pricing_structure?: InputMaybe<PricingStructureInput>;
  product_variants?: InputMaybe<Array<ProductVariantInput>>;
  providesTicketTypeId?: InputMaybe<Scalars['ID']['input']>;
};

export type ProductVariant = {
  __typename: 'ProductVariant';
  description?: Maybe<Scalars['String']['output']>;
  description_html?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<ActiveStorageAttachment>;
  /** @deprecated Please use the image field instead. */
  image_url?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  order_quantities_by_status: Array<OrderQuantityByStatus>;
  override_pricing_structure?: Maybe<PricingStructure>;
  position?: Maybe<Scalars['Int']['output']>;
  product: Product;
};

export type ProductVariantInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  override_pricing_structure?: InputMaybe<PricingStructureInput>;
};

/** Autogenerated input type of ProvideEventTicket */
export type ProvideEventTicketInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  ticketTypeId?: InputMaybe<Scalars['ID']['input']>;
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of ProvideEventTicket. */
export type ProvideEventTicketPayload = {
  __typename: 'ProvideEventTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  ticket: Ticket;
};

export type Query = {
  __typename: 'Query';
  /**
   * If there is a CMS partial on the root site called `account_form_text`, renders it to HTML
   * and returns the result. Otherwise, returns null.
   *
   * This is used by the "update your account" pages as a way to clarify that your account is
   * shared between multiple conventions.
   * @deprecated Please use the blockPartial field of CmsParent instead.
   */
  accountFormContentHtml?: Maybe<Scalars['String']['output']>;
  /**
   * If the current user is an assumed identity (using the "become user" feature), this returns
   * the actual profile of the signed-in account. If not, returns null.
   */
  assumedIdentityFromProfile?: Maybe<UserConProfile>;
  /**
   * Returns the CMS parent object associated with a given domain name. In a
   * convention domain, this is the `Convention` itself. Otherwise, it's the `RootSite`.
   */
  cmsParentByDomain: CmsParent;
  /**
   * Returns the CMS parent object associated with the domain name of this HTTP request. In a
   * convention domain, this is the `Convention` itself. Otherwise, it's the `RootSite`.
   */
  cmsParentByRequestHost: CmsParent;
  /** Returns the convention associated with a specified domain name. */
  conventionByDomain: Convention;
  /** Finds a convention by ID. If a matching one can't be found, the request will error out. */
  conventionById: Convention;
  /**
   * Returns the convention associated with the domain name of this HTTP request. If one is not
   * present, the request will error out. (For a version that will return null instead of
   * erroring out, use `conventionByRequestHostIfPresent`.)
   */
  conventionByRequestHost: Convention;
  /**
   * Returns the convention associated with the domain name of this HTTP request. If one is not
   * present, returns null.
   */
  conventionByRequestHostIfPresent?: Maybe<Convention>;
  /**
   * Returns a paginated list of conventions. See PaginationInterface for details on how to use
   * paginated lists, and ConventionFiltersInput for filters you can use here.
   */
  conventions_paginated: ConventionsPagination;
  /**
   * Returns the ability object for the current user's permissions, or an ability object for an
   * anonymous user if no user is currently signed in.
   */
  currentAbility: Ability;
  /** Returns the currently signed-in user. If no user is signed in, returns null. */
  currentUser?: Maybe<User>;
  /** Returns the default currency for this site */
  defaultCurrencyCode: Scalars['String']['output'];
  /** Returns a global email route by ID. */
  email_route: EmailRoute;
  /**
   * Returns a paginated list of the _global_ email routes configured in Intercode.
   * (Convention-specific email routing is controlled via that convention's StaffPositions.)
   */
  email_routes_paginated: EmailRoutesPagination;
  /**
   * Returns whether or not this instance of Intercode has any third-party OAuth2 applications
   * set up. If not, the UI will not show the "Authorized Applications" menu item to users.
   */
  hasOauthApplications: Scalars['Boolean']['output'];
  /**
   * Returns the authorized OAuth applications for the current user. If no user is signed in,
   * returns null.
   */
  myAuthorizedApplications: Array<AuthorizedApplication>;
  /**
   * Given a set of valid OAuth query parameters for the `/oauth/authorize` endpoint, returns a
   * JSON object containing the necessary data for rendering the pre-authorization screen that
   * checks if you want to allow an application to access Intercode on your behalf.
   *
   * This essentially emulates the JSON behavior of
   * [Doorkeeper](https://github.com/doorkeeper-gem/doorkeeper)'s API-only mode if you go to
   * `/oauth/authorize` with query parameters. The only reason this query exists, rather than
   * simply having clients actually call `/oauth/authorize`, is that we're running Doorkeeper
   * in regular mode so that we can get the server-rendered HTML admin views.
   *
   * When we've implemented our own admin screens for OAuth
   * (see [this Github issue](https://github.com/neinteractiveliterature/intercode/issues/2740)),
   * this query will be deprecated.
   */
  oauthPreAuth: Scalars['Json']['output'];
  /** Returns all organizations in the database. */
  organizations: Array<Organization>;
  /** Returns the singleton RootSite object, which is a CMS parent. */
  rootSite: RootSite;
  /** Returns a list of all supported currency codes */
  supportedCurrencyCodes: Array<Scalars['String']['output']>;
  /** Finds a user by ID. If there is no user with that ID, errors out. */
  user: User;
  /** Finds up to 25 users by ID. If any of the IDs don't match an existing user, errors out. */
  users: Array<User>;
  /**
   * Returns a paginated list of users. See PaginationInterface for details on how to use
   * paginated lists, and UserFiltersInput for filters you can use here.
   */
  users_paginated: UsersPagination;
};


export type QueryCmsParentByDomainArgs = {
  domain: Scalars['String']['input'];
};


export type QueryConventionByDomainArgs = {
  domain: Scalars['String']['input'];
};


export type QueryConventionByIdArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryConventions_PaginatedArgs = {
  filters?: InputMaybe<ConventionFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryEmail_RouteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEmail_Routes_PaginatedArgs = {
  filters?: InputMaybe<EmailRouteFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryOauthPreAuthArgs = {
  queryParams: Scalars['Json']['input'];
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryUsersArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type QueryUsers_PaginatedArgs = {
  filters?: InputMaybe<UserFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};

/** A record of a decision the ranked choice automation made while processing a signup round. */
export type RankedChoiceDecision = {
  __typename: 'RankedChoiceDecision';
  /** The time this RankedChoiceDecision was created. */
  created_at: Scalars['Date']['output'];
  /** The decision the algorithm made. */
  decision: RankedChoiceDecisionValue;
  /** Any additional data the algorithm attached to this decision record. */
  extra?: Maybe<Scalars['JSON']['output']>;
  /** The ID of this decision record. */
  id: Scalars['ID']['output'];
  /** The reason for this decision, if any. */
  reason?: Maybe<RankedChoiceDecisionReason>;
  /** The signup that resulted from this decision, if any. */
  signup?: Maybe<Signup>;
  /** The choice that was being processed when this decision was made, if any. */
  signup_ranked_choice?: Maybe<SignupRankedChoice>;
  /** The signup request that resulted from this decision, if any. */
  signup_request?: Maybe<SignupRequest>;
  /** The signup round in which this decision was made. */
  signup_round: SignupRound;
  /** The time this RankedChoiceDecision was last modified. */
  updated_at: Scalars['Date']['output'];
  /** The user profile this decision pertains to, if any. */
  user_con_profile?: Maybe<UserConProfile>;
};

/** Filters that can be applied to a paginated table of RankedChoiceDecisions. */
export type RankedChoiceDecisionFiltersInput = {
  /** Filter by the type of decision(s) that were made. */
  decision?: InputMaybe<Array<RankedChoiceDecisionValue>>;
  /** Filter by the title of the event the decisions pertained to. */
  event_title?: InputMaybe<Scalars['String']['input']>;
  /** Filter by the reason(s) for the decisions. */
  reason?: InputMaybe<Array<RankedChoiceDecisionReason>>;
  /** Filter by the name of the user profiles these decisions pertained to. */
  user_con_profile_name?: InputMaybe<Scalars['String']['input']>;
};

/** The reason the ranked choice automation algorithm made the decision it did when evaluating a particular choice. */
export enum RankedChoiceDecisionReason {
  /** This choice would conflict with an existing signup this user has */
  Conflict = 'CONFLICT',
  /** This event is full */
  Full = 'FULL',
  /** Tickets are required in this convention and this user doesn't have one */
  MissingTicket = 'MISSING_TICKET',
  /** This user already has the maximum number of allowed signups at this time */
  NoMoreSignupsAllowed = 'NO_MORE_SIGNUPS_ALLOWED',
  /** This user has no more pending ranked choices in their queue */
  NoPendingChoices = 'NO_PENDING_CHOICES',
  /** The user's personal constraints prohibit signing up for this event (in conjunction with their existing signups) */
  RankedChoiceUserConstraints = 'RANKED_CHOICE_USER_CONSTRAINTS'
}

/** The decision the ranked choice automation algorithm made when evaluating a particular choice. */
export enum RankedChoiceDecisionValue {
  /** Sign the user up for the chosen event */
  Signup = 'SIGNUP',
  /** Skip this choice but continue evaluating this user's ranked choices */
  SkipChoice = 'SKIP_CHOICE',
  /** Skip all remaining choices for this user */
  SkipUser = 'SKIP_USER',
  /** Sign the user up in the waitlist for the chosen event */
  Waitlist = 'WAITLIST'
}

/** A paginated table of RankedChoiceDecisions. */
export type RankedChoiceDecisionsPagination = PaginationInterface & {
  __typename: 'RankedChoiceDecisionsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<RankedChoiceDecision>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

/** An order to execute ranked-choice signup rounds in. */
export enum RankedChoiceOrder {
  /** In lottery number order, lowest number first */
  Asc = 'ASC',
  /** In lottery number order, lowest number first, then highest, then lowest, etc. */
  AscSerpentine = 'ASC_SERPENTINE',
  /** In lottery number order, highest number first */
  Desc = 'DESC',
  /** In lottery number order, highest number first, then lowest, then highest, etc. */
  DescSerpentine = 'DESC_SERPENTINE'
}

/**
 * A user-defined constraint on how many events the ranked choice algorithm should sign them up for.  This can be
 * time-bounded, and a user can have as many or as few of these as they like.
 */
export type RankedChoiceUserConstraint = {
  __typename: 'RankedChoiceUserConstraint';
  /** When this constraint was created. */
  created_at: Scalars['Date']['output'];
  /**
   * The time at which this constraint stops applying (non-inclusive).  If null, this constraint is unbounded on the
   * finish side.
   */
  finish?: Maybe<Scalars['Date']['output']>;
  /** The ID of this constraint. */
  id: Scalars['ID']['output'];
  /** The maximum number of counted signups to be allowed in the timespan described by this constraint. */
  maximum_signups: Scalars['Int']['output'];
  /**
   * The time at which this constraint starts applying (inclusive).  If null, this constraint is unbounded on the
   * start side.
   */
  start?: Maybe<Scalars['Date']['output']>;
  /** The last time this constraint was modified. */
  updated_at: Scalars['Date']['output'];
  /** The user this constraint applies to. */
  user_con_profile: UserConProfile;
};

/**
 * A user-defined constraint on how many events the ranked choice algorithm should sign them up for.  This can be
 * time-bounded, and a user can have as many or as few of these as they like.
 */
export type RankedChoiceUserConstraintInput = {
  /**
   * The time at which this constraint stops applying (non-inclusive).  If null, this constraint is unbounded on the
   * finish side.
   */
  finish?: InputMaybe<Scalars['Date']['input']>;
  /** The maximum number of counted signups to be allowed in the timespan described by this constraint. */
  maximumSignups?: InputMaybe<Scalars['Int']['input']>;
  /**
   * The time at which this constraint starts applying (inclusive).  If null, this constraint is unbounded on the
   * start side.
   */
  start?: InputMaybe<Scalars['Date']['input']>;
};

/** Autogenerated input type of RateEvent */
export type RateEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  rating: Scalars['Int']['input'];
};

/** Autogenerated return type of RateEvent. */
export type RateEventPayload = {
  __typename: 'RateEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event: Event;
};

export enum ReceiveSignupEmail {
  /** Receive email for all signup activity */
  AllSignups = 'ALL_SIGNUPS',
  /** Do not receive signup email */
  No = 'NO',
  /** Receive email for signup activity affecting confirmed signups */
  NonWaitlistSignups = 'NON_WAITLIST_SIGNUPS'
}

export enum RefundStatus {
  /** A refund was requested, but the charge had already been refunded */
  AlreadyRefunded = 'ALREADY_REFUNDED',
  /** No refund was attempted */
  NotRefunded = 'NOT_REFUNDED',
  /** A refund was successfully provided */
  Refunded = 'REFUNDED'
}

/**
 * A registration policy describes how signups for an event will work.  A registration policy consists of a set of
 * buckets, each of which holds space for signups.  Additionally, the registration policy contains a few other options
 * that can be set that affect the behavior of signups as a whole for this event.
 *
 * For more on registration policies, [see the signups documentation](https://intercode.interactiveliterature.org/docs/concepts/signups).
 */
export type RegistrationPolicy = {
  __typename: 'RegistrationPolicy';
  /** The buckets in this registration policy. */
  buckets: Array<RegistrationPolicyBucket>;
  /** If true, no-preference signups in this event cannot be moved once their bucket has been assigned. */
  freeze_no_preference_buckets: Scalars['Boolean']['output'];
  /** The sum of minimum slots across all counted buckets. */
  minimum_slots?: Maybe<Scalars['Int']['output']>;
  /** The sum of minimum slots across all buckets, including not-counted buckets. */
  minimum_slots_including_not_counted?: Maybe<Scalars['Int']['output']>;
  /** Does this registration policy include only not-counted buckets? */
  only_uncounted?: Maybe<Scalars['Boolean']['output']>;
  /** The sum of preferred slots across all counted buckets. */
  preferred_slots?: Maybe<Scalars['Int']['output']>;
  /** The sum of preferred slots across all buckets, including not-counted buckets. */
  preferred_slots_including_not_counted?: Maybe<Scalars['Int']['output']>;
  /** If true, no-preference signups will not be allowed for this event. */
  prevent_no_preference_signups: Scalars['Boolean']['output'];
  /**
   * Does this event have an effectively-limited number of slots?
   *
   * The logic for this is more complex than it might first appear.  An event's slots are effectively unlimited if it
   * either:
   *
   * - Has a counted + unlimited bucket
   * - Has a not-counted + unlimited bucket, and no counted buckets
   *
   * Therefore, this will be true if both of the above conditions are false.
   */
  slots_limited?: Maybe<Scalars['Boolean']['output']>;
  /** The sum of total slots across all counted buckets. */
  total_slots?: Maybe<Scalars['Int']['output']>;
  /** The sum of total slots across all buckets, including not-counted buckets. */
  total_slots_including_not_counted?: Maybe<Scalars['Int']['output']>;
};

export type RegistrationPolicyBucket = {
  __typename: 'RegistrationPolicyBucket';
  anything: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  expose_attendees: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  minimum_slots?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  not_counted: Scalars['Boolean']['output'];
  preferred_slots?: Maybe<Scalars['Int']['output']>;
  slots_limited: Scalars['Boolean']['output'];
  total_slots?: Maybe<Scalars['Int']['output']>;
};

/** Autogenerated input type of RejectSignupRequest */
export type RejectSignupRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of RejectSignupRequest. */
export type RejectSignupRequestPayload = {
  __typename: 'RejectSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  signup_request: SignupRequest;
};

/** Autogenerated input type of RenameCmsFile */
export type RenameCmsFileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  filename: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of RenameCmsFile. */
export type RenameCmsFilePayload = {
  __typename: 'RenameCmsFilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_file: CmsFile;
};

/** Autogenerated input type of RerunModeratedRankedChoiceSignupRound */
export type RerunModeratedRankedChoiceSignupRoundInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the SignupRound to rerun. */
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of RerunModeratedRankedChoiceSignupRound. */
export type RerunModeratedRankedChoiceSignupRoundPayload = {
  __typename: 'RerunModeratedRankedChoiceSignupRoundPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The SignupRound after being rerun. */
  signup_round: SignupRound;
};

/** Autogenerated input type of RestoreDroppedEvent */
export type RestoreDroppedEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of RestoreDroppedEvent. */
export type RestoreDroppedEventPayload = {
  __typename: 'RestoreDroppedEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event: Event;
};

/** Autogenerated input type of RevokeAuthorizedApplication */
export type RevokeAuthorizedApplicationInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  uid: Scalars['ID']['input'];
};

/** Autogenerated return type of RevokeAuthorizedApplication. */
export type RevokeAuthorizedApplicationPayload = {
  __typename: 'RevokeAuthorizedApplicationPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type Room = {
  __typename: 'Room';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  runs: Array<Run>;
};

export type RoomInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type RootSite = CmsParent & {
  __typename: 'RootSite';
  blockPartial?: Maybe<CmsPartial>;
  /**
   * Finds a CMS content group by ID within the domain name of this HTTP request. If there is no
   * CMS content group with that ID, or the CMS content group is associated with a different
   * domain name, errors out.
   */
  cmsContentGroup: CmsContentGroup;
  /** Returns all CMS content groups within the current domain. */
  cmsContentGroups: Array<CmsContentGroup>;
  /** Returns all CMS files within the current domain. */
  cmsFiles: Array<CmsFile>;
  /** Returns all CMS GraphQL queries within the current domain. */
  cmsGraphqlQueries: Array<CmsGraphqlQuery>;
  /** Returns all CMS layouts within the current domain. */
  cmsLayouts: Array<CmsLayout>;
  /** Returns all CMS navigation items within the current domain. */
  cmsNavigationItems: Array<CmsNavigationItem>;
  /**
   * Finds a CMS page within the domain name of this HTTP request. Exactly one of the three
   * optional arguments (`id`, `slug`, and `rootPage`) must be specified. These each represent a
   * different way of finding a page. If the desired page can't be found within the current
   * domain name, errors out.
   */
  cmsPage: Page;
  /** Returns all CMS pages within the current domain. */
  cmsPages: Array<Page>;
  /** Returns all CMS partials within the current domain. */
  cmsPartials: Array<CmsPartial>;
  /** Returns all CMS variables within the current domain. */
  cmsVariables: Array<CmsVariable>;
  /** Returns the default CMS layout used in this domain. */
  defaultLayout: CmsLayout;
  /**
   * Returns the CMS layout to be used for a particular URL path within the current domain. (This
   * will be the page-specific layout if the URL corresponds to a page with a layout override, or
   * the default layout for the domain otherwise.)
   */
  effectiveCmsLayout: CmsLayout;
  /** Does a full-text search within this domain. */
  fullTextSearch: SearchResult;
  host: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /**
   * Returns all the Liquid assigns for regular CMS page rendering in the current domain name.
   * This is a combination of globally-accessible Liquid assigns and domain-specific user-defined
   * CMS variables.
   */
  liquidAssigns: Array<LiquidAssign>;
  /** Given a Liquid text string, renders it to HTML and returns the result. */
  previewLiquid: Scalars['String']['output'];
  /** Given a Markdown text string, renders it to HTML and returns the result. */
  previewMarkdown: Scalars['String']['output'];
  /** The CMS page used for the root path (/) of this domain. */
  rootPage: Page;
  site_name: Scalars['String']['output'];
  /**
   * Finds CMS content by partial name, case-insensitive, within the current domain's CMS content.
   * For example, in a convention that has a partial called `attendee_profile` and a page called
   * `info_for_attendees`, a search for `attendee` would return both of these.
   *
   * This query is always limited to a maximum of 10 results.
   */
  typeaheadSearchCmsContent: Array<CmsContent>;
  url: Scalars['String']['output'];
};


export type RootSiteBlockPartialArgs = {
  name: CmsPartialBlockName;
};


export type RootSiteCmsContentGroupArgs = {
  id: Scalars['ID']['input'];
};


export type RootSiteCmsPageArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  rootPage?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type RootSiteEffectiveCmsLayoutArgs = {
  path: Scalars['String']['input'];
};


export type RootSiteFullTextSearchArgs = {
  query: Scalars['String']['input'];
};


export type RootSitePreviewLiquidArgs = {
  content: Scalars['String']['input'];
};


export type RootSitePreviewMarkdownArgs = {
  eventId?: InputMaybe<Scalars['ID']['input']>;
  eventProposalId?: InputMaybe<Scalars['ID']['input']>;
  markdown: Scalars['String']['input'];
};


export type RootSiteTypeaheadSearchCmsContentArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type RootSiteInput = {
  defaultLayoutId?: InputMaybe<Scalars['ID']['input']>;
  rootPageId?: InputMaybe<Scalars['ID']['input']>;
  site_name?: InputMaybe<Scalars['String']['input']>;
};

/**
 * A run of an event within a convention. Events can have multiple runs of the course of a convention (with some
 * exceptions, such as conventions that use single_event site mode).
 */
export type Run = {
  __typename: 'Run';
  /** The number of confirmed signups in limited-signup buckets for this run */
  confirmed_limited_signup_count: Scalars['Int']['output'];
  /** The number of confirmed signups (regardless of bucket) for this run */
  confirmed_signup_count: Scalars['Int']['output'];
  /** Whether or not the current user is allowed to request a signup summary of this run */
  current_ability_can_signup_summary_run: Scalars['Boolean']['output'];
  /** The time at which this run finishes */
  ends_at: Scalars['Date']['output'];
  /** The event this is a run of */
  event: Event;
  /**
   * A GroupedSignupCounts object for this run, from which more detailed information about the number of signups can
   * be obtained (sliced in various ways).
   */
  grouped_signup_counts: Array<GroupedSignupCount>;
  /** The ID of this run */
  id: Scalars['ID']['output'];
  /** The current user's SignupRankedChoices for this Run */
  my_signup_ranked_choices: Array<SignupRankedChoice>;
  /** The current user's SignupRequests for this Run */
  my_signup_requests: Array<SignupRequest>;
  /** The current user's Signups for this Run */
  my_signups: Array<Signup>;
  /** The number of confirmed, but not counted signups for this run */
  not_counted_confirmed_signup_count: Scalars['Int']['output'];
  /** The number of non-counted signups for this run (regardless of confirmation status) */
  not_counted_signup_count: Scalars['Int']['output'];
  /** The names of all the rooms this run takes place in */
  room_names: Array<Scalars['String']['output']>;
  /** The rooms this run takes place in */
  rooms: Array<Room>;
  /** An optional, admin-only note to put on this run.  This note is not visible to most users. */
  schedule_note?: Maybe<Scalars['String']['output']>;
  signup_changes_paginated: SignupChangesPagination;
  /** @deprecated Please use grouped_signup_counts instead */
  signup_count_by_state_and_bucket_key_and_counted: Scalars['Json']['output'];
  /** The signups for this run */
  signups_paginated: SignupsPagination;
  /** The time at which this run starts */
  starts_at: Scalars['Date']['output'];
  /**
   * If present, Intercode will append this suffix string to this run whenever it appears in the UI.  This can be
   * used to disambiguate between multiple runs of the same event.
   */
  title_suffix?: Maybe<Scalars['String']['output']>;
  /** The number of signups currently on the waitlist for this run */
  waitlisted_signup_count: Scalars['Int']['output'];
};


/**
 * A run of an event within a convention. Events can have multiple runs of the course of a convention (with some
 * exceptions, such as conventions that use single_event site mode).
 */
export type RunSignup_Changes_PaginatedArgs = {
  filters?: InputMaybe<SignupChangeFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};


/**
 * A run of an event within a convention. Events can have multiple runs of the course of a convention (with some
 * exceptions, such as conventions that use single_event site mode).
 */
export type RunSignups_PaginatedArgs = {
  filters?: InputMaybe<SignupFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type RunFiltersInput = {
  category?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  form_items?: InputMaybe<Scalars['JSON']['input']>;
  my_rating?: InputMaybe<Array<Scalars['Int']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_prefix?: InputMaybe<Scalars['String']['input']>;
};

export type RunInput = {
  roomIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  schedule_note?: InputMaybe<Scalars['String']['input']>;
  starts_at?: InputMaybe<Scalars['Date']['input']>;
  title_suffix?: InputMaybe<Scalars['String']['input']>;
};

export type RunsPagination = PaginationInterface & {
  __typename: 'RunsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<Run>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

export type SalesCountByProductAndPaymentAmount = {
  __typename: 'SalesCountByProductAndPaymentAmount';
  count: Scalars['Int']['output'];
  payment_amount: Money;
  product: Product;
  status: OrderStatus;
};

export type ScheduledMoneyValue = {
  __typename: 'ScheduledMoneyValue';
  timespans: Array<TimespanWithMoneyValue>;
};

export type ScheduledMoneyValueInput = {
  timespans: Array<TimespanWithMoneyValueInput>;
};

export type ScheduledValue = {
  __typename: 'ScheduledValue';
  timespans: Array<TimespanWithValue>;
};

export type ScheduledValueInput = {
  timespans: Array<TimespanWithValueInput>;
};

export enum SchedulingUi {
  Recurring = 'recurring',
  Regular = 'regular',
  SingleRun = 'single_run'
}

export type SearchResult = {
  __typename: 'SearchResult';
  entries: Array<SearchResultEntry>;
  total_entries: Scalars['Int']['output'];
};

export type SearchResultEntry = {
  __typename: 'SearchResultEntry';
  highlight?: Maybe<Scalars['String']['output']>;
  model: SearchableModel;
  rank: Scalars['Float']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type SearchableModel = Event | EventProposal | Page | UserConProfile;

/** Autogenerated input type of SendNotificationPreview */
export type SendNotificationPreviewInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['Boolean']['input'];
  event_key: Scalars['String']['input'];
  sms: Scalars['Boolean']['input'];
};

/** Autogenerated return type of SendNotificationPreview. */
export type SendNotificationPreviewPayload = {
  __typename: 'SendNotificationPreviewPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
};

/** Autogenerated input type of SetCmsVariable */
export type SetCmsVariableInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cms_variable: CmsVariableInput;
};

/** Autogenerated return type of SetCmsVariable. */
export type SetCmsVariablePayload = {
  __typename: 'SetCmsVariablePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_variable: CmsVariable;
};

/** Autogenerated input type of SetConventionCanceled */
export type SetConventionCanceledInput = {
  canceled: Scalars['Boolean']['input'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of SetConventionCanceled. */
export type SetConventionCanceledPayload = {
  __typename: 'SetConventionCanceledPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  convention: Convention;
};

/** Autogenerated input type of SetSignupRankedChoicePrioritizeWaitlist */
export type SetSignupRankedChoicePrioritizeWaitlistInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the SignupRankedChoice to update */
  id: Scalars['ID']['input'];
  /** Should this SignupRankedChoice prioritize itself for full events? */
  prioritizeWaitlist: Scalars['Boolean']['input'];
};

/** Autogenerated return type of SetSignupRankedChoicePrioritizeWaitlist. */
export type SetSignupRankedChoicePrioritizeWaitlistPayload = {
  __typename: 'SetSignupRankedChoicePrioritizeWaitlistPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The SignupRankedChoice that has just been modified */
  signup_ranked_choice: SignupRankedChoice;
};

export enum ShowSchedule {
  Gms = 'gms',
  No = 'no',
  Priv = 'priv',
  Yes = 'yes'
}

export type Signup = {
  __typename: 'Signup';
  age_restrictions_check: Scalars['String']['output'];
  bucket_key?: Maybe<Scalars['String']['output']>;
  choice?: Maybe<Scalars['Int']['output']>;
  counted: Scalars['Boolean']['output'];
  created_at: Scalars['Date']['output'];
  expires_at?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  requested_bucket_key?: Maybe<Scalars['String']['output']>;
  run: Run;
  state: SignupState;
  updated_at: Scalars['Date']['output'];
  user_con_profile: UserConProfile;
  waitlist_position?: Maybe<Scalars['Int']['output']>;
};

/**
 * The automation behavior to use for event signups in a Convention.  Currently, we only support one type of
 * automated signups, the "ranked choice" behavior.  Conventions can also disable automation entirely using the
 * "none" value.
 */
export enum SignupAutomationMode {
  /** Signups are fully manual */
  None = 'none',
  /** Attendees make a ranked list of choices and the site attempts to give everyone what they want */
  RankedChoice = 'ranked_choice'
}

export type SignupChange = {
  __typename: 'SignupChange';
  action: SignupChangeAction;
  bucket_key?: Maybe<Scalars['String']['output']>;
  counted: Scalars['Boolean']['output'];
  created_at: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  previous_signup_change?: Maybe<SignupChange>;
  run: Run;
  signup: Signup;
  state: SignupState;
  updated_at: Scalars['Date']['output'];
  user_con_profile: UserConProfile;
};

/** The action taken that caused a signup to change. */
export enum SignupChangeAction {
  AcceptSignupRankedChoice = 'accept_signup_ranked_choice',
  AcceptSignupRequest = 'accept_signup_request',
  AdminCreateSignup = 'admin_create_signup',
  ChangeRegistrationPolicy = 'change_registration_policy',
  FreezeBucketAssignments = 'freeze_bucket_assignments',
  HoldExpired = 'hold_expired',
  SelfServiceSignup = 'self_service_signup',
  TicketPurchase = 'ticket_purchase',
  Unknown = 'unknown',
  VacancyFill = 'vacancy_fill',
  Withdraw = 'withdraw'
}

export type SignupChangeFiltersInput = {
  action?: InputMaybe<Array<Scalars['String']['input']>>;
  event_title?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type SignupChangesPagination = PaginationInterface & {
  __typename: 'SignupChangesPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<SignupChange>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

export type SignupCountByState = {
  __typename: 'SignupCountByState';
  count: Scalars['Int']['output'];
  state: SignupState;
};

export type SignupFiltersInput = {
  bucket?: InputMaybe<Array<Scalars['String']['input']>>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum SignupMode {
  /** Attendees can request signups and signup changes but con staff must approve them */
  Moderated = 'moderated',
  /** Attendees can sign themselves up for events */
  SelfService = 'self_service'
}

export type SignupMoveResult = {
  __typename: 'SignupMoveResult';
  bucket_key?: Maybe<Scalars['String']['output']>;
  prev_bucket_key?: Maybe<Scalars['String']['output']>;
  prev_state: SignupState;
  signup: Signup;
  signup_id: Scalars['Int']['output'];
  state: SignupState;
};

/**
 * In a ranked-choice signup convention, SignupRankedChoices are the items in a user's signup queue.  Users may have
 * as many of these as they like.  When SignupRounds open, Intercode will automatically attempt to sign users up for
 * the number of events they're allowed at this time based on their SignupRankedChoices.
 */
export type SignupRankedChoice = {
  __typename: 'SignupRankedChoice';
  /** The time this choice was added to the user's queue */
  created_at: Scalars['Date']['output'];
  /** The ID of this SignupRankedChoice */
  id: Scalars['ID']['output'];
  /**
   * If true, this ranked choice will prioritize itself even if the event is full (and therefore the attendee would
   * end up on the waitlist)
   */
  prioritize_waitlist: Scalars['Boolean']['output'];
  /** The priority of this choice (lower numbers are higher priority) */
  priority: Scalars['Int']['output'];
  /** All the automated decisions that have been made about this choice */
  ranked_choice_decisions: Array<RankedChoiceDecision>;
  /** The bucket that this choice is trying to sign up in (or null, if it's a no-preference signup) */
  requested_bucket_key?: Maybe<Scalars['String']['output']>;
  /** The resulting Signup from processing this choice, if it has been processed */
  result_signup?: Maybe<Signup>;
  /**
   * The resulting SignupRequest from processing this choice, if it has been processed (and is in a moderated-signup
   * convention)
   */
  result_signup_request?: Maybe<SignupRequest>;
  /** If this choice would be skipped if executed now, the reason why.  If it wouldn't, null. */
  simulated_skip_reason?: Maybe<SimulatedSkipReason>;
  /** The current processing state of this choice (e.g. pending, accepted) */
  state: SignupRankedChoiceState;
  /** The event run that this choice is trying to sign up for */
  target_run: Run;
  /** The last time this choice was modified */
  updated_at: Scalars['Date']['output'];
  /** The user who last updated this choice */
  updated_by: User;
  /** The user whose queue this choice is part of */
  user_con_profile: UserConProfile;
};

/** The processing state of a SignupRankedChoice */
export enum SignupRankedChoiceState {
  /** We have not yet attempted to process this choice */
  Pending = 'pending',
  /** The attendee has had a signup request put in (see the result_signup_request field for the actual signup request) */
  Requested = 'requested',
  /** The attendee has been signed up (see the result_signup field for the actual signup) */
  SignedUp = 'signed_up',
  /** The attendee has been waitlisted (see the result_signup field for the actual signup) */
  Waitlisted = 'waitlisted'
}

/**
 * In a moderated-signup convention, SignupRequests are the queue of signups that users have asked to do.  Convention
 * staff can go through these requests and accept them (which produces a Signup) or reject them.
 */
export type SignupRequest = {
  __typename: 'SignupRequest';
  /** The time this request was put in */
  created_at: Scalars['Date']['output'];
  /** The ID of this SignupRequest */
  id: Scalars['ID']['output'];
  /**
   * The signup that this request is asking to replace (e.g. if the user is trying to leave a conflicting event).  If
   * this request is accepted, the replace_signup will be withdrawn.
   */
  replace_signup?: Maybe<Signup>;
  /** The bucket that this request is asking to sign up in (or null, if it's a no-preference signup) */
  requested_bucket_key?: Maybe<Scalars['String']['output']>;
  /** The resulting Signup from accepting this request, if it has been accepted */
  result_signup?: Maybe<Signup>;
  /** The SignupRankedChoice this request resulted from, if any */
  signup_ranked_choice?: Maybe<SignupRankedChoice>;
  /** The current processing state of this request (e.g. pending, accepted, rejected) */
  state: SignupRequestState;
  /** The run the user would like to sign up for */
  target_run: Run;
  /** The last time this request was modified */
  updated_at: Scalars['Date']['output'];
  /** The last user who modified this request */
  updated_by: User;
  /** The user who made this request */
  user_con_profile: UserConProfile;
};

export type SignupRequestFiltersInput = {
  state?: InputMaybe<Array<SignupRequestState>>;
};

/** The processing state of a SignupRequest */
export enum SignupRequestState {
  /** The request has been accepted and the requester has been signed up (see the result_signup field for the actual signup) */
  Accepted = 'accepted',
  /** The request has not yet been reviewed by a moderator */
  Pending = 'pending',
  /** The request has been rejected and the requester has not been signed up */
  Rejected = 'rejected',
  /** The requester withdrew their request before it was accepted or rejected */
  Withdrawn = 'withdrawn'
}

export type SignupRequestsPagination = PaginationInterface & {
  __typename: 'SignupRequestsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<SignupRequest>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

/**
 * A round of signups in a particular convention.  This represents a range of time in which a certain number of
 * signups is allowed.
 *
 * In conventions that use automated signups (e.g. ranked-choice signups), signup rounds are used as triggers for
 * signup automation.
 */
export type SignupRound = {
  __typename: 'SignupRound';
  /** The convention this SignupRound is in. */
  convention: Convention;
  /** When this SignupRound was first created. */
  created_at: Scalars['Date']['output'];
  /**
   * In conventions that use automated signups, when this SignupRound was executed.  If it has not been executed yet,
   * this will be null.
   */
  executed_at?: Maybe<Scalars['Date']['output']>;
  /** The ID of this SignupRound. */
  id: Scalars['ID']['output'];
  /**
   * Either "not_yet", "not_now", "unlimited", or a string representation of a number.  This is the maximum number of
   * signups allowed during this SignupRound.
   */
  maximum_event_signups: Scalars['String']['output'];
  ranked_choice_decisions_paginated: RankedChoiceDecisionsPagination;
  /** In ranked-choice signup conventions, the order to use for executing users' ranked choices in this round. */
  ranked_choice_order?: Maybe<RankedChoiceOrder>;
  /** When this SignupRound starts. */
  start?: Maybe<Scalars['Date']['output']>;
  /** When this SignupRound was last modified. */
  updated_at: Scalars['Date']['output'];
};


/**
 * A round of signups in a particular convention.  This represents a range of time in which a certain number of
 * signups is allowed.
 *
 * In conventions that use automated signups (e.g. ranked-choice signups), signup rounds are used as triggers for
 * signup automation.
 */
export type SignupRoundRanked_Choice_Decisions_PaginatedArgs = {
  filters?: InputMaybe<RankedChoiceDecisionFiltersInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  per_page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
};

/** An input for creating or modifying SignupRounds. */
export type SignupRoundInput = {
  /** The maximum number of signups allowed during this signup round */
  maximum_event_signups?: InputMaybe<Scalars['String']['input']>;
  /** For ranked-choice conventions, the order to execute signup choices in */
  ranked_choice_order?: InputMaybe<RankedChoiceOrder>;
  /** The time that this signup round starts */
  start?: InputMaybe<Scalars['Date']['input']>;
};

export enum SignupState {
  /** Attendee's spot is confirmed */
  Confirmed = 'confirmed',
  /** Attendee's spot is held temporarily while the attendee finishes paying for their ticket */
  TicketPurchaseHold = 'ticket_purchase_hold',
  /** Attendee is on the waitlist for this event and may be pulled in automatically */
  Waitlisted = 'waitlisted',
  /** Attendee has withdrawn from this event (and this signup is no longer valid) */
  Withdrawn = 'withdrawn'
}

export type SignupsPagination = PaginationInterface & {
  __typename: 'SignupsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<Signup>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

/** If a SignupRankedChoice would be skipped if executed now, the reason why it would be skipped. */
export type SimulatedSkipReason = {
  __typename: 'SimulatedSkipReason';
  /** Any additional data the attached to this skip. */
  extra: Scalars['JSON']['output'];
  /** The reason this choice would be skipped, if any. */
  reason: RankedChoiceDecisionReason;
};

export enum SiteMode {
  /** Site behaves as a convention with multiple events */
  Convention = 'convention',
  /** Site behaves as a series of standalone events */
  EventSeries = 'event_series',
  /** Site behaves as a single standalone event */
  SingleEvent = 'single_event'
}

/** Autogenerated input type of SortCmsNavigationItems */
export type SortCmsNavigationItemsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  sort_items: Array<UpdateCmsNavigationItemInput>;
};

/** Autogenerated return type of SortCmsNavigationItems. */
export type SortCmsNavigationItemsPayload = {
  __typename: 'SortCmsNavigationItemsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  navigation_items: Array<CmsNavigationItem>;
};

/**
 * A description of a field to sort a result set by. This is typically used in pagination
 * fields to specify how the results should be ordered.
 */
export type SortInput = {
  /**
   * If true, the field will be sorted in descending order. If false, it will be sorted in
   * ascending order.
   */
  desc: Scalars['Boolean']['input'];
  /** The name of the field to sort by. */
  field: Scalars['String']['input'];
};

export type StaffPosition = {
  __typename: 'StaffPosition';
  cc_addresses: Array<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  email_aliases: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Permission>;
  user_con_profiles: Array<UserConProfile>;
  visible?: Maybe<Scalars['Boolean']['output']>;
};

export type StaffPositionInput = {
  cc_addresses?: InputMaybe<Array<Scalars['String']['input']>>;
  email?: InputMaybe<Scalars['String']['input']>;
  email_aliases?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  userConProfileIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type StripeAccount = {
  __typename: 'StripeAccount';
  account_onboarding_link: Scalars['String']['output'];
  charges_enabled: Scalars['Boolean']['output'];
  display_name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};


export type StripeAccountAccount_Onboarding_LinkArgs = {
  base_url: Scalars['String']['input'];
};

/** Autogenerated input type of SubmitEventProposal */
export type SubmitEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of SubmitEventProposal. */
export type SubmitEventProposalPayload = {
  __typename: 'SubmitEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of SubmitOrder */
export type SubmitOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the order to submit. */
  id?: InputMaybe<Scalars['ID']['input']>;
  /** The ID of the Stripe PaymentIntent to use for payment, if applicable. */
  payment_intent_id?: InputMaybe<Scalars['String']['input']>;
  /** The payment mode to use for submitting this order. */
  payment_mode: PaymentMode;
};

/** Autogenerated return type of SubmitOrder. */
export type SubmitOrderPayload = {
  __typename: 'SubmitOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The order after successful submission. */
  order: Order;
};

export type TeamMember = {
  __typename: 'TeamMember';
  display_team_member: Scalars['Boolean']['output'];
  email?: Maybe<Scalars['String']['output']>;
  event: Event;
  id: Scalars['ID']['output'];
  receive_con_email: Scalars['Boolean']['output'];
  receive_signup_email: ReceiveSignupEmail;
  show_email: Scalars['Boolean']['output'];
  user_con_profile: UserConProfile;
};

export type TeamMemberInput = {
  display_team_member?: InputMaybe<Scalars['Boolean']['input']>;
  receive_con_email?: InputMaybe<Scalars['Boolean']['input']>;
  receive_signup_email?: InputMaybe<ReceiveSignupEmail>;
  show_email?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Ticket = {
  __typename: 'Ticket';
  convention: Convention;
  created_at: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  order_entry?: Maybe<OrderEntry>;
  provided_by_event?: Maybe<Event>;
  run?: Maybe<Run>;
  ticket_type: TicketType;
  updated_at: Scalars['Date']['output'];
  user_con_profile: UserConProfile;
};

export type TicketCountByTypeAndPaymentAmount = {
  __typename: 'TicketCountByTypeAndPaymentAmount';
  count: Scalars['Int']['output'];
  payment_amount: Money;
  ticket_type: TicketType;
};

export type TicketInput = {
  providedByEventId?: InputMaybe<Scalars['ID']['input']>;
  ticketTypeId?: InputMaybe<Scalars['ID']['input']>;
};

export enum TicketMode {
  /** Tickets are neither sold nor required in this convention */
  Disabled = 'disabled',
  /** A valid ticket is required to sign up for events in this convention */
  RequiredForSignup = 'required_for_signup',
  /** Each event in this convention sells tickets separately */
  TicketPerEvent = 'ticket_per_event'
}

export type TicketType = {
  __typename: 'TicketType';
  allows_event_signups: Scalars['Boolean']['output'];
  convention?: Maybe<Convention>;
  counts_towards_convention_maximum: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  event?: Maybe<Event>;
  id: Scalars['ID']['output'];
  maximum_event_provided_tickets: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  parent: TicketTypeParent;
  providing_products: Array<Product>;
};


export type TicketTypeMaximum_Event_Provided_TicketsArgs = {
  eventId?: InputMaybe<Scalars['ID']['input']>;
};

export type TicketTypeInput = {
  allows_event_signups?: InputMaybe<Scalars['Boolean']['input']>;
  counts_towards_convention_maximum?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  maximum_event_provided_tickets?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pricing_schedule?: InputMaybe<ScheduledMoneyValueInput>;
  publicly_available?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TicketTypeParent = Convention | Event;

export type TimespanWithMoneyValue = {
  __typename: 'TimespanWithMoneyValue';
  finish?: Maybe<Scalars['Date']['output']>;
  start?: Maybe<Scalars['Date']['output']>;
  value: Money;
};

export type TimespanWithMoneyValueInput = {
  finish?: InputMaybe<Scalars['Date']['input']>;
  start?: InputMaybe<Scalars['Date']['input']>;
  value: MoneyInput;
};

export type TimespanWithValue = {
  __typename: 'TimespanWithValue';
  finish?: Maybe<Scalars['Date']['output']>;
  start?: Maybe<Scalars['Date']['output']>;
  value: Scalars['String']['output'];
};

export type TimespanWithValueInput = {
  finish?: InputMaybe<Scalars['Date']['input']>;
  start?: InputMaybe<Scalars['Date']['input']>;
  string_value?: InputMaybe<Scalars['String']['input']>;
};

export enum TimezoneMode {
  /** Display dates and times using convention’s local time zone */
  ConventionLocal = 'convention_local',
  /** Display dates and times using user’s local time zone */
  UserLocal = 'user_local'
}

/** Autogenerated input type of TransitionEventProposal */
export type TransitionEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  drop_event?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  status: Scalars['String']['input'];
};

/** Autogenerated return type of TransitionEventProposal. */
export type TransitionEventProposalPayload = {
  __typename: 'TransitionEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of UpdateCmsContentGroup */
export type UpdateCmsContentGroupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cms_content_group: CmsContentGroupInput;
  grant_permissions?: InputMaybe<Array<PermissionInput>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  revoke_permissions?: InputMaybe<Array<PermissionInput>>;
};

/** Autogenerated return type of UpdateCmsContentGroup. */
export type UpdateCmsContentGroupPayload = {
  __typename: 'UpdateCmsContentGroupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_content_group: CmsContentGroup;
};

/** Autogenerated input type of UpdateCmsGraphqlQuery */
export type UpdateCmsGraphqlQueryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  query: CmsGraphqlQueryInput;
};

/** Autogenerated return type of UpdateCmsGraphqlQuery. */
export type UpdateCmsGraphqlQueryPayload = {
  __typename: 'UpdateCmsGraphqlQueryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  query: CmsGraphqlQuery;
};

/** Autogenerated input type of UpdateCmsLayout */
export type UpdateCmsLayoutInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cms_layout: CmsLayoutInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateCmsLayout. */
export type UpdateCmsLayoutPayload = {
  __typename: 'UpdateCmsLayoutPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_layout: CmsLayout;
};

/** Autogenerated input type of UpdateCmsNavigationItem */
export type UpdateCmsNavigationItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cms_navigation_item?: InputMaybe<CmsNavigationItemInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateCmsNavigationItem. */
export type UpdateCmsNavigationItemPayload = {
  __typename: 'UpdateCmsNavigationItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_navigation_item: CmsNavigationItem;
};

/** Autogenerated input type of UpdateCmsPartial */
export type UpdateCmsPartialInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cms_partial: CmsPartialInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateCmsPartial. */
export type UpdateCmsPartialPayload = {
  __typename: 'UpdateCmsPartialPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  cms_partial: CmsPartial;
};

/** Autogenerated input type of UpdateConvention */
export type UpdateConventionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  convention: ConventionInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateConvention. */
export type UpdateConventionPayload = {
  __typename: 'UpdateConventionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  convention: Convention;
};

/** Autogenerated input type of UpdateCoupon */
export type UpdateCouponInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  coupon: CouponInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateCoupon. */
export type UpdateCouponPayload = {
  __typename: 'UpdateCouponPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  coupon: Coupon;
};

/** Autogenerated input type of UpdateDepartment */
export type UpdateDepartmentInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  department: DepartmentInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateDepartment. */
export type UpdateDepartmentPayload = {
  __typename: 'UpdateDepartmentPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  department: Department;
};

/** Autogenerated input type of UpdateEmailRoute */
export type UpdateEmailRouteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  email_route: EmailRouteInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateEmailRoute. */
export type UpdateEmailRoutePayload = {
  __typename: 'UpdateEmailRoutePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  email_route: EmailRoute;
};

/** Autogenerated input type of UpdateEventAdminNotes */
export type UpdateEventAdminNotesInput = {
  admin_notes: Scalars['String']['input'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateEventAdminNotes. */
export type UpdateEventAdminNotesPayload = {
  __typename: 'UpdateEventAdminNotesPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event: Event;
};

/** Autogenerated input type of UpdateEventCategory */
export type UpdateEventCategoryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  event_category: EventCategoryInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateEventCategory. */
export type UpdateEventCategoryPayload = {
  __typename: 'UpdateEventCategoryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event_category: EventCategory;
};

/** Autogenerated input type of UpdateEvent */
export type UpdateEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  event?: InputMaybe<EventInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateEvent. */
export type UpdateEventPayload = {
  __typename: 'UpdateEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event: Event;
};

/** Autogenerated input type of UpdateEventProposalAdminNotes */
export type UpdateEventProposalAdminNotesInput = {
  admin_notes: Scalars['String']['input'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateEventProposalAdminNotes. */
export type UpdateEventProposalAdminNotesPayload = {
  __typename: 'UpdateEventProposalAdminNotesPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of UpdateEventProposal */
export type UpdateEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  event_proposal: EventProposalInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateEventProposal. */
export type UpdateEventProposalPayload = {
  __typename: 'UpdateEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of UpdateForm */
export type UpdateFormInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  form: FormInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated input type of UpdateFormItem */
export type UpdateFormItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  form_item: FormItemInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateFormItem. */
export type UpdateFormItemPayload = {
  __typename: 'UpdateFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  form_item: FormItem;
};

/** Autogenerated return type of UpdateForm. */
export type UpdateFormPayload = {
  __typename: 'UpdateFormPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  form: Form;
};

/** Autogenerated input type of UpdateFormSection */
export type UpdateFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  form_section: FormSectionInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateFormSection. */
export type UpdateFormSectionPayload = {
  __typename: 'UpdateFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  form_section: FormSection;
};

/** Autogenerated input type of UpdateFormWithJSON */
export type UpdateFormWithJsonInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  form_json: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateFormWithJSON. */
export type UpdateFormWithJsonPayload = {
  __typename: 'UpdateFormWithJSONPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  form: Form;
};

/** Autogenerated input type of UpdateMaximumEventProvidedTicketsOverride */
export type UpdateMaximumEventProvidedTicketsOverrideInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  override_value: Scalars['Int']['input'];
};

/** Autogenerated return type of UpdateMaximumEventProvidedTicketsOverride. */
export type UpdateMaximumEventProvidedTicketsOverridePayload = {
  __typename: 'UpdateMaximumEventProvidedTicketsOverridePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  maximum_event_provided_tickets_override: MaximumEventProvidedTicketsOverride;
};

/** Autogenerated input type of UpdateNotificationTemplate */
export type UpdateNotificationTemplateInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  event_key: Scalars['String']['input'];
  notification_template: NotificationTemplateInput;
};

/** Autogenerated return type of UpdateNotificationTemplate. */
export type UpdateNotificationTemplatePayload = {
  __typename: 'UpdateNotificationTemplatePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  notification_template: NotificationTemplate;
};

/** Autogenerated input type of UpdateOrderEntry */
export type UpdateOrderEntryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  order_entry: OrderEntryInput;
};

/** Autogenerated return type of UpdateOrderEntry. */
export type UpdateOrderEntryPayload = {
  __typename: 'UpdateOrderEntryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order_entry: OrderEntry;
};

/** Autogenerated input type of UpdateOrder */
export type UpdateOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  order: OrderInput;
};

/** Autogenerated return type of UpdateOrder. */
export type UpdateOrderPayload = {
  __typename: 'UpdateOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  order: Order;
};

/** Autogenerated input type of UpdateOrganizationRole */
export type UpdateOrganizationRoleInput = {
  addUserIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  add_permissions?: InputMaybe<Array<PermissionInput>>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  organization_role: OrganizationRoleInput;
  removePermissionIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  removeUserIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** Autogenerated return type of UpdateOrganizationRole. */
export type UpdateOrganizationRolePayload = {
  __typename: 'UpdateOrganizationRolePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  organization_role: OrganizationRole;
};

/** Autogenerated input type of UpdatePage */
export type UpdatePageInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  page: PageInput;
};

/** Autogenerated return type of UpdatePage. */
export type UpdatePagePayload = {
  __typename: 'UpdatePagePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  page: Page;
};

/** Autogenerated input type of UpdateProduct */
export type UpdateProductInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  product: ProductInput;
};

/** Autogenerated return type of UpdateProduct. */
export type UpdateProductPayload = {
  __typename: 'UpdateProductPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  product: Product;
};

/** Autogenerated input type of UpdateRankedChoiceUserConstraint */
export type UpdateRankedChoiceUserConstraintInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the constraint to update. */
  id: Scalars['ID']['input'];
  /** The updated values to use for this constraint. */
  rankedChoiceUserConstraint: RankedChoiceUserConstraintInput;
};

/** Autogenerated return type of UpdateRankedChoiceUserConstraint. */
export type UpdateRankedChoiceUserConstraintPayload = {
  __typename: 'UpdateRankedChoiceUserConstraintPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The constraint after being updated. */
  ranked_choice_user_constraint: RankedChoiceUserConstraint;
};

/** Autogenerated input type of UpdateRoom */
export type UpdateRoomInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  room: RoomInput;
};

/** Autogenerated return type of UpdateRoom. */
export type UpdateRoomPayload = {
  __typename: 'UpdateRoomPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  room: Room;
};

/** Autogenerated input type of UpdateRootSite */
export type UpdateRootSiteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  root_site: RootSiteInput;
};

/** Autogenerated return type of UpdateRootSite. */
export type UpdateRootSitePayload = {
  __typename: 'UpdateRootSitePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  root_site: RootSite;
};

/** Autogenerated input type of UpdateRun */
export type UpdateRunInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  run: RunInput;
};

/** Autogenerated return type of UpdateRun. */
export type UpdateRunPayload = {
  __typename: 'UpdateRunPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  run: Run;
};

/** Autogenerated input type of UpdateSignupBucket */
export type UpdateSignupBucketInput = {
  bucket_key: Scalars['String']['input'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateSignupBucket. */
export type UpdateSignupBucketPayload = {
  __typename: 'UpdateSignupBucketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  signup: Signup;
};

/** Autogenerated input type of UpdateSignupCounted */
export type UpdateSignupCountedInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  counted: Scalars['Boolean']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateSignupCounted. */
export type UpdateSignupCountedPayload = {
  __typename: 'UpdateSignupCountedPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  signup: Signup;
};

/** Autogenerated input type of UpdateSignupRankedChoicePriority */
export type UpdateSignupRankedChoicePriorityInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the SignupRankedChoice to update */
  id: Scalars['ID']['input'];
  /** The new priority to set the SignupRankedChoice to */
  priority: Scalars['Int']['input'];
};

/** Autogenerated return type of UpdateSignupRankedChoicePriority. */
export type UpdateSignupRankedChoicePriorityPayload = {
  __typename: 'UpdateSignupRankedChoicePriorityPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The SignupRankedChoice that has just been reprioritized */
  signup_ranked_choice: SignupRankedChoice;
};

/** Autogenerated input type of UpdateSignupRound */
export type UpdateSignupRoundInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the SignupRound to update */
  id: Scalars['ID']['input'];
  /** The new data to write to the SignupRound */
  signupRound: SignupRoundInput;
};

/** Autogenerated return type of UpdateSignupRound. */
export type UpdateSignupRoundPayload = {
  __typename: 'UpdateSignupRoundPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The SignupRound that has just been reprioritized */
  signup_round: SignupRound;
};

/** Autogenerated input type of UpdateStaffPosition */
export type UpdateStaffPositionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  staff_position: StaffPositionInput;
};

/** Autogenerated return type of UpdateStaffPosition. */
export type UpdateStaffPositionPayload = {
  __typename: 'UpdateStaffPositionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of UpdateStaffPositionPermissions */
export type UpdateStaffPositionPermissionsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  grant_permissions: Array<PermissionInput>;
  revoke_permissions: Array<PermissionInput>;
  staffPositionId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of UpdateStaffPositionPermissions. */
export type UpdateStaffPositionPermissionsPayload = {
  __typename: 'UpdateStaffPositionPermissionsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of UpdateTeamMember */
export type UpdateTeamMemberInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  team_member: TeamMemberInput;
};

/** Autogenerated return type of UpdateTeamMember. */
export type UpdateTeamMemberPayload = {
  __typename: 'UpdateTeamMemberPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  team_member: TeamMember;
};

/** Autogenerated input type of UpdateTicket */
export type UpdateTicketInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ticket: TicketInput;
};

/** Autogenerated return type of UpdateTicket. */
export type UpdateTicketPayload = {
  __typename: 'UpdateTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  ticket: Ticket;
};

/** Autogenerated input type of UpdateTicketType */
export type UpdateTicketTypeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ticket_type: TicketTypeInput;
};

/** Autogenerated return type of UpdateTicketType. */
export type UpdateTicketTypePayload = {
  __typename: 'UpdateTicketTypePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  ticket_type: TicketType;
};

/** Autogenerated input type of UpdateUserActivityAlert */
export type UpdateUserActivityAlertInput = {
  add_notification_destinations: Array<NotificationDestinationInput>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  removeNotificationDestinationIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  user_activity_alert: UserActivityAlertInput;
};

/** Autogenerated return type of UpdateUserActivityAlert. */
export type UpdateUserActivityAlertPayload = {
  __typename: 'UpdateUserActivityAlertPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user_activity_alert: UserActivityAlert;
};

/** Autogenerated input type of UpdateUserConProfile */
export type UpdateUserConProfileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  user_con_profile: UserConProfileInput;
};

/** Autogenerated return type of UpdateUserConProfile. */
export type UpdateUserConProfilePayload = {
  __typename: 'UpdateUserConProfilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user_con_profile: UserConProfile;
};

export type User = {
  __typename: 'User';
  email?: Maybe<Scalars['String']['output']>;
  event_proposals: Array<EventProposal>;
  first_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  name_inverted?: Maybe<Scalars['String']['output']>;
  privileges?: Maybe<Array<Scalars['String']['output']>>;
  user_con_profiles: Array<UserConProfile>;
};

export type UserActivityAlert = {
  __typename: 'UserActivityAlert';
  convention: Convention;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notification_destinations: Array<NotificationDestination>;
  partial_name?: Maybe<Scalars['String']['output']>;
  trigger_on_ticket_create: Scalars['Boolean']['output'];
  trigger_on_user_con_profile_create: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type UserActivityAlertInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  partial_name?: InputMaybe<Scalars['String']['input']>;
  trigger_on_ticket_create?: InputMaybe<Scalars['Boolean']['input']>;
  trigger_on_user_con_profile_create?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

/**
 * A UserConProfile is a user's profile in a particular convention web site.  Most convention-level objects are
 * attached to the UserConProfile (e.g. signups, event team memberships, staff positions, etc.).
 */
export type UserConProfile = {
  __typename: 'UserConProfile';
  /** This user profile's permission set. */
  ability?: Maybe<Ability>;
  /** Has this user accepted the clickwrap agreement for this convention (if it has one)? */
  accepted_clickwrap_agreement?: Maybe<Scalars['Boolean']['output']>;
  /** The street address portion of this profile's mailing address. */
  address?: Maybe<Scalars['String']['output']>;
  /** The bio to display for this user profile, in Markdown format. */
  bio?: Maybe<Scalars['String']['output']>;
  /** The bio to display for this user profile, rendered as HTML. */
  bio_html?: Maybe<Scalars['String']['output']>;
  /** If present, overrides the name to use for this user profile in their bio display. */
  bio_name?: Maybe<Scalars['String']['output']>;
  /** This user profile's date of birth. */
  birth_date?: Maybe<Scalars['Date']['output']>;
  /**
   * Is this user allowed to display a bio on the web site (e.g. because they're a convention staff member or an
   * event team member)?
   */
  can_have_bio: Scalars['Boolean']['output'];
  /** Does this user have permission to override the event-provided ticket thresholds in this convention? */
  can_override_maximum_event_provided_tickets: Scalars['Boolean']['output'];
  /** The city portion of this profile's mailing address. */
  city?: Maybe<Scalars['String']['output']>;
  /** The convention this profile is attached to. */
  convention: Convention;
  /** The country portion of this profile's mailing address. */
  country?: Maybe<Scalars['String']['output']>;
  /** If this profile has a pending order, returns that order. Otherwise, returns null. */
  current_pending_order?: Maybe<Order>;
  current_user_form_item_viewer_role: FormItemRole;
  current_user_form_item_writer_role: FormItemRole;
  /** This user profile's email address. */
  email?: Maybe<Scalars['String']['output']>;
  /** This user profile's first name. */
  first_name: Scalars['String']['output'];
  form_response_attrs_json?: Maybe<Scalars['Json']['output']>;
  form_response_attrs_json_with_rendered_markdown?: Maybe<Scalars['Json']['output']>;
  /** Has this user enabled Gravatars for this profile? */
  gravatar_enabled: Scalars['Boolean']['output'];
  /** The URL of this profile's Gravatar. */
  gravatar_url: Scalars['String']['output'];
  /** The randomly-generated secret portion of the URL to use for fetching this profile's personal calendar. */
  ical_secret?: Maybe<Scalars['String']['output']>;
  /** The ID of this profile. */
  id: Scalars['ID']['output'];
  /** This user profile's last name. */
  last_name: Scalars['String']['output'];
  /** This profile's mobile phone number. */
  mobile_phone?: Maybe<Scalars['String']['output']>;
  /** This user profile's full name, including their nickname if present. */
  name: Scalars['String']['output'];
  /** This user profile's name in Last, First format. */
  name_inverted: Scalars['String']['output'];
  /** This user profile's full name, not including their nickname. */
  name_without_nickname: Scalars['String']['output'];
  /** This user profile's nickname. */
  nickname?: Maybe<Scalars['String']['output']>;
  /** A human-readable summary of all this profile's orders. */
  order_summary: Scalars['String']['output'];
  /** All the orders placed by this profile. */
  orders: Array<Order>;
  /** If this user can't be signed up for any of their ranked choices, should the site waitlist them? */
  ranked_choice_allow_waitlist: Scalars['Boolean']['output'];
  /** All the constraints this profile has placed on the number of ranked choice signups they want. */
  ranked_choice_user_constraints: Array<RankedChoiceUserConstraint>;
  /** Should this profile's bio use the nickname as part of their name? */
  show_nickname_in_bio?: Maybe<Scalars['Boolean']['output']>;
  /** The current constraints on signups for this user at this convention. */
  signup_constraints: UserSignupConstraints;
  /** This user's ranked choice list for signups. */
  signup_ranked_choices: Array<SignupRankedChoice>;
  /** All the signup requests made by this profile. */
  signup_requests: Array<SignupRequest>;
  /** All the event signups attached to this profile. */
  signups: Array<Signup>;
  /** Does this profile belong to a global site admin? */
  site_admin: Scalars['Boolean']['output'];
  /** All the staff positions this profile belongs to. */
  staff_positions: Array<StaffPosition>;
  /** The state portion of this profile's mailing address. */
  state?: Maybe<Scalars['String']['output']>;
  /** All the team memberships this profile is in. */
  team_members: Array<TeamMember>;
  /** This profile's convention ticket, if present. */
  ticket?: Maybe<Ticket>;
  /** The user account attached to this profile. */
  user?: Maybe<User>;
  /**
   * The ID of the user account this profile belongs to.
   *
   * This is a little bit of a weird thing to expose here; normally we'd just have people query for
   * User, but access to that object is restricted.  So if you need the user ID (e.g. to determine whether two profiles
   * are the same person) but you don't necessarily have access to the User account, you can use this field.
   */
  user_id: Scalars['ID']['output'];
  /** The ZIP portion of this profile's mailing address. */
  zipcode?: Maybe<Scalars['String']['output']>;
};


/**
 * A UserConProfile is a user's profile in a particular convention web site.  Most convention-level objects are
 * attached to the UserConProfile (e.g. signups, event team memberships, staff positions, etc.).
 */
export type UserConProfileForm_Response_Attrs_JsonArgs = {
  itemIdentifiers?: InputMaybe<Array<Scalars['String']['input']>>;
};


/**
 * A UserConProfile is a user's profile in a particular convention web site.  Most convention-level objects are
 * attached to the UserConProfile (e.g. signups, event team memberships, staff positions, etc.).
 */
export type UserConProfileForm_Response_Attrs_Json_With_Rendered_MarkdownArgs = {
  itemIdentifiers?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UserConProfileFiltersInput = {
  attending?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  is_team_member?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  payment_amount?: InputMaybe<Scalars['Float']['input']>;
  /** DEPRECATED. Privileges are deprecated in favor of permissions and staff positions */
  privileges?: InputMaybe<Array<Scalars['String']['input']>>;
  ticket?: InputMaybe<Array<Scalars['String']['input']>>;
  ticket_type?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** An input for creating or modifying UserConProfiles. */
export type UserConProfileInput = {
  /** The street address portion of this profile's mailing address. */
  address?: InputMaybe<Scalars['String']['input']>;
  /** The time this user profile prefers to be called on the phone. */
  best_call_time?: InputMaybe<Scalars['String']['input']>;
  /** The bio to display for this user profile, in Markdown format. */
  bio?: InputMaybe<Scalars['String']['input']>;
  /** This user profile's date of birth. */
  birth_date?: InputMaybe<Scalars['Date']['input']>;
  /** The city portion of this profile's mailing address. */
  city?: InputMaybe<Scalars['String']['input']>;
  /** The country portion of this profile's mailing address. */
  country?: InputMaybe<Scalars['String']['input']>;
  /** This user profile's daytime phone number. */
  day_phone?: InputMaybe<Scalars['String']['input']>;
  /** This user profile's evening phone number. */
  evening_phone?: InputMaybe<Scalars['String']['input']>;
  /** This user profile's first name. */
  first_name?: InputMaybe<Scalars['String']['input']>;
  /**
   * An object in JSON format, where the keys are form fields on the UserConProfile form for this convention and the
   * values are the appropriate values to be set on those fields for this user profile.
   */
  form_response_attrs_json?: InputMaybe<Scalars['String']['input']>;
  /** Has this user enabled Gravatars for this profile? */
  gravatar_enabled?: InputMaybe<Scalars['Boolean']['input']>;
  /** This user profile's last name. */
  last_name?: InputMaybe<Scalars['String']['input']>;
  /** This user profile's nickname. */
  nickname?: InputMaybe<Scalars['String']['input']>;
  /** The method by which this user profile prefers the convention contact them. */
  preferred_contact?: InputMaybe<Scalars['String']['input']>;
  /** If this user can't be signed up for any of their ranked choices, should the site waitlist them? */
  ranked_choice_allow_waitlist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Should this profile's bio use the nickname as part of their name? */
  show_nickname_in_bio?: InputMaybe<Scalars['Boolean']['input']>;
  /** The state portion of this profile's mailing address. */
  state?: InputMaybe<Scalars['String']['input']>;
  /** The ZIP portion of this profile's mailing address. */
  zipcode?: InputMaybe<Scalars['String']['input']>;
};

export type UserConProfilesPagination = PaginationInterface & {
  __typename: 'UserConProfilesPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<UserConProfile>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

export type UserFiltersInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  privileges?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** The signup constraints on a user for a particular convention. */
export type UserSignupConstraints = {
  __typename: 'UserSignupConstraints';
  /** Is this user currently at their maximum allowed signups? */
  at_maximum_signups: Scalars['Boolean']['output'];
  /** The current number of counted signups for this user. */
  current_signup_count: Scalars['Int']['output'];
  /** The user profile these constraints describe. */
  user_con_profile: UserConProfile;
};

export type UsersPagination = PaginationInterface & {
  __typename: 'UsersPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int']['output'];
  entries: Array<User>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int']['output'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int']['output'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int']['output'];
};

export type WinningUserConProfileInput = {
  conventionId?: InputMaybe<Scalars['ID']['input']>;
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated input type of WithdrawAllUserConProfileSignups */
export type WithdrawAllUserConProfileSignupsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of WithdrawAllUserConProfileSignups. */
export type WithdrawAllUserConProfileSignupsPayload = {
  __typename: 'WithdrawAllUserConProfileSignupsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  user_con_profile: UserConProfile;
};

/** Autogenerated input type of WithdrawMySignup */
export type WithdrawMySignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of WithdrawMySignup. */
export type WithdrawMySignupPayload = {
  __typename: 'WithdrawMySignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  signup: Signup;
};

/** Autogenerated input type of WithdrawSignupRequest */
export type WithdrawSignupRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of WithdrawSignupRequest. */
export type WithdrawSignupRequestPayload = {
  __typename: 'WithdrawSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  signup_request: SignupRequest;
};

/** Autogenerated input type of WithdrawUserSignup */
export type WithdrawUserSignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  runId?: InputMaybe<Scalars['ID']['input']>;
  suppress_confirmation?: InputMaybe<Scalars['Boolean']['input']>;
  suppress_notifications?: InputMaybe<Scalars['Boolean']['input']>;
  userConProfileId?: InputMaybe<Scalars['ID']['input']>;
};

/** Autogenerated return type of WithdrawUserSignup. */
export type WithdrawUserSignupPayload = {
  __typename: 'WithdrawUserSignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  signup: Signup;
};
