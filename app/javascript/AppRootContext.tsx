import { createContext } from 'react';
import type { Locale } from 'date-fns';

import { SignupMode, SiteMode, TicketMode } from './graphqlTypes.generated';
import { AppRootQueryQuery } from './appRootQueries.generated';

export type AppRootContextValue = {
  assumedIdentityFromProfile?: AppRootQueryQuery['assumedIdentityFromProfile'];
  cmsNavigationItems: AppRootQueryQuery['cmsNavigationItems'];
  conventionAcceptingProposals?: boolean | null;
  conventionCanceled?: boolean | null;
  conventionDomain?: string | null;
  conventionName?: string | null;
  currentAbility: AppRootQueryQuery['currentAbility'];
  currentPendingOrder?: AppRootQueryQuery['currentPendingOrder'];
  currentUser?: AppRootQueryQuery['currentUser'];
  dateFnsLocale?: Locale;
  language: string;
  myProfile?: AppRootQueryQuery['myProfile'];
  rootSiteName?: string | null;
  signupMode?: SignupMode;
  siteMode?: SiteMode;
  ticketsAvailableForPurchase?: boolean | null;
  ticketMode?: TicketMode | null;
  ticketName?: string;
  ticketTypes?: NonNullable<AppRootQueryQuery['convention']>['ticket_types'];
  timezoneName: string;
};

export const appRootContextDefaultValue: AppRootContextValue = {
  assumedIdentityFromProfile: null,
  cmsNavigationItems: [],
  conventionAcceptingProposals: null,
  conventionCanceled: false,
  conventionName: null,
  conventionDomain: null,
  currentAbility: {
    __typename: 'Ability',
    can_list_events: false,
    can_manage_any_cms_content: false,
    can_manage_conventions: false,
    can_manage_email_routes: false,
    can_manage_forms: false,
    can_manage_oauth_applications: false,
    can_manage_rooms: false,
    can_manage_runs: false,
    can_manage_signups: false,
    can_manage_staff_positions: false,
    can_manage_ticket_types: false,
    can_read_any_mailing_list: false,
    can_read_event_proposals: false,
    can_read_orders: false,
    can_read_organizations: false,
    can_read_reports: false,
    can_read_schedule: false,
    can_read_schedule_with_counts: false,
    can_read_user_activity_alerts: false,
    can_read_user_con_profiles: false,
    can_read_users: false,
    can_update_convention: false,
    can_update_departments: false,
    can_update_event_categories: false,
    can_update_notification_templates: false,
  },
  currentPendingOrder: null,
  currentUser: null,
  dateFnsLocale: undefined,
  language: 'en',
  myProfile: null,
  rootSiteName: null,
  siteMode: undefined,
  signupMode: undefined,
  ticketsAvailableForPurchase: null,
  ticketMode: null,
  ticketName: 'ticket',
  ticketTypes: [],
  timezoneName: 'Etc/UTC',
};

const AppRootContext = createContext<AppRootContextValue>(appRootContextDefaultValue);

export default AppRootContext;
