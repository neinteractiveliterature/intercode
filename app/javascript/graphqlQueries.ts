/* eslint-disable */
import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date in ISO8601 format */
  Date: any;
  /** An arbitrary object, serialized as JSON */
  Json: any;
  BigDecimal: any;
  Upload: any;
};

export type Ability = {
  __typename?: 'Ability';
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
  /** @deprecated Privileges have been removed in favor of permissions.  This will always return false. */
  can_update_privileges_user_con_profile: Scalars['Boolean'];
  can_update_products: Scalars['Boolean'];
  can_update_signup: Scalars['Boolean'];
  can_update_signups: Scalars['Boolean'];
  can_update_ticket: Scalars['Boolean'];
  can_update_user_con_profile: Scalars['Boolean'];
  can_withdraw_all_user_con_profile_signups: Scalars['Boolean'];
};


export type AbilityCan_Become_User_Con_ProfileArgs = {
  user_con_profile_id: Scalars['Int'];
};


export type AbilityCan_Delete_EventArgs = {
  event_id: Scalars['Int'];
};


export type AbilityCan_Delete_Event_ProposalArgs = {
  event_proposal_id: Scalars['Int'];
};


export type AbilityCan_Delete_TicketArgs = {
  ticket_id: Scalars['Int'];
};


export type AbilityCan_Delete_User_Con_ProfileArgs = {
  user_con_profile_id: Scalars['Int'];
};


export type AbilityCan_Force_Confirm_SignupArgs = {
  signup_id: Scalars['Int'];
};


export type AbilityCan_Read_Admin_Notes_On_Event_ProposalArgs = {
  event_proposal_id: Scalars['Int'];
};


export type AbilityCan_Read_Event_SignupsArgs = {
  event_id: Scalars['Int'];
};


export type AbilityCan_Update_Admin_Notes_On_Event_ProposalArgs = {
  event_proposal_id: Scalars['Int'];
};


export type AbilityCan_Update_Bucket_SignupArgs = {
  signup_id: Scalars['Int'];
};


export type AbilityCan_Update_Counted_SignupArgs = {
  signup_id: Scalars['Int'];
};


export type AbilityCan_Update_EventArgs = {
  event_id: Scalars['Int'];
};


export type AbilityCan_Update_Event_ProposalArgs = {
  event_proposal_id: Scalars['Int'];
};


export type AbilityCan_Update_Privileges_User_Con_ProfileArgs = {
  user_con_profile_id: Scalars['Int'];
};


export type AbilityCan_Update_SignupArgs = {
  signup_id: Scalars['Int'];
};


export type AbilityCan_Update_TicketArgs = {
  ticket_id: Scalars['Int'];
};


export type AbilityCan_Update_User_Con_ProfileArgs = {
  user_con_profile_id: Scalars['Int'];
};


export type AbilityCan_Withdraw_All_User_Con_Profile_SignupsArgs = {
  user_con_profile_id: Scalars['Int'];
};

/** Autogenerated input type of AcceptClickwrapAgreement */
export type AcceptClickwrapAgreementInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Autogenerated return type of AcceptClickwrapAgreement */
export type AcceptClickwrapAgreementPayload = {
  __typename?: 'AcceptClickwrapAgreementPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  my_profile: UserConProfile;
};

/** Autogenerated input type of AcceptSignupRequest */
export type AcceptSignupRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of AcceptSignupRequest */
export type AcceptSignupRequestPayload = {
  __typename?: 'AcceptSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
  signup_request: SignupRequest;
};

/** Autogenerated input type of AddOrderEntryToCurrentPendingOrder */
export type AddOrderEntryToCurrentPendingOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order_entry: OrderEntryInput;
};

/** Autogenerated return type of AddOrderEntryToCurrentPendingOrder */
export type AddOrderEntryToCurrentPendingOrderPayload = {
  __typename?: 'AddOrderEntryToCurrentPendingOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order_entry: OrderEntry;
};

export type AuthorizedApplication = {
  __typename?: 'AuthorizedApplication';
  name: Scalars['String'];
  scopes: Array<Scalars['String']>;
  uid: Scalars['ID'];
};


/** Autogenerated input type of CancelOrder */
export type CancelOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  skip_refund?: Maybe<Scalars['Boolean']>;
};

/** Autogenerated return type of CancelOrder */
export type CancelOrderPayload = {
  __typename?: 'CancelOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order: Order;
};

export type ChoiceCount = {
  __typename?: 'ChoiceCount';
  choice: Scalars['Int'];
  count: Scalars['Int'];
  state: SignupState;
};

export type CmsContent = CmsLayout | CmsPartial | Page;

export type CmsContentGroup = {
  __typename?: 'CmsContentGroup';
  contents: Array<CmsContent>;
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  id: Scalars['Int'];
  name: Scalars['String'];
  permissions: Array<Permission>;
};

export type CmsContentGroupInput = {
  contents?: Maybe<Array<CmsContentInput>>;
  name?: Maybe<Scalars['String']>;
};

export type CmsContentInput = {
  content_type: CmsContentTypeIndicator;
  id: Scalars['Int'];
};

export enum CmsContentTypeIndicator {
  CmsLayout = 'CmsLayout',
  CmsPartial = 'CmsPartial',
  Page = 'Page'
}

export type CmsFile = {
  __typename?: 'CmsFile';
  content_type: Scalars['String'];
  current_ability_can_delete: Scalars['Boolean'];
  filename: Scalars['String'];
  id: Scalars['Int'];
  size: Scalars['Int'];
  url: Scalars['String'];
};

export type CmsGraphqlQuery = {
  __typename?: 'CmsGraphqlQuery';
  admin_notes?: Maybe<Scalars['String']>;
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  id: Scalars['Int'];
  identifier: Scalars['String'];
  query: Scalars['String'];
};

export type CmsGraphqlQueryInput = {
  admin_notes?: Maybe<Scalars['String']>;
  identifier?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
};

export type CmsLayout = {
  __typename?: 'CmsLayout';
  admin_notes?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  content_html?: Maybe<Scalars['String']>;
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  navbar_classes?: Maybe<Scalars['String']>;
};


export type CmsLayoutContent_HtmlArgs = {
  path?: Maybe<Scalars['String']>;
};

export type CmsLayoutInput = {
  admin_notes?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  navbar_classes?: Maybe<Scalars['String']>;
};

export type CmsNavigationItem = {
  __typename?: 'CmsNavigationItem';
  id: Scalars['Int'];
  navigation_items?: Maybe<Array<Maybe<CmsNavigationItem>>>;
  navigation_section?: Maybe<CmsNavigationItem>;
  page?: Maybe<Page>;
  position?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};

export type CmsNavigationItemInput = {
  navigation_section_id?: Maybe<Scalars['Int']>;
  page_id?: Maybe<Scalars['Int']>;
  position?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};

export type CmsParent = Convention | RootSite;

export type CmsPartial = {
  __typename?: 'CmsPartial';
  admin_notes?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
};

export type CmsPartialInput = {
  admin_notes?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type CmsVariable = {
  __typename?: 'CmsVariable';
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  id: Scalars['Int'];
  key: Scalars['String'];
  value_json: Scalars['String'];
};

export type CmsVariableInput = {
  key: Scalars['String'];
  value_json: Scalars['String'];
};

export type ContactEmail = {
  __typename?: 'ContactEmail';
  email: Scalars['String'];
  formatted_address: Scalars['String'];
  metadata_json: Scalars['Json'];
  name?: Maybe<Scalars['String']>;
};

export type Convention = {
  __typename?: 'Convention';
  accepting_proposals?: Maybe<Scalars['Boolean']>;
  bio_eligible_user_con_profiles: Array<UserConProfile>;
  canceled: Scalars['Boolean'];
  catch_all_staff_position?: Maybe<StaffPosition>;
  clickwrap_agreement?: Maybe<Scalars['String']>;
  clickwrap_agreement_html?: Maybe<Scalars['String']>;
  cms_content_groups: Array<CmsContentGroup>;
  cms_layouts?: Maybe<Array<CmsLayout>>;
  cms_navigation_items?: Maybe<Array<CmsNavigationItem>>;
  coupons_paginated: CouponsPagination;
  created_at?: Maybe<Scalars['Date']>;
  default_layout?: Maybe<CmsLayout>;
  departments: Array<Department>;
  domain?: Maybe<Scalars['String']>;
  email_from: Scalars['String'];
  email_mode: EmailMode;
  ends_at?: Maybe<Scalars['Date']>;
  event_categories: Array<EventCategory>;
  event_mailing_list_domain?: Maybe<Scalars['String']>;
  event_proposals_paginated: EventProposalsPagination;
  events_paginated: EventsPagination;
  forms: Array<Form>;
  hidden: Scalars['Boolean'];
  id: Scalars['Int'];
  location?: Maybe<Scalars['Json']>;
  /** @deprecated Mail privileges have gone away in favor of permissions */
  mail_privilege_names: Array<Scalars['String']>;
  mailing_lists: MailingLists;
  masked_stripe_secret_key?: Maybe<Scalars['String']>;
  maximum_event_signups?: Maybe<ScheduledValue>;
  maximum_tickets?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  notification_templates: Array<NotificationTemplate>;
  orders?: Maybe<OrdersConnection>;
  orders_paginated: OrdersPagination;
  organization?: Maybe<Organization>;
  pages?: Maybe<Array<Page>>;
  pre_schedule_content_html?: Maybe<Scalars['String']>;
  /** @deprecated Privileges have gone away in favor of permissions */
  privilege_names: Array<Scalars['String']>;
  products?: Maybe<Array<Product>>;
  reports: ConventionReports;
  rooms?: Maybe<Array<Room>>;
  root_page?: Maybe<Page>;
  show_event_list?: Maybe<ShowSchedule>;
  show_schedule?: Maybe<ShowSchedule>;
  signup_changes_paginated: SignupChangesPagination;
  signup_counts_by_state: Array<SignupCountByState>;
  signup_mode: SignupMode;
  signup_requests_open: Scalars['Boolean'];
  signup_requests_paginated: SignupRequestsPagination;
  /** @deprecated Use signup_changes_paginated instead */
  signup_spy_paginated: SignupsPagination;
  site_mode: SiteMode;
  staff_positions?: Maybe<Array<StaffPosition>>;
  starts_at?: Maybe<Scalars['Date']>;
  stripe_publishable_key?: Maybe<Scalars['String']>;
  ticket_mode: TicketMode;
  ticket_name: Scalars['String'];
  ticket_types?: Maybe<Array<TicketType>>;
  tickets_available_for_purchase: Scalars['Boolean'];
  timezone_mode: TimezoneMode;
  timezone_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['Date']>;
  user_activity_alert: UserActivityAlert;
  user_activity_alerts?: Maybe<Array<Maybe<UserActivityAlert>>>;
  user_con_profile_form: Form;
  user_con_profiles_paginated: UserConProfilesPagination;
};


export type ConventionCoupons_PaginatedArgs = {
  filters?: Maybe<CouponFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};


export type ConventionEvent_CategoriesArgs = {
  current_ability_can_read_event_proposals?: Maybe<Scalars['Boolean']>;
};


export type ConventionEvent_Proposals_PaginatedArgs = {
  filters?: Maybe<EventProposalFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};


export type ConventionEvents_PaginatedArgs = {
  filters?: Maybe<EventFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};


export type ConventionOrdersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type ConventionOrders_PaginatedArgs = {
  filters?: Maybe<OrderFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};


export type ConventionProductsArgs = {
  only_available?: Maybe<Scalars['Boolean']>;
  only_ticket_providing?: Maybe<Scalars['Boolean']>;
};


export type ConventionSignup_Changes_PaginatedArgs = {
  filters?: Maybe<SignupChangeFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};


export type ConventionSignup_Requests_PaginatedArgs = {
  filters?: Maybe<SignupRequestFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};


export type ConventionSignup_Spy_PaginatedArgs = {
  filters?: Maybe<SignupFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};


export type ConventionUser_Activity_AlertArgs = {
  id: Scalars['Int'];
};


export type ConventionUser_Con_Profiles_PaginatedArgs = {
  filters?: Maybe<UserConProfileFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};

export type ConventionFiltersInput = {
  name?: Maybe<Scalars['String']>;
  organization_name?: Maybe<Scalars['String']>;
};

export type ConventionInput = {
  accepting_proposals?: Maybe<Scalars['Boolean']>;
  catch_all_staff_position_id?: Maybe<Scalars['Int']>;
  clickwrap_agreement?: Maybe<Scalars['String']>;
  default_layout_id?: Maybe<Scalars['Int']>;
  domain?: Maybe<Scalars['String']>;
  email_from?: Maybe<Scalars['String']>;
  email_mode?: Maybe<EmailMode>;
  ends_at?: Maybe<Scalars['Date']>;
  event_mailing_list_domain?: Maybe<Scalars['String']>;
  hidden?: Maybe<Scalars['Boolean']>;
  location?: Maybe<Scalars['Json']>;
  maximum_event_signups?: Maybe<ScheduledValueInput>;
  maximum_tickets?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  root_page_id?: Maybe<Scalars['Int']>;
  show_event_list?: Maybe<ShowSchedule>;
  show_schedule?: Maybe<ShowSchedule>;
  signup_mode?: Maybe<SignupMode>;
  signup_requests_open?: Maybe<Scalars['Boolean']>;
  site_mode?: Maybe<SiteMode>;
  starts_at?: Maybe<Scalars['Date']>;
  stripe_publishable_key?: Maybe<Scalars['String']>;
  stripe_secret_key?: Maybe<Scalars['String']>;
  ticket_mode?: Maybe<TicketMode>;
  ticket_name?: Maybe<Scalars['String']>;
  timezone_mode?: Maybe<TimezoneMode>;
  timezone_name?: Maybe<Scalars['String']>;
};

export type ConventionReports = {
  __typename?: 'ConventionReports';
  event_provided_tickets: Array<EventProvidedTicketList>;
  events_by_choice: Array<EventWithChoiceCounts>;
  ticket_count_by_type_and_payment_amount: Array<TicketCountByTypeAndPaymentAmount>;
  total_revenue: Money;
};

export type ConventionsPagination = PaginationInterface & {
  __typename?: 'ConventionsPagination';
  current_page: Scalars['Int'];
  entries: Array<Convention>;
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
};

/** Autogenerated input type of ConvertTicketToEventProvided */
export type ConvertTicketToEventProvidedInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_id: Scalars['Int'];
  ticket_type_id: Scalars['Int'];
  user_con_profile_id: Scalars['Int'];
};

/** Autogenerated return type of ConvertTicketToEventProvided */
export type ConvertTicketToEventProvidedPayload = {
  __typename?: 'ConvertTicketToEventProvidedPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The ticket we deleted in order to provide a new ticket */
  deleted_ticket: Ticket;
  refund_status: RefundStatus;
  /** The new ticket we just provided */
  ticket: Ticket;
};

export type Coupon = {
  __typename?: 'Coupon';
  code: Scalars['String'];
  convention: Convention;
  expires_at?: Maybe<Scalars['Date']>;
  fixed_amount?: Maybe<Money>;
  id: Scalars['Int'];
  percent_discount?: Maybe<Scalars['BigDecimal']>;
  provides_product?: Maybe<Product>;
  usage_limit?: Maybe<Scalars['Int']>;
};

export type CouponApplication = {
  __typename?: 'CouponApplication';
  coupon: Coupon;
  discount: Money;
  id: Scalars['Int'];
  order: Order;
};

export type CouponFiltersInput = {
  code?: Maybe<Scalars['String']>;
};

export type CouponInput = {
  code?: Maybe<Scalars['String']>;
  expires_at?: Maybe<Scalars['Date']>;
  fixed_amount?: Maybe<MoneyInput>;
  percent_discount?: Maybe<Scalars['BigDecimal']>;
  provides_product_id?: Maybe<Scalars['Int']>;
  usage_limit?: Maybe<Scalars['Int']>;
};

export type CouponsPagination = PaginationInterface & {
  __typename?: 'CouponsPagination';
  current_page: Scalars['Int'];
  entries: Array<Coupon>;
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
};

/** Autogenerated input type of CreateCmsContentGroup */
export type CreateCmsContentGroupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_content_group: CmsContentGroupInput;
  permissions?: Maybe<Array<PermissionInput>>;
};

/** Autogenerated return type of CreateCmsContentGroup */
export type CreateCmsContentGroupPayload = {
  __typename?: 'CreateCmsContentGroupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_content_group: CmsContentGroup;
};

/** Autogenerated input type of CreateCmsFile */
export type CreateCmsFileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  file: Scalars['Upload'];
};

/** Autogenerated return type of CreateCmsFile */
export type CreateCmsFilePayload = {
  __typename?: 'CreateCmsFilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_file: CmsFile;
};

/** Autogenerated input type of CreateCmsGraphqlQuery */
export type CreateCmsGraphqlQueryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  query: CmsGraphqlQueryInput;
};

/** Autogenerated return type of CreateCmsGraphqlQuery */
export type CreateCmsGraphqlQueryPayload = {
  __typename?: 'CreateCmsGraphqlQueryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  query: CmsGraphqlQuery;
};

/** Autogenerated input type of CreateCmsLayout */
export type CreateCmsLayoutInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_layout: CmsLayoutInput;
};

/** Autogenerated return type of CreateCmsLayout */
export type CreateCmsLayoutPayload = {
  __typename?: 'CreateCmsLayoutPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_layout: CmsLayout;
};

