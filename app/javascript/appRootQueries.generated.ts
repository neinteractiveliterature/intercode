/* eslint-disable */
import * as Types from './graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AppRootQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type AppRootQueryData = { __typename: 'Query', hasOauthApplications: boolean, defaultCurrencyCode: string, supportedCurrencyCodes: Array<string>, cmsParentByRequestHost: { __typename: 'Convention', id: string, cmsNavigationItems: Array<{ __typename: 'CmsNavigationItem', id: string, position?: number | null, title?: string | null, navigation_section?: { __typename: 'CmsNavigationItem', id: string } | null, page?: { __typename: 'Page', id: string, slug?: string | null } | null }> } | { __typename: 'RootSite', id: string, cmsNavigationItems: Array<{ __typename: 'CmsNavigationItem', id: string, position?: number | null, title?: string | null, navigation_section?: { __typename: 'CmsNavigationItem', id: string } | null, page?: { __typename: 'Page', id: string, slug?: string | null } | null }> }, currentAbility: { __typename: 'Ability', can_read_schedule: boolean, can_read_schedule_with_counts: boolean, can_list_events: boolean, can_read_user_con_profiles: boolean, can_manage_conventions: boolean, can_update_convention: boolean, can_update_departments: boolean, can_manage_email_routes: boolean, can_update_event_categories: boolean, can_read_event_proposals: boolean, can_manage_runs: boolean, can_manage_forms: boolean, can_read_any_mailing_list: boolean, can_update_notification_templates: boolean, can_manage_oauth_applications: boolean, can_read_reports: boolean, can_manage_rooms: boolean, can_manage_signups: boolean, can_manage_any_cms_content: boolean, can_manage_staff_positions: boolean, can_read_orders: boolean, can_manage_ticket_types: boolean, can_read_user_activity_alerts: boolean, can_read_organizations: boolean, can_read_users: boolean }, currentUser?: { __typename: 'User', id: string, name?: string | null } | null, assumedIdentityFromProfile?: { __typename: 'UserConProfile', id: string, name_without_nickname: string } | null, convention?: { __typename: 'Convention', id: string, name: string, domain?: string | null, default_currency_code?: string | null, accepting_proposals?: boolean | null, canceled: boolean, language: string, site_mode: Types.SiteMode, signup_mode: Types.SignupMode, signup_automation_mode: Types.SignupAutomationMode, starts_at?: string | null, stripe_account_id?: string | null, stripe_publishable_key?: string | null, ends_at?: string | null, ticket_mode: Types.TicketMode, timezone_name?: string | null, timezone_mode: Types.TimezoneMode, clickwrap_agreement?: string | null, tickets_available_for_purchase: boolean, ticket_name: string, ticketNamePlural: string, ticket_types: Array<{ __typename: 'TicketType', id: string, providing_products: Array<{ __typename: 'Product', id: string, available: boolean }> }>, my_profile?: { __typename: 'UserConProfile', id: string, name: string, email?: string | null, mobile_phone?: string | null, accepted_clickwrap_agreement?: boolean | null, name_without_nickname: string, first_name: string, last_name: string, gravatar_enabled: boolean, gravatar_url: string, ticket?: { __typename: 'Ticket', id: string } | null, current_pending_order?: { __typename: 'Order', id: string, order_entries: Array<{ __typename: 'OrderEntry', id: string, quantity: number }> } | null } | null } | null, rootSite: { __typename: 'RootSite', id: string, site_name: string } };

export type AppRootLayoutQueryVariables = Types.Exact<{
  path: Types.Scalars['String']['input'];
}>;


export type AppRootLayoutQueryData = { __typename: 'Query', cmsParentByRequestHost: { __typename: 'Convention', id: string, effectiveCmsLayout: { __typename: 'CmsLayout', id: string, content_html?: string | null } } | { __typename: 'RootSite', id: string, effectiveCmsLayout: { __typename: 'CmsLayout', id: string, content_html?: string | null } } };


