/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  /** Date in ISO8601 format */
  Date: string;
  /** An arbitrary object, serialized as JSON */
  Json: string;
  Upload: File;
};

export type Ability = {
  __typename: 'Ability';
  can_become_user_con_profile: Scalars['Boolean'];
  can_create_cms_content_groups: Scalars['Boolean'];
  can_create_cms_files: Scalars['Boolean'];
  can_create_cms_graphql_queries: Scalars['Boolean'];
  can_create_cms_layouts: Scalars['Boolean'];
  can_create_cms_navigation_items: Scalars['Boolean'];
  can_create_cms_partials: Scalars['Boolean'];
  can_create_cms_variables: Scalars['Boolean'];
  can_create_orders: Scalars['Boolean'];
  can_create_pages: Scalars['Boolean'];
  can_create_tickets: Scalars['Boolean'];
  can_create_user_con_profiles: Scalars['Boolean'];
  can_delete_event: Scalars['Boolean'];
  can_delete_event_proposal: Scalars['Boolean'];
  can_delete_ticket: Scalars['Boolean'];
  can_delete_user_con_profile: Scalars['Boolean'];
  can_force_confirm_signup: Scalars['Boolean'];
  can_list_events: Scalars['Boolean'];
  can_manage_any_cms_content: Scalars['Boolean'];
  can_manage_conventions: Scalars['Boolean'];
  can_manage_email_routes: Scalars['Boolean'];
  can_manage_forms: Scalars['Boolean'];
  can_manage_oauth_applications: Scalars['Boolean'];
  can_manage_rooms: Scalars['Boolean'];
  can_manage_runs: Scalars['Boolean'];
  can_manage_signups: Scalars['Boolean'];
  can_manage_staff_positions: Scalars['Boolean'];
  can_manage_ticket_types: Scalars['Boolean'];
  can_override_maximum_event_provided_tickets: Scalars['Boolean'];
  can_read_admin_notes_on_event_proposal: Scalars['Boolean'];
  can_read_any_mailing_list: Scalars['Boolean'];
  can_read_event_proposals: Scalars['Boolean'];
  can_read_event_signups: Scalars['Boolean'];
  can_read_orders: Scalars['Boolean'];
  can_read_organizations: Scalars['Boolean'];
  can_read_reports: Scalars['Boolean'];
  can_read_schedule: Scalars['Boolean'];
  can_read_schedule_with_counts: Scalars['Boolean'];
  can_read_signups: Scalars['Boolean'];
  can_read_user_activity_alerts: Scalars['Boolean'];
  can_read_user_con_profiles: Scalars['Boolean'];
  can_read_users: Scalars['Boolean'];
  can_update_admin_notes_on_event_proposal: Scalars['Boolean'];
  can_update_bucket_signup: Scalars['Boolean'];
  can_update_convention: Scalars['Boolean'];
  can_update_counted_signup: Scalars['Boolean'];
  can_update_departments: Scalars['Boolean'];
  can_update_event: Scalars['Boolean'];
  can_update_event_categories: Scalars['Boolean'];
  can_update_event_proposal: Scalars['Boolean'];
  can_update_notification_templates: Scalars['Boolean'];
  can_update_orders: Scalars['Boolean'];
  can_update_products: Scalars['Boolean'];
  can_update_signup: Scalars['Boolean'];
  can_update_signups: Scalars['Boolean'];
  can_update_ticket: Scalars['Boolean'];
  can_update_user_con_profile: Scalars['Boolean'];
  can_withdraw_all_user_con_profile_signups: Scalars['Boolean'];
};


