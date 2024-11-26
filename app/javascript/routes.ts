import { index, layout, route, prefix } from '@react-router/dev/routes';

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

export default [
  layout('AppRoot.tsx', [
    // TODO Form editor routes
    // TODO Liquid docs routes
    layout('AppRootLayout.tsx', [
      layout('NonCMSPageWrapper.tsx', [
        layout('RouteGuards/MultiEventConventionRouteGuard.tsx', { id: 'RootMultiEventGuard' }, []),
        ...prefix('events', [
          layout('RouteGuards/MultiEventConventionRouteGuard.tsx', { id: 'EventsMultiEventGuard' }, [
            route('schedule', 'EventsApp/schedule.tsx', [route(':day', 'EventsApp/ScheduleApp.tsx')]),
            route('schedule_by_room/*', 'EventsApp/schedule_by_room.tsx'),
            route('schedule_with_counts/*', 'EventsApp/schedule_with_counts.tsx'),
            route('table', 'EventsApp/EventCatalog/EventTable/index.tsx'),
            index('EventsApp/EventCatalog/EventList/index.tsx'),
          ]),
          layout('RouteGuards/RankedChoiceRouteGuard.tsx', [
            route('my-signup-queue', 'EventsApp/MySignupQueue/index.tsx'),
          ]),
          route(':eventId', 'EventsApp/$eventId.tsx', { id: NamedRoute.Event }, [
            layout('RouteGuards/EventPageGuard.tsx', [
              index('EventsApp/EventPage/index.tsx', { id: NamedRoute.EventPage }),
              route('runs/:runId', 'EventsApp/SignupAdmin/RunHeader.tsx', [
                route('admin_signups', 'EventsApp/SignupAdmin/route.ts', { id: NamedRoute.SignupAdmin }, [
                  route('', 'EventsApp/SignupAdmin/SignupsIndex.tsx', [
                    index('EventsApp/SignupAdmin/RunSignupsTable.tsx', { id: NamedRoute.RunSignupsTable }),
                    route('emails/:separator', 'EventsApp/SignupAdmin/RunEmailList.tsx', {
                      id: NamedRoute.RunEmailList,
                    }),
                    route('signup_changes', 'EventsApp/SignupAdmin/RunSignupChangesTable.tsx', {
                      id: NamedRoute.RunSignupChangesTable,
                    }),
                  ]),
                  route(':id', 'EventsApp/SignupAdmin/$id/route.tsx', { id: NamedRoute.EditSignup }, [
                    route('change_bucket', 'EventsApp/SignupAdmin/$id/change_bucket.tsx'),
                    route('force_confirm', 'EventsApp/SignupAdmin/$id/force_confirm.tsx'),
                  ]),
                ]),
                route('signup_summary', 'EventsApp/SignupAdmin/RunSignupSummary.tsx', {
                  id: NamedRoute.RunSignupSummary,
                }),
              ]),
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
