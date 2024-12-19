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
        layout('RouteGuards/ConventionRouteGuard.tsx', [
          route('admin_departments', 'DepartmentAdmin/route.tsx', { id: NamedRoute.DepartmentAdmin }, [
            route(':id', 'DepartmentAdmin/SingleDepartmentRoute.ts', [
              route('edit', 'DepartmentAdmin/EditDepartment.tsx'),
              index('DepartmentAdmin/$id.ts'),
            ]),
            route('new', 'DepartmentAdmin/NewDepartment.tsx'),
            index('DepartmentAdmin/DepartmentAdminIndex.tsx'),
          ]),
          route('admin_event_proposals', 'EventProposals/EventProposalsAdmin.tsx', [
            route(':id', 'EventProposals/$id.ts', { id: NamedRoute.AdminEventProposal }, [
              route('history/:changeGroupId?', 'EventProposals/EventProposalHistory.tsx', {
                id: NamedRoute.EventProposalHistory,
              }),
              route('edit', 'EventProposals/AdminEditEventProposal.tsx', { id: NamedRoute.AdminEditEventProposal }),
              index('EventProposals/EventProposalAdminDisplay.tsx', { id: NamedRoute.EventProposalAdminDisplay }),
            ]),
            index('EventProposals/EventProposalsAdminTable.tsx'),
          ]),
          route('admin_events', 'EventAdmin/index.tsx', { id: NamedRoute.EventAdmin }, [
            index('EventAdmin/route.ts'),
            layout('RouteGuards/MultiEventConventionRouteGuard.tsx', { id: 'AdminEventsMultiEventGuard' }, [
              route('dropped_events', 'EventAdmin/DroppedEventAdmin.tsx'),
              route(':eventCategoryId', 'EventAdmin/$eventCategoryId.ts', [
                route('', 'EventAdmin/CategorySpecificEventAdmin.tsx', [
                  route('events/:eventId/runs', 'EventAdmin/runs/route.ts', [
                    route(':runId', 'EventAdmin/SingleRunRoute.ts', [route('edit', 'EventAdmin/EditRun.tsx')]),
                    route('create_multiple', 'EventAdmin/CreateMultipleRunsRoute.ts'),
                    route('new', 'EventAdmin/NewRun.tsx'),
                  ]),
                ]),
                route('events', 'EventAdmin/create.ts', [
                  index('EventAdmin/events/route.ts'),
                  route(':eventId', 'EventAdmin/$id.ts', [
                    route('admin_notes', 'EventAdmin/AdminNotesRoute.ts'),
                    route('drop', 'EventAdmin/drop.ts'),
                    route('edit', 'EventAdmin/EventAdminEditEvent.tsx'),
                    route('restore', 'EventAdmin/RestoreEventRoute.ts'),
                  ]),
                ]),
              ]),
            ]),
          ]),
          route('admin_forms', 'FormAdmin/index.tsx', { id: NamedRoute.AdminForms }, [
            route(':id/edit_advanced', 'FormAdmin/FormJSONEditor.tsx', { id: NamedRoute.FormJSONEditor }),
            route(':id', 'FormAdmin/$id/route.ts'),
            index('FormAdmin/FormAdminIndex.tsx', { id: NamedRoute.FormAdminIndex }),
          ]),
          ...prefix('admin_notifications', [
            layout('RouteGuards/CanUpdateNotificationTemplatesRouteGuard.tsx', [
              route(':category/:event', 'NotificationAdmin/NotificationConfiguration.tsx', [
                route('preview', 'NotificationAdmin/preview.ts'),
              ]),
              index('NotificationAdmin/NotificationAdminIndex.tsx'),
            ]),
          ]),
          route('admin_store', 'Store/StoreAdmin.tsx', [
            route('products', 'Store/ProductAdmin/index.tsx', [route(':id', 'Store/ProductAdmin/$id.ts')]),
            route('coupons', 'Store/CouponAdmin/CouponAdminTable.tsx', [
              route(':id', 'Store/CouponAdmin/EditCouponModal.tsx'),
              route('new', 'Store/CouponAdmin/NewCouponModal.tsx'),
            ]),
            route('orders', 'Store/OrderAdmin/index.tsx', [
              route(':id', 'Store/OrderAdmin/$id.tsx', [
                route('cancel', 'Store/OrderAdmin/cancel.ts'),
                route('mark_paid', 'Store/OrderAdmin/mark_paid.ts'),
                route('order_entries', 'Store/OrderAdmin/order_entries/route.ts', [
                  route(':orderEntryId', 'Store/OrderAdmin/order_entries/$orderEntryId.ts'),
                ]),
                route('coupon_applications', 'Store/OrderAdmin/coupon_applications/route.ts', [
                  route(':couponApplicationId', 'Store/OrderAdmin/coupon_applications/$couponApplicationId.ts'),
                ]),
              ]),
              route('new', 'Store/OrderAdmin/new.tsx'),
            ]),
            route('order_summary', 'Store/OrderSummary.tsx'),
            index('Store/OrderAdmin/route.ts'),
          ]),
          route('cart', 'Store/Cart/index.tsx', [
            route('order_entries/:id', 'Store/Cart/order_entries/$id.ts'),
            route('coupon_applications', 'Store/Cart/coupon_applications/route.ts', [
              route(':id', 'Store/Cart/coupon_applications/$id.ts'),
            ]),
          ]),
          route('clickwrap_agreement', 'ClickwrapAgreement/index.tsx'),
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
                route(':teamMemberId', 'EventsApp/TeamMemberAdmin/EditTeamMember.tsx', {
                  id: NamedRoute.EditTeamMember,
                }),
                route('', 'EventsApp/TeamMemberAdmin/TeamMembersIndex.tsx', { id: NamedRoute.TeamMembersIndex }, [
                  route(':teamMemberId/provide_ticket', 'EventsApp/TeamMemberAdmin/ProvideTicketModal.tsx'),
                ]),
              ]),
              route('history/:changeGroupId?', 'EventsApp/EventPage/EventHistory.tsx'),
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
              layout('RouteGuards/EventPageGuard.tsx', [
                index('EventsApp/EventPage/index.tsx', { id: NamedRoute.EventPage }),
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
      ]),
      route('/pages/*', 'CmsPage/index.tsx'),
      index('CmsPage/index.tsx', { id: NamedRoute.RootPage }),
      route('*', 'FourOhFourPage.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