export type AbilityCan_Become_User_Con_ProfileArgs = {
  userConProfileId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Delete_EventArgs = {
  eventId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Delete_Event_ProposalArgs = {
  eventProposalId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Delete_TicketArgs = {
  ticketId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Delete_User_Con_ProfileArgs = {
  userConProfileId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Force_Confirm_SignupArgs = {
  signupId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Read_Admin_Notes_On_Event_ProposalArgs = {
  eventProposalId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Read_Event_SignupsArgs = {
  eventId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Update_Admin_Notes_On_Event_ProposalArgs = {
  eventProposalId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Update_Bucket_SignupArgs = {
  signupId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Update_Counted_SignupArgs = {
  signupId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Update_EventArgs = {
  eventId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Update_Event_ProposalArgs = {
  eventProposalId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Update_SignupArgs = {
  signupId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Update_TicketArgs = {
  ticketId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Update_User_Con_ProfileArgs = {
  userConProfileId?: InputMaybe<Scalars['ID']>;
};


export type AbilityCan_Withdraw_All_User_Con_Profile_SignupsArgs = {
  userConProfileId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated input type of AcceptClickwrapAgreement */
export type AcceptClickwrapAgreementInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** Autogenerated return type of AcceptClickwrapAgreement */
export type AcceptClickwrapAgreementPayload = {
  __typename: 'AcceptClickwrapAgreementPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  my_profile: UserConProfile;
};

/** Autogenerated input type of AcceptSignupRequest */
export type AcceptSignupRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of AcceptSignupRequest */
export type AcceptSignupRequestPayload = {
  __typename: 'AcceptSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
  signup_request: SignupRequest;
};

export type ActiveStorageAttachment = {
  __typename: 'ActiveStorageAttachment';
  byte_size: Scalars['Int'];
  content_type: Scalars['String'];
  filename: Scalars['String'];
  id: Scalars['ID'];
  resized_url?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};


export type ActiveStorageAttachmentResized_UrlArgs = {
  maxHeight: Scalars['Int'];
  maxWidth: Scalars['Int'];
};

/** Autogenerated input type of AddOrderEntryToCurrentPendingOrder */
export type AddOrderEntryToCurrentPendingOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  order_entry: OrderEntryInput;
};

/** Autogenerated return type of AddOrderEntryToCurrentPendingOrder */
export type AddOrderEntryToCurrentPendingOrderPayload = {
  __typename: 'AddOrderEntryToCurrentPendingOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order_entry: OrderEntry;
};

/** Autogenerated input type of AttachImageToEvent */
export type AttachImageToEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  signedBlobId: Scalars['ID'];
};

/** Autogenerated return type of AttachImageToEvent */
export type AttachImageToEventPayload = {
  __typename: 'AttachImageToEventPayload';
  attachment: ActiveStorageAttachment;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: Event;
};

/** Autogenerated input type of AttachImageToEventProposal */
export type AttachImageToEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  signedBlobId: Scalars['ID'];
};

/** Autogenerated return type of AttachImageToEventProposal */
export type AttachImageToEventProposalPayload = {
  __typename: 'AttachImageToEventProposalPayload';
  attachment: ActiveStorageAttachment;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

export type AuthorizedApplication = {
  __typename: 'AuthorizedApplication';
  name: Scalars['String'];
  scopes: Array<Scalars['String']>;
  uid: Scalars['ID'];
};

/** Autogenerated input type of CancelOrder */
export type CancelOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  skip_refund?: InputMaybe<Scalars['Boolean']>;
};

/** Autogenerated return type of CancelOrder */
export type CancelOrderPayload = {
  __typename: 'CancelOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order: Order;
};

export type ChoiceCount = {
  __typename: 'ChoiceCount';
  choice: Scalars['Int'];
  count: Scalars['Int'];
  state: SignupState;
};

export type CmsContent = CmsLayout | CmsPartial | Page;

export type CmsContentGroup = {
  __typename: 'CmsContentGroup';
  contents: Array<CmsContent>;
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
  permissions: Array<Permission>;
};

export type CmsContentGroupInput = {
  contents?: InputMaybe<Array<CmsContentInput>>;
  name?: InputMaybe<Scalars['String']>;
};

export type CmsContentInput = {
  content_type: CmsContentTypeIndicator;
  id?: InputMaybe<Scalars['ID']>;
};

export enum CmsContentTypeIndicator {
  CmsLayout = 'CmsLayout',
  CmsPartial = 'CmsPartial',
  Page = 'Page'
}

export type CmsFile = {
  __typename: 'CmsFile';
  current_ability_can_delete: Scalars['Boolean'];
  file: ActiveStorageAttachment;
  id: Scalars['ID'];
};

export type CmsGraphqlQuery = {
  __typename: 'CmsGraphqlQuery';
  admin_notes?: Maybe<Scalars['String']>;
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  id: Scalars['ID'];
  identifier: Scalars['String'];
  query: Scalars['String'];
};

export type CmsGraphqlQueryInput = {
  admin_notes?: InputMaybe<Scalars['String']>;
  identifier?: InputMaybe<Scalars['String']>;
  query?: InputMaybe<Scalars['String']>;
};

export type CmsLayout = {
  __typename: 'CmsLayout';
  admin_notes?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  content_html?: Maybe<Scalars['String']>;
  content_html_with_placeholders?: Maybe<Scalars['String']>;
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  navbar_classes?: Maybe<Scalars['String']>;
};


export type CmsLayoutContent_HtmlArgs = {
  path?: InputMaybe<Scalars['String']>;
};


export type CmsLayoutContent_Html_With_PlaceholdersArgs = {
  path?: InputMaybe<Scalars['String']>;
};

export type CmsLayoutInput = {
  admin_notes?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  navbar_classes?: InputMaybe<Scalars['String']>;
};

export type CmsNavigationItem = {
  __typename: 'CmsNavigationItem';
  id: Scalars['ID'];
  navigation_items?: Maybe<Array<Maybe<CmsNavigationItem>>>;
  navigation_section?: Maybe<CmsNavigationItem>;
  page?: Maybe<Page>;
  position?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};

export type CmsNavigationItemInput = {
  navigationSectionId?: InputMaybe<Scalars['ID']>;
  pageId?: InputMaybe<Scalars['ID']>;
  position?: InputMaybe<Scalars['Int']>;
  title?: InputMaybe<Scalars['String']>;
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
  defaultLayout: CmsLayout;
  /**
   * Returns the CMS layout to be used for a particular URL path within the current domain. (This
   * will be the page-specific layout if the URL corresponds to a page with a layout override, or
   * the default layout for the domain otherwise.)
   */
  effectiveCmsLayout: CmsLayout;
  /** Does a full-text search within this domain. */
  fullTextSearch: SearchResult;
  id: Scalars['ID'];
  /**
   * Returns all the Liquid assigns for regular CMS page rendering in the current domain name.
   * This is a combination of globally-accessible Liquid assigns and domain-specific user-defined
   * CMS variables.
   */
  liquidAssigns: Array<LiquidAssign>;
  /** Given a Liquid text string, renders it to HTML and returns the result. */
  previewLiquid: Scalars['String'];
  /** Given a Markdown text string, renders it to HTML and returns the result. */
  previewMarkdown: Scalars['String'];
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
export type CmsParentCmsContentGroupArgs = {
  id?: InputMaybe<Scalars['ID']>;
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
  id?: InputMaybe<Scalars['ID']>;
  rootPage?: InputMaybe<Scalars['Boolean']>;
  slug?: InputMaybe<Scalars['String']>;
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
  path: Scalars['String'];
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
  query: Scalars['String'];
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
  content: Scalars['String'];
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
  eventId?: InputMaybe<Scalars['ID']>;
  eventProposalId?: InputMaybe<Scalars['ID']>;
  markdown: Scalars['String'];
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
  name?: InputMaybe<Scalars['String']>;
};

export type CmsPartial = {
  __typename: 'CmsPartial';
  admin_notes?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type CmsPartialInput = {
  admin_notes?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type CmsVariable = {
  __typename: 'CmsVariable';
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  id: Scalars['ID'];
  key: Scalars['String'];
  value_json: Scalars['String'];
};

export type CmsVariableInput = {
  key: Scalars['String'];
  value_json: Scalars['String'];
};

export type ContactEmail = {
  __typename: 'ContactEmail';
  email: Scalars['String'];
  formatted_address: Scalars['String'];
  metadata_json: Scalars['Json'];
  name?: Maybe<Scalars['String']>;
};

export type Convention = CmsParent & {
  __typename: 'Convention';
  accepting_proposals?: Maybe<Scalars['Boolean']>;
  bio_eligible_user_con_profiles: Array<UserConProfile>;
  canceled: Scalars['Boolean'];
  catch_all_staff_position?: Maybe<StaffPosition>;
  clickwrap_agreement?: Maybe<Scalars['String']>;
  clickwrap_agreement_html?: Maybe<Scalars['String']>;
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
  coupons_paginated: CouponsPagination;
  created_at?: Maybe<Scalars['Date']>;
  defaultLayout: CmsLayout;
  departments: Array<Department>;
  domain?: Maybe<Scalars['String']>;
  /**
   * Returns the CMS layout to be used for a particular URL path within the current domain. (This
   * will be the page-specific layout if the URL corresponds to a page with a layout override, or
   * the default layout for the domain otherwise.)
   */
  effectiveCmsLayout: CmsLayout;
  email_from: Scalars['String'];
  email_mode: EmailMode;
  ends_at?: Maybe<Scalars['Date']>;
  /**
   * Finds an active event by ID in this convention. If there is no event with that ID in this
   * convention, or the event is no longer active, errors out.
   */
  event: Event;
  event_categories: Array<EventCategory>;
  event_mailing_list_domain?: Maybe<Scalars['String']>;
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
  favicon?: Maybe<ActiveStorageAttachment>;
  /** @deprecated Please use the favicon field instead. */
  favicon_url?: Maybe<Scalars['String']>;
  /**
   * Finds a form by ID in this convention. If there is no form with that ID in this convention,
   * errors out.
   */
  form: Form;
  forms: Array<Form>;
  /** Does a full-text search within this domain. */
  fullTextSearch: SearchResult;
  hidden: Scalars['Boolean'];
  id: Scalars['ID'];
  language: Scalars['String'];
  /**
   * Returns all the Liquid assigns for regular CMS page rendering in the current domain name.
   * This is a combination of globally-accessible Liquid assigns and domain-specific user-defined
   * CMS variables.
   */
  liquidAssigns: Array<LiquidAssign>;
  location?: Maybe<Scalars['Json']>;
  mailing_lists: MailingLists;
  maximum_event_signups?: Maybe<ScheduledValue>;
  maximum_tickets?: Maybe<Scalars['Int']>;
  /**
   * Returns the convention-specific profile for the current user within this convention. If no
   * user is signed in, returns null.
   */
  my_profile?: Maybe<UserConProfile>;
  /**
   * Returns all signups for the current user within this convention. If no user is signed in,
   * returns an empty array.
   */
  my_signups: Array<Signup>;
  name: Scalars['String'];
  notification_templates: Array<NotificationTemplate>;
  /**
   * Returns all the Liquid assigns for rendering a particular notification event in this
   * convention. This is a combination of globally-accessible Liquid assigns, values specific
   * to that notification event, and convention-specific user-defined CMS variables.
   */
  notifier_liquid_assigns: Array<LiquidAssign>;
  open_graph_image?: Maybe<ActiveStorageAttachment>;
  /** @deprecated Please use the open_graph_image field instead. */
  open_graph_image_url?: Maybe<Scalars['String']>;
  orders_paginated: OrdersPagination;
  organization?: Maybe<Organization>;
  pre_schedule_content_html?: Maybe<Scalars['String']>;
  /** Given a Liquid text string, renders it to HTML and returns the result. */
  previewLiquid: Scalars['String'];
  /** Given a Markdown text string, renders it to HTML and returns the result. */
  previewMarkdown: Scalars['String'];
  /**
   * Given a Liquid text string and a notification event, renders the Liquid to HTML using the
   * current domain's CMS context as if it were the content for that notification type.
   */
  preview_notifier_liquid: Scalars['String'];
  /**
   * Finds a product by ID in this convention. If there is no product with that ID in this
   * convention, errors out.
   */
  product: Product;
  products: Array<Product>;
  reports: ConventionReports;
  rooms: Array<Room>;
  rootPage: Page;
  /**
   * Finds an active run by ID in this convention. If there is no run with that ID in this
   * convention, or the run's event is no longer active, errors out.
   */
  run: Run;
  show_event_list?: Maybe<ShowSchedule>;
  show_schedule?: Maybe<ShowSchedule>;
  /**
   * Finds a signup by ID in this convention. If there is no signup with that ID in this
   * convention, errors out.
   */
  signup: Signup;
  signup_changes_paginated: SignupChangesPagination;
  signup_counts_by_state: Array<SignupCountByState>;
  signup_mode: SignupMode;
  signup_requests_open: Scalars['Boolean'];
  signup_requests_paginated: SignupRequestsPagination;
  site_mode: SiteMode;
  /**
   * Finds a staff position by ID in this convention. If there is no staff position with that ID
   * in this convention, errors out.
   */
  staff_position: StaffPosition;
  staff_positions: Array<StaffPosition>;
  starts_at?: Maybe<Scalars['Date']>;
  stripe_account?: Maybe<StripeAccount>;
  stripe_account_id?: Maybe<Scalars['String']>;
  stripe_account_ready_to_charge: Scalars['Boolean'];
  stripe_publishable_key?: Maybe<Scalars['String']>;
  ticketNamePlural: Scalars['String'];
  ticket_mode: TicketMode;
  ticket_name: Scalars['String'];
  ticket_types: Array<TicketType>;
  tickets_available_for_purchase: Scalars['Boolean'];
  timezone_mode: TimezoneMode;
  timezone_name?: Maybe<Scalars['String']>;
  /**
   * Finds CMS content by partial name, case-insensitive, within the current domain's CMS content.
   * For example, in a convention that has a partial called `attendee_profile` and a page called
   * `info_for_attendees`, a search for `attendee` would return both of these.
   *
   * This query is always limited to a maximum of 10 results.
   */
  typeaheadSearchCmsContent: Array<CmsContent>;
  updated_at?: Maybe<Scalars['Date']>;
  user_activity_alert: UserActivityAlert;
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
  user_con_profile_form: Form;
  user_con_profiles_paginated: UserConProfilesPagination;
};


export type ConventionCmsContentGroupArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type ConventionCmsPageArgs = {
  id?: InputMaybe<Scalars['ID']>;
  rootPage?: InputMaybe<Scalars['Boolean']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type ConventionCoupons_PaginatedArgs = {
  filters?: InputMaybe<CouponFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type ConventionEffectiveCmsLayoutArgs = {
  path: Scalars['String'];
};


export type ConventionEventArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type ConventionEvent_CategoriesArgs = {
  current_ability_can_read_event_proposals?: InputMaybe<Scalars['Boolean']>;
};


export type ConventionEvent_ProposalArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type ConventionEvent_Proposals_PaginatedArgs = {
  filters?: InputMaybe<EventProposalFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type ConventionEventsArgs = {
  finish?: InputMaybe<Scalars['Date']>;
  includeDropped?: InputMaybe<Scalars['Boolean']>;
  start?: InputMaybe<Scalars['Date']>;
};


export type ConventionEvents_PaginatedArgs = {
  filters?: InputMaybe<EventFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type ConventionFormArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type ConventionFullTextSearchArgs = {
  query: Scalars['String'];
};


export type ConventionNotifier_Liquid_AssignsArgs = {
  eventKey: Scalars['String'];
};


export type ConventionOrders_PaginatedArgs = {
  filters?: InputMaybe<OrderFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type ConventionPreviewLiquidArgs = {
  content: Scalars['String'];
};


export type ConventionPreviewMarkdownArgs = {
  eventId?: InputMaybe<Scalars['ID']>;
  eventProposalId?: InputMaybe<Scalars['ID']>;
  markdown: Scalars['String'];
};


export type ConventionPreview_Notifier_LiquidArgs = {
  content: Scalars['String'];
  eventKey: Scalars['String'];
};


export type ConventionProductArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type ConventionProductsArgs = {
  only_available?: InputMaybe<Scalars['Boolean']>;
  only_ticket_providing?: InputMaybe<Scalars['Boolean']>;
};


export type ConventionRunArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type ConventionSignupArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type ConventionSignup_Changes_PaginatedArgs = {
  filters?: InputMaybe<SignupChangeFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type ConventionSignup_Requests_PaginatedArgs = {
  filters?: InputMaybe<SignupRequestFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type ConventionStaff_PositionArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type ConventionTypeaheadSearchCmsContentArgs = {
  name?: InputMaybe<Scalars['String']>;
};


export type ConventionUser_Activity_AlertArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type ConventionUser_Con_ProfileArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type ConventionUser_Con_Profile_By_User_IdArgs = {
  userId?: InputMaybe<Scalars['ID']>;
};


export type ConventionUser_Con_Profiles_PaginatedArgs = {
  filters?: InputMaybe<UserConProfileFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type ConventionFiltersInput = {
  name?: InputMaybe<Scalars['String']>;
  organization_name?: InputMaybe<Scalars['String']>;
};

export type ConventionInput = {
  accepting_proposals?: InputMaybe<Scalars['Boolean']>;
  catchAllStaffPositionId?: InputMaybe<Scalars['ID']>;
  clickwrap_agreement?: InputMaybe<Scalars['String']>;
  defaultLayoutId?: InputMaybe<Scalars['ID']>;
  domain?: InputMaybe<Scalars['String']>;
  email_from?: InputMaybe<Scalars['String']>;
  email_mode?: InputMaybe<EmailMode>;
  ends_at?: InputMaybe<Scalars['Date']>;
  event_mailing_list_domain?: InputMaybe<Scalars['String']>;
  favicon?: InputMaybe<Scalars['Upload']>;
  hidden?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['Json']>;
  maximum_event_signups?: InputMaybe<ScheduledValueInput>;
  maximum_tickets?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  openGraphImage?: InputMaybe<Scalars['Upload']>;
  rootPageId?: InputMaybe<Scalars['ID']>;
  show_event_list?: InputMaybe<ShowSchedule>;
  show_schedule?: InputMaybe<ShowSchedule>;
  signup_mode?: InputMaybe<SignupMode>;
  signup_requests_open?: InputMaybe<Scalars['Boolean']>;
  site_mode?: InputMaybe<SiteMode>;
  starts_at?: InputMaybe<Scalars['Date']>;
  ticket_mode?: InputMaybe<TicketMode>;
  ticket_name?: InputMaybe<Scalars['String']>;
  timezone_mode?: InputMaybe<TimezoneMode>;
  timezone_name?: InputMaybe<Scalars['String']>;
};

export type ConventionReports = {
  __typename: 'ConventionReports';
  event_provided_tickets: Array<EventProvidedTicketList>;
  events_by_choice: Array<EventWithChoiceCounts>;
  ticket_count_by_type_and_payment_amount: Array<TicketCountByTypeAndPaymentAmount>;
  total_revenue: Money;
};

export type ConventionsPagination = PaginationInterface & {
  __typename: 'ConventionsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int'];
  entries: Array<Convention>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
};

/** Autogenerated input type of ConvertTicketToEventProvided */
export type ConvertTicketToEventProvidedInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['ID']>;
  ticketTypeId?: InputMaybe<Scalars['ID']>;
  userConProfileId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of ConvertTicketToEventProvided */
export type ConvertTicketToEventProvidedPayload = {
  __typename: 'ConvertTicketToEventProvidedPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The ticket we deleted in order to provide a new ticket */
  deleted_ticket: Ticket;
  refund_status: RefundStatus;
  /** The new ticket we just provided */
  ticket: Ticket;
};

export type Coupon = {
  __typename: 'Coupon';
  code: Scalars['String'];
  convention: Convention;
  expires_at?: Maybe<Scalars['Date']>;
  fixed_amount?: Maybe<Money>;
  id: Scalars['ID'];
  percent_discount?: Maybe<Scalars['BigDecimal']>;
  provides_product?: Maybe<Product>;
  usage_limit?: Maybe<Scalars['Int']>;
};

export type CouponApplication = {
  __typename: 'CouponApplication';
  coupon: Coupon;
  discount: Money;
  id: Scalars['ID'];
  order: Order;
};

export type CouponFiltersInput = {
  code?: InputMaybe<Scalars['String']>;
};

export type CouponInput = {
  code?: InputMaybe<Scalars['String']>;
  expires_at?: InputMaybe<Scalars['Date']>;
  fixed_amount?: InputMaybe<MoneyInput>;
  percent_discount?: InputMaybe<Scalars['BigDecimal']>;
  providesProductId?: InputMaybe<Scalars['ID']>;
  usage_limit?: InputMaybe<Scalars['Int']>;
};

export type CouponsPagination = PaginationInterface & {
  __typename: 'CouponsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int'];
  entries: Array<Coupon>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
};

/** Autogenerated input type of CreateCmsContentGroup */
export type CreateCmsContentGroupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  cms_content_group: CmsContentGroupInput;
  permissions?: InputMaybe<Array<PermissionInput>>;
};

/** Autogenerated return type of CreateCmsContentGroup */
export type CreateCmsContentGroupPayload = {
  __typename: 'CreateCmsContentGroupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_content_group: CmsContentGroup;
};

/** Autogenerated input type of CreateCmsFile */
export type CreateCmsFileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Scalars['Upload']>;
  signedBlobId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of CreateCmsFile */
export type CreateCmsFilePayload = {
  __typename: 'CreateCmsFilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_file: CmsFile;
};

/** Autogenerated input type of CreateCmsGraphqlQuery */
export type CreateCmsGraphqlQueryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  query: CmsGraphqlQueryInput;
};

/** Autogenerated return type of CreateCmsGraphqlQuery */
export type CreateCmsGraphqlQueryPayload = {
  __typename: 'CreateCmsGraphqlQueryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  query: CmsGraphqlQuery;
};

/** Autogenerated input type of CreateCmsLayout */
export type CreateCmsLayoutInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  cms_layout: CmsLayoutInput;
};

/** Autogenerated return type of CreateCmsLayout */
export type CreateCmsLayoutPayload = {
  __typename: 'CreateCmsLayoutPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_layout: CmsLayout;
};

/** Autogenerated input type of CreateCmsNavigationItem */
export type CreateCmsNavigationItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  cms_navigation_item: CmsNavigationItemInput;
};

/** Autogenerated return type of CreateCmsNavigationItem */
export type CreateCmsNavigationItemPayload = {
  __typename: 'CreateCmsNavigationItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_navigation_item: CmsNavigationItem;
};

/** Autogenerated input type of CreateCmsPartial */
export type CreateCmsPartialInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  cms_partial: CmsPartialInput;
};

/** Autogenerated return type of CreateCmsPartial */
export type CreateCmsPartialPayload = {
  __typename: 'CreateCmsPartialPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_partial: CmsPartial;
};

/** Autogenerated input type of CreateConvention */
export type CreateConventionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  cloneConventionId?: InputMaybe<Scalars['ID']>;
  cms_content_set_name?: InputMaybe<Scalars['String']>;
  convention: ConventionInput;
  organizationId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of CreateConvention */
export type CreateConventionPayload = {
  __typename: 'CreateConventionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  convention: Convention;
};

/** Autogenerated input type of CreateConventionStripeAccount */
export type CreateConventionStripeAccountInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** Autogenerated return type of CreateConventionStripeAccount */
export type CreateConventionStripeAccountPayload = {
  __typename: 'CreateConventionStripeAccountPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  stripe_account: StripeAccount;
};

/** Autogenerated input type of CreateCouponApplication */
export type CreateCouponApplicationInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  coupon_code: Scalars['String'];
  orderId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of CreateCouponApplication */
export type CreateCouponApplicationPayload = {
  __typename: 'CreateCouponApplicationPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon_application: CouponApplication;
};

/** Autogenerated input type of CreateCoupon */
export type CreateCouponInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  coupon: CouponInput;
};

/** Autogenerated return type of CreateCoupon */
export type CreateCouponPayload = {
  __typename: 'CreateCouponPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon: Coupon;
};

/** Autogenerated input type of CreateDepartment */
export type CreateDepartmentInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  department: DepartmentInput;
};

/** Autogenerated return type of CreateDepartment */
export type CreateDepartmentPayload = {
  __typename: 'CreateDepartmentPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  department: Department;
};

/** Autogenerated input type of CreateEmailRoute */
export type CreateEmailRouteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  email_route: EmailRouteInput;
};

/** Autogenerated return type of CreateEmailRoute */
export type CreateEmailRoutePayload = {
  __typename: 'CreateEmailRoutePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  email_route: EmailRoute;
};

/** Autogenerated input type of CreateEventCategory */
export type CreateEventCategoryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  event_category: EventCategoryInput;
};

/** Autogenerated return type of CreateEventCategory */
export type CreateEventCategoryPayload = {
  __typename: 'CreateEventCategoryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_category: EventCategory;
};

/** Autogenerated input type of CreateEvent */
export type CreateEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  event: EventInput;
  signedImageBlobIds?: InputMaybe<Array<Scalars['ID']>>;
};

/** Autogenerated return type of CreateEvent */
export type CreateEventPayload = {
  __typename: 'CreateEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: Event;
};

/** Autogenerated input type of CreateEventProposal */
export type CreateEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  cloneEventProposalId?: InputMaybe<Scalars['ID']>;
  eventCategoryId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of CreateEventProposal */
export type CreateEventProposalPayload = {
  __typename: 'CreateEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of CreateFillerEvent */
export type CreateFillerEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  event: EventInput;
  run?: InputMaybe<RunInput>;
  signedImageBlobIds?: InputMaybe<Array<Scalars['ID']>>;
};

/** Autogenerated return type of CreateFillerEvent */
export type CreateFillerEventPayload = {
  __typename: 'CreateFillerEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: Event;
};

/** Autogenerated input type of CreateForm */
export type CreateFormInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  form: FormInput;
  form_type: FormType;
};

/** Autogenerated input type of CreateFormItem */
export type CreateFormItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  formSectionId?: InputMaybe<Scalars['ID']>;
  form_item: FormItemInput;
};

/** Autogenerated return type of CreateFormItem */
export type CreateFormItemPayload = {
  __typename: 'CreateFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_item: FormItem;
};

/** Autogenerated return type of CreateForm */
export type CreateFormPayload = {
  __typename: 'CreateFormPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: Form;
};

/** Autogenerated input type of CreateFormSection */
export type CreateFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  formId?: InputMaybe<Scalars['ID']>;
  form_section: FormSectionInput;
};

/** Autogenerated return type of CreateFormSection */
export type CreateFormSectionPayload = {
  __typename: 'CreateFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_section: FormSection;
};

/** Autogenerated input type of CreateFormWithJSON */
export type CreateFormWithJsonInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  form_json: Scalars['String'];
  form_type: FormType;
};

/** Autogenerated return type of CreateFormWithJSON */
export type CreateFormWithJsonPayload = {
  __typename: 'CreateFormWithJSONPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: Form;
};

/** Autogenerated input type of CreateMaximumEventProvidedTicketsOverride */
export type CreateMaximumEventProvidedTicketsOverrideInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['ID']>;
  override_value: Scalars['Int'];
  ticketTypeId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of CreateMaximumEventProvidedTicketsOverride */
export type CreateMaximumEventProvidedTicketsOverridePayload = {
  __typename: 'CreateMaximumEventProvidedTicketsOverridePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  maximum_event_provided_tickets_override: MaximumEventProvidedTicketsOverride;
};

/** Autogenerated input type of CreateMultipleRuns */
export type CreateMultipleRunsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['ID']>;
  runs: Array<RunInput>;
};

/** Autogenerated return type of CreateMultipleRuns */
export type CreateMultipleRunsPayload = {
  __typename: 'CreateMultipleRunsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  runs: Array<Run>;
};

/** Autogenerated input type of CreateMySignup */
export type CreateMySignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  no_requested_bucket?: InputMaybe<Scalars['Boolean']>;
  requested_bucket_key?: InputMaybe<Scalars['String']>;
  runId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of CreateMySignup */
export type CreateMySignupPayload = {
  __typename: 'CreateMySignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

/** Autogenerated input type of CreateOrderEntry */
export type CreateOrderEntryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  orderId?: InputMaybe<Scalars['ID']>;
  order_entry: OrderEntryInput;
};

/** Autogenerated return type of CreateOrderEntry */
export type CreateOrderEntryPayload = {
  __typename: 'CreateOrderEntryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order_entry: OrderEntry;
};

/** Autogenerated input type of CreateOrder */
export type CreateOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  order: OrderInput;
  order_entries?: InputMaybe<Array<OrderEntryInput>>;
  status: OrderStatus;
  userConProfileId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of CreateOrder */
export type CreateOrderPayload = {
  __typename: 'CreateOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order: Order;
};

/** Autogenerated input type of CreateOrganizationRole */
export type CreateOrganizationRoleInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  organizationId?: InputMaybe<Scalars['ID']>;
  organization_role: OrganizationRoleInput;
  permissions: Array<PermissionInput>;
  userIds?: InputMaybe<Array<Scalars['ID']>>;
};

/** Autogenerated return type of CreateOrganizationRole */
export type CreateOrganizationRolePayload = {
  __typename: 'CreateOrganizationRolePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  organization_role: OrganizationRole;
};

/** Autogenerated input type of CreatePage */
export type CreatePageInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  page: PageInput;
};

/** Autogenerated return type of CreatePage */
export type CreatePagePayload = {
  __typename: 'CreatePagePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  page: Page;
};

/** Autogenerated input type of CreateProduct */
export type CreateProductInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  product: ProductInput;
};

/** Autogenerated return type of CreateProduct */
export type CreateProductPayload = {
  __typename: 'CreateProductPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  product: Product;
};

/** Autogenerated input type of CreateRoom */
export type CreateRoomInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  room: RoomInput;
};

/** Autogenerated return type of CreateRoom */
export type CreateRoomPayload = {
  __typename: 'CreateRoomPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  room: Room;
};

/** Autogenerated input type of CreateRun */
export type CreateRunInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['ID']>;
  run: RunInput;
};

/** Autogenerated return type of CreateRun */
export type CreateRunPayload = {
  __typename: 'CreateRunPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  run: Run;
};

/** Autogenerated input type of CreateSignupRequest */
export type CreateSignupRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  replaceSignupId?: InputMaybe<Scalars['ID']>;
  requested_bucket_key?: InputMaybe<Scalars['String']>;
  targetRunId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of CreateSignupRequest */
export type CreateSignupRequestPayload = {
  __typename: 'CreateSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup_request: SignupRequest;
};

/** Autogenerated input type of CreateStaffPosition */
export type CreateStaffPositionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  staff_position: StaffPositionInput;
};

/** Autogenerated return type of CreateStaffPosition */
export type CreateStaffPositionPayload = {
  __typename: 'CreateStaffPositionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of CreateTeamMember */
export type CreateTeamMemberInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['ID']>;
  provideTicketTypeId?: InputMaybe<Scalars['ID']>;
  team_member: TeamMemberInput;
  userConProfileId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of CreateTeamMember */
export type CreateTeamMemberPayload = {
  __typename: 'CreateTeamMemberPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  converted_signups: Array<Signup>;
  move_results: Array<SignupMoveResult>;
  team_member: TeamMember;
  ticket?: Maybe<Ticket>;
};

/** Autogenerated input type of CreateTicket */
export type CreateTicketInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  ticket: TicketInput;
  userConProfileId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of CreateTicket */
export type CreateTicketPayload = {
  __typename: 'CreateTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket: Ticket;
};

/** Autogenerated input type of CreateTicketType */
export type CreateTicketTypeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['ID']>;
  ticket_type: TicketTypeInput;
};

/** Autogenerated return type of CreateTicketType */
export type CreateTicketTypePayload = {
  __typename: 'CreateTicketTypePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket_type: TicketType;
};

/** Autogenerated input type of CreateUserActivityAlert */
export type CreateUserActivityAlertInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  notification_destinations: Array<NotificationDestinationInput>;
  user_activity_alert: UserActivityAlertInput;
};

