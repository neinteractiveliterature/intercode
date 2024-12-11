import { index, layout, route, prefix, RouteConfig } from '@react-router/dev/routes';

export enum NamedRoute {
  AdminEditEventProposal = 'AdminEditEventProposal',
  AdminEventProposal = 'AdminEventProposal',
  AdminForms = 'AdminForms',
  AdminUserConProfile = 'AdminUserConProfile',
  CmsAdmin = 'CmsAdmin',
  CmsContentGroupsAdmin = 'CmsContentGroupsAdmin',
  CmsFiles = 'CmsFiles',
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
  EventAdmin = 'EventAdmin',
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
  RootPage = 'RootPage',
  RootSiteConventionDisplay = 'RootSiteConventionDisplay',
  RootSiteConventionsAdmin = 'RootSiteConventionAdmin',
  RootSiteConventionsAdminTable = 'RootSiteConventionsAdminTable',
  RunEmailList = 'RunEmailList',
  RunSignupChangesTable = 'RunSignupChangesTable',
  RunSignupsTable = 'RunSignupsTable',
  RunSignupSummary = 'RunSignupSummary',
  SignupAdmin = 'SignupAdmin',
  TeamMembers = 'TeamMembers',
  TeamMembersIndex = 'TeamMembersIndex',
  UserActivityAlerts = 'UserActivityAlerts',
  UserAdmin = 'UserAdmin',
  UserAdminDisplay = 'UserAdminDisplay',
  UsersTable = 'UsersTable',
}

export type RouteName = keyof typeof NamedRoute & string;

export default [
  layout('AppRoot.tsx', [
    // TODO Form editor routes
    // TODO Liquid docs routes
    layout('AppRootLayout.tsx', [
      layout('NonCMSPageWrapper.tsx', [
        route('convention/edit', 'ConventionAdmin/index.tsx'),
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
            route('attach_image', 'EventsApp/attach_image.ts'),
            layout('RouteGuards/TicketPerEventPageGuard.tsx', [
              route('ticket_types', 'EventsApp/EventTicketTypes/layout.tsx', [
                route('new', 'EventsApp/EventTicketTypes/new.tsx'),
                route(':id', 'EventsApp/EventTicketTypes/$id.ts', [
                  route('edit', 'EventsApp/EventTicketTypes/edit.tsx'),
                ]),
                index('EventsApp/EventTicketTypes/route.tsx'),
              ]),
            ]),
            route('edit', 'RouteGuards/EditEventGuard.tsx', [index('EventsApp/StandaloneEditEvent/index.tsx')]),
            route(
              'maximum_event_provided_ticket_overrides',
              'EventsApp/MaximumEventProvidedTicketsOverrides/route.ts',
              [route(':id', 'EventsApp/MaximumEventProvidedTicketsOverrides/$id.ts')],
            ),
            route('team_members', 'EventsApp/TeamMemberAdmin/index.tsx', { id: NamedRoute.TeamMembers }, [
              route('new', 'EventsApp/TeamMemberAdmin/NewTeamMember.tsx', { id: NamedRoute.NewTeamMember }),
              route(':teamMemberId', 'EventsApp/TeamMemberAdmin/EditTeamMember.tsx', { id: NamedRoute.EditTeamMember }),
              route('', 'EventsApp/TeamMemberAdmin/TeamMembersIndex.tsx', { id: NamedRoute.TeamMembersIndex }, [
                route(':teamMemberId/provide_ticket', 'EventsApp/TeamMemberAdmin/ProvideTicketModal.tsx'),
              ]),
            ]),
            route('history/:changeGroupId?', 'EventsApp/EventPage/EventHistory.tsx'),
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
        ...prefix('ticket_types', [
          layout('RouteGuards/TicketRequiredForSignupRouteGuard.tsx', [
            layout('RouteGuards/CanManageTicketTypesRouteGuard.tsx', [
              route('new', 'TicketTypeAdmin/new.tsx'),
              route(':id', 'TicketTypeAdmin/$id.ts', [route('edit', 'TicketTypeAdmin/edit.tsx')]),
              index('TicketTypeAdmin/route.tsx'),
            ]),
          ]),
        ]),
      ]),
      route('/pages/*', 'CmsPage/index.tsx'),
      index('CmsPage/index.tsx', { id: NamedRoute.RootPage }),
      route('*', 'FourOhFourPage.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