/** Autogenerated input type of CreateCmsNavigationItem */
export type CreateCmsNavigationItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_navigation_item: CmsNavigationItemInput;
};

/** Autogenerated return type of CreateCmsNavigationItem */
export type CreateCmsNavigationItemPayload = {
  __typename?: 'CreateCmsNavigationItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_navigation_item: CmsNavigationItem;
};

/** Autogenerated input type of CreateCmsPartial */
export type CreateCmsPartialInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_partial: CmsPartialInput;
};

/** Autogenerated return type of CreateCmsPartial */
export type CreateCmsPartialPayload = {
  __typename?: 'CreateCmsPartialPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_partial: CmsPartial;
};

/** Autogenerated input type of CreateConvention */
export type CreateConventionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  clone_convention_id?: Maybe<Scalars['Int']>;
  cms_content_set_name?: Maybe<Scalars['String']>;
  convention: ConventionInput;
  organization_id?: Maybe<Scalars['Int']>;
};

/** Autogenerated return type of CreateConvention */
export type CreateConventionPayload = {
  __typename?: 'CreateConventionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  convention: Convention;
};

/** Autogenerated input type of CreateCouponApplication */
export type CreateCouponApplicationInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon_code: Scalars['String'];
  order_id: Scalars['Int'];
};

/** Autogenerated return type of CreateCouponApplication */
export type CreateCouponApplicationPayload = {
  __typename?: 'CreateCouponApplicationPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon_application: CouponApplication;
};

/** Autogenerated input type of CreateCoupon */
export type CreateCouponInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon: CouponInput;
};

/** Autogenerated return type of CreateCoupon */
export type CreateCouponPayload = {
  __typename?: 'CreateCouponPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon: Coupon;
};

/** Autogenerated input type of CreateDepartment */
export type CreateDepartmentInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  department: DepartmentInput;
};

/** Autogenerated return type of CreateDepartment */
export type CreateDepartmentPayload = {
  __typename?: 'CreateDepartmentPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  department: Department;
};

/** Autogenerated input type of CreateEmailRoute */
export type CreateEmailRouteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  email_route: EmailRouteInput;
};

/** Autogenerated return type of CreateEmailRoute */
export type CreateEmailRoutePayload = {
  __typename?: 'CreateEmailRoutePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  email_route: EmailRoute;
};

/** Autogenerated input type of CreateEventCategory */
export type CreateEventCategoryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_category: EventCategoryInput;
};

/** Autogenerated return type of CreateEventCategory */
export type CreateEventCategoryPayload = {
  __typename?: 'CreateEventCategoryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_category: EventCategory;
};

/** Autogenerated input type of CreateEvent */
export type CreateEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: EventInput;
};

/** Autogenerated return type of CreateEvent */
export type CreateEventPayload = {
  __typename?: 'CreateEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: Event;
};

/** Autogenerated input type of CreateEventProposal */
export type CreateEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  clone_event_proposal_id?: Maybe<Scalars['Int']>;
  event_category_id: Scalars['Int'];
};

/** Autogenerated return type of CreateEventProposal */
export type CreateEventProposalPayload = {
  __typename?: 'CreateEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of CreateFillerEvent */
export type CreateFillerEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: EventInput;
  run?: Maybe<RunInput>;
};

/** Autogenerated return type of CreateFillerEvent */
export type CreateFillerEventPayload = {
  __typename?: 'CreateFillerEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: Event;
};

/** Autogenerated input type of CreateForm */
export type CreateFormInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: FormInput;
  form_type: FormType;
};

/** Autogenerated input type of CreateFormItem */
export type CreateFormItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_item: FormItemInput;
  form_section_id?: Maybe<Scalars['Int']>;
};

/** Autogenerated return type of CreateFormItem */
export type CreateFormItemPayload = {
  __typename?: 'CreateFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_item: FormItem;
};

/** Autogenerated return type of CreateForm */
export type CreateFormPayload = {
  __typename?: 'CreateFormPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: Form;
};

/** Autogenerated input type of CreateFormSection */
export type CreateFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_id?: Maybe<Scalars['Int']>;
  form_section: FormSectionInput;
};

/** Autogenerated return type of CreateFormSection */
export type CreateFormSectionPayload = {
  __typename?: 'CreateFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_section: FormSection;
};

/** Autogenerated input type of CreateFormWithJSON */
export type CreateFormWithJsonInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_json: Scalars['String'];
  form_type: FormType;
};

/** Autogenerated return type of CreateFormWithJSON */
export type CreateFormWithJsonPayload = {
  __typename?: 'CreateFormWithJSONPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: Form;
};

/** Autogenerated input type of CreateMaximumEventProvidedTicketsOverride */
export type CreateMaximumEventProvidedTicketsOverrideInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_id: Scalars['Int'];
  override_value: Scalars['Int'];
  ticket_type_id: Scalars['Int'];
};

/** Autogenerated return type of CreateMaximumEventProvidedTicketsOverride */
export type CreateMaximumEventProvidedTicketsOverridePayload = {
  __typename?: 'CreateMaximumEventProvidedTicketsOverridePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  maximum_event_provided_tickets_override: MaximumEventProvidedTicketsOverride;
};

/** Autogenerated input type of CreateMultipleRuns */
export type CreateMultipleRunsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_id: Scalars['Int'];
  runs: Array<RunInput>;
};

/** Autogenerated return type of CreateMultipleRuns */
export type CreateMultipleRunsPayload = {
  __typename?: 'CreateMultipleRunsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  runs: Array<Run>;
};

/** Autogenerated input type of CreateMySignup */
export type CreateMySignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  no_requested_bucket?: Maybe<Scalars['Boolean']>;
  requested_bucket_key?: Maybe<Scalars['String']>;
  run_id: Scalars['Int'];
};

/** Autogenerated return type of CreateMySignup */
export type CreateMySignupPayload = {
  __typename?: 'CreateMySignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

/** Autogenerated input type of CreateOrderEntry */
export type CreateOrderEntryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order_entry: OrderEntryInput;
  order_id: Scalars['Int'];
};

/** Autogenerated return type of CreateOrderEntry */
export type CreateOrderEntryPayload = {
  __typename?: 'CreateOrderEntryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order_entry: OrderEntry;
};

/** Autogenerated input type of CreateOrder */
export type CreateOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order: OrderInput;
  order_entries?: Maybe<Array<OrderEntryInput>>;
  status: OrderStatus;
  user_con_profile_id: Scalars['Int'];
};

/** Autogenerated return type of CreateOrder */
export type CreateOrderPayload = {
  __typename?: 'CreateOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order: Order;
};

/** Autogenerated input type of CreateOrganizationRole */
export type CreateOrganizationRoleInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  organization_id: Scalars['Int'];
  organization_role: OrganizationRoleInput;
  permissions: Array<PermissionInput>;
  user_ids: Array<Scalars['Int']>;
};

/** Autogenerated return type of CreateOrganizationRole */
export type CreateOrganizationRolePayload = {
  __typename?: 'CreateOrganizationRolePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  organization_role: OrganizationRole;
};

/** Autogenerated input type of CreatePage */
export type CreatePageInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  page: PageInput;
};

/** Autogenerated return type of CreatePage */
export type CreatePagePayload = {
  __typename?: 'CreatePagePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  page: Page;
};

/** Autogenerated input type of CreateProduct */
export type CreateProductInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  product: ProductInput;
};

/** Autogenerated return type of CreateProduct */
export type CreateProductPayload = {
  __typename?: 'CreateProductPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  product: Product;
};

/** Autogenerated input type of CreateRoom */
export type CreateRoomInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  room: RoomInput;
};

/** Autogenerated return type of CreateRoom */
export type CreateRoomPayload = {
  __typename?: 'CreateRoomPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  room: Room;
};

/** Autogenerated input type of CreateRun */
export type CreateRunInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_id: Scalars['Int'];
  run: RunInput;
};

/** Autogenerated return type of CreateRun */
export type CreateRunPayload = {
  __typename?: 'CreateRunPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  run: Run;
};

/** Autogenerated input type of CreateSignupRequest */
export type CreateSignupRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  replace_signup_id?: Maybe<Scalars['Int']>;
  requested_bucket_key?: Maybe<Scalars['String']>;
  target_run_id: Scalars['Int'];
};

/** Autogenerated return type of CreateSignupRequest */
export type CreateSignupRequestPayload = {
  __typename?: 'CreateSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup_request: SignupRequest;
};

/** Autogenerated input type of CreateStaffPosition */
export type CreateStaffPositionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  staff_position: StaffPositionInput;
};

/** Autogenerated return type of CreateStaffPosition */
export type CreateStaffPositionPayload = {
  __typename?: 'CreateStaffPositionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of CreateTeamMember */
export type CreateTeamMemberInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_id: Scalars['Int'];
  provide_ticket_type_id?: Maybe<Scalars['Int']>;
  team_member: TeamMemberInput;
  user_con_profile_id: Scalars['Int'];
};

/** Autogenerated return type of CreateTeamMember */
export type CreateTeamMemberPayload = {
  __typename?: 'CreateTeamMemberPayload';
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
  clientMutationId?: Maybe<Scalars['String']>;
  ticket: TicketInput;
  user_con_profile_id: Scalars['Int'];
};

/** Autogenerated return type of CreateTicket */
export type CreateTicketPayload = {
  __typename?: 'CreateTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket: Ticket;
};

/** Autogenerated input type of CreateTicketType */
export type CreateTicketTypeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket_type: TicketTypeInput;
};

/** Autogenerated return type of CreateTicketType */
export type CreateTicketTypePayload = {
  __typename?: 'CreateTicketTypePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket_type: TicketType;
};

/** Autogenerated input type of CreateUserActivityAlert */
export type CreateUserActivityAlertInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  notification_destinations: Array<NotificationDestinationInput>;
  user_activity_alert: UserActivityAlertInput;
};

/** Autogenerated return type of CreateUserActivityAlert */
export type CreateUserActivityAlertPayload = {
  __typename?: 'CreateUserActivityAlertPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_activity_alert: UserActivityAlert;
};

/** Autogenerated input type of CreateUserConProfile */
export type CreateUserConProfileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_con_profile: UserConProfileInput;
  user_id: Scalars['Int'];
};

/** Autogenerated return type of CreateUserConProfile */
export type CreateUserConProfilePayload = {
  __typename?: 'CreateUserConProfilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_con_profile: UserConProfile;
};

/** Autogenerated input type of CreateUserSignup */
export type CreateUserSignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  no_requested_bucket?: Maybe<Scalars['Boolean']>;
  requested_bucket_key?: Maybe<Scalars['String']>;
  run_id: Scalars['Int'];
  suppress_notifications?: Maybe<Scalars['Boolean']>;
  user_con_profile_id: Scalars['Int'];
};

/** Autogenerated return type of CreateUserSignup */
export type CreateUserSignupPayload = {
  __typename?: 'CreateUserSignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};


/** Autogenerated input type of DeleteCmsContentGroup */
export type DeleteCmsContentGroupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteCmsContentGroup */
export type DeleteCmsContentGroupPayload = {
  __typename?: 'DeleteCmsContentGroupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_content_group: CmsContentGroup;
};

/** Autogenerated input type of DeleteCmsFile */
export type DeleteCmsFileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteCmsFile */
export type DeleteCmsFilePayload = {
  __typename?: 'DeleteCmsFilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_file: CmsFile;
};

/** Autogenerated input type of DeleteCmsGraphqlQuery */
export type DeleteCmsGraphqlQueryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteCmsGraphqlQuery */
export type DeleteCmsGraphqlQueryPayload = {
  __typename?: 'DeleteCmsGraphqlQueryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  query: CmsGraphqlQuery;
};

/** Autogenerated input type of DeleteCmsLayout */
export type DeleteCmsLayoutInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteCmsLayout */
export type DeleteCmsLayoutPayload = {
  __typename?: 'DeleteCmsLayoutPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_layout: CmsLayout;
};

/** Autogenerated input type of DeleteCmsNavigationItem */
export type DeleteCmsNavigationItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteCmsNavigationItem */
export type DeleteCmsNavigationItemPayload = {
  __typename?: 'DeleteCmsNavigationItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_navigation_item: CmsNavigationItem;
};

/** Autogenerated input type of DeleteCmsPartial */
export type DeleteCmsPartialInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteCmsPartial */
export type DeleteCmsPartialPayload = {
  __typename?: 'DeleteCmsPartialPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_partial: CmsPartial;
};

/** Autogenerated input type of DeleteCmsVariable */
export type DeleteCmsVariableInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  key: Scalars['String'];
};

/** Autogenerated return type of DeleteCmsVariable */
export type DeleteCmsVariablePayload = {
  __typename?: 'DeleteCmsVariablePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_variable: CmsVariable;
};

/** Autogenerated input type of DeleteCouponApplication */
export type DeleteCouponApplicationInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteCouponApplication */
export type DeleteCouponApplicationPayload = {
  __typename?: 'DeleteCouponApplicationPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon_application: CouponApplication;
};

/** Autogenerated input type of DeleteCoupon */
export type DeleteCouponInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteCoupon */
export type DeleteCouponPayload = {
  __typename?: 'DeleteCouponPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon: Coupon;
};

/** Autogenerated input type of DeleteDepartment */
export type DeleteDepartmentInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteDepartment */
export type DeleteDepartmentPayload = {
  __typename?: 'DeleteDepartmentPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  department: Department;
};

/** Autogenerated input type of DeleteEmailRoute */
export type DeleteEmailRouteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteEmailRoute */
export type DeleteEmailRoutePayload = {
  __typename?: 'DeleteEmailRoutePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  email_route: EmailRoute;
};

/** Autogenerated input type of DeleteEventCategory */
export type DeleteEventCategoryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteEventCategory */
export type DeleteEventCategoryPayload = {
  __typename?: 'DeleteEventCategoryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_category: EventCategory;
};

