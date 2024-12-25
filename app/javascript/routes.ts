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
  MyProfileSetup = 'MyProfileSetup',
}

export type RouteName = keyof typeof NamedRoute & string;

export default [
  layout('AppRoot.tsx', [
    route('admin_forms/:id/edit', 'FormAdmin/FormEditor.tsx', [
      route('section', 'FormAdmin/$id/edit/section/route.ts', [
        ...prefix(':sectionId', [
          route('item', 'FormAdmin/$id/edit/section/$sectionId/item/route.ts', [
            ...prefix(':itemId', [
              route('move', 'FormAdmin/$id/edit/section/$sectionId/item/$itemId/move.ts'),
              index('FormAdmin/$id/edit/section/$sectionId/item/$itemId/route.tsx'),
            ]),
          ]),
          index('FormAdmin/$id/edit/section/$sectionId/route.tsx'),
        ]),
      ]),
    ]),
    route('liquid_docs', 'LiquidDocs/route.tsx', { id: NamedRoute.LiquidDocs }, [
      route('assigns/:name', 'LiquidDocs/AssignDoc.tsx'),
      route('filters/:name', 'LiquidDocs/FilterDoc.tsx'),
      route('tags/:name', 'LiquidDocs/LiquidTagDoc.tsx'),
      index('LiquidDocs/index.tsx'),
    ]),
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
          route('event_categories', 'EventCategoryAdmin/route.tsx', { id: NamedRoute.EventCategoryAdmin }, [
            route('new', 'EventCategoryAdmin/NewEventCategory.tsx', { id: NamedRoute.NewEventCategory }),
            route(':id', 'EventCategoryAdmin/$id.ts', [
              route('edit', 'EventCategoryAdmin/EditEventCategory.tsx', { id: NamedRoute.EditEventCategory }),
            ]),
            index('EventCategoryAdmin/EventCategoryIndex.tsx', { id: NamedRoute.EventCategoryIndex }),
          ]),
          ...prefix('event_proposals', [
            route(':id', 'EventProposals/$id/route.ts', [
              route('admin_notes', 'EventProposals/$id/admin_notes.ts'),
              route('edit', 'EventProposals/EditEventProposal.tsx'),
              route('transition', 'EventProposals/$id/transition.ts'),
            ]),
            index('EventProposals/route.ts'),
          ]),
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
          route('mailing_lists', 'MailingLists/route.tsx', [
            route('event_proposers', 'MailingLists/EventProposers.tsx'),
            route('team_members', 'MailingLists/TeamMembers.tsx'),
            route('ticketed_attendees', 'MailingLists/TicketedAttendees.tsx'),
            route('users_with_pending_bio', 'MailingLists/UsersWithPendingBio.tsx'),
            route('waitlists', 'MailingLists/WaitlistMailingLists.tsx'),
            route('whos_free', 'MailingLists/WhosFree.tsx'),
            index('MailingLists/index.tsx'),
          ]),
          route('my_profile', 'RouteGuards/LoginRequiredRouteGuard.tsx', [
            route('edit_bio', 'MyProfile/edit_bio.ts'),
            route('edit', 'MyProfile/MyProfileForm.tsx'),
            route('setup', 'MyProfile/MyProfileForm.tsx', { id: NamedRoute.MyProfileSetup }),
            index('MyProfile/MyProfileDisplay.tsx'),
          ]),
          route('order_history', 'Store/OrderHistory.tsx'),
          route('products/:id', 'Store/ProductPage.tsx'),
          route('reports', 'Reports/route.tsx', [
            route('attendance_by_payment_amount', 'Reports/AttendanceByPaymentAmount.tsx'),
            route('event_provided_tickets', 'Reports/EventProvidedTickets.tsx'),
            route('events_by_choice', 'Reports/EventsByChoice.tsx'),
            route('signup_spy', 'Reports/SignupSpy.tsx'),
            index('Reports/index.tsx'),
          ]),
          route('rooms', 'RoomsAdmin/index.tsx', [route(':id', 'RoomsAdmin/$id/route.ts')]),
          route('signup_moderation', 'SignupModeration/index.tsx', [
            route('create_signups', 'SignupModeration/CreateSignup.tsx'),
            route('queue', 'SignupModeration/SignupModerationQueue.tsx'),
            route('ranked_choice_queue', 'SignupModeration/RankedChoiceQueue.tsx', [
              route(':userConProfileId', 'SignupModeration/UserRankedChoiceQueue.tsx'),
            ]),
            ...prefix('signup_requests/:id', [
              route('accept', 'SignupModeration/signup_requests/$id/accept.ts'),
              route('reject', 'SignupModeration/signup_requests/$id/reject.ts'),
            ]),
            route('signup_rounds/:id/rerun', 'SignupModeration/signup_rounds/$id/rerun.ts'),
            index('SignupModeration/indexRedirect.ts'),
          ]),
          route('signup_rounds', 'SignupRoundsAdmin/index.tsx', [
            route(':id', 'SignupRoundsAdmin/$id.ts', [
              route('results', 'SignupRoundsAdmin/RankedChoiceSignupDecisionsPage.tsx'),
            ]),
            index('SignupRoundsAdmin/SignupRoundsAdminPage.tsx'),
          ]),
          route('staff_positions', 'StaffPositionAdmin/index.tsx', [
            route('new', 'StaffPositionAdmin/NewStaffPosition.tsx'),
            route(':id', 'StaffPositionAdmin/$id/route.ts', [
              route('edit', 'StaffPositionAdmin/EditStaffPosition.tsx', { id: NamedRoute.EditStaffPosition }),
              route('edit_permissions', 'StaffPositionAdmin/EditStaffPositionPermissions.tsx', {
                id: NamedRoute.EditStaffPositionPermissions,
              }),
            ]),
            index('StaffPositionAdmin/StaffPositionsTable.tsx'),
          ]),
          ...prefix('ticket', [route('new', 'MyTicket/TicketPurchasePage.tsx'), index('MyTicket/MyTicketDisplay.tsx')]),
          ...prefix('ticket_types', [
            layout('RouteGuards/TicketRequiredForSignupRouteGuard.tsx', [
              layout('RouteGuards/CanManageTicketTypesRouteGuard.tsx', [
                route('new', 'TicketTypeAdmin/new.tsx'),
                route(':id', 'TicketTypeAdmin/$id.ts', [route('edit', 'TicketTypeAdmin/edit.tsx')]),
                index('TicketTypeAdmin/route.tsx'),
              ]),
            ]),
          ]),
          route(
            'user_activity_alerts',
            'UserActivityAlerts/UserActivityAlertsAdmin.tsx',
            { id: NamedRoute.UserActivityAlerts },
            [
              route('new', 'UserActivityAlerts/NewUserActivityAlert.tsx'),
              route(':id/edit', 'UserActivityAlerts/EditUserActivityAlert.tsx'),
              index('UserActivityAlerts/UserActivityAlertsList.tsx'),
            ],
          ),
          route('user_con_profiles', 'UserConProfiles/route.tsx', [
            route(':id', 'UserConProfiles/userConProfileLoader.ts', { id: NamedRoute.AdminUserConProfile }, [
              ...prefix('admin_ticket', [
                route('edit', 'UserConProfiles/EditTicket.tsx'),
                route('new', 'UserConProfiles/NewTicket.tsx'),
              ]),
              route('edit', 'UserConProfiles/EditUserConProfile.tsx'),
              index('UserConProfiles/UserConProfileAdminDisplay.tsx'),
            ]),
            route('', 'UserConProfiles/AttendeesPage.tsx', [route('new', 'UserConProfiles/AddAttendeeModal.tsx')]),
          ]),
        ]),
      ]),
      layout('RouteGuards/RootSiteRouteGuard.tsx', [
        route('conventions', 'RootSiteConventionsAdmin/index.tsx', { id: NamedRoute.RootSiteConventionsAdmin }, [
          route(':id', 'RootSiteConventionsAdmin/ConventionDisplay.tsx', { id: NamedRoute.RootSiteConventionDisplay }, [
            route('clone', 'RootSiteConventionsAdmin/clone.tsx'),
          ]),
          route(
            '',
            'RootSiteConventionsAdmin/RootSiteConventionsAdminTable.tsx',
            { id: NamedRoute.RootSiteConventionsAdminTable },
            [route('new', 'RootSiteConventionsAdmin/new.tsx')],
          ),
        ]),
        route('email_routes', 'RootSiteEmailRoutesAdmin/index.tsx', [
          route(':id', 'RootSiteEmailRoutesAdmin/EditEmailRouteModal.tsx'),
          route('new', 'RootSiteEmailRoutesAdmin/NewEmailRouteModal.tsx'),
        ]),
        route('organizations', 'OrganizationAdmin/index.tsx', { id: NamedRoute.OrganizationAdmin }, [
          route(':id', 'OrganizationAdmin/$id.ts', { id: NamedRoute.Organization }, [
            ...prefix('roles', [
              route(':organizationRoleId', 'OrganizationAdmin/$id/roles/$organizationRoleId/route.ts', [
                route('edit', 'OrganizationAdmin/EditOrganizationRole.tsx', { id: NamedRoute.EditOrganizationRole }),
              ]),
              route('new', 'OrganizationAdmin/NewOrganizationRole.tsx', { id: NamedRoute.NewOrganizationRole }),
            ]),
            index('OrganizationAdmin/OrganizationDisplay.tsx', { id: NamedRoute.OrganizationDisplay }),
          ]),
          index('OrganizationAdmin/OrganizationIndex.tsx'),
        ]),
        route('users', 'Users/UsersAdmin.tsx', { id: NamedRoute.UserAdmin }, [
          route(':id', 'Users/UserAdminDisplay.tsx', { id: NamedRoute.UserAdminDisplay }),
          route('', 'Users/UsersTable.tsx', { id: NamedRoute.UsersTable }, [
            route('merge/:ids', 'Users/MergeUsersModal.tsx'),
          ]),
        ]),
      ]),
      layout('CmsAdmin/index.tsx', { id: NamedRoute.CmsAdmin }, [
        route(
          'cms_content_groups',
          'CmsAdmin/CmsContentGroupsAdmin/route.ts',
          { id: NamedRoute.CmsContentGroupsAdmin },
          [
            route(':id', 'CmsAdmin/CmsContentGroupsAdmin/SingleCmsContentGroupRoute.ts', [
              route('edit', 'CmsAdmin/CmsContentGroupsAdmin/EditCmsContentGroup.tsx'),
              route('view_source', 'CmsAdmin/CmsContentGroupsAdmin/ViewCmsContentGroup.tsx'),
            ]),
            route('new', 'CmsAdmin/CmsContentGroupsAdmin/NewCmsContentGroup.tsx'),
            index('CmsAdmin/CmsContentGroupsAdmin/CmsContentGroupsAdminTable.tsx'),
          ],
        ),
        route('cms_files', 'CmsAdmin/CmsFilesAdmin/index.tsx', { id: NamedRoute.CmsFiles }),
        route(
          'cms_graphql_queries',
          'CmsAdmin/CmsGraphqlQueriesAdmin/route.ts',
          { id: NamedRoute.CmsGraphqlQueriesAdmin },
          [
            route(':id', 'CmsAdmin/CmsGraphqlQueriesAdmin/SingleGraphqlQueryRoute.ts', [
              route('edit', 'CmsAdmin/CmsGraphqlQueriesAdmin/EditCmsGraphqlQuery.tsx'),
              route('view_source', 'CmsAdmin/CmsGraphqlQueriesAdmin/ViewCmsGraphqlQuerySource.tsx'),
            ]),
            route('new', 'CmsAdmin/CmsGraphqlQueriesAdmin/NewCmsGraphqlQuery.tsx'),
            index('CmsAdmin/CmsGraphqlQueriesAdmin/CmsGraphqlQueriesAdminTable.tsx'),
          ],
        ),
        route('cms_layouts', 'CmsAdmin/CmsLayoutsAdmin/route.ts', { id: NamedRoute.CmsLayoutsAdmin }, [
          route(':id', 'CmsAdmin/CmsLayoutsAdmin/SingleLayoutRoute.tsx', [
            route('edit', 'CmsAdmin/CmsLayoutsAdmin/EditCmsLayout.tsx'),
            route('view_source', 'CmsAdmin/CmsLayoutsAdmin/ViewCmsLayoutSource.tsx'),
          ]),
          route('new', 'CmsAdmin/CmsLayoutsAdmin/NewCmsLayout.tsx'),
          index('CmsAdmin/CmsLayoutsAdmin/CmsLayoutsAdminTable.tsx'),
        ]),
        route('cms_navigation_items', 'CmsAdmin/NavigationItemsAdmin/index.tsx'),
        route('cms_pages', 'CmsAdmin/CmsPagesAdmin/route.ts', { id: NamedRoute.CmsPagesAdmin }, [
          route(':id', 'CmsAdmin/CmsPagesAdmin/SinglePageRoute.tsx', [
            route('edit', 'CmsAdmin/CmsPagesAdmin/EditCmsPage.tsx'),
            route('view_source', 'CmsAdmin/CmsPagesAdmin/ViewCmsPageSource.tsx'),
          ]),
          route('new', 'CmsAdmin/CmsPagesAdmin/NewCmsPage.tsx'),
          index('CmsAdmin/CmsPagesAdmin/CmsPagesAdminTable.tsx'),
        ]),
        route('cms_partials', 'CmsAdmin/CmsPartialsAdmin/route.ts', { id: NamedRoute.CmsPartialsAdmin }, [
          route(':id', 'CmsAdmin/CmsPartialsAdmin/SinglePartialRoute.tsx', [
            route('edit', 'CmsAdmin/CmsPartialsAdmin/EditCmsPartial.tsx'),
            route('view_source', 'CmsAdmin/CmsPartialsAdmin/ViewCmsPartialSource.tsx'),
          ]),
          route('new', 'CmsAdmin/CmsPartialsAdmin/NewCmsPartial.tsx'),
          index('CmsAdmin/CmsPartialsAdmin/CmsPartialsAdminTable.tsx'),
        ]),
        route('cms_variables', 'CmsAdmin/CmsVariablesAdmin/index.tsx', [
          route(':key', 'CmsAdmin/CmsVariablesAdmin/SingleVariableRoute.ts'),
        ]),
        route('root_site', 'RootSiteAdmin/EditRootSite.tsx'),
      ]),
      route('/pages/*', 'CmsPage/index.tsx'),
      index('CmsPage/index.tsx', { id: NamedRoute.RootPage }),
      route('*', 'FourOhFourPage.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
