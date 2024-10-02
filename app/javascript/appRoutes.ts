import { DefineRoutesFunction } from '@remix-run/dev/dist/config/routes';

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

export const appRoutes = (defineRoutes: DefineRoutesFunction) => {
  return defineRoutes((route) => {
    route(undefined, 'AppRoot.tsx', () => {
      // TODO Form editor routes
      // TODO Liquid docs routes
      route(undefined, 'AppRootLayout.tsx', () => {
        route(undefined, 'NonCMSPageWrapper.tsx', () => {
          route(undefined, 'RouteGuards/MultiEventConventionRouteGuard.tsx', () => {});
          route('events', 'EventsApp/route.tsx', () => {
            route(':eventId', 'EventsApp/$eventId.tsx', { id: NamedRoute.Event}, () => {
              route(undefined')
            })
          });
        });
        route('/pages/*', 'CmsPage/index.tsx');
        route(undefined, 'CmsPage/index.tsx', { index: true, id: NamedRoute.RootPage });
        route('*', 'FourOhFourPage.tsx');
      });
    });
  });
};