/** Autogenerated input type of DeleteEventProposal */
export type DeleteEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteEventProposal */
export type DeleteEventProposalPayload = {
  __typename?: 'DeleteEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of DeleteForm */
export type DeleteFormInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated input type of DeleteFormItem */
export type DeleteFormItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteFormItem */
export type DeleteFormItemPayload = {
  __typename?: 'DeleteFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Autogenerated return type of DeleteForm */
export type DeleteFormPayload = {
  __typename?: 'DeleteFormPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: Form;
};

/** Autogenerated input type of DeleteFormSection */
export type DeleteFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteFormSection */
export type DeleteFormSectionPayload = {
  __typename?: 'DeleteFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Autogenerated input type of DeleteMaximumEventProvidedTicketsOverride */
export type DeleteMaximumEventProvidedTicketsOverrideInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteMaximumEventProvidedTicketsOverride */
export type DeleteMaximumEventProvidedTicketsOverridePayload = {
  __typename?: 'DeleteMaximumEventProvidedTicketsOverridePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  maximum_event_provided_tickets_override: MaximumEventProvidedTicketsOverride;
};

/** Autogenerated input type of DeleteOrderEntry */
export type DeleteOrderEntryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteOrderEntry */
export type DeleteOrderEntryPayload = {
  __typename?: 'DeleteOrderEntryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order_entry: OrderEntry;
};

/** Autogenerated input type of DeleteOrganizationRole */
export type DeleteOrganizationRoleInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteOrganizationRole */
export type DeleteOrganizationRolePayload = {
  __typename?: 'DeleteOrganizationRolePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

/** Autogenerated input type of DeletePage */
export type DeletePageInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeletePage */
export type DeletePagePayload = {
  __typename?: 'DeletePagePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  page: Page;
};

/** Autogenerated input type of DeleteProduct */
export type DeleteProductInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteProduct */
export type DeleteProductPayload = {
  __typename?: 'DeleteProductPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  product: Product;
};

/** Autogenerated input type of DeleteRoom */
export type DeleteRoomInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteRoom */
export type DeleteRoomPayload = {
  __typename?: 'DeleteRoomPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  room: Room;
};

/** Autogenerated input type of DeleteRun */
export type DeleteRunInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteRun */
export type DeleteRunPayload = {
  __typename?: 'DeleteRunPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  run: Run;
};

/** Autogenerated input type of DeleteStaffPosition */
export type DeleteStaffPositionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteStaffPosition */
export type DeleteStaffPositionPayload = {
  __typename?: 'DeleteStaffPositionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of DeleteTeamMember */
export type DeleteTeamMemberInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteTeamMember */
export type DeleteTeamMemberPayload = {
  __typename?: 'DeleteTeamMemberPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  team_member: TeamMember;
};

/** Autogenerated input type of DeleteTicket */
export type DeleteTicketInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  refund?: Maybe<Scalars['Boolean']>;
};

/** Autogenerated return type of DeleteTicket */
export type DeleteTicketPayload = {
  __typename?: 'DeleteTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket: Ticket;
};

/** Autogenerated input type of DeleteTicketType */
export type DeleteTicketTypeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteTicketType */
export type DeleteTicketTypePayload = {
  __typename?: 'DeleteTicketTypePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket_type: TicketType;
};

/** Autogenerated input type of DeleteUserActivityAlert */
export type DeleteUserActivityAlertInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteUserActivityAlert */
export type DeleteUserActivityAlertPayload = {
  __typename?: 'DeleteUserActivityAlertPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_activity_alert: UserActivityAlert;
};

/** Autogenerated input type of DeleteUserConProfile */
export type DeleteUserConProfileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DeleteUserConProfile */
export type DeleteUserConProfilePayload = {
  __typename?: 'DeleteUserConProfilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_con_profile: UserConProfile;
};

export type Department = {
  __typename?: 'Department';
  event_categories: Array<EventCategory>;
  id: Scalars['Int'];
  name: Scalars['String'];
  proposal_description?: Maybe<Scalars['String']>;
};

export type DepartmentInput = {
  name?: Maybe<Scalars['String']>;
  proposal_description?: Maybe<Scalars['String']>;
};

/** Autogenerated input type of DropEvent */
export type DropEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of DropEvent */
export type DropEventPayload = {
  __typename?: 'DropEventPayload';
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
  __typename?: 'EmailRoute';
  forward_addresses?: Maybe<Array<Scalars['String']>>;
  id: Scalars['Int'];
  receiver_address: Scalars['String'];
};

export type EmailRouteFiltersInput = {
  forward_addresses?: Maybe<Scalars['String']>;
  receiver_address?: Maybe<Scalars['String']>;
};

export type EmailRouteInput = {
  forward_addresses?: Maybe<Array<Scalars['String']>>;
  receiver_address?: Maybe<Scalars['String']>;
};

export type EmailRoutesPagination = PaginationInterface & {
  __typename?: 'EmailRoutesPagination';
  current_page: Scalars['Int'];
  entries: Array<EmailRoute>;
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
};

export type Event = {
  __typename?: 'Event';
  admin_notes?: Maybe<Scalars['String']>;
  age_restrictions?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  can_play_concurrently: Scalars['Boolean'];
  /** @deprecated Please use event_category.can_provide_tickets instead */
  can_provide_tickets: Scalars['Boolean'];
  /** @deprecated Please use event_category instead */
  category: Scalars['String'];
  con_mail_destination?: Maybe<Scalars['String']>;
  content_warnings?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  description_html?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  event_category: EventCategory;
  form?: Maybe<Form>;
  form_response_attrs_json?: Maybe<Scalars['Json']>;
  form_response_attrs_json_with_rendered_markdown?: Maybe<Scalars['Json']>;
  form_response_changes: Array<FormResponseChange>;
  id: Scalars['Int'];
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
  /** @deprecated Please use event_category.team_member_name instead */
  team_member_name: Scalars['String'];
  team_members: Array<TeamMember>;
  title?: Maybe<Scalars['String']>;
  total_slots?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};


export type EventRunArgs = {
  id: Scalars['Int'];
};


export type EventRunsArgs = {
  excludeConflicts?: Maybe<Scalars['Boolean']>;
  finish?: Maybe<Scalars['Date']>;
  start?: Maybe<Scalars['Date']>;
};

export type EventCategory = {
  __typename?: 'EventCategory';
  can_provide_tickets: Scalars['Boolean'];
  convention: Convention;
  default_color?: Maybe<Scalars['String']>;
  department?: Maybe<Department>;
  event_form: Form;
  event_proposal_form?: Maybe<Form>;
  events_paginated: EventsPagination;
  full_color?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  proposable: Scalars['Boolean'];
  proposal_description?: Maybe<Scalars['String']>;
  scheduling_ui: SchedulingUi;
  signed_up_color?: Maybe<Scalars['String']>;
  team_member_name: Scalars['String'];
};


export type EventCategoryEvents_PaginatedArgs = {
  filters?: Maybe<EventFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};

export type EventCategoryInput = {
  can_provide_tickets?: Maybe<Scalars['Boolean']>;
  default_color?: Maybe<Scalars['String']>;
  department_id?: Maybe<Scalars['Int']>;
  event_form_id?: Maybe<Scalars['Int']>;
  event_proposal_form_id?: Maybe<Scalars['Int']>;
  full_color?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  proposal_description?: Maybe<Scalars['String']>;
  scheduling_ui?: Maybe<SchedulingUi>;
  signed_up_color?: Maybe<Scalars['String']>;
  team_member_name?: Maybe<Scalars['String']>;
};

export type EventFiltersInput = {
  category?: Maybe<Array<Maybe<Scalars['Int']>>>;
  my_rating?: Maybe<Array<Scalars['Int']>>;
  title?: Maybe<Scalars['String']>;
  title_prefix?: Maybe<Scalars['String']>;
};

export type EventInput = {
  event_category_id?: Maybe<Scalars['Int']>;
  form_response_attrs_json?: Maybe<Scalars['String']>;
};

export type EventProposal = {
  __typename?: 'EventProposal';
  admin_notes?: Maybe<Scalars['String']>;
  convention: Convention;
  created_at: Scalars['Date'];
  event?: Maybe<Event>;
  event_category: EventCategory;
  form?: Maybe<Form>;
  form_response_attrs_json?: Maybe<Scalars['Json']>;
  form_response_attrs_json_with_rendered_markdown?: Maybe<Scalars['Json']>;
  form_response_changes: Array<FormResponseChange>;
  id: Scalars['Int'];
  length_seconds?: Maybe<Scalars['Int']>;
  owner: UserConProfile;
  registration_policy?: Maybe<RegistrationPolicy>;
  status: Scalars['String'];
  submitted_at: Scalars['Date'];
  title?: Maybe<Scalars['String']>;
  updated_at: Scalars['Date'];
};

export type EventProposalFiltersInput = {
  event_category?: Maybe<Array<Maybe<Scalars['Int']>>>;
  owner?: Maybe<Scalars['String']>;
  status?: Maybe<Array<Maybe<Scalars['String']>>>;
  title?: Maybe<Scalars['String']>;
};

export type EventProposalInput = {
  form_response_attrs_json?: Maybe<Scalars['String']>;
};

export type EventProposalsPagination = PaginationInterface & {
  __typename?: 'EventProposalsPagination';
  current_page: Scalars['Int'];
  entries: Array<EventProposal>;
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
};

export type EventProvidedTicketList = {
  __typename?: 'EventProvidedTicketList';
  provided_by_event: Event;
  tickets: Array<Ticket>;
};

export type EventsPagination = PaginationInterface & {
  __typename?: 'EventsPagination';
  current_page: Scalars['Int'];
  entries: Array<Event>;
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
};

export type EventWithChoiceCounts = {
  __typename?: 'EventWithChoiceCounts';
  choice_counts: Array<ChoiceCount>;
  event: Event;
};

/** Autogenerated input type of ForceConfirmSignup */
export type ForceConfirmSignupInput = {
  bucket_key: Scalars['String'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of ForceConfirmSignup */
export type ForceConfirmSignupPayload = {
  __typename?: 'ForceConfirmSignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

export type Form = {
  __typename?: 'Form';
  event_categories: Array<EventCategory>;
  export_json: Scalars['Json'];
  form_api_json: Scalars['Json'];
  form_sections: Array<FormSection>;
  form_type: FormType;
  id: Scalars['Int'];
  proposal_event_categories: Array<EventCategory>;
  title: Scalars['String'];
  user_con_profile_conventions: Array<Convention>;
};

export type FormInput = {
  title?: Maybe<Scalars['String']>;
};

export type FormItem = {
  __typename?: 'FormItem';
  admin_description?: Maybe<Scalars['String']>;
  default_value?: Maybe<Scalars['Json']>;
  form_section: FormSection;
  id: Scalars['Int'];
  identifier?: Maybe<Scalars['String']>;
  item_type?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  properties?: Maybe<Scalars['Json']>;
  public_description?: Maybe<Scalars['String']>;
  rendered_properties?: Maybe<Scalars['Json']>;
};

export type FormItemInput = {
  admin_description?: Maybe<Scalars['String']>;
  default_value?: Maybe<Scalars['Json']>;
  identifier?: Maybe<Scalars['String']>;
  item_type?: Maybe<Scalars['String']>;
  properties?: Maybe<Scalars['Json']>;
  public_description?: Maybe<Scalars['String']>;
};

export type FormResponseChange = {
  __typename?: 'FormResponseChange';
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
  __typename?: 'FormSection';
  form: Form;
  form_items: Array<FormItem>;
  id: Scalars['Int'];
  position?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};

export type FormSectionInput = {
  title?: Maybe<Scalars['String']>;
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
  __typename?: 'LiquidAssign';
  cms_variable_value_json?: Maybe<Scalars['String']>;
  drop_class_name: Scalars['String'];
  name: Scalars['String'];
};

export type MailingLists = {
  __typename?: 'MailingLists';
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
  __typename?: 'MailingListsResult';
  emails: Array<ContactEmail>;
  metadata_fields: Array<Scalars['String']>;
};

export type MailingListsWaitlistsResult = {
  __typename?: 'MailingListsWaitlistsResult';
  emails: Array<ContactEmail>;
  metadata_fields: Array<Scalars['String']>;
  run: Run;
};

/** Autogenerated input type of MarkOrderPaid */
export type MarkOrderPaidInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of MarkOrderPaid */
export type MarkOrderPaidPayload = {
  __typename?: 'MarkOrderPaidPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order: Order;
};

export type MaximumEventProvidedTicketsOverride = {
  __typename?: 'MaximumEventProvidedTicketsOverride';
  event: Event;
  id: Scalars['Int'];
  override_value: Scalars['Int'];
  ticket_type: TicketType;
};

/** Autogenerated input type of MergeUsers */
export type MergeUsersInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  userIds: Array<Scalars['Int']>;
  winningUserConProfiles: Array<WinningUserConProfileInput>;
  winningUserId: Scalars['Int'];
};

/** Autogenerated return type of MergeUsers */
export type MergeUsersPayload = {
  __typename?: 'MergeUsersPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user: User;
};

export type Money = {
  __typename?: 'Money';
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
  clientMutationId?: Maybe<Scalars['String']>;
  destination_index?: Maybe<Scalars['Int']>;
  form_section_id: Scalars['Int'];
  id: Scalars['Int'];
};

/** Autogenerated return type of MoveFormItem */
export type MoveFormItemPayload = {
  __typename?: 'MoveFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_item: FormItem;
  form_section: FormSection;
};

/** Autogenerated input type of MoveFormSection */
export type MoveFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  destination_index: Scalars['Int'];
  id: Scalars['Int'];
};

/** Autogenerated return type of MoveFormSection */
export type MoveFormSectionPayload = {
  __typename?: 'MoveFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: Form;
  form_section: FormSection;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptClickwrapAgreement?: Maybe<AcceptClickwrapAgreementPayload>;
  acceptSignupRequest?: Maybe<AcceptSignupRequestPayload>;
  addOrderEntryToCurrentPendingOrder?: Maybe<AddOrderEntryToCurrentPendingOrderPayload>;
  cancelOrder?: Maybe<CancelOrderPayload>;
  convertTicketToEventProvided?: Maybe<ConvertTicketToEventProvidedPayload>;
  createCmsContentGroup?: Maybe<CreateCmsContentGroupPayload>;
  createCmsFile?: Maybe<CreateCmsFilePayload>;
  createCmsGraphqlQuery?: Maybe<CreateCmsGraphqlQueryPayload>;
  createCmsLayout?: Maybe<CreateCmsLayoutPayload>;
  createCmsNavigationItem?: Maybe<CreateCmsNavigationItemPayload>;
  createCmsPartial?: Maybe<CreateCmsPartialPayload>;
  createConvention?: Maybe<CreateConventionPayload>;
  createCoupon?: Maybe<CreateCouponPayload>;
  createCouponApplication?: Maybe<CreateCouponApplicationPayload>;
  createDepartment?: Maybe<CreateDepartmentPayload>;
  createEmailRoute?: Maybe<CreateEmailRoutePayload>;
  createEvent?: Maybe<CreateEventPayload>;
  createEventCategory?: Maybe<CreateEventCategoryPayload>;
  createEventProposal?: Maybe<CreateEventProposalPayload>;
  createFillerEvent?: Maybe<CreateFillerEventPayload>;
  createForm?: Maybe<CreateFormPayload>;
  createFormItem?: Maybe<CreateFormItemPayload>;
  createFormSection?: Maybe<CreateFormSectionPayload>;
  createFormWithJSON?: Maybe<CreateFormWithJsonPayload>;
  createMaximumEventProvidedTicketsOverride?: Maybe<CreateMaximumEventProvidedTicketsOverridePayload>;
  createMultipleRuns?: Maybe<CreateMultipleRunsPayload>;
  createMySignup?: Maybe<CreateMySignupPayload>;
  createOrder?: Maybe<CreateOrderPayload>;
  createOrderEntry?: Maybe<CreateOrderEntryPayload>;
  createOrganizationRole?: Maybe<CreateOrganizationRolePayload>;
  createPage?: Maybe<CreatePagePayload>;
  createProduct?: Maybe<CreateProductPayload>;
  createRoom?: Maybe<CreateRoomPayload>;
  createRun?: Maybe<CreateRunPayload>;
  createSignupRequest?: Maybe<CreateSignupRequestPayload>;
  createStaffPosition?: Maybe<CreateStaffPositionPayload>;
  createTeamMember?: Maybe<CreateTeamMemberPayload>;
  createTicket?: Maybe<CreateTicketPayload>;
  createTicketType?: Maybe<CreateTicketTypePayload>;
  createUserActivityAlert?: Maybe<CreateUserActivityAlertPayload>;
  createUserConProfile?: Maybe<CreateUserConProfilePayload>;
  createUserSignup?: Maybe<CreateUserSignupPayload>;
  deleteCmsContentGroup?: Maybe<DeleteCmsContentGroupPayload>;
  deleteCmsFile?: Maybe<DeleteCmsFilePayload>;
  deleteCmsGraphqlQuery?: Maybe<DeleteCmsGraphqlQueryPayload>;
  deleteCmsLayout?: Maybe<DeleteCmsLayoutPayload>;
  deleteCmsNavigationItem?: Maybe<DeleteCmsNavigationItemPayload>;
  deleteCmsPartial?: Maybe<DeleteCmsPartialPayload>;
  deleteCmsVariable?: Maybe<DeleteCmsVariablePayload>;
  deleteCoupon?: Maybe<DeleteCouponPayload>;
  deleteCouponApplication?: Maybe<DeleteCouponApplicationPayload>;
  deleteDepartment?: Maybe<DeleteDepartmentPayload>;
  deleteEmailRoute?: Maybe<DeleteEmailRoutePayload>;
  deleteEventCategory?: Maybe<DeleteEventCategoryPayload>;
  deleteEventProposal?: Maybe<DeleteEventProposalPayload>;
  deleteForm?: Maybe<DeleteFormPayload>;
  deleteFormItem?: Maybe<DeleteFormItemPayload>;
  deleteFormSection?: Maybe<DeleteFormSectionPayload>;
  deleteMaximumEventProvidedTicketsOverride?: Maybe<DeleteMaximumEventProvidedTicketsOverridePayload>;
  deleteOrderEntry?: Maybe<DeleteOrderEntryPayload>;
  deleteOrganizationRole?: Maybe<DeleteOrganizationRolePayload>;
  deletePage?: Maybe<DeletePagePayload>;
  deleteProduct?: Maybe<DeleteProductPayload>;
  deleteRoom?: Maybe<DeleteRoomPayload>;
  deleteRun?: Maybe<DeleteRunPayload>;
  deleteStaffPosition?: Maybe<DeleteStaffPositionPayload>;
  deleteTeamMember?: Maybe<DeleteTeamMemberPayload>;
  deleteTicket?: Maybe<DeleteTicketPayload>;
  deleteTicketType?: Maybe<DeleteTicketTypePayload>;
  deleteUserActivityAlert?: Maybe<DeleteUserActivityAlertPayload>;
  deleteUserConProfile?: Maybe<DeleteUserConProfilePayload>;
  dropEvent?: Maybe<DropEventPayload>;
  forceConfirmSignup?: Maybe<ForceConfirmSignupPayload>;
  markOrderPaid?: Maybe<MarkOrderPaidPayload>;
  mergeUsers?: Maybe<MergeUsersPayload>;
  moveFormItem?: Maybe<MoveFormItemPayload>;
  moveFormSection?: Maybe<MoveFormSectionPayload>;
  provideEventTicket?: Maybe<ProvideEventTicketPayload>;
  rateEvent?: Maybe<RateEventPayload>;
  rejectSignupRequest?: Maybe<RejectSignupRequestPayload>;
  renameCmsFile?: Maybe<RenameCmsFilePayload>;
  restoreDroppedEvent?: Maybe<RestoreDroppedEventPayload>;
  revokeAuthorizedApplication?: Maybe<RevokeAuthorizedApplicationPayload>;
  setCmsVariable?: Maybe<SetCmsVariablePayload>;
  setConventionCanceled?: Maybe<SetConventionCanceledPayload>;
  sortCmsNavigationItems?: Maybe<SortCmsNavigationItemsPayload>;
  submitEventProposal?: Maybe<SubmitEventProposalPayload>;
  submitOrder?: Maybe<SubmitOrderPayload>;
  transitionEventProposal?: Maybe<TransitionEventProposalPayload>;
  updateCmsContentGroup?: Maybe<UpdateCmsContentGroupPayload>;
  updateCmsGraphqlQuery?: Maybe<UpdateCmsGraphqlQueryPayload>;
  updateCmsLayout?: Maybe<UpdateCmsLayoutPayload>;
  updateCmsNavigationItem?: Maybe<UpdateCmsNavigationItemPayload>;
  updateCmsPartial?: Maybe<UpdateCmsPartialPayload>;
  updateConvention?: Maybe<UpdateConventionPayload>;
  updateCoupon?: Maybe<UpdateCouponPayload>;
  updateDepartment?: Maybe<UpdateDepartmentPayload>;
  updateEmailRoute?: Maybe<UpdateEmailRoutePayload>;
  updateEvent?: Maybe<UpdateEventPayload>;
  updateEventAdminNotes?: Maybe<UpdateEventAdminNotesPayload>;
  updateEventCategory?: Maybe<UpdateEventCategoryPayload>;
  updateEventProposal?: Maybe<UpdateEventProposalPayload>;
  updateEventProposalAdminNotes?: Maybe<UpdateEventProposalAdminNotesPayload>;
  updateForm?: Maybe<UpdateFormPayload>;
  updateFormItem?: Maybe<UpdateFormItemPayload>;
  updateFormSection?: Maybe<UpdateFormSectionPayload>;
  updateFormWithJSON?: Maybe<UpdateFormWithJsonPayload>;
  updateMaximumEventProvidedTicketsOverride?: Maybe<UpdateMaximumEventProvidedTicketsOverridePayload>;
  updateNotificationTemplate?: Maybe<UpdateNotificationTemplatePayload>;
  updateOrder?: Maybe<UpdateOrderPayload>;
  updateOrderEntry?: Maybe<UpdateOrderEntryPayload>;
  updateOrganizationRole?: Maybe<UpdateOrganizationRolePayload>;
  updatePage?: Maybe<UpdatePagePayload>;
  updateProduct?: Maybe<UpdateProductPayload>;
  updateRoom?: Maybe<UpdateRoomPayload>;
  updateRootSite?: Maybe<UpdateRootSitePayload>;
  updateRun?: Maybe<UpdateRunPayload>;
  updateSignupBucket?: Maybe<UpdateSignupBucketPayload>;
  updateSignupCounted?: Maybe<UpdateSignupCountedPayload>;
  updateStaffPosition?: Maybe<UpdateStaffPositionPayload>;
  updateStaffPositionPermissions?: Maybe<UpdateStaffPositionPermissionsPayload>;
  updateTeamMember?: Maybe<UpdateTeamMemberPayload>;
  updateTicket?: Maybe<UpdateTicketPayload>;
  updateTicketType?: Maybe<UpdateTicketTypePayload>;
  updateUserActivityAlert?: Maybe<UpdateUserActivityAlertPayload>;
  updateUserConProfile?: Maybe<UpdateUserConProfilePayload>;
  withdrawAllUserConProfileSignups?: Maybe<WithdrawAllUserConProfileSignupsPayload>;
  withdrawMySignup?: Maybe<WithdrawMySignupPayload>;
  withdrawSignupRequest?: Maybe<WithdrawSignupRequestPayload>;
  withdrawUserSignup?: Maybe<WithdrawUserSignupPayload>;
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
  __typename?: 'NotificationDestination';
  id: Scalars['Int'];
  source: NotificationSource;
  staff_position?: Maybe<StaffPosition>;
  user_con_profile?: Maybe<UserConProfile>;
};

export type NotificationDestinationInput = {
  staff_position_id?: Maybe<Scalars['Int']>;
  user_con_profile_id?: Maybe<Scalars['Int']>;
};

export type NotificationSource = UserActivityAlert;

export type NotificationTemplate = {
  __typename?: 'NotificationTemplate';
  body_html?: Maybe<Scalars['String']>;
  body_sms?: Maybe<Scalars['String']>;
  body_text?: Maybe<Scalars['String']>;
  event_key: Scalars['String'];
  id: Scalars['Int'];
  subject?: Maybe<Scalars['String']>;
};

export type NotificationTemplateInput = {
  body_html?: Maybe<Scalars['String']>;
  body_sms?: Maybe<Scalars['String']>;
  body_text?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
};

export type Order = {
  __typename?: 'Order';
  charge_id?: Maybe<Scalars['String']>;
  coupon_applications: Array<CouponApplication>;
  id?: Maybe<Scalars['Int']>;
  order_entries: Array<Maybe<OrderEntry>>;
  paid_at?: Maybe<Scalars['Date']>;
  payment_amount?: Maybe<Money>;
  payment_note?: Maybe<Scalars['String']>;
  status: OrderStatus;
  submitted_at?: Maybe<Scalars['Date']>;
  total_price: Money;
  total_price_before_discounts: Money;
  user_con_profile: UserConProfile;
};

/** An edge in a connection. */
export type OrderEdge = {
  __typename?: 'OrderEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<Order>;
};

export type OrderEntry = {
  __typename?: 'OrderEntry';
  describe_products: Scalars['String'];
  id?: Maybe<Scalars['Int']>;
  order: Order;
  price: Money;
  price_per_item: Money;
  product: Product;
  product_variant?: Maybe<ProductVariant>;
  quantity: Scalars['Int'];
};

export type OrderEntryInput = {
  price_per_item?: Maybe<MoneyInput>;
  product_id?: Maybe<Scalars['Int']>;
  product_variant_id?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
  ticket_id?: Maybe<Scalars['Int']>;
};

export type OrderFiltersInput = {
  id?: Maybe<Scalars['String']>;
  status?: Maybe<Array<Scalars['String']>>;
  user_name?: Maybe<Scalars['String']>;
};

export type OrderInput = {
  payment_amount?: Maybe<MoneyInput>;
  payment_note?: Maybe<Scalars['String']>;
};

export type OrderQuantityByStatus = {
  __typename?: 'OrderQuantityByStatus';
  quantity: Scalars['Int'];
  status: Scalars['String'];
};

/** The connection type for Order. */
export type OrdersConnection = {
  __typename?: 'OrdersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<OrderEdge>>>;
  /** A list of nodes. */
  nodes?: Maybe<Array<Maybe<Order>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type OrdersPagination = PaginationInterface & {
  __typename?: 'OrdersPagination';
  current_page: Scalars['Int'];
  entries: Array<Order>;
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
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

export type Organization = {
  __typename?: 'Organization';
  conventions: Array<Convention>;
  current_ability_can_manage_access: Scalars['Boolean'];
  id: Scalars['Int'];
  name: Scalars['String'];
  organization_roles: Array<OrganizationRole>;
};

export type OrganizationRole = {
  __typename?: 'OrganizationRole';
  id: Scalars['Int'];
  name: Scalars['String'];
  organization: Organization;
  permissions: Array<Permission>;
  users: Array<User>;
};

export type OrganizationRoleInput = {
  name?: Maybe<Scalars['String']>;
};

export type Page = {
  __typename?: 'Page';
  admin_notes?: Maybe<Scalars['String']>;
  cms_layout?: Maybe<CmsLayout>;
  content?: Maybe<Scalars['String']>;
  content_html: Scalars['String'];
  current_ability_can_delete: Scalars['Boolean'];
  current_ability_can_update: Scalars['Boolean'];
  hidden_from_search: Scalars['Boolean'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  referenced_partials: Array<CmsPartial>;
  skip_clickwrap_agreement?: Maybe<Scalars['Boolean']>;
  slug?: Maybe<Scalars['String']>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type PageInput = {
  admin_notes?: Maybe<Scalars['String']>;
  cms_layout_id?: Maybe<Scalars['Int']>;
  content?: Maybe<Scalars['String']>;
  hidden_from_search?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  skip_clickwrap_agreement?: Maybe<Scalars['Boolean']>;
  slug?: Maybe<Scalars['String']>;
};

export type PaginationInterface = {
  current_page: Scalars['Int'];
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
};

export enum PaymentMode {
  Free = 'free',
  Later = 'later',
  Now = 'now'
}

export type Permission = {
  __typename?: 'Permission';
  id: Scalars['Int'];
  model: PermissionedModel;
  permission: Scalars['String'];
  role: PermissionedRole;
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

export type PermissionInput = {
  model_id?: Maybe<Scalars['Int']>;
  model_type?: Maybe<PermissionedModelTypeIndicator>;
  permission: Scalars['String'];
  role_id?: Maybe<Scalars['Int']>;
  role_type?: Maybe<PermissionedRoleTypeIndicator>;
};

export enum PricingStrategy {
  /** Fixed price */
  Fixed = 'fixed',
  /** Price that changes over time */
  ScheduledValue = 'scheduled_value'
}

export type PricingStructure = {
  __typename?: 'PricingStructure';
  price?: Maybe<Money>;
  pricing_strategy: PricingStrategy;
  value: PricingStructureValue;
};


export type PricingStructurePriceArgs = {
  time?: Maybe<Scalars['Date']>;
};

export type PricingStructureInput = {
  fixed_value?: Maybe<MoneyInput>;
  pricing_strategy: PricingStrategy;
  scheduled_value?: Maybe<ScheduledMoneyValueInput>;
};

export type PricingStructureValue = Money | ScheduledMoneyValue;

export type Product = {
  __typename?: 'Product';
  available: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  description_html?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  image_url?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  order_quantities_by_status: Array<OrderQuantityByStatus>;
  payment_options: Array<Maybe<Scalars['String']>>;
  /** @deprecated Use pricing_structure instead */
  price: Money;
  pricing_structure?: Maybe<PricingStructure>;
  product_variants: Array<ProductVariant>;
  provides_ticket_type?: Maybe<TicketType>;
};

export type ProductInput = {
  available?: Maybe<Scalars['Boolean']>;
  delete_variant_ids?: Maybe<Array<Scalars['Int']>>;
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['Upload']>;
  name?: Maybe<Scalars['String']>;
  payment_options?: Maybe<Array<Scalars['String']>>;
  pricing_structure?: Maybe<PricingStructureInput>;
  product_variants?: Maybe<Array<ProductVariantInput>>;
  provides_ticket_type_id?: Maybe<Scalars['Int']>;
};

export type ProductVariant = {
  __typename?: 'ProductVariant';
  description?: Maybe<Scalars['String']>;
  description_html?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  image_url?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  order_quantities_by_status: Array<OrderQuantityByStatus>;
  /** @deprecated Use override_pricing_structure instead */
  override_price?: Maybe<Money>;
  override_pricing_structure?: Maybe<PricingStructure>;
  position?: Maybe<Scalars['Int']>;
  product: Product;
};

export type ProductVariantInput = {
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  image?: Maybe<Scalars['Upload']>;
  name?: Maybe<Scalars['String']>;
  override_pricing_structure?: Maybe<PricingStructureInput>;
};

/** Autogenerated input type of ProvideEventTicket */
export type ProvideEventTicketInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_id: Scalars['Int'];
  ticket_type_id: Scalars['Int'];
  user_con_profile_id: Scalars['Int'];
};

/** Autogenerated return type of ProvideEventTicket */
export type ProvideEventTicketPayload = {
  __typename?: 'ProvideEventTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket: Ticket;
};

export type Query = {
  __typename?: 'Query';
  accountFormContentHtml?: Maybe<Scalars['String']>;
  assumedIdentityFromProfile?: Maybe<UserConProfile>;
  cmsContentGroup: CmsContentGroup;
  cmsContentGroups: Array<CmsContentGroup>;
  cmsFiles?: Maybe<Array<CmsFile>>;
  cmsGraphqlQueries?: Maybe<Array<CmsGraphqlQuery>>;
  cmsLayouts: Array<CmsLayout>;
  cmsNavigationItems: Array<CmsNavigationItem>;
  cmsPage: Page;
  cmsPages: Array<Page>;
  cmsParent: CmsParent;
  cmsPartials: Array<CmsPartial>;
  cmsVariables?: Maybe<Array<CmsVariable>>;
  convention?: Maybe<Convention>;
  conventions: Array<Convention>;
  conventions_paginated: ConventionsPagination;
  currentAbility: Ability;
  currentPendingOrder?: Maybe<Order>;
  currentUser?: Maybe<User>;
  effectiveCmsLayout: CmsLayout;
  email_routes_paginated: EmailRoutesPagination;
  event?: Maybe<Event>;
  eventProposal?: Maybe<EventProposal>;
  events: Array<Event>;
  form?: Maybe<Form>;
  liquidAssigns?: Maybe<Array<LiquidAssign>>;
  myAuthorizedApplications: Array<AuthorizedApplication>;
  myProfile?: Maybe<UserConProfile>;
  my_signups: Array<Signup>;
  notifierLiquidAssigns?: Maybe<Array<LiquidAssign>>;
  oauthPreAuth: Scalars['Json'];
  organizations: Array<Organization>;
  previewFormItem: FormItem;
  previewLiquid: Scalars['String'];
  previewMarkdown: Scalars['String'];
  previewNotifierLiquid: Scalars['String'];
  product: Product;
  rootSite: RootSite;
  run?: Maybe<Run>;
  runs?: Maybe<Array<Run>>;
  searchCmsContent: Array<CmsContent>;
  signup: Signup;
  siteSearch: SearchResult;
  staffPosition?: Maybe<StaffPosition>;
  user: User;
  userConProfile?: Maybe<UserConProfile>;
  users: Array<User>;
  users_paginated: UsersPagination;
};


export type QueryCmsContentGroupArgs = {
  id: Scalars['Int'];
};


export type QueryCmsPageArgs = {
  id?: Maybe<Scalars['Int']>;
  rootPage?: Maybe<Scalars['Boolean']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryConventionArgs = {
  id?: Maybe<Scalars['Int']>;
};


export type QueryConventions_PaginatedArgs = {
  filters?: Maybe<ConventionFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};


export type QueryEffectiveCmsLayoutArgs = {
  path: Scalars['String'];
};


export type QueryEmail_Routes_PaginatedArgs = {
  filters?: Maybe<EmailRouteFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};


export type QueryEventArgs = {
  id: Scalars['Int'];
};


export type QueryEventProposalArgs = {
  id: Scalars['Int'];
};


export type QueryEventsArgs = {
  extendedCounts?: Maybe<Scalars['Boolean']>;
  finish?: Maybe<Scalars['Date']>;
  includeDropped?: Maybe<Scalars['Boolean']>;
  start?: Maybe<Scalars['Date']>;
};


export type QueryFormArgs = {
  id: Scalars['Int'];
};


export type QueryNotifierLiquidAssignsArgs = {
  eventKey: Scalars['String'];
};


export type QueryOauthPreAuthArgs = {
  queryParams: Scalars['Json'];
};


export type QueryPreviewFormItemArgs = {
  formItem: FormItemInput;
  formSectionId: Scalars['Int'];
};


export type QueryPreviewLiquidArgs = {
  content: Scalars['String'];
};


export type QueryPreviewMarkdownArgs = {
  markdown: Scalars['String'];
};


export type QueryPreviewNotifierLiquidArgs = {
  content: Scalars['String'];
  eventKey: Scalars['String'];
};


export type QueryProductArgs = {
  id: Scalars['Int'];
};


export type QueryRunArgs = {
  id: Scalars['Int'];
};


export type QuerySearchCmsContentArgs = {
  name?: Maybe<Scalars['String']>;
};


export type QuerySignupArgs = {
  id: Scalars['Int'];
};


export type QuerySiteSearchArgs = {
  query: Scalars['String'];
};


export type QueryStaffPositionArgs = {
  id: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};


export type QueryUserConProfileArgs = {
  id: Scalars['Int'];
};


export type QueryUsersArgs = {
  ids: Array<Scalars['Int']>;
};


export type QueryUsers_PaginatedArgs = {
  filters?: Maybe<UserFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};

/** Autogenerated input type of RateEvent */
export type RateEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_id: Scalars['Int'];
  rating: Scalars['Int'];
};

/** Autogenerated return type of RateEvent */
export type RateEventPayload = {
  __typename?: 'RateEventPayload';
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
  __typename?: 'RegistrationPolicy';
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
  __typename?: 'RegistrationPolicyBucket';
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
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of RejectSignupRequest */
export type RejectSignupRequestPayload = {
  __typename?: 'RejectSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup_request: SignupRequest;
};

/** Autogenerated input type of RenameCmsFile */
export type RenameCmsFileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
  id: Scalars['Int'];
};

/** Autogenerated return type of RenameCmsFile */
export type RenameCmsFilePayload = {
  __typename?: 'RenameCmsFilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_file: CmsFile;
};

/** Autogenerated input type of RestoreDroppedEvent */
export type RestoreDroppedEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of RestoreDroppedEvent */
export type RestoreDroppedEventPayload = {
  __typename?: 'RestoreDroppedEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: Event;
};

/** Autogenerated input type of RevokeAuthorizedApplication */
export type RevokeAuthorizedApplicationInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  uid: Scalars['ID'];
};

/** Autogenerated return type of RevokeAuthorizedApplication */
export type RevokeAuthorizedApplicationPayload = {
  __typename?: 'RevokeAuthorizedApplicationPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

export type Room = {
  __typename?: 'Room';
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  runs: Array<Run>;
};

export type RoomInput = {
  name?: Maybe<Scalars['String']>;
};

export type RootSite = {
  __typename?: 'RootSite';
  default_layout?: Maybe<CmsLayout>;
  host: Scalars['String'];
  id: Scalars['Int'];
  root_page: Page;
  site_name: Scalars['String'];
  url: Scalars['String'];
};

export type RootSiteInput = {
  default_layout_id?: Maybe<Scalars['Int']>;
  root_page_id?: Maybe<Scalars['Int']>;
  site_name?: Maybe<Scalars['String']>;
};

export type Run = {
  __typename?: 'Run';
  confirmed_limited_signup_count?: Maybe<Scalars['Int']>;
  confirmed_signup_count?: Maybe<Scalars['Int']>;
  current_ability_can_signup_summary_run: Scalars['Boolean'];
  ends_at: Scalars['Date'];
  event?: Maybe<Event>;
  id: Scalars['Int'];
  my_signup_requests: Array<SignupRequest>;
  my_signups: Array<Signup>;
  not_counted_confirmed_signup_count?: Maybe<Scalars['Int']>;
  not_counted_signup_count?: Maybe<Scalars['Int']>;
  room_names: Array<Scalars['String']>;
  rooms: Array<Room>;
  schedule_note?: Maybe<Scalars['String']>;
  signup_changes_paginated: SignupChangesPagination;
  signup_count_by_state_and_bucket_key_and_counted: Scalars['Json'];
  signups_paginated: SignupsPagination;
  starts_at: Scalars['Date'];
  title_suffix?: Maybe<Scalars['String']>;
  waitlisted_signup_count?: Maybe<Scalars['Int']>;
};


export type RunSignup_Changes_PaginatedArgs = {
  filters?: Maybe<SignupChangeFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<SortInput>>;
};


export type RunSignups_PaginatedArgs = {
  filters?: Maybe<SignupFiltersInput>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  sort?: Maybe<Array<Maybe<SortInput>>>;
};

export type RunInput = {
  room_ids?: Maybe<Array<Scalars['Int']>>;
  schedule_note?: Maybe<Scalars['String']>;
  starts_at?: Maybe<Scalars['Date']>;
  title_suffix?: Maybe<Scalars['String']>;
};

export type ScheduledMoneyValue = {
  __typename?: 'ScheduledMoneyValue';
  timespans: Array<TimespanWithMoneyValue>;
};

export type ScheduledMoneyValueInput = {
  timespans: Array<TimespanWithMoneyValueInput>;
};

export type ScheduledValue = {
  __typename?: 'ScheduledValue';
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

export type SearchableModel = Event | EventProposal | Page | UserConProfile;

export type SearchResult = {
  __typename?: 'SearchResult';
  entries: Array<SearchResultEntry>;
  total_entries: Scalars['Int'];
};

export type SearchResultEntry = {
  __typename?: 'SearchResultEntry';
  highlight?: Maybe<Scalars['String']>;
  model: SearchableModel;
  rank: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
};

/** Autogenerated input type of SetCmsVariable */
export type SetCmsVariableInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_variable: CmsVariableInput;
};

/** Autogenerated return type of SetCmsVariable */
export type SetCmsVariablePayload = {
  __typename?: 'SetCmsVariablePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_variable: CmsVariable;
};

/** Autogenerated input type of SetConventionCanceled */
export type SetConventionCanceledInput = {
  canceled: Scalars['Boolean'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of SetConventionCanceled */
export type SetConventionCanceledPayload = {
  __typename?: 'SetConventionCanceledPayload';
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
  __typename?: 'Signup';
  age_restrictions_check: Scalars['String'];
  bucket_key?: Maybe<Scalars['String']>;
  choice?: Maybe<Scalars['Int']>;
  counted: Scalars['Boolean'];
  created_at: Scalars['Date'];
  id: Scalars['Int'];
  requested_bucket_key?: Maybe<Scalars['String']>;
  run: Run;
  state: SignupState;
  updated_at: Scalars['Date'];
  user_con_profile: UserConProfile;
  waitlist_position?: Maybe<Scalars['Int']>;
};

export type SignupChange = {
  __typename?: 'SignupChange';
  action: SignupChangeAction;
  bucket_key?: Maybe<Scalars['String']>;
  counted: Scalars['Boolean'];
  created_at: Scalars['Date'];
  id: Scalars['Int'];
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
  action?: Maybe<Array<Scalars['String']>>;
  event_title?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type SignupChangesPagination = PaginationInterface & {
  __typename?: 'SignupChangesPagination';
  current_page: Scalars['Int'];
  entries: Array<SignupChange>;
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
};

export type SignupCountByState = {
  __typename?: 'SignupCountByState';
  count: Scalars['Int'];
  state: SignupState;
};

export type SignupFiltersInput = {
  bucket?: Maybe<Array<Scalars['String']>>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  state?: Maybe<Array<Scalars['String']>>;
};

export enum SignupMode {
  /** Attendees can request signups and signup changes but con staff must approve them */
  Moderated = 'moderated',
  /** Attendees can sign themselves up for events */
  SelfService = 'self_service'
}

export type SignupMoveResult = {
  __typename?: 'SignupMoveResult';
  bucket_key?: Maybe<Scalars['String']>;
  prev_bucket_key?: Maybe<Scalars['String']>;
  prev_state: SignupState;
  signup: Signup;
  signup_id: Scalars['Int'];
  state: SignupState;
};

export type SignupRequest = {
  __typename?: 'SignupRequest';
  created_at: Scalars['Date'];
  id: Scalars['Int'];
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
  state?: Maybe<Array<SignupRequestState>>;
};

export type SignupRequestsPagination = PaginationInterface & {
  __typename?: 'SignupRequestsPagination';
  current_page: Scalars['Int'];
  entries: Array<SignupRequest>;
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
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

export type SignupsPagination = PaginationInterface & {
  __typename?: 'SignupsPagination';
  current_page: Scalars['Int'];
  entries: Array<Signup>;
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
};

export enum SignupState {
  Confirmed = 'confirmed',
  Waitlisted = 'waitlisted',
  Withdrawn = 'withdrawn'
}

export enum SiteMode {
  /** Site behaves as a convention with multiple events */
  Convention = 'convention',
  /** Site behaves as a single standalone event */
  SingleEvent = 'single_event'
}

/** Autogenerated input type of SortCmsNavigationItems */
export type SortCmsNavigationItemsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  sort_items: Array<UpdateCmsNavigationItemInput>;
};

/** Autogenerated return type of SortCmsNavigationItems */
export type SortCmsNavigationItemsPayload = {
  __typename?: 'SortCmsNavigationItemsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
};

export type SortInput = {
  desc: Scalars['Boolean'];
  field: Scalars['String'];
};

export type StaffPosition = {
  __typename?: 'StaffPosition';
  cc_addresses: Array<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_aliases: Array<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  permissions: Array<Permission>;
  user_con_profiles?: Maybe<Array<UserConProfile>>;
  visible?: Maybe<Scalars['Boolean']>;
};

export type StaffPositionInput = {
  cc_addresses?: Maybe<Array<Scalars['String']>>;
  email?: Maybe<Scalars['String']>;
  email_aliases?: Maybe<Array<Scalars['String']>>;
  name?: Maybe<Scalars['String']>;
  user_con_profile_ids?: Maybe<Array<Scalars['Int']>>;
  visible?: Maybe<Scalars['Boolean']>;
};

/** Autogenerated input type of SubmitEventProposal */
export type SubmitEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of SubmitEventProposal */
export type SubmitEventProposalPayload = {
  __typename?: 'SubmitEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of SubmitOrder */
export type SubmitOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  payment_mode: PaymentMode;
  stripe_token?: Maybe<Scalars['String']>;
};

/** Autogenerated return type of SubmitOrder */
export type SubmitOrderPayload = {
  __typename?: 'SubmitOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order: Order;
};

export type TeamMember = {
  __typename?: 'TeamMember';
  /** @deprecated Use display_team_member instead */
  display: Scalars['Boolean'];
  display_team_member: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  event: Event;
  id: Scalars['Int'];
  receive_con_email: Scalars['Boolean'];
  receive_signup_email: ReceiveSignupEmail;
  show_email: Scalars['Boolean'];
  user_con_profile: UserConProfile;
};

export type TeamMemberInput = {
  display_team_member?: Maybe<Scalars['Boolean']>;
  receive_con_email?: Maybe<Scalars['Boolean']>;
  receive_signup_email?: Maybe<ReceiveSignupEmail>;
  show_email?: Maybe<Scalars['Boolean']>;
};

export type Ticket = {
  __typename?: 'Ticket';
  /** @deprecated Use order_entry for payment fields */
  charge_id?: Maybe<Scalars['String']>;
  convention: Convention;
  created_at: Scalars['Date'];
  id: Scalars['Int'];
  order_entry?: Maybe<OrderEntry>;
  /** @deprecated Use order_entry for payment fields */
  payment_amount?: Maybe<Money>;
  /** @deprecated Use order_entry for payment fields */
  payment_note?: Maybe<Scalars['String']>;
  provided_by_event?: Maybe<Event>;
  ticket_type: TicketType;
  updated_at: Scalars['Date'];
  user_con_profile: UserConProfile;
};

export type TicketCountByTypeAndPaymentAmount = {
  __typename?: 'TicketCountByTypeAndPaymentAmount';
  count: Scalars['Int'];
  payment_amount: Money;
  ticket_type: TicketType;
};

export type TicketInput = {
  provided_by_event_id?: Maybe<Scalars['Int']>;
  ticket_type_id: Scalars['Int'];
};

export enum TicketMode {
  /** Tickets are neither sold nor required in this convention */
  Disabled = 'disabled',
  /** A valid ticket is required to sign up for events in this convention */
  RequiredForSignup = 'required_for_signup'
}

export type TicketType = {
  __typename?: 'TicketType';
  allows_event_signups: Scalars['Boolean'];
  convention: Convention;
  counts_towards_convention_maximum: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  maximum_event_provided_tickets: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  /** @deprecated Tickets are now provided through products */
  pricing_schedule: ScheduledMoneyValue;
  providing_products: Array<Product>;
  /** @deprecated Tickets are now provided through products */
  publicly_available: Scalars['Boolean'];
};


export type TicketTypeMaximum_Event_Provided_TicketsArgs = {
  event_id?: Maybe<Scalars['Int']>;
};

export type TicketTypeInput = {
  allows_event_signups?: Maybe<Scalars['Boolean']>;
  counts_towards_convention_maximum?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  maximum_event_provided_tickets?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  pricing_schedule?: Maybe<ScheduledMoneyValueInput>;
  publicly_available?: Maybe<Scalars['Boolean']>;
};

export type TimespanWithMoneyValue = {
  __typename?: 'TimespanWithMoneyValue';
  finish?: Maybe<Scalars['Date']>;
  start?: Maybe<Scalars['Date']>;
  value: Money;
};

export type TimespanWithMoneyValueInput = {
  finish?: Maybe<Scalars['Date']>;
  start?: Maybe<Scalars['Date']>;
  value: MoneyInput;
};

export type TimespanWithValue = {
  __typename?: 'TimespanWithValue';
  finish?: Maybe<Scalars['Date']>;
  start?: Maybe<Scalars['Date']>;
  value: Scalars['String'];
};

export type TimespanWithValueInput = {
  finish?: Maybe<Scalars['Date']>;
  start?: Maybe<Scalars['Date']>;
  string_value?: Maybe<Scalars['String']>;
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
  clientMutationId?: Maybe<Scalars['String']>;
  drop_event?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  status: Scalars['String'];
};

/** Autogenerated return type of TransitionEventProposal */
export type TransitionEventProposalPayload = {
  __typename?: 'TransitionEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of UpdateCmsContentGroup */
export type UpdateCmsContentGroupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_content_group: CmsContentGroupInput;
  grant_permissions?: Maybe<Array<PermissionInput>>;
  id: Scalars['Int'];
  revoke_permissions?: Maybe<Array<PermissionInput>>;
};

/** Autogenerated return type of UpdateCmsContentGroup */
export type UpdateCmsContentGroupPayload = {
  __typename?: 'UpdateCmsContentGroupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_content_group: CmsContentGroup;
};

/** Autogenerated input type of UpdateCmsGraphqlQuery */
export type UpdateCmsGraphqlQueryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  query: CmsGraphqlQueryInput;
};

/** Autogenerated return type of UpdateCmsGraphqlQuery */
export type UpdateCmsGraphqlQueryPayload = {
  __typename?: 'UpdateCmsGraphqlQueryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  query: CmsGraphqlQuery;
};

/** Autogenerated input type of UpdateCmsLayout */
export type UpdateCmsLayoutInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_layout: CmsLayoutInput;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateCmsLayout */
export type UpdateCmsLayoutPayload = {
  __typename?: 'UpdateCmsLayoutPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_layout: CmsLayout;
};

/** Autogenerated input type of UpdateCmsNavigationItem */
export type UpdateCmsNavigationItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_navigation_item?: Maybe<CmsNavigationItemInput>;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateCmsNavigationItem */
export type UpdateCmsNavigationItemPayload = {
  __typename?: 'UpdateCmsNavigationItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_navigation_item: CmsNavigationItem;
};

/** Autogenerated input type of UpdateCmsPartial */
export type UpdateCmsPartialInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_partial: CmsPartialInput;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateCmsPartial */
export type UpdateCmsPartialPayload = {
  __typename?: 'UpdateCmsPartialPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  cms_partial: CmsPartial;
};

/** Autogenerated input type of UpdateConvention */
export type UpdateConventionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  convention: ConventionInput;
  id?: Maybe<Scalars['Int']>;
};

/** Autogenerated return type of UpdateConvention */
export type UpdateConventionPayload = {
  __typename?: 'UpdateConventionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  convention: Convention;
};

/** Autogenerated input type of UpdateCoupon */
export type UpdateCouponInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon: CouponInput;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateCoupon */
export type UpdateCouponPayload = {
  __typename?: 'UpdateCouponPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  coupon: Coupon;
};

/** Autogenerated input type of UpdateDepartment */
export type UpdateDepartmentInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  department: DepartmentInput;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateDepartment */
export type UpdateDepartmentPayload = {
  __typename?: 'UpdateDepartmentPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  department: Department;
};

/** Autogenerated input type of UpdateEmailRoute */
export type UpdateEmailRouteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  email_route: EmailRouteInput;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateEmailRoute */
export type UpdateEmailRoutePayload = {
  __typename?: 'UpdateEmailRoutePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  email_route: EmailRoute;
};

/** Autogenerated input type of UpdateEventAdminNotes */
export type UpdateEventAdminNotesInput = {
  admin_notes: Scalars['String'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateEventAdminNotes */
export type UpdateEventAdminNotesPayload = {
  __typename?: 'UpdateEventAdminNotesPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: Event;
};

/** Autogenerated input type of UpdateEventCategory */
export type UpdateEventCategoryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_category: EventCategoryInput;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateEventCategory */
export type UpdateEventCategoryPayload = {
  __typename?: 'UpdateEventCategoryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_category: EventCategory;
};

/** Autogenerated input type of UpdateEvent */
export type UpdateEventInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event?: Maybe<EventInput>;
  id?: Maybe<Scalars['Int']>;
};

/** Autogenerated return type of UpdateEvent */
export type UpdateEventPayload = {
  __typename?: 'UpdateEventPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event: Event;
};

/** Autogenerated input type of UpdateEventProposalAdminNotes */
export type UpdateEventProposalAdminNotesInput = {
  admin_notes: Scalars['String'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateEventProposalAdminNotes */
export type UpdateEventProposalAdminNotesPayload = {
  __typename?: 'UpdateEventProposalAdminNotesPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of UpdateEventProposal */
export type UpdateEventProposalInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposalInput;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateEventProposal */
export type UpdateEventProposalPayload = {
  __typename?: 'UpdateEventProposalPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_proposal: EventProposal;
};

/** Autogenerated input type of UpdateForm */
export type UpdateFormInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: FormInput;
  id: Scalars['Int'];
};

/** Autogenerated input type of UpdateFormItem */
export type UpdateFormItemInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_item: FormItemInput;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateFormItem */
export type UpdateFormItemPayload = {
  __typename?: 'UpdateFormItemPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_item: FormItem;
};

/** Autogenerated return type of UpdateForm */
export type UpdateFormPayload = {
  __typename?: 'UpdateFormPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: Form;
};

/** Autogenerated input type of UpdateFormSection */
export type UpdateFormSectionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_section: FormSectionInput;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateFormSection */
export type UpdateFormSectionPayload = {
  __typename?: 'UpdateFormSectionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_section: FormSection;
};

/** Autogenerated input type of UpdateFormWithJSON */
export type UpdateFormWithJsonInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form_json: Scalars['String'];
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateFormWithJSON */
export type UpdateFormWithJsonPayload = {
  __typename?: 'UpdateFormWithJSONPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  form: Form;
};

/** Autogenerated input type of UpdateMaximumEventProvidedTicketsOverride */
export type UpdateMaximumEventProvidedTicketsOverrideInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  override_value: Scalars['Int'];
};

/** Autogenerated return type of UpdateMaximumEventProvidedTicketsOverride */
export type UpdateMaximumEventProvidedTicketsOverridePayload = {
  __typename?: 'UpdateMaximumEventProvidedTicketsOverridePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  maximum_event_provided_tickets_override: MaximumEventProvidedTicketsOverride;
};

/** Autogenerated input type of UpdateNotificationTemplate */
export type UpdateNotificationTemplateInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  event_key: Scalars['String'];
  notification_template: NotificationTemplateInput;
};

/** Autogenerated return type of UpdateNotificationTemplate */
export type UpdateNotificationTemplatePayload = {
  __typename?: 'UpdateNotificationTemplatePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  notification_template: NotificationTemplate;
};

/** Autogenerated input type of UpdateOrderEntry */
export type UpdateOrderEntryInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  order_entry: OrderEntryInput;
};

/** Autogenerated return type of UpdateOrderEntry */
export type UpdateOrderEntryPayload = {
  __typename?: 'UpdateOrderEntryPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order_entry: OrderEntry;
};

/** Autogenerated input type of UpdateOrder */
export type UpdateOrderInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  order: OrderInput;
};

/** Autogenerated return type of UpdateOrder */
export type UpdateOrderPayload = {
  __typename?: 'UpdateOrderPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  order: Order;
};

/** Autogenerated input type of UpdateOrganizationRole */
export type UpdateOrganizationRoleInput = {
  add_permissions?: Maybe<Array<PermissionInput>>;
  add_user_ids?: Maybe<Array<Scalars['Int']>>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  organization_role: OrganizationRoleInput;
  remove_permission_ids?: Maybe<Array<Scalars['Int']>>;
  remove_user_ids?: Maybe<Array<Scalars['Int']>>;
};

/** Autogenerated return type of UpdateOrganizationRole */
export type UpdateOrganizationRolePayload = {
  __typename?: 'UpdateOrganizationRolePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  organization_role: OrganizationRole;
};

/** Autogenerated input type of UpdatePage */
export type UpdatePageInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  page: PageInput;
};

/** Autogenerated return type of UpdatePage */
export type UpdatePagePayload = {
  __typename?: 'UpdatePagePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  page: Page;
};

/** Autogenerated input type of UpdateProduct */
export type UpdateProductInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  product: ProductInput;
};

/** Autogenerated return type of UpdateProduct */
export type UpdateProductPayload = {
  __typename?: 'UpdateProductPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  product: Product;
};

/** Autogenerated input type of UpdateRoom */
export type UpdateRoomInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  room: RoomInput;
};

/** Autogenerated return type of UpdateRoom */
export type UpdateRoomPayload = {
  __typename?: 'UpdateRoomPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  room: Room;
};

/** Autogenerated input type of UpdateRootSite */
export type UpdateRootSiteInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  root_site: RootSiteInput;
};

/** Autogenerated return type of UpdateRootSite */
export type UpdateRootSitePayload = {
  __typename?: 'UpdateRootSitePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  root_site: RootSite;
};

/** Autogenerated input type of UpdateRun */
export type UpdateRunInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  run: RunInput;
};

/** Autogenerated return type of UpdateRun */
export type UpdateRunPayload = {
  __typename?: 'UpdateRunPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  run: Run;
};

/** Autogenerated input type of UpdateSignupBucket */
export type UpdateSignupBucketInput = {
  bucket_key: Scalars['String'];
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateSignupBucket */
export type UpdateSignupBucketPayload = {
  __typename?: 'UpdateSignupBucketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

/** Autogenerated input type of UpdateSignupCounted */
export type UpdateSignupCountedInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  counted: Scalars['Boolean'];
  id: Scalars['Int'];
};

/** Autogenerated return type of UpdateSignupCounted */
export type UpdateSignupCountedPayload = {
  __typename?: 'UpdateSignupCountedPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

/** Autogenerated input type of UpdateStaffPosition */
export type UpdateStaffPositionInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  staff_position: StaffPositionInput;
};

/** Autogenerated return type of UpdateStaffPosition */
export type UpdateStaffPositionPayload = {
  __typename?: 'UpdateStaffPositionPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of UpdateStaffPositionPermissions */
export type UpdateStaffPositionPermissionsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  grant_permissions: Array<PermissionInput>;
  revoke_permissions: Array<PermissionInput>;
  staff_position_id: Scalars['Int'];
};

/** Autogenerated return type of UpdateStaffPositionPermissions */
export type UpdateStaffPositionPermissionsPayload = {
  __typename?: 'UpdateStaffPositionPermissionsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  staff_position: StaffPosition;
};

/** Autogenerated input type of UpdateTeamMember */
export type UpdateTeamMemberInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  team_member: TeamMemberInput;
};

/** Autogenerated return type of UpdateTeamMember */
export type UpdateTeamMemberPayload = {
  __typename?: 'UpdateTeamMemberPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  team_member: TeamMember;
};

/** Autogenerated input type of UpdateTicket */
export type UpdateTicketInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  ticket: TicketInput;
};

/** Autogenerated return type of UpdateTicket */
export type UpdateTicketPayload = {
  __typename?: 'UpdateTicketPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket: Ticket;
};

/** Autogenerated input type of UpdateTicketType */
export type UpdateTicketTypeInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  ticket_type: TicketTypeInput;
};

/** Autogenerated return type of UpdateTicketType */
export type UpdateTicketTypePayload = {
  __typename?: 'UpdateTicketTypePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  ticket_type: TicketType;
};

/** Autogenerated input type of UpdateUserActivityAlert */
export type UpdateUserActivityAlertInput = {
  add_notification_destinations: Array<NotificationDestinationInput>;
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  remove_notification_destination_ids: Array<Scalars['Int']>;
  user_activity_alert: UserActivityAlertInput;
};

/** Autogenerated return type of UpdateUserActivityAlert */
export type UpdateUserActivityAlertPayload = {
  __typename?: 'UpdateUserActivityAlertPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_activity_alert: UserActivityAlert;
};

/** Autogenerated input type of UpdateUserConProfile */
export type UpdateUserConProfileInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  user_con_profile: UserConProfileInput;
};

/** Autogenerated return type of UpdateUserConProfile */
export type UpdateUserConProfilePayload = {
  __typename?: 'UpdateUserConProfilePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_con_profile: UserConProfile;
};


export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  event_proposals: Array<EventProposal>;
  first_name?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  last_name?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  name_inverted?: Maybe<Scalars['String']>;
  privileges?: Maybe<Array<Maybe<Scalars['String']>>>;
  user_con_profiles: Array<UserConProfile>;
};

