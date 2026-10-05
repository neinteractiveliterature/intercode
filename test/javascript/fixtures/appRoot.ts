import {
  SignupAutomationMode,
  SignupMode,
  SiteMode,
  TicketMode,
  TimezoneMode,
} from '../../../app/javascript/graphqlTypes.generated';
import { AppRootQueryData } from '../../../app/javascript/appRootQueries.generated';

// The data the app root query loads, for tests of loaders that read it (the convention's dates, site mode, and so on)

export type AppRootConvention = NonNullable<AppRootQueryData['convention']>;

export function buildAppRootConvention(overrides: Partial<AppRootConvention> = {}): AppRootConvention {
  return {
    __typename: 'Convention',
    id: '1',
    name: 'Test Con',
    domain: 'test.example.com',
    default_currency_code: 'USD',
    accepting_proposals: false,
    canceled: false,
    language: 'en',
    site_mode: SiteMode.Convention,
    signup_mode: SignupMode.SelfService,
    signup_automation_mode: SignupAutomationMode.None,
    starts_at: '2026-06-05T14:00:00Z',
    ends_at: '2026-06-07T22:00:00Z',
    stripe_account_id: null,
    stripe_publishable_key: null,
    ticket_mode: TicketMode.RequiredForSignup,
    timezone_name: 'America/New_York',
    timezone_mode: TimezoneMode.ConventionLocal,
    clickwrap_agreement: null,
    tickets_available_for_purchase: false,
    ticket_name: 'ticket',
    ticketNamePlural: 'tickets',
    ticket_types: [],
    my_profile: null,
    ...overrides,
  };
}

export function buildAppRootData(convention: AppRootConvention | null = buildAppRootConvention()): AppRootQueryData {
  return {
    __typename: 'Query',
    hasOauthApplications: false,
    defaultCurrencyCode: 'USD',
    supportedCurrencyCodes: ['USD'],
    cmsParentByRequestHost: { __typename: 'Convention', id: '1', cmsNavigationItems: [] },
    currentAbility: {
      __typename: 'Ability',
      can_read_schedule: true,
      can_read_schedule_with_counts: false,
      can_list_events: true,
      can_read_user_con_profiles: false,
      can_manage_conventions: false,
      can_update_convention: false,
      can_update_departments: false,
      can_manage_email_routes: false,
      can_update_event_categories: false,
      can_read_event_proposals: false,
      can_manage_runs: false,
      can_manage_forms: false,
      can_read_any_mailing_list: false,
      can_update_notification_templates: false,
      can_manage_oauth_applications: false,
      can_read_reports: false,
      can_manage_rooms: false,
      can_manage_signups: false,
      can_manage_any_cms_content: false,
      can_manage_staff_positions: false,
      can_read_orders: false,
      can_manage_ticket_types: false,
      can_read_user_activity_alerts: false,
      can_read_organizations: false,
      can_read_users: false,
    },
    currentUser: null,
    assumedIdentityFromProfile: null,
    convention,
    rootSite: { __typename: 'RootSite', id: '1', site_name: 'Test Site' },
  };
}