/** Autogenerated return type of CreateUserActivityAlert */
export type CreateUserActivityAlertPayload = {
  __typename: 'CreateUserActivityAlertPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_activity_alert: UserActivityAlert;
};

/** Autogenerated input type of CreateUserConProfile */
export type CreateUserConProfileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['ID']>;
  user_con_profile: UserConProfileInput;
};

/** Autogenerated return type of CreateUserConProfile */
export type CreateUserConProfilePayload = {
  __typename: 'CreateUserConProfilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_con_profile: UserConProfile;
};

/** Autogenerated input type of CreateUserSignup */
export type CreateUserSignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  no_requested_bucket?: InputMaybe<Scalars['Boolean']>;
  requested_bucket_key?: InputMaybe<Scalars['String']>;
  runId?: InputMaybe<Scalars['ID']>;
  suppress_notifications?: InputMaybe<Scalars['Boolean']>;
  userConProfileId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of CreateUserSignup */
export type CreateUserSignupPayload = {
  __typename: 'CreateUserSignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

/** Autogenerated input type of DeleteCmsContentGroup */
export type DeleteCmsContentGroupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteCmsContentGroup */
export type DeleteCmsContentGroupPayload = {
  __typename: 'DeleteCmsContentGroupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_content_group: CmsContentGroup;
};

/** Autogenerated input type of DeleteCmsFile */
export type DeleteCmsFileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteCmsFile */
export type DeleteCmsFilePayload = {
  __typename: 'DeleteCmsFilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_file: CmsFile;
};

/** Autogenerated input type of DeleteCmsGraphqlQuery */
export type DeleteCmsGraphqlQueryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteCmsGraphqlQuery */
export type DeleteCmsGraphqlQueryPayload = {
  __typename: 'DeleteCmsGraphqlQueryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  query: CmsGraphqlQuery;
};

/** Autogenerated input type of DeleteCmsLayout */
export type DeleteCmsLayoutInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteCmsLayout */
export type DeleteCmsLayoutPayload = {
  __typename: 'DeleteCmsLayoutPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_layout: CmsLayout;
};

/** Autogenerated input type of DeleteCmsNavigationItem */
export type DeleteCmsNavigationItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteCmsNavigationItem */
export type DeleteCmsNavigationItemPayload = {
  __typename: 'DeleteCmsNavigationItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_navigation_item: CmsNavigationItem;
};

/** Autogenerated input type of DeleteCmsPartial */
export type DeleteCmsPartialInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteCmsPartial */
export type DeleteCmsPartialPayload = {
  __typename: 'DeleteCmsPartialPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_partial: CmsPartial;
};

/** Autogenerated input type of DeleteCmsVariable */
export type DeleteCmsVariableInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  key: Scalars['String'];
};