export type UserActivityAlert = {
  __typename?: 'UserActivityAlert';
  convention: Convention;
  email?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  notification_destinations: Array<NotificationDestination>;
  partial_name?: Maybe<Scalars['String']>;
  trigger_on_ticket_create: Scalars['Boolean'];
  trigger_on_user_con_profile_create: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type UserActivityAlertInput = {
  email?: Maybe<Scalars['String']>;
  partial_name?: Maybe<Scalars['String']>;
  trigger_on_ticket_create?: Maybe<Scalars['Boolean']>;
  trigger_on_user_con_profile_create?: Maybe<Scalars['Boolean']>;
  user_id?: Maybe<Scalars['Int']>;
};

export type UserConProfile = {
  __typename?: 'UserConProfile';
  ability?: Maybe<Ability>;
  accepted_clickwrap_agreement?: Maybe<Scalars['Boolean']>;
  address?: Maybe<Scalars['String']>;
  /** @deprecated Daytime phone, evening phone, best time to call, and preferred contact method fields are deprecated in favor of just using the mobile phone and/or email address.  For conventions that used the deprecated fields, they will remain available in form_response_attrs_json. */
  best_call_time?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  bio_html?: Maybe<Scalars['String']>;
  bio_name?: Maybe<Scalars['String']>;
  birth_date?: Maybe<Scalars['Date']>;
  can_have_bio: Scalars['Boolean'];
  can_override_maximum_event_provided_tickets: Scalars['Boolean'];
  city?: Maybe<Scalars['String']>;
  convention?: Maybe<Convention>;
  country?: Maybe<Scalars['String']>;
  /** @deprecated Daytime phone, evening phone, best time to call, and preferred contact method fields are deprecated in favor of just using the mobile phone and/or email address.  For conventions that used the deprecated fields, they will remain available in form_response_attrs_json. */
  day_phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  /** @deprecated Daytime phone, evening phone, best time to call, and preferred contact method fields are deprecated in favor of just using the mobile phone and/or email address.  For conventions that used the deprecated fields, they will remain available in form_response_attrs_json. */
  evening_phone?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  form_response_attrs_json?: Maybe<Scalars['String']>;
  gravatar_enabled: Scalars['Boolean'];
  gravatar_url: Scalars['String'];
  ical_secret?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  last_name?: Maybe<Scalars['String']>;
  mobile_phone?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  name_inverted?: Maybe<Scalars['String']>;
  name_without_nickname?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  order_summary: Scalars['String'];
  orders: Array<Maybe<Order>>;
  /** @deprecated Daytime phone, evening phone, best time to call, and preferred contact method fields are deprecated in favor of just using the mobile phone and/or email address.  For conventions that used the deprecated fields, they will remain available in form_response_attrs_json. */
  preferred_contact?: Maybe<Scalars['String']>;
  /** @deprecated Privileges are deprecated in favor of permissions and staff positions */
  privileges?: Maybe<Array<Maybe<Scalars['String']>>>;
  show_nickname_in_bio?: Maybe<Scalars['Boolean']>;
  signup_requests: Array<SignupRequest>;
  signups: Array<Signup>;
  staff_positions: Array<StaffPosition>;
  state?: Maybe<Scalars['String']>;
  team_members: Array<TeamMember>;
  ticket?: Maybe<Ticket>;
  user?: Maybe<User>;
  user_id: Scalars['Int'];
  zipcode?: Maybe<Scalars['String']>;
};

export type UserConProfileFiltersInput = {
  attending?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  is_team_member?: Maybe<Scalars['Boolean']>;
  last_name?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  payment_amount?: Maybe<Scalars['Float']>;
  /** DEPRECATED. Privileges are deprecated in favor of permissions and staff positions */
  privileges?: Maybe<Array<Scalars['String']>>;
  ticket?: Maybe<Array<Scalars['String']>>;
  ticket_type?: Maybe<Array<Scalars['String']>>;
};

export type UserConProfileInput = {
  address?: Maybe<Scalars['String']>;
  best_call_time?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  birth_date?: Maybe<Scalars['Date']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  day_phone?: Maybe<Scalars['String']>;
  evening_phone?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  form_response_attrs_json?: Maybe<Scalars['String']>;
  gravatar_enabled?: Maybe<Scalars['Boolean']>;
  last_name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  preferred_contact?: Maybe<Scalars['String']>;
  show_nickname_in_bio?: Maybe<Scalars['Boolean']>;
  state?: Maybe<Scalars['String']>;
  zipcode?: Maybe<Scalars['String']>;
};

export type UserConProfilesPagination = PaginationInterface & {
  __typename?: 'UserConProfilesPagination';
  current_page: Scalars['Int'];
  entries: Array<UserConProfile>;
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
};

export type UserFiltersInput = {
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  privileges?: Maybe<Array<Scalars['String']>>;
};

export type UsersPagination = PaginationInterface & {
  __typename?: 'UsersPagination';
  current_page: Scalars['Int'];
  entries: Array<User>;
  per_page: Scalars['Int'];
  total_entries: Scalars['Int'];
  total_pages: Scalars['Int'];
};

export type WinningUserConProfileInput = {
  conventionId: Scalars['Int'];
  userConProfileId: Scalars['Int'];
};

/** Autogenerated input type of WithdrawAllUserConProfileSignups */
export type WithdrawAllUserConProfileSignupsInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_con_profile_id: Scalars['Int'];
};

