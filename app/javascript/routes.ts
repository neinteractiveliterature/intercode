import { index, layout, route } from '@react-router/dev/routes';

export enum NamedRoute {
  AdminEditEventProposal = 'AdminEditEventProposal',
  AdminEventProposal = 'AdminEventProposal',
  AdminForms = 'AdminForms',
  AdminUserConProfile = 'AdminUserConProfile',
  CmsAdmin = 'CmsAdmin',
  CmsContentGroupsAdmin = 'CmsContentGroupsAdmin',
  CmsGraphqlQueriesAdmin = 'CmsGraphqlQueriesAdmin',
  CmsLayoutsAdmin = 'CmsLayoutsAdmin',
  CmsPagesAdmin = 'CmsPagesAdmin',
  CmsPartialsAdmin = 'CmsPartialsAdmin',
  DepartmentAdmin = 'DepartmentAdmin',
  EditEventCategory = 'EditEventCategory',
  EditOrganizationRole = 'EditOrganizationRole',
  EditSignup = 'EditSignup',
  EditStaffPosition = 'EditStaffPosition',
  EditStaffPositionPermissions = 'EditStaffPositionPermissions',
  EditTeamMember = 'EditTeamMember',
  EditUserActivityAlert = 'EditUserActivityAlert',
  Event = 'Event',
  EventCategoryAdmin = 'EventCategoryAdmin',
  EventCategoryIndex = 'EventCategoryIndex',
  EventPage = 'EventPage',
  EventProposalAdminDisplay = 'EventProposalAdminDisplay',
  EventProposalHistory = 'EventProposalHistory',
  EventProposalHistoryChangeGroup = 'EventProposalHistoryChangeGroup',
  FormAdminIndex = 'FormAdminIndex',
  FormJSONEditor = 'FormJSONEditor',
  LiquidDocs = 'LiquidDocs',
  NewEventCategory = 'NewEventCategory',
  NewOrganizationRole = 'NewOrganizationRole',
  NewTeamMember = 'NewTeamMember',
  Organization = 'Organization',
  OrganizationAdmin = 'OrganizationAdmin',
  OrganizationDisplay = 'OrganizationDisplay',
  RootSiteConventionDisplay = 'RootSiteConventionDisplay',
  RunEmailList = 'RunEmailList',
  RunSignupChangesTable = 'RunSignupChangesTable',
  RunSignupsTable = 'RunSignupsTable',
  RunSignupSummary = 'RunSignupSummary',
  SignupAdmin = 'SignupAdmin',
  TeamMembers = 'TeamMembers',
  TeamMembersIndex = 'TeamMembersIndex',
  UserActivityAlerts = 'UserActivityAlerts',
  CmsFiles = 'CmsFiles',
  UserAdminDisplay = 'UserAdminDisplay',
  UserAdmin = 'UserAdmin',
  UsersTable = 'UsersTable',
  EventAdmin = 'EventAdmin',
  RootSiteConventionsAdmin = 'RootSiteConventionAdmin',
  RootSiteConventionsAdminTable = 'RootSiteConventionsAdminTable',
  RootPage = 'RootPage',
}

export type RouteName = keyof typeof NamedRoute & string;

export const routes = [
  layout('AppRoot.tsx', [
    // TODO Form editor routes
    // TODO Liquid docs routes
    layout('AppRootLayout.tsx', [
      layout('NonCMSPageWrapper.tsx', [
        layout('RouteGuards/MultiEventConventionRouteGuard.tsx', []),
        route('events', 'EventsApp/route.tsx', [
          route(':eventId', 'EventsApp/$eventId.tsx', { id: NamedRoute.Event }, [
            layout('RouteGuards/EventPageGuard.tsx', [
              index('EventsApp/EventPage/index.tsx', { id: NamedRoute.EventPage }),
            ]),
          ]),
        ]),
      ]),
      route('/pages/*', 'CmsPage/index.tsx'),
      index('CmsPage/index.tsx', { id: NamedRoute.RootPage }),
      route('*', 'FourOhFourPage.tsx'),
    ]),
  ]),
];