/** Autogenerated return type of DeleteCmsVariable */
export type DeleteCmsVariablePayload = {
  __typename: 'DeleteCmsVariablePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_variable: CmsVariable;
};

/** Autogenerated input type of DeleteCouponApplication */
export type DeleteCouponApplicationInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteCouponApplication */
export type DeleteCouponApplicationPayload = {
  __typename: 'DeleteCouponApplicationPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon_application: CouponApplication;
};

/** Autogenerated input type of DeleteCoupon */
export type DeleteCouponInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteCoupon */
export type DeleteCouponPayload = {
  __typename: 'DeleteCouponPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon: Coupon;
};

/** Autogenerated input type of DeleteDepartment */
export type DeleteDepartmentInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteDepartment */
export type DeleteDepartmentPayload = {
  __typename: 'DeleteDepartmentPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  department: Department;
};

/** Autogenerated input type of DeleteEmailRoute */
export type DeleteEmailRouteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteEmailRoute */
export type DeleteEmailRoutePayload = {
  __typename: 'DeleteEmailRoutePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  email_route: EmailRoute;
};

/** Autogenerated input type of DeleteEventCategory */
export type DeleteEventCategoryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteEventCategory */
export type DeleteEventCategoryPayload = {
  __typename: 'DeleteEventCategoryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_category: EventCategory;
};