/** Autogenerated return type of WithdrawAllUserConProfileSignups */
export type WithdrawAllUserConProfileSignupsPayload = {
  __typename?: 'WithdrawAllUserConProfileSignupsPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  user_con_profile: UserConProfile;
};

/** Autogenerated input type of WithdrawMySignup */
export type WithdrawMySignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  run_id: Scalars['Int'];
};

/** Autogenerated return type of WithdrawMySignup */
export type WithdrawMySignupPayload = {
  __typename?: 'WithdrawMySignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

/** Autogenerated input type of WithdrawSignupRequest */
export type WithdrawSignupRequestInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** Autogenerated return type of WithdrawSignupRequest */
export type WithdrawSignupRequestPayload = {
  __typename?: 'WithdrawSignupRequestPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup_request: SignupRequest;
};

/** Autogenerated input type of WithdrawUserSignup */
export type WithdrawUserSignupInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  run_id: Scalars['Int'];
  suppress_notifications?: Maybe<Scalars['Boolean']>;
  user_con_profile_id: Scalars['Int'];
};

/** Autogenerated return type of WithdrawUserSignup */
export type WithdrawUserSignupPayload = {
  __typename?: 'WithdrawUserSignupPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  signup: Signup;
};

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;


export type CreateEventMutation = (
  { __typename?: 'Mutation' }
  & { createEvent?: Maybe<(
    { __typename?: 'CreateEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Event, 'id'>
      & EventFieldsFragment
    ) }
  )> }
);