export const AppRootQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppRootQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasOauthApplications"}},{"kind":"Field","name":{"kind":"Name","value":"cmsParentByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cmsNavigationItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"navigation_section"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentAbility"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"can_read_schedule"}},{"kind":"Field","name":{"kind":"Name","value":"can_read_schedule_with_counts"}},{"kind":"Field","name":{"kind":"Name","value":"can_list_events"}},{"kind":"Field","name":{"kind":"Name","value":"can_read_user_con_profiles"}},{"kind":"Field","name":{"kind":"Name","value":"can_manage_conventions"}},{"kind":"Field","name":{"kind":"Name","value":"can_update_convention"}},{"kind":"Field","name":{"kind":"Name","value":"can_update_departments"}},{"kind":"Field","name":{"kind":"Name","value":"can_manage_email_routes"}},{"kind":"Field","name":{"kind":"Name","value":"can_update_event_categories"}},{"kind":"Field","name":{"kind":"Name","value":"can_read_event_proposals"}},{"kind":"Field","name":{"kind":"Name","value":"can_manage_runs"}},{"kind":"Field","name":{"kind":"Name","value":"can_manage_forms"}},{"kind":"Field","name":{"kind":"Name","value":"can_read_any_mailing_list"}},{"kind":"Field","name":{"kind":"Name","value":"can_update_notification_templates"}},{"kind":"Field","name":{"kind":"Name","value":"can_manage_oauth_applications"}},{"kind":"Field","name":{"kind":"Name","value":"can_read_reports"}},{"kind":"Field","name":{"kind":"Name","value":"can_manage_rooms"}},{"kind":"Field","name":{"kind":"Name","value":"can_manage_signups"}},{"kind":"Field","name":{"kind":"Name","value":"can_manage_any_cms_content"}},{"kind":"Field","name":{"kind":"Name","value":"can_manage_staff_positions"}},{"kind":"Field","name":{"kind":"Name","value":"can_read_orders"}},{"kind":"Field","name":{"kind":"Name","value":"can_manage_ticket_types"}},{"kind":"Field","name":{"kind":"Name","value":"can_read_user_activity_alerts"}},{"kind":"Field","name":{"kind":"Name","value":"can_read_organizations"}},{"kind":"Field","name":{"kind":"Name","value":"can_read_users"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assumedIdentityFromProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"convention"},"name":{"kind":"Name","value":"conventionByRequestHostIfPresent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"default_currency_code"}},{"kind":"Field","name":{"kind":"Name","value":"accepting_proposals"}},{"kind":"Field","name":{"kind":"Name","value":"canceled"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"site_mode"}},{"kind":"Field","name":{"kind":"Name","value":"signup_mode"}},{"kind":"Field","name":{"kind":"Name","value":"signup_automation_mode"}},{"kind":"Field","name":{"kind":"Name","value":"starts_at"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_account_id"}},{"kind":"Field","name":{"kind":"Name","value":"stripe_publishable_key"}},{"kind":"Field","name":{"kind":"Name","value":"ends_at"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_mode"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_name"}},{"kind":"Field","name":{"kind":"Name","value":"timezone_mode"}},{"kind":"Field","name":{"kind":"Name","value":"clickwrap_agreement"}},{"kind":"Field","name":{"kind":"Name","value":"tickets_available_for_purchase"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_name"}},{"kind":"Field","name":{"kind":"Name","value":"ticketNamePlural"}},{"kind":"Field","name":{"kind":"Name","value":"ticket_types"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"providing_products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"available"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"my_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile_phone"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_clickwrap_agreement"}},{"kind":"Field","name":{"kind":"Name","value":"name_without_nickname"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"gravatar_enabled"}},{"kind":"Field","name":{"kind":"Name","value":"gravatar_url"}},{"kind":"Field","name":{"kind":"Name","value":"ticket"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"current_pending_order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order_entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rootSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"site_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultCurrencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"supportedCurrencyCodes"}}]}}]} as unknown as DocumentNode<AppRootQueryData, AppRootQueryVariables>;
export const AppRootLayoutQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AppRootLayoutQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cmsParentByRequestHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveCmsLayout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_html"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"path"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}]}]}}]}}]}}]} as unknown as DocumentNode<AppRootLayoutQueryData, AppRootLayoutQueryVariables>;