/** Autogenerated input type of DeleteEventProposal */
export type DeleteEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteEventProposal */
export type DeleteEventProposalPayload = {
  __typename: 'DeleteEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of DeleteForm */
export type DeleteFormInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated input type of DeleteFormItem */
export type DeleteFormItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteFormItem */
export type DeleteFormItemPayload = {
  __typename: 'DeleteFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Autogenerated return type of DeleteForm */
export type DeleteFormPayload = {
  __typename: 'DeleteFormPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: Form;
};

/** Autogenerated input type of DeleteFormSection */
export type DeleteFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteFormSection */
export type DeleteFormSectionPayload = {
  __typename: 'DeleteFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Autogenerated input type of DeleteMaximumEventProvidedTicketsOverride */
export type DeleteMaximumEventProvidedTicketsOverrideInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteMaximumEventProvidedTicketsOverride */
export type DeleteMaximumEventProvidedTicketsOverridePayload = {
  __typename: 'DeleteMaximumEventProvidedTicketsOverridePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  maximum_event_provided_tickets_override: MaximumEventProvidedTicketsOverride;
};

/** Autogenerated input type of DeleteOrderEntry */
export type DeleteOrderEntryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteOrderEntry */
export type DeleteOrderEntryPayload = {
  __typename: 'DeleteOrderEntryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order_entry: OrderEntry;
};

/** Autogenerated input type of DeleteOrganizationRole */
export type DeleteOrganizationRoleInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteOrganizationRole */
export type DeleteOrganizationRolePayload = {
  __typename: 'DeleteOrganizationRolePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Autogenerated input type of DeletePage */
export type DeletePageInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeletePage */
export type DeletePagePayload = {
  __typename: 'DeletePagePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  page: Page;
};

/** Autogenerated input type of DeleteProduct */
export type DeleteProductInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteProduct */
export type DeleteProductPayload = {
  __typename: 'DeleteProductPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  product: Product;
};

/** Autogenerated input type of DeleteRoom */
export type DeleteRoomInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteRoom */
export type DeleteRoomPayload = {
  __typename: 'DeleteRoomPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  room: Room;
};

/** Autogenerated input type of DeleteRun */
export type DeleteRunInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteRun */
export type DeleteRunPayload = {
  __typename: 'DeleteRunPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  run: Run;
};

/** Autogenerated input type of DeleteStaffPosition */
export type DeleteStaffPositionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteStaffPosition */
export type DeleteStaffPositionPayload = {
  __typename: 'DeleteStaffPositionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of DeleteTeamMember */
export type DeleteTeamMemberInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteTeamMember */
export type DeleteTeamMemberPayload = {
  __typename: 'DeleteTeamMemberPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  team_member: TeamMember;
};

/** Autogenerated input type of DeleteTicket */
export type DeleteTicketInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  refund?: InputMaybe<Scalars['Boolean']>;
};

/** Autogenerated return type of DeleteTicket */
export type DeleteTicketPayload = {
  __typename: 'DeleteTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket: Ticket;
};

/** Autogenerated input type of DeleteTicketType */
export type DeleteTicketTypeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteTicketType */
export type DeleteTicketTypePayload = {
  __typename: 'DeleteTicketTypePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket_type: TicketType;
};

/** Autogenerated input type of DeleteUserActivityAlert */
export type DeleteUserActivityAlertInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteUserActivityAlert */
export type DeleteUserActivityAlertPayload = {
  __typename: 'DeleteUserActivityAlertPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_activity_alert: UserActivityAlert;
};

/** Autogenerated input type of DeleteUserConProfile */
export type DeleteUserConProfileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DeleteUserConProfile */
export type DeleteUserConProfilePayload = {
  __typename: 'DeleteUserConProfilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_con_profile: UserConProfile;
};

export type Department = {
  __typename: 'Department';
  event_categories: Array<EventCategory>;
  id: Scalars['ID'];
  name: Scalars['String'];
  proposal_description?: Maybe<Scalars['String']>;
};

export type DepartmentInput = {
  name?: InputMaybe<Scalars['String']>;
  proposal_description?: InputMaybe<Scalars['String']>;
};

/** Autogenerated input type of DropEvent */
export type DropEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of DropEvent */
export type DropEventPayload = {
  __typename: 'DropEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
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
  forward_addresses?: Maybe<Array<Scalars['String']>>;
  id: Scalars['ID'];
  receiver_address: Scalars['String'];
};

export type EmailRouteFiltersInput = {
  forward_addresses?: InputMaybe<Scalars['String']>;
  receiver_address?: InputMaybe<Scalars['String']>;
};

export type EmailRouteInput = {
  forward_addresses?: InputMaybe<Array<Scalars['String']>>;
  receiver_address?: InputMaybe<Scalars['String']>;
};

export type EmailRoutesPagination = PaginationInterface & {
  __typename: 'EmailRoutesPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int'];
  entries: Array<EmailRoute>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
};

export type Event = {
  __typename: 'Event';
  admin_notes?: Maybe<Scalars['String']>;
  age_restrictions?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  can_play_concurrently: Scalars['Boolean'];
  con_mail_destination?: Maybe<Scalars['String']>;
  content_warnings?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  current_user_form_item_viewer_role: FormItemRole;
  current_user_form_item_writer_role: FormItemRole;
  description?: Maybe<Scalars['String']>;
  description_html?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  event_category: EventCategory;
  form?: Maybe<Form>;
  form_response_attrs_json?: Maybe<Scalars['Json']>;
  form_response_attrs_json_with_rendered_markdown?: Maybe<Scalars['Json']>;
  form_response_changes: Array<FormResponseChange>;
  id: Scalars['ID'];
  images: Array<ActiveStorageAttachment>;
  length_seconds: Scalars['Int'];
  maximum_event_provided_tickets_overrides: Array<MaximumEventProvidedTicketsOverride>;
  my_rating?: Maybe<Scalars['Int']>;
  organization?: Maybe<Scalars['String']>;
  participant_communications?: Maybe<Scalars['String']>;
  private_signup_list?: Maybe<Scalars['Boolean']>;
  provided_tickets: Array<Ticket>;
  registration_policy?: Maybe<RegistrationPolicy>;
  run: Run;
  runs: Array<Run>;
  short_blurb?: Maybe<Scalars['String']>;
  short_blurb_html?: Maybe<Scalars['String']>;
  slots_limited?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  team_members: Array<TeamMember>;
  ticket_types: Array<TicketType>;
  title?: Maybe<Scalars['String']>;
  total_slots?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};


export type EventRunArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type EventRunsArgs = {
  excludeConflicts?: InputMaybe<Scalars['Boolean']>;
  finish?: InputMaybe<Scalars['Date']>;
  start?: InputMaybe<Scalars['Date']>;
};

export type EventCategory = {
  __typename: 'EventCategory';
  can_provide_tickets: Scalars['Boolean'];
  convention: Convention;
  default_color?: Maybe<Scalars['String']>;
  department?: Maybe<Department>;
  event_form: Form;
  event_proposal_form?: Maybe<Form>;
  events_paginated: EventsPagination;
  full_color?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  proposable: Scalars['Boolean'];
  proposal_description?: Maybe<Scalars['String']>;
  scheduling_ui: SchedulingUi;
  signed_up_color?: Maybe<Scalars['String']>;
  teamMemberNamePlural: Scalars['String'];
  team_member_name: Scalars['String'];
};


export type EventCategoryEvents_PaginatedArgs = {
  filters?: InputMaybe<EventFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};

export type EventCategoryInput = {
  can_provide_tickets?: InputMaybe<Scalars['Boolean']>;
  default_color?: InputMaybe<Scalars['String']>;
  departmentId?: InputMaybe<Scalars['ID']>;
  eventFormId?: InputMaybe<Scalars['ID']>;
  eventProposalFormId?: InputMaybe<Scalars['ID']>;
  full_color?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  proposal_description?: InputMaybe<Scalars['String']>;
  scheduling_ui?: InputMaybe<SchedulingUi>;
  signed_up_color?: InputMaybe<Scalars['String']>;
  team_member_name?: InputMaybe<Scalars['String']>;
};

export type EventFiltersInput = {
  category?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  my_rating?: InputMaybe<Array<Scalars['Int']>>;
  title?: InputMaybe<Scalars['String']>;
  title_prefix?: InputMaybe<Scalars['String']>;
};

export type EventInput = {
  addImageBlobIds?: InputMaybe<Array<Scalars['ID']>>;
  eventCategoryId?: InputMaybe<Scalars['ID']>;
  form_response_attrs_json?: InputMaybe<Scalars['String']>;
  removeImageBlobIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type EventProposal = {
  __typename: 'EventProposal';
  admin_notes?: Maybe<Scalars['String']>;
  convention: Convention;
  created_at: Scalars['Date'];
  current_user_form_item_viewer_role: FormItemRole;
  current_user_form_item_writer_role: FormItemRole;
  event?: Maybe<Event>;
  event_category: EventCategory;
  form?: Maybe<Form>;
  form_response_attrs_json?: Maybe<Scalars['Json']>;
  form_response_attrs_json_with_rendered_markdown?: Maybe<Scalars['Json']>;
  form_response_changes: Array<FormResponseChange>;
  id: Scalars['ID'];
  images: Array<ActiveStorageAttachment>;
  length_seconds?: Maybe<Scalars['Int']>;
  owner: UserConProfile;
  registration_policy?: Maybe<RegistrationPolicy>;
  status: Scalars['String'];
  submitted_at: Scalars['Date'];
  title?: Maybe<Scalars['String']>;
  updated_at: Scalars['Date'];
};

export type EventProposalFiltersInput = {
  event_category?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  owner?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title?: InputMaybe<Scalars['String']>;
};

export type EventProposalInput = {
  addImageBlobIds?: InputMaybe<Array<Scalars['ID']>>;
  form_response_attrs_json?: InputMaybe<Scalars['String']>;
  removeImageBlobIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type EventProposalsPagination = PaginationInterface & {
  __typename: 'EventProposalsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int'];
  entries: Array<EventProposal>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
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
  current_page: Scalars['Int'];
  entries: Array<Event>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
};

/** Autogenerated input type of ForceConfirmSignup */
export type ForceConfirmSignupInput = {
  bucket_key: Scalars['String'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of ForceConfirmSignup */
export type ForceConfirmSignupPayload = {
  __typename: 'ForceConfirmSignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

export type Form = {
  __typename: 'Form';
  event_categories: Array<EventCategory>;
  export_json: Scalars['Json'];
  form_section: FormSection;
  form_sections: Array<FormSection>;
  form_type: FormType;
  id: Scalars['ID'];
  proposal_event_categories: Array<EventCategory>;
  title: Scalars['String'];
  user_con_profile_conventions: Array<Convention>;
};


export type FormForm_SectionArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type FormInput = {
  title?: InputMaybe<Scalars['String']>;
};

export type FormItem = {
  __typename: 'FormItem';
  admin_description?: Maybe<Scalars['String']>;
  default_value?: Maybe<Scalars['Json']>;
  form_section: FormSection;
  id: Scalars['ID'];
  identifier?: Maybe<Scalars['String']>;
  item_type: Scalars['String'];
  position: Scalars['Int'];
  properties: Scalars['Json'];
  public_description?: Maybe<Scalars['String']>;
  rendered_properties: Scalars['Json'];
  visibility: FormItemRole;
  writeability: FormItemRole;
};

export type FormItemInput = {
  admin_description?: InputMaybe<Scalars['String']>;
  default_value?: InputMaybe<Scalars['Json']>;
  identifier?: InputMaybe<Scalars['String']>;
  item_type?: InputMaybe<Scalars['String']>;
  properties?: InputMaybe<Scalars['Json']>;
  public_description?: InputMaybe<Scalars['String']>;
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
  compacted: Scalars['Boolean'];
  created_at: Scalars['Date'];
  field_identifier: Scalars['String'];
  new_value?: Maybe<Scalars['Json']>;
  notified_at?: Maybe<Scalars['Date']>;
  previous_value?: Maybe<Scalars['Json']>;
  updated_at: Scalars['Date'];
  user_con_profile: UserConProfile;
};

export type FormSection = {
  __typename: 'FormSection';
  form: Form;
  form_items: Array<FormItem>;
  id: Scalars['ID'];
  position: Scalars['Int'];
  /**
   * Given a FormItemInput, returns a preview version of that form item within this section. This
   * does not actually save the form item. This is mostly useful because of the
   * `rendered_properties` field inside FormItem, which lets clients retrieve
   * a rendered HTML version of the Liquid-enabled properties of the form item.
   */
  preview_form_item: FormItem;
  title?: Maybe<Scalars['String']>;
};


export type FormSectionPreview_Form_ItemArgs = {
  formItem: FormItemInput;
};

export type FormSectionInput = {
  title?: InputMaybe<Scalars['String']>;
};

export enum FormType {
  /** Event form */
  Event = 'event',
  /** Event proposal form */
  EventProposal = 'event_proposal',
  /** User profile form */
  UserConProfile = 'user_con_profile'
}

export type LiquidAssign = {
  __typename: 'LiquidAssign';
  cms_variable_value_json?: Maybe<Scalars['String']>;
  drop_class_name: Scalars['String'];
  name: Scalars['String'];
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
  finish: Scalars['Date'];
  start: Scalars['Date'];
};

export type MailingListsResult = {
  __typename: 'MailingListsResult';
  emails: Array<ContactEmail>;
  metadata_fields: Array<Scalars['String']>;
};

export type MailingListsWaitlistsResult = {
  __typename: 'MailingListsWaitlistsResult';
  emails: Array<ContactEmail>;
  metadata_fields: Array<Scalars['String']>;
  run: Run;
};

/** Autogenerated input type of MarkOrderPaid */
export type MarkOrderPaidInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of MarkOrderPaid */
export type MarkOrderPaidPayload = {
  __typename: 'MarkOrderPaidPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order: Order;
};

export type MaximumEventProvidedTicketsOverride = {
  __typename: 'MaximumEventProvidedTicketsOverride';
  event: Event;
  id: Scalars['ID'];
  override_value: Scalars['Int'];
  ticket_type: TicketType;
};

/** Autogenerated input type of MergeUsers */
export type MergeUsersInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The user IDs to merge. */
  userIds?: InputMaybe<Array<Scalars['ID']>>;
  winningUserConProfiles: Array<WinningUserConProfileInput>;
  winningUserId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of MergeUsers */
export type MergeUsersPayload = {
  __typename: 'MergeUsersPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user: User;
};

export type Money = {
  __typename: 'Money';
  currency_code: Scalars['String'];
  fractional: Scalars['Int'];
};

export type MoneyInput = {
  currency_code: Scalars['String'];
  fractional: Scalars['Int'];
};

/** Autogenerated input type of MoveFormItem */
export type MoveFormItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  destination_index?: InputMaybe<Scalars['Int']>;
  formSectionId?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of MoveFormItem */
export type MoveFormItemPayload = {
  __typename: 'MoveFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_item: FormItem;
  form_section: FormSection;
};

/** Autogenerated input type of MoveFormSection */
export type MoveFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  destination_index: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of MoveFormSection */
export type MoveFormSectionPayload = {
  __typename: 'MoveFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
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
  createRoom: CreateRoomPayload;
  createRun: CreateRunPayload;
  createSignupRequest: CreateSignupRequestPayload;
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
  deleteRoom: DeleteRoomPayload;
  deleteRun: DeleteRunPayload;
  deleteStaffPosition: DeleteStaffPositionPayload;
  deleteTeamMember: DeleteTeamMemberPayload;
  deleteTicket: DeleteTicketPayload;
  deleteTicketType: DeleteTicketTypePayload;
  deleteUserActivityAlert: DeleteUserActivityAlertPayload;
  deleteUserConProfile: DeleteUserConProfilePayload;
  dropEvent: DropEventPayload;
  forceConfirmSignup: ForceConfirmSignupPayload;
  markOrderPaid: MarkOrderPaidPayload;
  mergeUsers: MergeUsersPayload;
  moveFormItem: MoveFormItemPayload;
  moveFormSection: MoveFormSectionPayload;
  provideEventTicket: ProvideEventTicketPayload;
  rateEvent: RateEventPayload;
  rejectSignupRequest: RejectSignupRequestPayload;
  renameCmsFile: RenameCmsFilePayload;
  restoreDroppedEvent: RestoreDroppedEventPayload;
  revokeAuthorizedApplication: RevokeAuthorizedApplicationPayload;
  setCmsVariable: SetCmsVariablePayload;
  setConventionCanceled: SetConventionCanceledPayload;
  sortCmsNavigationItems: SortCmsNavigationItemsPayload;
  submitEventProposal: SubmitEventProposalPayload;
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
  updateRoom: UpdateRoomPayload;
  updateRootSite: UpdateRootSitePayload;
  updateRun: UpdateRunPayload;
  updateSignupBucket: UpdateSignupBucketPayload;
  updateSignupCounted: UpdateSignupCountedPayload;
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


export type MutationCreateRoomArgs = {
  input: CreateRoomInput;
};


export type MutationCreateRunArgs = {
  input: CreateRunInput;
};


export type MutationCreateSignupRequestArgs = {
  input: CreateSignupRequestInput;
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


export type MutationDeleteRoomArgs = {
  input: DeleteRoomInput;
};


export type MutationDeleteRunArgs = {
  input: DeleteRunInput;
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


export type MutationRestoreDroppedEventArgs = {
  input: RestoreDroppedEventInput;
};


export type MutationRevokeAuthorizedApplicationArgs = {
  input: RevokeAuthorizedApplicationInput;
};


export type MutationSetCmsVariableArgs = {
  input: SetCmsVariableInput;
};


export type MutationSetConventionCanceledArgs = {
  input: SetConventionCanceledInput;
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
  id: Scalars['ID'];
  source: NotificationSource;
  staff_position?: Maybe<StaffPosition>;
  user_con_profile?: Maybe<UserConProfile>;
};

export type NotificationDestinationInput = {
  staffPositionId?: InputMaybe<Scalars['ID']>;
  userConProfileId?: InputMaybe<Scalars['ID']>;
};

export type NotificationSource = UserActivityAlert;

export type NotificationTemplate = {
  __typename: 'NotificationTemplate';
  body_html?: Maybe<Scalars['String']>;
  body_sms?: Maybe<Scalars['String']>;
  body_text?: Maybe<Scalars['String']>;
  event_key: Scalars['String'];
  id: Scalars['ID'];
  subject?: Maybe<Scalars['String']>;
};

export type NotificationTemplateInput = {
  body_html?: InputMaybe<Scalars['String']>;
  body_sms?: InputMaybe<Scalars['String']>;
  body_text?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Scalars['String']>;
};

export type Order = {
  __typename: 'Order';
  charge_id?: Maybe<Scalars['String']>;
  coupon_applications: Array<CouponApplication>;
  id: Scalars['ID'];
  order_entries: Array<OrderEntry>;
  paid_at?: Maybe<Scalars['Date']>;
  payment_amount?: Maybe<Money>;
  /**
   * Generates a Stripe PaymentIntent for this order and returns the client secret from that
   * PaymentIntent. This can be used to start a payment on the client side, for example using
   * Apple Pay or Google Pay.
   */
  payment_intent_client_secret: Scalars['String'];
  payment_note?: Maybe<Scalars['String']>;
  status: OrderStatus;
  submitted_at?: Maybe<Scalars['Date']>;
  total_price: Money;
  total_price_before_discounts: Money;
  user_con_profile: UserConProfile;
};

export type OrderEntry = {
  __typename: 'OrderEntry';
  describe_products: Scalars['String'];
  id: Scalars['ID'];
  order: Order;
  price: Money;
  price_per_item: Money;
  product: Product;
  product_variant?: Maybe<ProductVariant>;
  quantity: Scalars['Int'];
};

export type OrderEntryInput = {
  price_per_item?: InputMaybe<MoneyInput>;
  productId?: InputMaybe<Scalars['ID']>;
  productVariantId?: InputMaybe<Scalars['ID']>;
  quantity?: InputMaybe<Scalars['Int']>;
  ticketId?: InputMaybe<Scalars['ID']>;
};

export type OrderFiltersInput = {
  id?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Array<Scalars['String']>>;
  user_name?: InputMaybe<Scalars['String']>;
};

export type OrderInput = {
  payment_amount?: InputMaybe<MoneyInput>;
  payment_note?: InputMaybe<Scalars['String']>;
};

export type OrderQuantityByStatus = {
  __typename: 'OrderQuantityByStatus';
  quantity: Scalars['Int'];
  status: Scalars['String'];
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
  current_page: Scalars['Int'];
  entries: Array<Order>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
};

export type Organization = {
  __typename: 'Organization';
  conventions: Array<Convention>;
  current_ability_can_manage_access: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
  organization_roles: Array<OrganizationRole>;
};

export type OrganizationRole = {
  __typename: 'OrganizationRole';
  id: Scalars['ID'];
  name: Scalars['String'];
  organization: Organization;
  permissions: Array<Permission>;
  users: Array<User>;
};

export type OrganizationRoleInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type Page = {
  __typename: 'Page';
  admin_notes?: Maybe<Scalars['String']>;
  cms_layout?: Maybe<CmsLayout>;
  content?: Maybe<Scalars['String']>;
  content_html: Scalars['String'];
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  hidden_from_search: Scalars['Boolean'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  referenced_partials: Array<CmsPartial>;
  skip_clickwrap_agreement?: Maybe<Scalars['Boolean']>;
  slug?: Maybe<Scalars['String']>;
};

export type PageInput = {
  admin_notes?: InputMaybe<Scalars['String']>;
  cmsLayoutId?: InputMaybe<Scalars['ID']>;
  content?: InputMaybe<Scalars['String']>;
  hidden_from_search?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  skip_clickwrap_agreement?: InputMaybe<Scalars['Boolean']>;
  slug?: InputMaybe<Scalars['String']>;
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
  current_page: Scalars['Int'];
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
};

export enum PaymentMode {
  Free = 'free',
  Later = 'later',
  Now = 'now',
  PaymentIntent = 'payment_intent'
}

export type Permission = {
  __typename: 'Permission';
  id: Scalars['ID'];
  model: PermissionedModel;
  permission: Scalars['String'];
  role: PermissionedRole;
};

export type PermissionInput = {
  modelId?: InputMaybe<Scalars['ID']>;
  model_type?: InputMaybe<PermissionedModelTypeIndicator>;
  permission: Scalars['String'];
  roleId?: InputMaybe<Scalars['ID']>;
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
  time?: InputMaybe<Scalars['Date']>;
};

export type PricingStructureInput = {
  fixed_value?: InputMaybe<MoneyInput>;
  pricing_strategy: PricingStrategy;
  scheduled_value?: InputMaybe<ScheduledMoneyValueInput>;
};

export type PricingStructureValue = Money | ScheduledMoneyValue;

export type Product = {
  __typename: 'Product';
  available: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  description_html?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<ActiveStorageAttachment>;
  /** @deprecated Please use the image field instead. */
  image_url?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  order_quantities_by_status: Array<OrderQuantityByStatus>;
  payment_options: Array<Scalars['String']>;
  pricing_structure: PricingStructure;
  product_variants: Array<ProductVariant>;
  provides_ticket_type?: Maybe<TicketType>;
};

export type ProductInput = {
  available?: InputMaybe<Scalars['Boolean']>;
  deleteVariantIds?: InputMaybe<Array<Scalars['ID']>>;
  description?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['Upload']>;
  name?: InputMaybe<Scalars['String']>;
  payment_options?: InputMaybe<Array<Scalars['String']>>;
  pricing_structure?: InputMaybe<PricingStructureInput>;
  product_variants?: InputMaybe<Array<ProductVariantInput>>;
  providesTicketTypeId?: InputMaybe<Scalars['ID']>;
};

export type ProductVariant = {
  __typename: 'ProductVariant';
  description?: Maybe<Scalars['String']>;
  description_html?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<ActiveStorageAttachment>;
  /** @deprecated Please use the image field instead. */
  image_url?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  order_quantities_by_status: Array<OrderQuantityByStatus>;
  override_pricing_structure?: Maybe<PricingStructure>;
  position?: Maybe<Scalars['Int']>;
  product: Product;
};

export type ProductVariantInput = {
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  image?: InputMaybe<Scalars['Upload']>;
  name?: InputMaybe<Scalars['String']>;
  override_pricing_structure?: InputMaybe<PricingStructureInput>;
};

/** Autogenerated input type of ProvideEventTicket */
export type ProvideEventTicketInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['ID']>;
  ticketTypeId?: InputMaybe<Scalars['ID']>;
  userConProfileId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of ProvideEventTicket */
export type ProvideEventTicketPayload = {
  __typename: 'ProvideEventTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
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
   */
  accountFormContentHtml?: Maybe<Scalars['String']>;
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
  /**
   * Returns a paginated list of the _global_ email routes configured in Intercode.
   * (Convention-specific email routing is controlled via that convention's StaffPositions.)
   */
  email_routes_paginated: EmailRoutesPagination;
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
  oauthPreAuth: Scalars['Json'];
  /** Returns all organizations in the database. */
  organizations: Array<Organization>;
  /** Returns the singleton RootSite object, which is a CMS parent. */
  rootSite: RootSite;
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
  domain: Scalars['String'];
};


export type QueryConventionByDomainArgs = {
  domain: Scalars['String'];
};


export type QueryConventionByIdArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryConventions_PaginatedArgs = {
  filters?: InputMaybe<ConventionFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryEmail_Routes_PaginatedArgs = {
  filters?: InputMaybe<EmailRouteFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryOauthPreAuthArgs = {
  queryParams: Scalars['Json'];
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryUsersArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryUsers_PaginatedArgs = {
  filters?: InputMaybe<UserFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};

/** Autogenerated input type of RateEvent */
export type RateEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['ID']>;
  rating: Scalars['Int'];
};

/** Autogenerated return type of RateEvent */
export type RateEventPayload = {
  __typename: 'RateEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
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

export type RegistrationPolicy = {
  __typename: 'RegistrationPolicy';
  buckets: Array<RegistrationPolicyBucket>;
  minimum_slots?: Maybe<Scalars['Int']>;
  minimum_slots_including_not_counted?: Maybe<Scalars['Int']>;
  only_uncounted?: Maybe<Scalars['Boolean']>;
  preferred_slots?: Maybe<Scalars['Int']>;
  preferred_slots_including_not_counted?: Maybe<Scalars['Int']>;
  prevent_no_preference_signups: Scalars['Boolean'];
  slots_limited?: Maybe<Scalars['Boolean']>;
  total_slots?: Maybe<Scalars['Int']>;
  total_slots_including_not_counted?: Maybe<Scalars['Int']>;
};

export type RegistrationPolicyBucket = {
  __typename: 'RegistrationPolicyBucket';
  anything: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  expose_attendees: Scalars['Boolean'];
  key: Scalars['String'];
  minimum_slots?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  not_counted: Scalars['Boolean'];
  preferred_slots?: Maybe<Scalars['Int']>;
  slots_limited: Scalars['Boolean'];
  total_slots?: Maybe<Scalars['Int']>;
};

/** Autogenerated input type of RejectSignupRequest */
export type RejectSignupRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of RejectSignupRequest */
export type RejectSignupRequestPayload = {
  __typename: 'RejectSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup_request: SignupRequest;
};

/** Autogenerated input type of RenameCmsFile */
export type RenameCmsFileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  filename: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of RenameCmsFile */
export type RenameCmsFilePayload = {
  __typename: 'RenameCmsFilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_file: CmsFile;
};

/** Autogenerated input type of RestoreDroppedEvent */
export type RestoreDroppedEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of RestoreDroppedEvent */
export type RestoreDroppedEventPayload = {
  __typename: 'RestoreDroppedEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: Event;
};

/** Autogenerated input type of RevokeAuthorizedApplication */
export type RevokeAuthorizedApplicationInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  uid: Scalars['ID'];
};

/** Autogenerated return type of RevokeAuthorizedApplication */
export type RevokeAuthorizedApplicationPayload = {
  __typename: 'RevokeAuthorizedApplicationPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

export type Room = {
  __typename: 'Room';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  runs: Array<Run>;
};

export type RoomInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type RootSite = CmsParent & {
  __typename: 'RootSite';
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
  defaultLayout: CmsLayout;
  /**
   * Returns the CMS layout to be used for a particular URL path within the current domain. (This
   * will be the page-specific layout if the URL corresponds to a page with a layout override, or
   * the default layout for the domain otherwise.)
   */
  effectiveCmsLayout: CmsLayout;
  /** Does a full-text search within this domain. */
  fullTextSearch: SearchResult;
  host: Scalars['String'];
  id: Scalars['ID'];
  /**
   * Returns all the Liquid assigns for regular CMS page rendering in the current domain name.
   * This is a combination of globally-accessible Liquid assigns and domain-specific user-defined
   * CMS variables.
   */
  liquidAssigns: Array<LiquidAssign>;
  /** Given a Liquid text string, renders it to HTML and returns the result. */
  previewLiquid: Scalars['String'];
  /** Given a Markdown text string, renders it to HTML and returns the result. */
  previewMarkdown: Scalars['String'];
  rootPage: Page;
  site_name: Scalars['String'];
  /**
   * Finds CMS content by partial name, case-insensitive, within the current domain's CMS content.
   * For example, in a convention that has a partial called `attendee_profile` and a page called
   * `info_for_attendees`, a search for `attendee` would return both of these.
   *
   * This query is always limited to a maximum of 10 results.
   */
  typeaheadSearchCmsContent: Array<CmsContent>;
  url: Scalars['String'];
};


export type RootSiteCmsContentGroupArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type RootSiteCmsPageArgs = {
  id?: InputMaybe<Scalars['ID']>;
  rootPage?: InputMaybe<Scalars['Boolean']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type RootSiteEffectiveCmsLayoutArgs = {
  path: Scalars['String'];
};


export type RootSiteFullTextSearchArgs = {
  query: Scalars['String'];
};


export type RootSitePreviewLiquidArgs = {
  content: Scalars['String'];
};


export type RootSitePreviewMarkdownArgs = {
  eventId?: InputMaybe<Scalars['ID']>;
  eventProposalId?: InputMaybe<Scalars['ID']>;
  markdown: Scalars['String'];
};


export type RootSiteTypeaheadSearchCmsContentArgs = {
  name?: InputMaybe<Scalars['String']>;
};

export type RootSiteInput = {
  defaultLayoutId?: InputMaybe<Scalars['ID']>;
  rootPageId?: InputMaybe<Scalars['ID']>;
  site_name?: InputMaybe<Scalars['String']>;
};

export type Run = {
  __typename: 'Run';
  confirmed_limited_signup_count: Scalars['Int'];
  confirmed_signup_count: Scalars['Int'];
  current_ability_can_signup_summary_run: Scalars['Boolean'];
  ends_at: Scalars['Date'];
  event: Event;
  id: Scalars['ID'];
  my_signup_requests: Array<SignupRequest>;
  my_signups: Array<Signup>;
  not_counted_confirmed_signup_count: Scalars['Int'];
  not_counted_signup_count: Scalars['Int'];
  room_names: Array<Scalars['String']>;
  rooms: Array<Room>;
  schedule_note?: Maybe<Scalars['String']>;
  signup_changes_paginated: SignupChangesPagination;
  signup_count_by_state_and_bucket_key_and_counted: Scalars['Json'];
  signups_paginated: SignupsPagination;
  starts_at: Scalars['Date'];
  title_suffix?: Maybe<Scalars['String']>;
  waitlisted_signup_count: Scalars['Int'];
};


export type RunSignup_Changes_PaginatedArgs = {
  filters?: InputMaybe<SignupChangeFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type RunSignups_PaginatedArgs = {
  filters?: InputMaybe<SignupFiltersInput>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};

export type RunInput = {
  roomIds?: InputMaybe<Array<Scalars['ID']>>;
  schedule_note?: InputMaybe<Scalars['String']>;
  starts_at?: InputMaybe<Scalars['Date']>;
  title_suffix?: InputMaybe<Scalars['String']>;
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
  total_entries: Scalars['Int'];
};

export type SearchResultEntry = {
  __typename: 'SearchResultEntry';
  highlight?: Maybe<Scalars['String']>;
  model: SearchableModel;
  rank: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
};

export type SearchableModel = Event | EventProposal | Page | UserConProfile;

/** Autogenerated input type of SetCmsVariable */
export type SetCmsVariableInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  cms_variable: CmsVariableInput;
};

/** Autogenerated return type of SetCmsVariable */
export type SetCmsVariablePayload = {
  __typename: 'SetCmsVariablePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_variable: CmsVariable;
};

/** Autogenerated input type of SetConventionCanceled */
export type SetConventionCanceledInput = {
  canceled: Scalars['Boolean'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of SetConventionCanceled */
export type SetConventionCanceledPayload = {
  __typename: 'SetConventionCanceledPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  convention: Convention;
};

export enum ShowSchedule {
  Gms = 'gms',
  No = 'no',
  Priv = 'priv',
  Yes = 'yes'
}

export type Signup = {
  __typename: 'Signup';
  age_restrictions_check: Scalars['String'];
  bucket_key?: Maybe<Scalars['String']>;
  choice?: Maybe<Scalars['Int']>;
  counted: Scalars['Boolean'];
  created_at: Scalars['Date'];
  id: Scalars['ID'];
  requested_bucket_key?: Maybe<Scalars['String']>;
  run: Run;
  state: SignupState;
  updated_at: Scalars['Date'];
  user_con_profile: UserConProfile;
  waitlist_position?: Maybe<Scalars['Int']>;
};

export type SignupChange = {
  __typename: 'SignupChange';
  action: SignupChangeAction;
  bucket_key?: Maybe<Scalars['String']>;
  counted: Scalars['Boolean'];
  created_at: Scalars['Date'];
  id: Scalars['ID'];
  previous_signup_change?: Maybe<SignupChange>;
  run: Run;
  signup: Signup;
  state: SignupState;
  updated_at: Scalars['Date'];
  user_con_profile: UserConProfile;
};

export enum SignupChangeAction {
  AcceptSignupRequest = 'accept_signup_request',
  AdminCreateSignup = 'admin_create_signup',
  ChangeRegistrationPolicy = 'change_registration_policy',
  SelfServiceSignup = 'self_service_signup',
  Unknown = 'unknown',
  VacancyFill = 'vacancy_fill',
  Withdraw = 'withdraw'
}

export type SignupChangeFiltersInput = {
  action?: InputMaybe<Array<Scalars['String']>>;
  event_title?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type SignupChangesPagination = PaginationInterface & {
  __typename: 'SignupChangesPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int'];
  entries: Array<SignupChange>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
};

export type SignupCountByState = {
  __typename: 'SignupCountByState';
  count: Scalars['Int'];
  state: SignupState;
};

export type SignupFiltersInput = {
  bucket?: InputMaybe<Array<Scalars['String']>>;
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Array<Scalars['String']>>;
};

export enum SignupMode {
  /** Attendees can request signups and signup changes but con staff must approve them */
  Moderated = 'moderated',
  /** Attendees can sign themselves up for events */
  SelfService = 'self_service'
}

export type SignupMoveResult = {
  __typename: 'SignupMoveResult';
  bucket_key?: Maybe<Scalars['String']>;
  prev_bucket_key?: Maybe<Scalars['String']>;
  prev_state: SignupState;
  signup: Signup;
  signup_id: Scalars['Int'];
  state: SignupState;
};

export type SignupRequest = {
  __typename: 'SignupRequest';
  created_at: Scalars['Date'];
  id: Scalars['ID'];
  replace_signup?: Maybe<Signup>;
  requested_bucket_key?: Maybe<Scalars['String']>;
  result_signup?: Maybe<Signup>;
  state: SignupRequestState;
  target_run: Run;
  updated_at: Scalars['Date'];
  updated_by: User;
  user_con_profile: UserConProfile;
};

export type SignupRequestFiltersInput = {
  state?: InputMaybe<Array<SignupRequestState>>;
};

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
  current_page: Scalars['Int'];
  entries: Array<SignupRequest>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
};

export enum SignupState {
  Confirmed = 'confirmed',
  Waitlisted = 'waitlisted',
  Withdrawn = 'withdrawn'
}

export type SignupsPagination = PaginationInterface & {
  __typename: 'SignupsPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int'];
  entries: Array<Signup>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  sort_items: Array<UpdateCmsNavigationItemInput>;
};

/** Autogenerated return type of SortCmsNavigationItems */
export type SortCmsNavigationItemsPayload = {
  __typename: 'SortCmsNavigationItemsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
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
  desc: Scalars['Boolean'];
  /** The name of the field to sort by. */
  field: Scalars['String'];
};

export type StaffPosition = {
  __typename: 'StaffPosition';
  cc_addresses: Array<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_aliases: Array<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  permissions: Array<Permission>;
  user_con_profiles: Array<UserConProfile>;
  visible?: Maybe<Scalars['Boolean']>;
};

export type StaffPositionInput = {
  cc_addresses?: InputMaybe<Array<Scalars['String']>>;
  email?: InputMaybe<Scalars['String']>;
  email_aliases?: InputMaybe<Array<Scalars['String']>>;
  name?: InputMaybe<Scalars['String']>;
  userConProfileIds?: InputMaybe<Array<Scalars['ID']>>;
  visible?: InputMaybe<Scalars['Boolean']>;
};

export type StripeAccount = {
  __typename: 'StripeAccount';
  account_onboarding_link: Scalars['String'];
  charges_enabled: Scalars['Boolean'];
  display_name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};


export type StripeAccountAccount_Onboarding_LinkArgs = {
  base_url: Scalars['String'];
};

/** Autogenerated input type of SubmitEventProposal */
export type SubmitEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of SubmitEventProposal */
export type SubmitEventProposalPayload = {
  __typename: 'SubmitEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of SubmitOrder */
export type SubmitOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  payment_intent_id?: InputMaybe<Scalars['String']>;
  payment_mode: PaymentMode;
  stripe_token?: InputMaybe<Scalars['String']>;
};

/** Autogenerated return type of SubmitOrder */
export type SubmitOrderPayload = {
  __typename: 'SubmitOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order: Order;
};

export type TeamMember = {
  __typename: 'TeamMember';
  display_team_member: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  event: Event;
  id: Scalars['ID'];
  receive_con_email: Scalars['Boolean'];
  receive_signup_email: ReceiveSignupEmail;
  show_email: Scalars['Boolean'];
  user_con_profile: UserConProfile;
};

export type TeamMemberInput = {
  display_team_member?: InputMaybe<Scalars['Boolean']>;
  receive_con_email?: InputMaybe<Scalars['Boolean']>;
  receive_signup_email?: InputMaybe<ReceiveSignupEmail>;
  show_email?: InputMaybe<Scalars['Boolean']>;
};

export type Ticket = {
  __typename: 'Ticket';
  convention: Convention;
  created_at: Scalars['Date'];
  event?: Maybe<Event>;
  id: Scalars['ID'];
  order_entry?: Maybe<OrderEntry>;
  provided_by_event?: Maybe<Event>;
  ticket_type: TicketType;
  updated_at: Scalars['Date'];
  user_con_profile: UserConProfile;
};

export type TicketCountByTypeAndPaymentAmount = {
  __typename: 'TicketCountByTypeAndPaymentAmount';
  count: Scalars['Int'];
  payment_amount: Money;
  ticket_type: TicketType;
};

export type TicketInput = {
  providedByEventId?: InputMaybe<Scalars['ID']>;
  ticketTypeId?: InputMaybe<Scalars['ID']>;
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
  allows_event_signups: Scalars['Boolean'];
  convention?: Maybe<Convention>;
  counts_towards_convention_maximum: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  event?: Maybe<Event>;
  id: Scalars['ID'];
  maximum_event_provided_tickets: Scalars['Int'];
  name: Scalars['String'];
  parent: TicketTypeParent;
  providing_products: Array<Product>;
};


export type TicketTypeMaximum_Event_Provided_TicketsArgs = {
  eventId?: InputMaybe<Scalars['ID']>;
};

export type TicketTypeInput = {
  allows_event_signups?: InputMaybe<Scalars['Boolean']>;
  counts_towards_convention_maximum?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  maximum_event_provided_tickets?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  pricing_schedule?: InputMaybe<ScheduledMoneyValueInput>;
  publicly_available?: InputMaybe<Scalars['Boolean']>;
};

export type TicketTypeParent = Convention | Event;

export type TimespanWithMoneyValue = {
  __typename: 'TimespanWithMoneyValue';
  finish?: Maybe<Scalars['Date']>;
  start?: Maybe<Scalars['Date']>;
  value: Money;
};

export type TimespanWithMoneyValueInput = {
  finish?: InputMaybe<Scalars['Date']>;
  start?: InputMaybe<Scalars['Date']>;
  value: MoneyInput;
};

export type TimespanWithValue = {
  __typename: 'TimespanWithValue';
  finish?: Maybe<Scalars['Date']>;
  start?: Maybe<Scalars['Date']>;
  value: Scalars['String'];
};

export type TimespanWithValueInput = {
  finish?: InputMaybe<Scalars['Date']>;
  start?: InputMaybe<Scalars['Date']>;
  string_value?: InputMaybe<Scalars['String']>;
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
  clientMutationId?: InputMaybe<Scalars['String']>;
  drop_event?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  status: Scalars['String'];
};

/** Autogenerated return type of TransitionEventProposal */
export type TransitionEventProposalPayload = {
  __typename: 'TransitionEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of UpdateCmsContentGroup */
export type UpdateCmsContentGroupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  cms_content_group: CmsContentGroupInput;
  grant_permissions?: InputMaybe<Array<PermissionInput>>;
  id?: InputMaybe<Scalars['ID']>;
  revoke_permissions?: InputMaybe<Array<PermissionInput>>;
};

/** Autogenerated return type of UpdateCmsContentGroup */
export type UpdateCmsContentGroupPayload = {
  __typename: 'UpdateCmsContentGroupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_content_group: CmsContentGroup;
};

/** Autogenerated input type of UpdateCmsGraphqlQuery */
export type UpdateCmsGraphqlQueryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  query: CmsGraphqlQueryInput;
};

/** Autogenerated return type of UpdateCmsGraphqlQuery */
export type UpdateCmsGraphqlQueryPayload = {
  __typename: 'UpdateCmsGraphqlQueryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  query: CmsGraphqlQuery;
};

/** Autogenerated input type of UpdateCmsLayout */
export type UpdateCmsLayoutInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  cms_layout: CmsLayoutInput;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateCmsLayout */
export type UpdateCmsLayoutPayload = {
  __typename: 'UpdateCmsLayoutPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_layout: CmsLayout;
};

/** Autogenerated input type of UpdateCmsNavigationItem */
export type UpdateCmsNavigationItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  cms_navigation_item?: InputMaybe<CmsNavigationItemInput>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateCmsNavigationItem */
export type UpdateCmsNavigationItemPayload = {
  __typename: 'UpdateCmsNavigationItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_navigation_item: CmsNavigationItem;
};

/** Autogenerated input type of UpdateCmsPartial */
export type UpdateCmsPartialInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  cms_partial: CmsPartialInput;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateCmsPartial */
export type UpdateCmsPartialPayload = {
  __typename: 'UpdateCmsPartialPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_partial: CmsPartial;
};

/** Autogenerated input type of UpdateConvention */
export type UpdateConventionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  convention: ConventionInput;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateConvention */
export type UpdateConventionPayload = {
  __typename: 'UpdateConventionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  convention: Convention;
};

/** Autogenerated input type of UpdateCoupon */
export type UpdateCouponInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  coupon: CouponInput;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateCoupon */
export type UpdateCouponPayload = {
  __typename: 'UpdateCouponPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon: Coupon;
};

/** Autogenerated input type of UpdateDepartment */
export type UpdateDepartmentInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  department: DepartmentInput;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateDepartment */
export type UpdateDepartmentPayload = {
  __typename: 'UpdateDepartmentPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  department: Department;
};

/** Autogenerated input type of UpdateEmailRoute */
export type UpdateEmailRouteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  email_route: EmailRouteInput;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateEmailRoute */
export type UpdateEmailRoutePayload = {
  __typename: 'UpdateEmailRoutePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  email_route: EmailRoute;
};

/** Autogenerated input type of UpdateEventAdminNotes */
export type UpdateEventAdminNotesInput = {
  admin_notes: Scalars['String'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateEventAdminNotes */
export type UpdateEventAdminNotesPayload = {
  __typename: 'UpdateEventAdminNotesPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: Event;
};

/** Autogenerated input type of UpdateEventCategory */
export type UpdateEventCategoryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  event_category: EventCategoryInput;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateEventCategory */
export type UpdateEventCategoryPayload = {
  __typename: 'UpdateEventCategoryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_category: EventCategory;
};

/** Autogenerated input type of UpdateEvent */
export type UpdateEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  event?: InputMaybe<EventInput>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateEvent */
export type UpdateEventPayload = {
  __typename: 'UpdateEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: Event;
};

/** Autogenerated input type of UpdateEventProposalAdminNotes */
export type UpdateEventProposalAdminNotesInput = {
  admin_notes: Scalars['String'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateEventProposalAdminNotes */
export type UpdateEventProposalAdminNotesPayload = {
  __typename: 'UpdateEventProposalAdminNotesPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of UpdateEventProposal */
export type UpdateEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  event_proposal: EventProposalInput;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateEventProposal */
export type UpdateEventProposalPayload = {
  __typename: 'UpdateEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of UpdateForm */
export type UpdateFormInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  form: FormInput;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated input type of UpdateFormItem */
export type UpdateFormItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  form_item: FormItemInput;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateFormItem */
export type UpdateFormItemPayload = {
  __typename: 'UpdateFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_item: FormItem;
};

/** Autogenerated return type of UpdateForm */
export type UpdateFormPayload = {
  __typename: 'UpdateFormPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: Form;
};

/** Autogenerated input type of UpdateFormSection */
export type UpdateFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  form_section: FormSectionInput;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateFormSection */
export type UpdateFormSectionPayload = {
  __typename: 'UpdateFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_section: FormSection;
};

/** Autogenerated input type of UpdateFormWithJSON */
export type UpdateFormWithJsonInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  form_json: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateFormWithJSON */
export type UpdateFormWithJsonPayload = {
  __typename: 'UpdateFormWithJSONPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: Form;
};

/** Autogenerated input type of UpdateMaximumEventProvidedTicketsOverride */
export type UpdateMaximumEventProvidedTicketsOverrideInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  override_value: Scalars['Int'];
};

/** Autogenerated return type of UpdateMaximumEventProvidedTicketsOverride */
export type UpdateMaximumEventProvidedTicketsOverridePayload = {
  __typename: 'UpdateMaximumEventProvidedTicketsOverridePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  maximum_event_provided_tickets_override: MaximumEventProvidedTicketsOverride;
};

/** Autogenerated input type of UpdateNotificationTemplate */
export type UpdateNotificationTemplateInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  event_key: Scalars['String'];
  notification_template: NotificationTemplateInput;
};

/** Autogenerated return type of UpdateNotificationTemplate */
export type UpdateNotificationTemplatePayload = {
  __typename: 'UpdateNotificationTemplatePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  notification_template: NotificationTemplate;
};

/** Autogenerated input type of UpdateOrderEntry */
export type UpdateOrderEntryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  order_entry: OrderEntryInput;
};

/** Autogenerated return type of UpdateOrderEntry */
export type UpdateOrderEntryPayload = {
  __typename: 'UpdateOrderEntryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order_entry: OrderEntry;
};

/** Autogenerated input type of UpdateOrder */
export type UpdateOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  order: OrderInput;
};

/** Autogenerated return type of UpdateOrder */
export type UpdateOrderPayload = {
  __typename: 'UpdateOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order: Order;
};

/** Autogenerated input type of UpdateOrganizationRole */
export type UpdateOrganizationRoleInput = {
  addUserIds?: InputMaybe<Array<Scalars['ID']>>;
  add_permissions?: InputMaybe<Array<PermissionInput>>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  organization_role: OrganizationRoleInput;
  removePermissionIds?: InputMaybe<Array<Scalars['ID']>>;
  removeUserIds?: InputMaybe<Array<Scalars['ID']>>;
};

/** Autogenerated return type of UpdateOrganizationRole */
export type UpdateOrganizationRolePayload = {
  __typename: 'UpdateOrganizationRolePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  organization_role: OrganizationRole;
};

/** Autogenerated input type of UpdatePage */
export type UpdatePageInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  page: PageInput;
};

/** Autogenerated return type of UpdatePage */
export type UpdatePagePayload = {
  __typename: 'UpdatePagePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  page: Page;
};

/** Autogenerated input type of UpdateProduct */
export type UpdateProductInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  product: ProductInput;
};

/** Autogenerated return type of UpdateProduct */
export type UpdateProductPayload = {
  __typename: 'UpdateProductPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  product: Product;
};

/** Autogenerated input type of UpdateRoom */
export type UpdateRoomInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  room: RoomInput;
};

/** Autogenerated return type of UpdateRoom */
export type UpdateRoomPayload = {
  __typename: 'UpdateRoomPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  room: Room;
};

/** Autogenerated input type of UpdateRootSite */
export type UpdateRootSiteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  root_site: RootSiteInput;
};

/** Autogenerated return type of UpdateRootSite */
export type UpdateRootSitePayload = {
  __typename: 'UpdateRootSitePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  root_site: RootSite;
};

/** Autogenerated input type of UpdateRun */
export type UpdateRunInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  run: RunInput;
};

/** Autogenerated return type of UpdateRun */
export type UpdateRunPayload = {
  __typename: 'UpdateRunPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  run: Run;
};

/** Autogenerated input type of UpdateSignupBucket */
export type UpdateSignupBucketInput = {
  bucket_key: Scalars['String'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateSignupBucket */
export type UpdateSignupBucketPayload = {
  __typename: 'UpdateSignupBucketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

/** Autogenerated input type of UpdateSignupCounted */
export type UpdateSignupCountedInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  counted: Scalars['Boolean'];
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateSignupCounted */
export type UpdateSignupCountedPayload = {
  __typename: 'UpdateSignupCountedPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

/** Autogenerated input type of UpdateStaffPosition */
export type UpdateStaffPositionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  staff_position: StaffPositionInput;
};

/** Autogenerated return type of UpdateStaffPosition */
export type UpdateStaffPositionPayload = {
  __typename: 'UpdateStaffPositionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of UpdateStaffPositionPermissions */
export type UpdateStaffPositionPermissionsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  grant_permissions: Array<PermissionInput>;
  revoke_permissions: Array<PermissionInput>;
  staffPositionId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of UpdateStaffPositionPermissions */
export type UpdateStaffPositionPermissionsPayload = {
  __typename: 'UpdateStaffPositionPermissionsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of UpdateTeamMember */
export type UpdateTeamMemberInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  team_member: TeamMemberInput;
};

/** Autogenerated return type of UpdateTeamMember */
export type UpdateTeamMemberPayload = {
  __typename: 'UpdateTeamMemberPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  team_member: TeamMember;
};

/** Autogenerated input type of UpdateTicket */
export type UpdateTicketInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  ticket: TicketInput;
};

/** Autogenerated return type of UpdateTicket */
export type UpdateTicketPayload = {
  __typename: 'UpdateTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket: Ticket;
};

/** Autogenerated input type of UpdateTicketType */
export type UpdateTicketTypeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  ticket_type: TicketTypeInput;
};

/** Autogenerated return type of UpdateTicketType */
export type UpdateTicketTypePayload = {
  __typename: 'UpdateTicketTypePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket_type: TicketType;
};

/** Autogenerated input type of UpdateUserActivityAlert */
export type UpdateUserActivityAlertInput = {
  add_notification_destinations: Array<NotificationDestinationInput>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  removeNotificationDestinationIds?: InputMaybe<Array<Scalars['ID']>>;
  user_activity_alert: UserActivityAlertInput;
};

/** Autogenerated return type of UpdateUserActivityAlert */
export type UpdateUserActivityAlertPayload = {
  __typename: 'UpdateUserActivityAlertPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_activity_alert: UserActivityAlert;
};

/** Autogenerated input type of UpdateUserConProfile */
export type UpdateUserConProfileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  user_con_profile: UserConProfileInput;
};

/** Autogenerated return type of UpdateUserConProfile */
export type UpdateUserConProfilePayload = {
  __typename: 'UpdateUserConProfilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_con_profile: UserConProfile;
};

export type User = {
  __typename: 'User';
  email?: Maybe<Scalars['String']>;
  event_proposals: Array<EventProposal>;
  first_name?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  last_name?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  name_inverted?: Maybe<Scalars['String']>;
  privileges?: Maybe<Array<Scalars['String']>>;
  user_con_profiles: Array<UserConProfile>;
};

export type UserActivityAlert = {
  __typename: 'UserActivityAlert';
  convention: Convention;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  notification_destinations: Array<NotificationDestination>;
  partial_name?: Maybe<Scalars['String']>;
  trigger_on_ticket_create: Scalars['Boolean'];
  trigger_on_user_con_profile_create: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type UserActivityAlertInput = {
  email?: InputMaybe<Scalars['String']>;
  partial_name?: InputMaybe<Scalars['String']>;
  trigger_on_ticket_create?: InputMaybe<Scalars['Boolean']>;
  trigger_on_user_con_profile_create?: InputMaybe<Scalars['Boolean']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type UserConProfile = {
  __typename: 'UserConProfile';
  ability?: Maybe<Ability>;
  accepted_clickwrap_agreement?: Maybe<Scalars['Boolean']>;
  address?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  bio_html?: Maybe<Scalars['String']>;
  bio_name?: Maybe<Scalars['String']>;
  birth_date?: Maybe<Scalars['Date']>;
  can_have_bio: Scalars['Boolean'];
  can_override_maximum_event_provided_tickets: Scalars['Boolean'];
  city?: Maybe<Scalars['String']>;
  convention: Convention;
  country?: Maybe<Scalars['String']>;
  /** If this profile has a pending order, returns that order. Otherwise, returns null. */
  current_pending_order?: Maybe<Order>;
  current_user_form_item_viewer_role: FormItemRole;
  current_user_form_item_writer_role: FormItemRole;
  email?: Maybe<Scalars['String']>;
  first_name: Scalars['String'];
  form_response_attrs_json?: Maybe<Scalars['Json']>;
  form_response_attrs_json_with_rendered_markdown?: Maybe<Scalars['Json']>;
  gravatar_enabled: Scalars['Boolean'];
  gravatar_url: Scalars['String'];
  ical_secret?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  last_name: Scalars['String'];
  mobile_phone?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  name_inverted: Scalars['String'];
  name_without_nickname: Scalars['String'];
  nickname?: Maybe<Scalars['String']>;
  order_summary: Scalars['String'];
  orders: Array<Order>;
  show_nickname_in_bio?: Maybe<Scalars['Boolean']>;
  signup_requests: Array<SignupRequest>;
  signups: Array<Signup>;
  site_admin: Scalars['Boolean'];
  staff_positions: Array<StaffPosition>;
  state?: Maybe<Scalars['String']>;
  team_members: Array<TeamMember>;
  ticket?: Maybe<Ticket>;
  user?: Maybe<User>;
  user_id: Scalars['Int'];
  zipcode?: Maybe<Scalars['String']>;
};

export type UserConProfileFiltersInput = {
  attending?: InputMaybe<Scalars['Boolean']>;
  email?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  is_team_member?: InputMaybe<Scalars['Boolean']>;
  last_name?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  payment_amount?: InputMaybe<Scalars['Float']>;
  /** DEPRECATED. Privileges are deprecated in favor of permissions and staff positions */
  privileges?: InputMaybe<Array<Scalars['String']>>;
  ticket?: InputMaybe<Array<Scalars['String']>>;
  ticket_type?: InputMaybe<Array<Scalars['String']>>;
};

export type UserConProfileInput = {
  address?: InputMaybe<Scalars['String']>;
  best_call_time?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  birth_date?: InputMaybe<Scalars['Date']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  day_phone?: InputMaybe<Scalars['String']>;
  evening_phone?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  form_response_attrs_json?: InputMaybe<Scalars['String']>;
  gravatar_enabled?: InputMaybe<Scalars['Boolean']>;
  last_name?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
  preferred_contact?: InputMaybe<Scalars['String']>;
  show_nickname_in_bio?: InputMaybe<Scalars['Boolean']>;
  state?: InputMaybe<Scalars['String']>;
  zipcode?: InputMaybe<Scalars['String']>;
};

export type UserConProfilesPagination = PaginationInterface & {
  __typename: 'UserConProfilesPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int'];
  entries: Array<UserConProfile>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
};

export type UserFiltersInput = {
  email?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  privileges?: InputMaybe<Array<Scalars['String']>>;
};

export type UsersPagination = PaginationInterface & {
  __typename: 'UsersPagination';
  /** The number of the page currently being returned in this query */
  current_page: Scalars['Int'];
  entries: Array<User>;
  /** The number of items per page currently being returned in this query */
  per_page: Scalars['Int'];
  /** The total number of items in the paginated list (across all pages) */
  total_entries: Scalars['Int'];
  /** The total number of pages in the paginated list */
  total_pages: Scalars['Int'];
};

export type WinningUserConProfileInput = {
  conventionId?: InputMaybe<Scalars['ID']>;
  userConProfileId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated input type of WithdrawAllUserConProfileSignups */
export type WithdrawAllUserConProfileSignupsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  userConProfileId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of WithdrawAllUserConProfileSignups */
export type WithdrawAllUserConProfileSignupsPayload = {
  __typename: 'WithdrawAllUserConProfileSignupsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_con_profile: UserConProfile;
};

/** Autogenerated input type of WithdrawMySignup */
export type WithdrawMySignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  runId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of WithdrawMySignup */
export type WithdrawMySignupPayload = {
  __typename: 'WithdrawMySignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

/** Autogenerated input type of WithdrawSignupRequest */
export type WithdrawSignupRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of WithdrawSignupRequest */
export type WithdrawSignupRequestPayload = {
  __typename: 'WithdrawSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup_request: SignupRequest;
};

/** Autogenerated input type of WithdrawUserSignup */
export type WithdrawUserSignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  runId?: InputMaybe<Scalars['ID']>;
  suppress_notifications?: InputMaybe<Scalars['Boolean']>;
  userConProfileId?: InputMaybe<Scalars['ID']>;
};

/** Autogenerated return type of WithdrawUserSignup */
export type WithdrawUserSignupPayload = {
  __typename: 'WithdrawUserSignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};