export type CreateFillerEventMutationVariables = Exact<{
  input: CreateFillerEventInput;
}>;


export type CreateFillerEventMutation = (
  { __typename?: 'Mutation' }
  & { createFillerEvent?: Maybe<(
    { __typename?: 'CreateFillerEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Event, 'id'>
      & EventFieldsFragment
    ) }
  )> }
);

export type DropEventMutationVariables = Exact<{
  input: DropEventInput;
}>;


export type DropEventMutation = (
  { __typename?: 'Mutation' }
  & { dropEvent?: Maybe<(
    { __typename?: 'DropEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Event, 'id' | 'status'>
    ) }
  )> }
);

export type RestoreDroppedEventMutationVariables = Exact<{
  input: RestoreDroppedEventInput;
}>;


export type RestoreDroppedEventMutation = (
  { __typename?: 'Mutation' }
  & { restoreDroppedEvent?: Maybe<(
    { __typename?: 'RestoreDroppedEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Event, 'id' | 'status'>
    ) }
  )> }
);

export type UpdateEventMutationVariables = Exact<{
  input: UpdateEventInput;
}>;


export type UpdateEventMutation = (
  { __typename?: 'Mutation' }
  & { updateEvent?: Maybe<(
    { __typename?: 'UpdateEventPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Event, 'id'>
      & EventFieldsFragment
    ) }
  )> }
);

export type CreateRunMutationVariables = Exact<{
  input: CreateRunInput;
}>;


export type CreateRunMutation = (
  { __typename?: 'Mutation' }
  & { createRun?: Maybe<(
    { __typename?: 'CreateRunPayload' }
    & { run: (
      { __typename?: 'Run' }
      & Pick<Run, 'id'>
      & RunFieldsFragment
    ) }
  )> }
);

export type CreateMultipleRunsMutationVariables = Exact<{
  input: CreateMultipleRunsInput;
}>;


export type CreateMultipleRunsMutation = (
  { __typename?: 'Mutation' }
  & { createMultipleRuns?: Maybe<(
    { __typename?: 'CreateMultipleRunsPayload' }
    & { runs: Array<(
      { __typename?: 'Run' }
      & Pick<Run, 'id'>
      & RunFieldsFragment
    )> }
  )> }
);

export type UpdateRunMutationVariables = Exact<{
  input: UpdateRunInput;
}>;


export type UpdateRunMutation = (
  { __typename?: 'Mutation' }
  & { updateRun?: Maybe<(
    { __typename?: 'UpdateRunPayload' }
    & { run: (
      { __typename?: 'Run' }
      & Pick<Run, 'id'>
      & RunFieldsFragment
    ) }
  )> }
);

export type DeleteRunMutationVariables = Exact<{
  input: DeleteRunInput;
}>;


export type DeleteRunMutation = (
  { __typename?: 'Mutation' }
  & { deleteRun?: Maybe<(
    { __typename?: 'DeleteRunPayload' }
    & { run: (
      { __typename?: 'Run' }
      & Pick<Run, 'id'>
      & RunFieldsFragment
    ) }
  )> }
);

export type CreateMaximumEventProvidedTicketsOverrideMutationVariables = Exact<{
  input: CreateMaximumEventProvidedTicketsOverrideInput;
}>;


export type CreateMaximumEventProvidedTicketsOverrideMutation = (
  { __typename?: 'Mutation' }
  & { createMaximumEventProvidedTicketsOverride?: Maybe<(
    { __typename?: 'CreateMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename?: 'MaximumEventProvidedTicketsOverride' }
      & Pick<MaximumEventProvidedTicketsOverride, 'id'>
      & MaximumEventProvidedTicketsOverrideFieldsFragment
    ) }
  )> }
);

export type DeleteMaximumEventProvidedTicketsOverrideMutationVariables = Exact<{
  input: DeleteMaximumEventProvidedTicketsOverrideInput;
}>;


export type DeleteMaximumEventProvidedTicketsOverrideMutation = (
  { __typename?: 'Mutation' }
  & { deleteMaximumEventProvidedTicketsOverride?: Maybe<(
    { __typename?: 'DeleteMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename?: 'MaximumEventProvidedTicketsOverride' }
      & Pick<MaximumEventProvidedTicketsOverride, 'id'>
      & MaximumEventProvidedTicketsOverrideFieldsFragment
    ) }
  )> }
);

export type UpdateMaximumEventProvidedTicketsOverrideMutationVariables = Exact<{
  input: UpdateMaximumEventProvidedTicketsOverrideInput;
}>;


export type UpdateMaximumEventProvidedTicketsOverrideMutation = (
  { __typename?: 'Mutation' }
  & { updateMaximumEventProvidedTicketsOverride?: Maybe<(
    { __typename?: 'UpdateMaximumEventProvidedTicketsOverridePayload' }
    & { maximum_event_provided_tickets_override: (
      { __typename?: 'MaximumEventProvidedTicketsOverride' }
      & Pick<MaximumEventProvidedTicketsOverride, 'id'>
      & MaximumEventProvidedTicketsOverrideFieldsFragment
    ) }
  )> }
);

export type UpdateEventAdminNotesMutationVariables = Exact<{
  eventId: Scalars['Int'];
  adminNotes: Scalars['String'];
}>;


export type UpdateEventAdminNotesMutation = (
  { __typename?: 'Mutation' }
  & { updateEventAdminNotes?: Maybe<(
    { __typename?: 'UpdateEventAdminNotesPayload' }
    & { event: (
      { __typename?: 'Event' }
      & Pick<Event, 'id'>
      & EventFieldsFragment
    ) }
  )> }
);

export type TicketTypeFieldsFragment = (
  { __typename?: 'TicketType' }
  & Pick<TicketType, 'id' | 'description' | 'maximum_event_provided_tickets'>
);

export type MaximumEventProvidedTicketsOverrideFieldsFragment = (
  { __typename?: 'MaximumEventProvidedTicketsOverride' }
  & Pick<MaximumEventProvidedTicketsOverride, 'id' | 'override_value'>
  & { ticket_type: (
    { __typename?: 'TicketType' }
    & Pick<TicketType, 'id'>
    & TicketTypeFieldsFragment
  ) }
);

export type RoomFieldsFragment = (
  { __typename?: 'Room' }
  & Pick<Room, 'id' | 'name'>
);

export type ConventionFieldsFragment = (
  { __typename?: 'Convention' }
  & Pick<Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'timezone_name' | 'timezone_mode' | 'event_mailing_list_domain' | 'site_mode' | 'ticket_name' | 'ticket_mode'>
  & { event_categories: Array<(
    { __typename?: 'EventCategory' }
    & Pick<EventCategory, 'id'>
    & EventPageEventCategoryFieldsFragment
  )>, rooms?: Maybe<Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id'>
    & RoomFieldsFragment
  )>>, ticket_types?: Maybe<Array<(
    { __typename?: 'TicketType' }
    & Pick<TicketType, 'id'>
    & TicketTypeFieldsFragment
  )>> }
);

export type RunFieldsFragment = (
  { __typename?: 'Run' }
  & Pick<Run, 'id' | 'starts_at' | 'schedule_note' | 'title_suffix'>
  & { rooms: Array<(
    { __typename?: 'Room' }
    & Pick<Room, 'id'>
    & RoomFieldsFragment
  )> }
);

export type EventFieldsFragment = (
  { __typename?: 'Event' }
  & Pick<Event, 'id' | 'title' | 'author' | 'description' | 'organization' | 'url' | 'con_mail_destination' | 'can_play_concurrently' | 'short_blurb' | 'participant_communications' | 'age_restrictions' | 'content_warnings' | 'email' | 'length_seconds' | 'status' | 'description_html' | 'form_response_attrs_json' | 'admin_notes'>
  & { event_category: (
    { __typename?: 'EventCategory' }
    & Pick<EventCategory, 'id'>
  ), registration_policy?: Maybe<(
    { __typename?: 'RegistrationPolicy' }
    & Pick<RegistrationPolicy, 'slots_limited' | 'prevent_no_preference_signups'>
    & { buckets: Array<(
      { __typename?: 'RegistrationPolicyBucket' }
      & Pick<RegistrationPolicyBucket, 'key' | 'name' | 'description' | 'minimum_slots' | 'preferred_slots' | 'total_slots' | 'slots_limited' | 'anything'>
    )> }
  )>, runs: Array<(
    { __typename?: 'Run' }
    & Pick<Run, 'id'>
    & RunFieldsFragment
  )>, maximum_event_provided_tickets_overrides: Array<(
    { __typename?: 'MaximumEventProvidedTicketsOverride' }
    & Pick<MaximumEventProvidedTicketsOverride, 'id'>
    & MaximumEventProvidedTicketsOverrideFieldsFragment
  )> }
);

export type EventPageEventCategoryFieldsFragment = (
  { __typename?: 'EventCategory' }
  & Pick<EventCategory, 'id' | 'name' | 'scheduling_ui' | 'default_color' | 'full_color' | 'signed_up_color'>
  & { event_form: (
    { __typename?: 'Form' }
    & Pick<Form, 'id' | 'form_api_json'>
  ) }
);

export type EventAdminEventsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type EventAdminEventsQueryQuery = (
  { __typename?: 'Query' }
  & { currentAbility: (
    { __typename?: 'Ability' }
    & Pick<Ability, 'can_override_maximum_event_provided_tickets' | 'can_manage_runs'>
  ), convention?: Maybe<(
    { __typename?: 'Convention' }
    & Pick<Convention, 'id'>
    & ConventionFieldsFragment
  )>, events: Array<(
    { __typename?: 'Event' }
    & Pick<Event, 'id'>
    & EventFieldsFragment
  )> }
);

export type ScheduleGridEventFragmentFragment = (
  { __typename?: 'Event' }
  & Pick<Event, 'id' | 'title' | 'length_seconds' | 'short_blurb_html' | 'my_rating' | 'can_play_concurrently'>
  & { event_category: (
    { __typename?: 'EventCategory' }
    & Pick<EventCategory, 'id' | 'name' | 'default_color' | 'signed_up_color' | 'full_color'>
  ), registration_policy?: Maybe<(
    { __typename?: 'RegistrationPolicy' }
    & Pick<RegistrationPolicy, 'slots_limited' | 'only_uncounted' | 'total_slots' | 'total_slots_including_not_counted' | 'preferred_slots' | 'preferred_slots_including_not_counted' | 'minimum_slots' | 'minimum_slots_including_not_counted'>
    & { buckets: Array<(
      { __typename?: 'RegistrationPolicyBucket' }
      & Pick<RegistrationPolicyBucket, 'key' | 'not_counted' | 'total_slots' | 'slots_limited'>
    )> }
  )>, runs: Array<(
    { __typename?: 'Run' }
    & Pick<Run, 'id' | 'starts_at' | 'schedule_note' | 'title_suffix' | 'confirmed_signup_count' | 'not_counted_signup_count' | 'room_names'>
    & RunBasicSignupDataFragment
  )> }
);

export type ScheduleGridConventionDataQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ScheduleGridConventionDataQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Maybe<(
    { __typename?: 'Convention' }
    & Pick<Convention, 'id' | 'pre_schedule_content_html'>
    & CommonConventionDataFragment
  )> }
);

export type ScheduleGridEventsQueryQueryVariables = Exact<{
  extendedCounts: Scalars['Boolean'];
  start?: Maybe<Scalars['Date']>;
  finish?: Maybe<Scalars['Date']>;
}>;


export type ScheduleGridEventsQueryQuery = (
  { __typename?: 'Query' }
  & { events: Array<(
    { __typename?: 'Event' }
    & Pick<Event, 'id'>
    & ScheduleGridEventFragmentFragment
  )> }
);

export type ScheduleGridCombinedQueryQueryVariables = Exact<{
  extendedCounts: Scalars['Boolean'];
  start?: Maybe<Scalars['Date']>;
  finish?: Maybe<Scalars['Date']>;
}>;


export type ScheduleGridCombinedQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Maybe<(
    { __typename?: 'Convention' }
    & Pick<Convention, 'id' | 'pre_schedule_content_html'>
    & CommonConventionDataFragment
  )>, events: Array<(
    { __typename?: 'Event' }
    & Pick<Event, 'id'>
    & ScheduleGridEventFragmentFragment
  )> }
);

export type CommonConventionDataFragment = (
  { __typename?: 'Convention' }
  & Pick<Convention, 'id' | 'name' | 'starts_at' | 'ends_at' | 'site_mode' | 'timezone_name' | 'timezone_mode' | 'ticket_name' | 'ticket_mode'>
  & { event_categories: Array<(
    { __typename?: 'EventCategory' }
    & Pick<EventCategory, 'id' | 'name' | 'scheduling_ui' | 'default_color' | 'full_color' | 'signed_up_color'>
  )> }
);

export type RunBasicSignupDataFragment = (
  { __typename?: 'Run' }
  & Pick<Run, 'id' | 'signup_count_by_state_and_bucket_key_and_counted'>
  & { my_signups: Array<(
    { __typename?: 'Signup' }
    & Pick<Signup, 'id' | 'state'>
  )>, my_signup_requests: Array<(
    { __typename?: 'SignupRequest' }
    & Pick<SignupRequest, 'id' | 'state'>
  )> }
);

export type CommonConventionDataQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CommonConventionDataQueryQuery = (
  { __typename?: 'Query' }
  & { convention?: Maybe<(
    { __typename?: 'Convention' }
    & Pick<Convention, 'id'>
    & CommonConventionDataFragment
  )> }
);

export const EventPageEventCategoryFieldsFragmentDoc = gql`
    fragment EventPageEventCategoryFields on EventCategory {
  id
  name
  scheduling_ui
  default_color
  full_color
  signed_up_color
  event_form {
    id
    form_api_json
  }
}
    `;
export const RoomFieldsFragmentDoc = gql`
    fragment RoomFields on Room {
  id
  name
}
    `;
export const TicketTypeFieldsFragmentDoc = gql`
    fragment TicketTypeFields on TicketType {
  id
  description
  maximum_event_provided_tickets
}
    `;
export const ConventionFieldsFragmentDoc = gql`
    fragment ConventionFields on Convention {
  id
  name
  starts_at
  ends_at
  timezone_name
  timezone_mode
  event_mailing_list_domain
  site_mode
  event_categories {
    id
    ...EventPageEventCategoryFields
  }
  rooms {
    id
    ...RoomFields
  }
  ticket_types {
    id
    ...TicketTypeFields
  }
  ticket_name
  ticket_mode
}
    ${EventPageEventCategoryFieldsFragmentDoc}
${RoomFieldsFragmentDoc}
${TicketTypeFieldsFragmentDoc}`;
export const RunFieldsFragmentDoc = gql`
    fragment RunFields on Run {
  id
  starts_at
  schedule_note
  title_suffix
  rooms {
    id
    ...RoomFields
  }
}
    ${RoomFieldsFragmentDoc}`;
export const MaximumEventProvidedTicketsOverrideFieldsFragmentDoc = gql`
    fragment MaximumEventProvidedTicketsOverrideFields on MaximumEventProvidedTicketsOverride {
  ticket_type {
    id
    ...TicketTypeFields
  }
  id
  override_value
}
    ${TicketTypeFieldsFragmentDoc}`;
export const EventFieldsFragmentDoc = gql`
    fragment EventFields on Event {
  id
  title
  author
  description
  organization
  url
  con_mail_destination
  can_play_concurrently
  short_blurb
  participant_communications
  age_restrictions
  content_warnings
  email
  length_seconds
  status
  description_html
  form_response_attrs_json
  admin_notes
  event_category {
    id
  }
  registration_policy {
    buckets {
      key
      name
      description
      minimum_slots
      preferred_slots
      total_slots
      slots_limited
      anything
    }
    slots_limited
    prevent_no_preference_signups
  }
  runs {
    id
    ...RunFields
  }
  maximum_event_provided_tickets_overrides {
    id
    ...MaximumEventProvidedTicketsOverrideFields
  }
}
    ${RunFieldsFragmentDoc}
${MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export const RunBasicSignupDataFragmentDoc = gql`
    fragment RunBasicSignupData on Run {
  id
  signup_count_by_state_and_bucket_key_and_counted
  my_signups {
    id
    state
  }
  my_signup_requests {
    id
    state
  }
}
    `;
export const ScheduleGridEventFragmentFragmentDoc = gql`
    fragment ScheduleGridEventFragment on Event {
  id
  title
  length_seconds
  short_blurb_html
  my_rating
  can_play_concurrently
  event_category {
    id
    name
    default_color
    signed_up_color
    full_color
  }
  registration_policy {
    slots_limited
    only_uncounted
    total_slots
    total_slots_including_not_counted
    preferred_slots
    preferred_slots_including_not_counted
    minimum_slots
    minimum_slots_including_not_counted
    buckets {
      key
      not_counted
      total_slots
      slots_limited
    }
  }
  runs(start: $start, finish: $finish) {
    id
    starts_at
    schedule_note
    title_suffix
    ...RunBasicSignupData
    confirmed_signup_count @include(if: $extendedCounts)
    not_counted_signup_count @include(if: $extendedCounts)
    room_names
  }
}
    ${RunBasicSignupDataFragmentDoc}`;
export const CommonConventionDataFragmentDoc = gql`
    fragment CommonConventionData on Convention {
  id
  name
  starts_at
  ends_at
  site_mode
  timezone_name
  timezone_mode
  ticket_name
  ticket_mode
  event_categories {
    id
    name
    scheduling_ui
    default_color
    full_color
    signed_up_color
  }
}
    `;
export const CreateEventDocument = gql`
    mutation CreateEvent($input: CreateEventInput!) {
  createEvent(input: $input) {
    event {
      id
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;
export type CreateEventMutationFn = ApolloReactCommon.MutationFunction<CreateEventMutation, CreateEventMutationVariables>;

/**
 * __useCreateEventMutation__
 *
 * To run a mutation, you first call `useCreateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEventMutation, { data, loading, error }] = useCreateEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateEventMutation, CreateEventMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument, baseOptions);
      }
export type CreateEventMutationHookResult = ReturnType<typeof useCreateEventMutation>;
export type CreateEventMutationResult = ApolloReactCommon.MutationResult<CreateEventMutation>;
export type CreateEventMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateEventMutation, CreateEventMutationVariables>;
export const CreateFillerEventDocument = gql`
    mutation CreateFillerEvent($input: CreateFillerEventInput!) {
  createFillerEvent(input: $input) {
    event {
      id
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;
export type CreateFillerEventMutationFn = ApolloReactCommon.MutationFunction<CreateFillerEventMutation, CreateFillerEventMutationVariables>;

/**
 * __useCreateFillerEventMutation__
 *
 * To run a mutation, you first call `useCreateFillerEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFillerEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFillerEventMutation, { data, loading, error }] = useCreateFillerEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFillerEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateFillerEventMutation, CreateFillerEventMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateFillerEventMutation, CreateFillerEventMutationVariables>(CreateFillerEventDocument, baseOptions);
      }
export type CreateFillerEventMutationHookResult = ReturnType<typeof useCreateFillerEventMutation>;
export type CreateFillerEventMutationResult = ApolloReactCommon.MutationResult<CreateFillerEventMutation>;
export type CreateFillerEventMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateFillerEventMutation, CreateFillerEventMutationVariables>;
export const DropEventDocument = gql`
    mutation DropEvent($input: DropEventInput!) {
  dropEvent(input: $input) {
    event {
      id
      status
    }
  }
}
    `;
export type DropEventMutationFn = ApolloReactCommon.MutationFunction<DropEventMutation, DropEventMutationVariables>;

/**
 * __useDropEventMutation__
 *
 * To run a mutation, you first call `useDropEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDropEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dropEventMutation, { data, loading, error }] = useDropEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDropEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DropEventMutation, DropEventMutationVariables>) {
        return ApolloReactHooks.useMutation<DropEventMutation, DropEventMutationVariables>(DropEventDocument, baseOptions);
      }
export type DropEventMutationHookResult = ReturnType<typeof useDropEventMutation>;
export type DropEventMutationResult = ApolloReactCommon.MutationResult<DropEventMutation>;
export type DropEventMutationOptions = ApolloReactCommon.BaseMutationOptions<DropEventMutation, DropEventMutationVariables>;
export const RestoreDroppedEventDocument = gql`
    mutation RestoreDroppedEvent($input: RestoreDroppedEventInput!) {
  restoreDroppedEvent(input: $input) {
    event {
      id
      status
    }
  }
}
    `;
export type RestoreDroppedEventMutationFn = ApolloReactCommon.MutationFunction<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>;

/**
 * __useRestoreDroppedEventMutation__
 *
 * To run a mutation, you first call `useRestoreDroppedEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRestoreDroppedEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [restoreDroppedEventMutation, { data, loading, error }] = useRestoreDroppedEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRestoreDroppedEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>) {
        return ApolloReactHooks.useMutation<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>(RestoreDroppedEventDocument, baseOptions);
      }
export type RestoreDroppedEventMutationHookResult = ReturnType<typeof useRestoreDroppedEventMutation>;
export type RestoreDroppedEventMutationResult = ApolloReactCommon.MutationResult<RestoreDroppedEventMutation>;
export type RestoreDroppedEventMutationOptions = ApolloReactCommon.BaseMutationOptions<RestoreDroppedEventMutation, RestoreDroppedEventMutationVariables>;
export const UpdateEventDocument = gql`
    mutation UpdateEvent($input: UpdateEventInput!) {
  updateEvent(input: $input) {
    event {
      id
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;
export type UpdateEventMutationFn = ApolloReactCommon.MutationFunction<UpdateEventMutation, UpdateEventMutationVariables>;

/**
 * __useUpdateEventMutation__
 *
 * To run a mutation, you first call `useUpdateEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventMutation, { data, loading, error }] = useUpdateEventMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEventMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateEventMutation, UpdateEventMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateEventMutation, UpdateEventMutationVariables>(UpdateEventDocument, baseOptions);
      }
export type UpdateEventMutationHookResult = ReturnType<typeof useUpdateEventMutation>;
export type UpdateEventMutationResult = ApolloReactCommon.MutationResult<UpdateEventMutation>;
export type UpdateEventMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateEventMutation, UpdateEventMutationVariables>;
export const CreateRunDocument = gql`
    mutation CreateRun($input: CreateRunInput!) {
  createRun(input: $input) {
    run {
      id
      ...RunFields
    }
  }
}
    ${RunFieldsFragmentDoc}`;
export type CreateRunMutationFn = ApolloReactCommon.MutationFunction<CreateRunMutation, CreateRunMutationVariables>;

/**
 * __useCreateRunMutation__
 *
 * To run a mutation, you first call `useCreateRunMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRunMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRunMutation, { data, loading, error }] = useCreateRunMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRunMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRunMutation, CreateRunMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateRunMutation, CreateRunMutationVariables>(CreateRunDocument, baseOptions);
      }
export type CreateRunMutationHookResult = ReturnType<typeof useCreateRunMutation>;
export type CreateRunMutationResult = ApolloReactCommon.MutationResult<CreateRunMutation>;
export type CreateRunMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRunMutation, CreateRunMutationVariables>;
export const CreateMultipleRunsDocument = gql`
    mutation CreateMultipleRuns($input: CreateMultipleRunsInput!) {
  createMultipleRuns(input: $input) {
    runs {
      id
      ...RunFields
    }
  }
}
    ${RunFieldsFragmentDoc}`;
export type CreateMultipleRunsMutationFn = ApolloReactCommon.MutationFunction<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>;

/**
 * __useCreateMultipleRunsMutation__
 *
 * To run a mutation, you first call `useCreateMultipleRunsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMultipleRunsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMultipleRunsMutation, { data, loading, error }] = useCreateMultipleRunsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMultipleRunsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>(CreateMultipleRunsDocument, baseOptions);
      }
export type CreateMultipleRunsMutationHookResult = ReturnType<typeof useCreateMultipleRunsMutation>;
export type CreateMultipleRunsMutationResult = ApolloReactCommon.MutationResult<CreateMultipleRunsMutation>;
export type CreateMultipleRunsMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMultipleRunsMutation, CreateMultipleRunsMutationVariables>;
export const UpdateRunDocument = gql`
    mutation UpdateRun($input: UpdateRunInput!) {
  updateRun(input: $input) {
    run {
      id
      ...RunFields
    }
  }
}
    ${RunFieldsFragmentDoc}`;
export type UpdateRunMutationFn = ApolloReactCommon.MutationFunction<UpdateRunMutation, UpdateRunMutationVariables>;

/**
 * __useUpdateRunMutation__
 *
 * To run a mutation, you first call `useUpdateRunMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRunMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRunMutation, { data, loading, error }] = useUpdateRunMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRunMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRunMutation, UpdateRunMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateRunMutation, UpdateRunMutationVariables>(UpdateRunDocument, baseOptions);
      }
export type UpdateRunMutationHookResult = ReturnType<typeof useUpdateRunMutation>;
export type UpdateRunMutationResult = ApolloReactCommon.MutationResult<UpdateRunMutation>;
export type UpdateRunMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRunMutation, UpdateRunMutationVariables>;
export const DeleteRunDocument = gql`
    mutation DeleteRun($input: DeleteRunInput!) {
  deleteRun(input: $input) {
    run {
      id
      ...RunFields
    }
  }
}
    ${RunFieldsFragmentDoc}`;
export type DeleteRunMutationFn = ApolloReactCommon.MutationFunction<DeleteRunMutation, DeleteRunMutationVariables>;

/**
 * __useDeleteRunMutation__
 *
 * To run a mutation, you first call `useDeleteRunMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRunMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRunMutation, { data, loading, error }] = useDeleteRunMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteRunMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRunMutation, DeleteRunMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteRunMutation, DeleteRunMutationVariables>(DeleteRunDocument, baseOptions);
      }
export type DeleteRunMutationHookResult = ReturnType<typeof useDeleteRunMutation>;
export type DeleteRunMutationResult = ApolloReactCommon.MutationResult<DeleteRunMutation>;
export type DeleteRunMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteRunMutation, DeleteRunMutationVariables>;
export const CreateMaximumEventProvidedTicketsOverrideDocument = gql`
    mutation CreateMaximumEventProvidedTicketsOverride($input: CreateMaximumEventProvidedTicketsOverrideInput!) {
  createMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      id
      ...MaximumEventProvidedTicketsOverrideFields
    }
  }
}
    ${MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export type CreateMaximumEventProvidedTicketsOverrideMutationFn = ApolloReactCommon.MutationFunction<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>;

/**
 * __useCreateMaximumEventProvidedTicketsOverrideMutation__
 *
 * To run a mutation, you first call `useCreateMaximumEventProvidedTicketsOverrideMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMaximumEventProvidedTicketsOverrideMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMaximumEventProvidedTicketsOverrideMutation, { data, loading, error }] = useCreateMaximumEventProvidedTicketsOverrideMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>(CreateMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type CreateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useCreateMaximumEventProvidedTicketsOverrideMutation>;
export type CreateMaximumEventProvidedTicketsOverrideMutationResult = ApolloReactCommon.MutationResult<CreateMaximumEventProvidedTicketsOverrideMutation>;
export type CreateMaximumEventProvidedTicketsOverrideMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMaximumEventProvidedTicketsOverrideMutation, CreateMaximumEventProvidedTicketsOverrideMutationVariables>;
export const DeleteMaximumEventProvidedTicketsOverrideDocument = gql`
    mutation DeleteMaximumEventProvidedTicketsOverride($input: DeleteMaximumEventProvidedTicketsOverrideInput!) {
  deleteMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      id
      ...MaximumEventProvidedTicketsOverrideFields
    }
  }
}
    ${MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export type DeleteMaximumEventProvidedTicketsOverrideMutationFn = ApolloReactCommon.MutationFunction<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>;

/**
 * __useDeleteMaximumEventProvidedTicketsOverrideMutation__
 *
 * To run a mutation, you first call `useDeleteMaximumEventProvidedTicketsOverrideMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMaximumEventProvidedTicketsOverrideMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMaximumEventProvidedTicketsOverrideMutation, { data, loading, error }] = useDeleteMaximumEventProvidedTicketsOverrideMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteMaximumEventProvidedTicketsOverrideMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>(DeleteMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type DeleteMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useDeleteMaximumEventProvidedTicketsOverrideMutation>;
export type DeleteMaximumEventProvidedTicketsOverrideMutationResult = ApolloReactCommon.MutationResult<DeleteMaximumEventProvidedTicketsOverrideMutation>;
export type DeleteMaximumEventProvidedTicketsOverrideMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteMaximumEventProvidedTicketsOverrideMutation, DeleteMaximumEventProvidedTicketsOverrideMutationVariables>;
export const UpdateMaximumEventProvidedTicketsOverrideDocument = gql`
    mutation UpdateMaximumEventProvidedTicketsOverride($input: UpdateMaximumEventProvidedTicketsOverrideInput!) {
  updateMaximumEventProvidedTicketsOverride(input: $input) {
    maximum_event_provided_tickets_override {
      id
      ...MaximumEventProvidedTicketsOverrideFields
    }
  }
}
    ${MaximumEventProvidedTicketsOverrideFieldsFragmentDoc}`;
export type UpdateMaximumEventProvidedTicketsOverrideMutationFn = ApolloReactCommon.MutationFunction<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>;

/**
 * __useUpdateMaximumEventProvidedTicketsOverrideMutation__
 *
 * To run a mutation, you first call `useUpdateMaximumEventProvidedTicketsOverrideMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMaximumEventProvidedTicketsOverrideMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMaximumEventProvidedTicketsOverrideMutation, { data, loading, error }] = useUpdateMaximumEventProvidedTicketsOverrideMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMaximumEventProvidedTicketsOverrideMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>(UpdateMaximumEventProvidedTicketsOverrideDocument, baseOptions);
      }
export type UpdateMaximumEventProvidedTicketsOverrideMutationHookResult = ReturnType<typeof useUpdateMaximumEventProvidedTicketsOverrideMutation>;
export type UpdateMaximumEventProvidedTicketsOverrideMutationResult = ApolloReactCommon.MutationResult<UpdateMaximumEventProvidedTicketsOverrideMutation>;
export type UpdateMaximumEventProvidedTicketsOverrideMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateMaximumEventProvidedTicketsOverrideMutation, UpdateMaximumEventProvidedTicketsOverrideMutationVariables>;
export const UpdateEventAdminNotesDocument = gql`
    mutation UpdateEventAdminNotes($eventId: Int!, $adminNotes: String!) {
  updateEventAdminNotes(input: {id: $eventId, admin_notes: $adminNotes}) {
    event {
      id
      ...EventFields
    }
  }
}
    ${EventFieldsFragmentDoc}`;
export type UpdateEventAdminNotesMutationFn = ApolloReactCommon.MutationFunction<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>;

/**
 * __useUpdateEventAdminNotesMutation__
 *
 * To run a mutation, you first call `useUpdateEventAdminNotesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEventAdminNotesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEventAdminNotesMutation, { data, loading, error }] = useUpdateEventAdminNotesMutation({
 *   variables: {
 *      eventId: // value for 'eventId'
 *      adminNotes: // value for 'adminNotes'
 *   },
 * });
 */
export function useUpdateEventAdminNotesMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>(UpdateEventAdminNotesDocument, baseOptions);
      }
export type UpdateEventAdminNotesMutationHookResult = ReturnType<typeof useUpdateEventAdminNotesMutation>;
export type UpdateEventAdminNotesMutationResult = ApolloReactCommon.MutationResult<UpdateEventAdminNotesMutation>;
export type UpdateEventAdminNotesMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateEventAdminNotesMutation, UpdateEventAdminNotesMutationVariables>;
export const EventAdminEventsQueryDocument = gql`
    query EventAdminEventsQuery {
  currentAbility {
    can_override_maximum_event_provided_tickets
    can_manage_runs
  }
  convention {
    id
    ...ConventionFields
  }
  events(includeDropped: true) {
    id
    ...EventFields
  }
}
    ${ConventionFieldsFragmentDoc}
${EventFieldsFragmentDoc}`;

/**
 * __useEventAdminEventsQueryQuery__
 *
 * To run a query within a React component, call `useEventAdminEventsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventAdminEventsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventAdminEventsQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useEventAdminEventsQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EventAdminEventsQueryQuery, EventAdminEventsQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<EventAdminEventsQueryQuery, EventAdminEventsQueryQueryVariables>(EventAdminEventsQueryDocument, baseOptions);
      }
export function useEventAdminEventsQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EventAdminEventsQueryQuery, EventAdminEventsQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EventAdminEventsQueryQuery, EventAdminEventsQueryQueryVariables>(EventAdminEventsQueryDocument, baseOptions);
        }
export type EventAdminEventsQueryQueryHookResult = ReturnType<typeof useEventAdminEventsQueryQuery>;
export type EventAdminEventsQueryLazyQueryHookResult = ReturnType<typeof useEventAdminEventsQueryLazyQuery>;
export type EventAdminEventsQueryQueryResult = ApolloReactCommon.QueryResult<EventAdminEventsQueryQuery, EventAdminEventsQueryQueryVariables>;
export const ScheduleGridConventionDataQueryDocument = gql`
    query ScheduleGridConventionDataQuery {
  convention {
    id
    pre_schedule_content_html
    ...CommonConventionData
  }
}
    ${CommonConventionDataFragmentDoc}`;

/**
 * __useScheduleGridConventionDataQueryQuery__
 *
 * To run a query within a React component, call `useScheduleGridConventionDataQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduleGridConventionDataQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduleGridConventionDataQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useScheduleGridConventionDataQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ScheduleGridConventionDataQueryQuery, ScheduleGridConventionDataQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<ScheduleGridConventionDataQueryQuery, ScheduleGridConventionDataQueryQueryVariables>(ScheduleGridConventionDataQueryDocument, baseOptions);
      }
export function useScheduleGridConventionDataQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScheduleGridConventionDataQueryQuery, ScheduleGridConventionDataQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ScheduleGridConventionDataQueryQuery, ScheduleGridConventionDataQueryQueryVariables>(ScheduleGridConventionDataQueryDocument, baseOptions);
        }
export type ScheduleGridConventionDataQueryQueryHookResult = ReturnType<typeof useScheduleGridConventionDataQueryQuery>;
export type ScheduleGridConventionDataQueryLazyQueryHookResult = ReturnType<typeof useScheduleGridConventionDataQueryLazyQuery>;
export type ScheduleGridConventionDataQueryQueryResult = ApolloReactCommon.QueryResult<ScheduleGridConventionDataQueryQuery, ScheduleGridConventionDataQueryQueryVariables>;
export const ScheduleGridEventsQueryDocument = gql`
    query ScheduleGridEventsQuery($extendedCounts: Boolean!, $start: Date, $finish: Date) {
  events(extendedCounts: $extendedCounts, start: $start, finish: $finish) {
    id
    ...ScheduleGridEventFragment
  }
}
    ${ScheduleGridEventFragmentFragmentDoc}`;

/**
 * __useScheduleGridEventsQueryQuery__
 *
 * To run a query within a React component, call `useScheduleGridEventsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduleGridEventsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduleGridEventsQueryQuery({
 *   variables: {
 *      extendedCounts: // value for 'extendedCounts'
 *      start: // value for 'start'
 *      finish: // value for 'finish'
 *   },
 * });
 */
export function useScheduleGridEventsQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ScheduleGridEventsQueryQuery, ScheduleGridEventsQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<ScheduleGridEventsQueryQuery, ScheduleGridEventsQueryQueryVariables>(ScheduleGridEventsQueryDocument, baseOptions);
      }
export function useScheduleGridEventsQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScheduleGridEventsQueryQuery, ScheduleGridEventsQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ScheduleGridEventsQueryQuery, ScheduleGridEventsQueryQueryVariables>(ScheduleGridEventsQueryDocument, baseOptions);
        }
export type ScheduleGridEventsQueryQueryHookResult = ReturnType<typeof useScheduleGridEventsQueryQuery>;
export type ScheduleGridEventsQueryLazyQueryHookResult = ReturnType<typeof useScheduleGridEventsQueryLazyQuery>;
export type ScheduleGridEventsQueryQueryResult = ApolloReactCommon.QueryResult<ScheduleGridEventsQueryQuery, ScheduleGridEventsQueryQueryVariables>;
export const ScheduleGridCombinedQueryDocument = gql`
    query ScheduleGridCombinedQuery($extendedCounts: Boolean!, $start: Date, $finish: Date) {
  convention {
    id
    pre_schedule_content_html
    ...CommonConventionData
  }
  events(extendedCounts: $extendedCounts, start: $start, finish: $finish) {
    id
    ...ScheduleGridEventFragment
  }
}
    ${CommonConventionDataFragmentDoc}
${ScheduleGridEventFragmentFragmentDoc}`;

/**
 * __useScheduleGridCombinedQueryQuery__
 *
 * To run a query within a React component, call `useScheduleGridCombinedQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduleGridCombinedQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduleGridCombinedQueryQuery({
 *   variables: {
 *      extendedCounts: // value for 'extendedCounts'
 *      start: // value for 'start'
 *      finish: // value for 'finish'
 *   },
 * });
 */
export function useScheduleGridCombinedQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ScheduleGridCombinedQueryQuery, ScheduleGridCombinedQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<ScheduleGridCombinedQueryQuery, ScheduleGridCombinedQueryQueryVariables>(ScheduleGridCombinedQueryDocument, baseOptions);
      }
export function useScheduleGridCombinedQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScheduleGridCombinedQueryQuery, ScheduleGridCombinedQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ScheduleGridCombinedQueryQuery, ScheduleGridCombinedQueryQueryVariables>(ScheduleGridCombinedQueryDocument, baseOptions);
        }
export type ScheduleGridCombinedQueryQueryHookResult = ReturnType<typeof useScheduleGridCombinedQueryQuery>;
export type ScheduleGridCombinedQueryLazyQueryHookResult = ReturnType<typeof useScheduleGridCombinedQueryLazyQuery>;
export type ScheduleGridCombinedQueryQueryResult = ApolloReactCommon.QueryResult<ScheduleGridCombinedQueryQuery, ScheduleGridCombinedQueryQueryVariables>;
export const CommonConventionDataQueryDocument = gql`
    query CommonConventionDataQuery {
  convention {
    id
    ...CommonConventionData
  }
}
    ${CommonConventionDataFragmentDoc}`;

/**
 * __useCommonConventionDataQueryQuery__
 *
 * To run a query within a React component, call `useCommonConventionDataQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommonConventionDataQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommonConventionDataQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useCommonConventionDataQueryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>) {
        return ApolloReactHooks.useQuery<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>(CommonConventionDataQueryDocument, baseOptions);
      }
export function useCommonConventionDataQueryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>(CommonConventionDataQueryDocument, baseOptions);
        }
export type CommonConventionDataQueryQueryHookResult = ReturnType<typeof useCommonConventionDataQueryQuery>;
export type CommonConventionDataQueryLazyQueryHookResult = ReturnType<typeof useCommonConventionDataQueryLazyQuery>;
export type CommonConventionDataQueryQueryResult = ApolloReactCommon.QueryResult<CommonConventionDataQueryQuery, CommonConventionDataQueryQueryVariables>;