import { type RouteConfig, index, layout, route, prefix } from '@react-router/dev/routes';

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
  MyProfileEdit = 'MyProfileEdit',
  MyProfileSetup = 'MyProfileSetup',
  NewEventCategory = 'NewEventCategory',
  NewOrganizationRole = 'NewOrganizationRole',
  NewTeamMember = 'NewTeamMember',
  Organization = 'Organization',
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
  TicketPerEventEditTicketType = 'TicketPerEventEditTicketType',
  TicketPerEventNewTicketType = 'TicketPerEventNewTicketType',
  TicketPerEventTicketTypesList = 'TicketPerEventTicketTypesList',
  UserActivityAlerts = 'UserActivityAlerts',
  UserAdmin = 'UserAdmin',
  UserAdminDisplay = 'UserAdminDisplay',
  UsersTable = 'UsersTable',
}

export type RouteName = keyof typeof NamedRoute & string;

export default [
  layout('./AppRoot.tsx', [
    route('oauth/callback', './Authentication/OAuthCallback.tsx'),

    // Form editor routes
    route('admin_forms/:id/edit', './FormAdmin/FormEditor.tsx', [
      route('section', './FormAdmin/$id/edit/section/route.ts', [
        route(':sectionId', './FormAdmin/$id/edit/section/$sectionId/route.tsx', [
          route('item', './FormAdmin/$id/edit/section/$sectionId/item/route.ts', [
            route(':itemId/move', './FormAdmin/$id/edit/section/$sectionId/item/$itemId/move.ts'),
            route(':itemId', './FormAdmin/$id/edit/section/$sectionId/item/$itemId/route.tsx'),
          ]),
        ]),
      ]),
    ]),

    // Liquid docs routes
    route('liquid_docs', './LiquidDocs/route.ts', { id: NamedRoute.LiquidDocs }, [
      route('assigns/:name', './LiquidDocs/AssignDoc.tsx'),
      route('filters/:name', './LiquidDocs/FilterDoc.tsx'),
      route('tags/:name', './LiquidDocs/LiquidTagDoc.tsx'),
      index('./LiquidDocs/index.tsx'),
    ]),

    layout('./AppRootLayout.tsx', [
      // CMS Admin routes
      layout('./CmsAdmin/route.ts', { id: NamedRoute.CmsAdmin }, [
        // CMS Pages
        route('cms_pages', './CmsAdmin/CmsPagesAdmin/route.ts', { id: NamedRoute.CmsPagesAdmin }, [
          route(':id', './CmsAdmin/CmsPagesAdmin/SinglePageRoute.tsx', [
            route('edit', './CmsAdmin/CmsPagesAdmin/EditCmsPage.tsx'),
            route('view_source', './CmsAdmin/CmsPagesAdmin/ViewCmsPageSource.tsx'),
          ]),
          route('new', './CmsAdmin/CmsPagesAdmin/NewCmsPage.tsx'),
          index('./CmsAdmin/CmsPagesAdmin/CmsPagesAdminTable.tsx'),
        ]),

        // CMS Partials
        route('cms_partials', './CmsAdmin/CmsPartialsAdmin/route.ts', { id: NamedRoute.CmsPartialsAdmin }, [
          route(':id', './CmsAdmin/CmsPartialsAdmin/SinglePartialRoute.tsx', [
            route('edit', './CmsAdmin/CmsPartialsAdmin/EditCmsPartial.tsx'),
            route('view_source', './CmsAdmin/CmsPartialsAdmin/ViewCmsPartialSource.tsx'),
          ]),
          route('new', './CmsAdmin/CmsPartialsAdmin/NewCmsPartial.tsx'),
          index('./CmsAdmin/CmsPartialsAdmin/CmsPartialsAdminTable.tsx'),
        ]),

        // CMS Files
        route('cms_files', './CmsAdmin/CmsFilesAdmin/index.tsx', { id: NamedRoute.CmsFiles }),

        // CMS Navigation Items
        route('cms_navigation_items', './CmsAdmin/NavigationItemsAdmin/index.tsx'),

        // CMS Layouts
        route('cms_layouts', './CmsAdmin/CmsLayoutsAdmin/route.ts', { id: NamedRoute.CmsLayoutsAdmin }, [
          route(':id', './CmsAdmin/CmsLayoutsAdmin/SingleLayoutRoute.tsx', [
            route('edit', './CmsAdmin/CmsLayoutsAdmin/EditCmsLayout.tsx'),
            route('view_source', './CmsAdmin/CmsLayoutsAdmin/ViewCmsLayoutSource.tsx'),
          ]),
          route('new', './CmsAdmin/CmsLayoutsAdmin/NewCmsLayout.tsx'),
          index('./CmsAdmin/CmsLayoutsAdmin/CmsLayoutsAdminTable.tsx'),
        ]),

        // CMS Variables
        route('cms_variables', './CmsAdmin/CmsVariablesAdmin/index.tsx', [
          route(':key', './CmsAdmin/CmsVariablesAdmin/SingleVariableRoute.ts'),
        ]),

        // CMS GraphQL Queries
        route(
          'cms_graphql_queries',
          './CmsAdmin/CmsGraphqlQueriesAdmin/route.ts',
          { id: NamedRoute.CmsGraphqlQueriesAdmin },
          [
            route(':id', './CmsAdmin/CmsGraphqlQueriesAdmin/SingleGraphqlQueryRoute.ts', [
              route('edit', './CmsAdmin/CmsGraphqlQueriesAdmin/EditCmsGraphqlQuery.tsx'),
              route('view_source', './CmsAdmin/CmsGraphqlQueriesAdmin/ViewCmsGraphqlQuerySource.tsx'),
            ]),
            route('new', './CmsAdmin/CmsGraphqlQueriesAdmin/NewCmsGraphqlQuery.tsx'),
            index('./CmsAdmin/CmsGraphqlQueriesAdmin/CmsGraphqlQueriesAdminTable.tsx'),
          ],
        ),

        // CMS Content Groups
        route(
          'cms_content_groups',
          './CmsAdmin/CmsContentGroupsAdmin/route.ts',
          { id: NamedRoute.CmsContentGroupsAdmin },
          [
            route(':id', './CmsAdmin/CmsContentGroupsAdmin/SingleCmsContentGroupRoute.ts', [
              route('edit', './CmsAdmin/CmsContentGroupsAdmin/EditCmsContentGroup.tsx'),
              index('./CmsAdmin/CmsContentGroupsAdmin/ViewCmsContentGroup.tsx'),
            ]),
            route('new', './CmsAdmin/CmsContentGroupsAdmin/NewCmsContentGroup.tsx'),
            index('./CmsAdmin/CmsContentGroupsAdmin/CmsContentGroupsAdminTable.tsx'),
          ],
        ),

        // Root Site Admin (only visible when conventionName is null)
        layout('./AppRootContext/guards/conventionNameNull.tsx', [
          route('root_site', './RootSiteAdmin/EditRootSite.tsx'),
        ]),
      ]),

      // OAuth routes
      route('oauth/applications-embed', './OAuthApplications/index.tsx'),
      route('oauth/authorize', './OAuth/AuthorizationPrompt.tsx'),
      route('oauth/authorized_applications', './OAuth/AuthorizedApplications.tsx', [route(':uid', './OAuth/$uid.ts')]),

      // User management routes
      route('users/edit', './Authentication/EditUser.tsx'),
      route('users/password/edit', './Authentication/ResetPassword.tsx'),

      // Common in-convention routes
      // Departments
      layout('./Authentication/guards/canUpdateDepartments.tsx', [
        route('admin_departments', './DepartmentAdmin/route.ts', { id: NamedRoute.DepartmentAdmin }, [
          route(':id', './DepartmentAdmin/SingleDepartmentRoute.ts', [
            route('edit', './DepartmentAdmin/EditDepartment.tsx'),
            index('./DepartmentAdmin/redirectSingleDepartmentIndex.ts'),
          ]),
          route('new', './DepartmentAdmin/NewDepartment.tsx'),
          index('./DepartmentAdmin/DepartmentAdminIndex.tsx'),
        ]),
      ]),

      // Event Admin
      route('admin_events', './EventAdmin/route.ts', { id: NamedRoute.EventAdmin }, [
        // Dropped events and event creation (only in non-single-event mode)
        layout('./AppRootContext/guards/siteModeNotSingleEvent.tsx', { id: 'EventAdminSiteModeGuard' }, [
          route('dropped_events', './EventAdmin/DroppedEventAdmin.tsx'),
          route(':eventCategoryId/events/new', './EventAdmin/NewEvent.tsx'),
          route(':eventCategoryId/events/:eventId/edit', './EventAdmin/EventAdminEditEvent.tsx'),
          route(':eventCategoryId', './EventAdmin/CategorySpecificEventAdmin.tsx', [
            route('events', './EventAdmin/create.ts', [
              index('./EventAdmin/redirectToMain.ts'),
              route(':eventId', './EventAdmin/$id.ts', [
                route('admin_notes', './EventAdmin/AdminNotesRoute.ts'),
                route('drop', './EventAdmin/drop.ts'),
                route('restore', './EventAdmin/RestoreEventRoute.ts'),
                route('runs/:runId', './EventAdmin/SingleRunRoute.ts', [route('edit', './EventAdmin/EditRun.tsx')]),
                route('runs/create_multiple', './EventAdmin/CreateMultipleRunsRoute.ts'),
                route('runs/new', './EventAdmin/NewRun.tsx'),
              ]),
            ]),
          ]),
        ]),
        index('./EventAdmin/redirectToRoot.ts'),
      ]),

      // Forms Admin
      route('admin_forms', './FormAdmin/index.tsx', { id: NamedRoute.AdminForms }, [
        route(':id/edit_advanced', './FormAdmin/FormJSONEditor.tsx', { id: NamedRoute.FormJSONEditor }),
        route(':id', './FormAdmin/$id/route.ts'),
        index('./FormAdmin/FormAdminIndex.tsx', { id: NamedRoute.FormAdminIndex }),
      ]),

      // Notifications Admin
      layout('./Authentication/guards/canUpdateNotificationTemplates.tsx', [
        route('admin_notifications', './NotificationAdmin/index.tsx', [
          route(':eventKey', './NotificationAdmin/NotificationConfiguration.tsx'),
          route(':eventKey/preview', './NotificationAdmin/preview.ts'),
          index('./NotificationAdmin/NotificationAdminIndex.tsx'),
        ]),
      ]),

      // Store Admin
      route('admin_store', './Store/StoreAdmin.tsx', [
        route('products', './Store/ProductAdmin/index.tsx', [route(':id', './Store/ProductAdmin/$id.ts')]),
        route('coupons', './Store/CouponAdmin/CouponAdminTable.tsx', [
          route(':id', './Store/CouponAdmin/EditCouponModal.tsx'),
          route('new', './Store/CouponAdmin/NewCouponModal.tsx'),
        ]),
        route('orders', './Store/OrderAdmin/index.tsx', [
          route(':id', './Store/OrderAdmin/$id.tsx', [
            route('cancel', './Store/OrderAdmin/cancel.ts'),
            route('mark_paid', './Store/OrderAdmin/mark_paid.ts'),
            route('order_entries', './Store/OrderAdmin/order_entries/route.ts', [
              route(':orderEntryId', './Store/OrderAdmin/order_entries/$orderEntryId.ts'),
            ]),
            route('coupon_applications', './Store/OrderAdmin/coupon_applications/route.ts', [
              route(':couponApplicationId', './Store/OrderAdmin/coupon_applications/$couponApplicationId.ts'),
            ]),
          ]),
          route('new', './Store/OrderAdmin/new.tsx'),
        ]),
        route('order_summary', './Store/OrderSummary.tsx'),
        index('./Store/StoreAdmin/redirectToProducts.ts'),
      ]),

      // Cart
      route('cart', './Store/Cart/index.tsx', [
        route('order_entries/:id', './Store/Cart/order_entries/$id.ts'),
        route('coupon_applications', './Store/Cart/coupon_applications/route.ts', [
          route(':id', './Store/Cart/coupon_applications/$id.ts'),
        ]),
      ]),

      // Clickwrap Agreement
      route('clickwrap_agreement', './ClickwrapAgreement/index.tsx'),

      // Convention Edit
      route('convention/edit', './ConventionAdmin/index.tsx'),

      // Events routes
      ...prefix('events', [
        // Schedule routes (only in non-single-event mode)
        layout('./AppRootContext/guards/siteModeNotSingleEvent.tsx', { id: 'EventsScheduleSiteModeGuard' }, [
          ...prefix('schedule', [route(':day', './EventsApp/ScheduleApp.tsx'), index('./EventsApp/schedule/index.ts')]),
          route('schedule_by_room/*', './EventsApp/schedule_by_room/route.ts'),
          route('schedule_with_counts/*', './EventsApp/schedule_with_counts/route.ts'),
          route('table', './EventsApp/EventCatalog/EventTable/index.tsx'),
        ]),

        // Signup queue (ranked choice only)
        layout('./AppRootContext/guards/signupAutomationModeRankedChoice.tsx', [
          route('my-signup-queue', './EventsApp/MySignupQueue/index.tsx'),
        ]),

        // Individual event routes
        route(':eventId', './EventsApp/EventPage/index.tsx', { id: NamedRoute.Event }, [
          route('attach_image', './EventsApp/attach_image.ts'),

          // Event ticket types (per-event tickets, only when TicketMode is TicketPerEvent)
          layout('./AppRootContext/guards/ticketModeTicketPerEvent.tsx', { id: 'EventTicketTypesGuard' }, [
            route('ticket_types', './EventsApp/EventTicketTypesWrapper.tsx', [
              route('new', './TicketTypeAdmin/NewTicketType.tsx', { id: NamedRoute.TicketPerEventNewTicketType }),
              route(':id/edit', './TicketTypeAdmin/EditTicketType.tsx', {
                id: NamedRoute.TicketPerEventEditTicketType,
              }),
              index('./TicketTypeAdmin/TicketTypesList.tsx', { id: NamedRoute.TicketPerEventTicketTypesList }),
            ]),
          ]),

          // Edit event (guarded)
          layout('./EventsApp/guards/EditEventGuard.tsx', [route('edit', './EventsApp/StandaloneEditEvent/index.tsx')]),

          // Maximum event provided ticket overrides
          route(
            'maximum_event_provided_ticket_overrides',
            './EventsApp/MaximumEventProvidedTicketsOverrides/route.ts',
            [route(':id', './EventsApp/MaximumEventProvidedTicketsOverrides/$id.ts')],
          ),

          // Team members
          route('team_members', './EventsApp/TeamMemberAdmin/route.ts', { id: NamedRoute.TeamMembers }, [
            route('new', './EventsApp/TeamMemberAdmin/NewTeamMember.tsx', { id: NamedRoute.NewTeamMember }),
            route(':teamMemberId', './EventsApp/TeamMemberAdmin/EditTeamMember.tsx', { id: NamedRoute.EditTeamMember }),
            route('', './EventsApp/TeamMemberAdmin/TeamMembersIndex.tsx', { id: NamedRoute.TeamMembersIndex }, [
              route(':teamMemberId/provide_ticket', './EventsApp/TeamMemberAdmin/ProvideTicketModal.tsx'),
            ]),
          ]),

          // Event history
          ...prefix('history', [route(':changeGroupId', './EventsApp/EventPage/EventHistory.tsx')]),

          // Run admin and signup admin
          route('runs/:runId', './EventsApp/SignupAdmin/RunHeader.tsx', [
            // Admin signups
            route('admin_signups', './EventsApp/SignupAdmin/SignupsIndex.tsx', { id: NamedRoute.SignupAdmin }, [
              route(':id', './EventsApp/SignupAdmin/$id/route.tsx', { id: NamedRoute.EditSignup }, [
                route('change_bucket', './EventsApp/SignupAdmin/$id/change_bucket.tsx'),
                route('force_confirm', './EventsApp/SignupAdmin/$id/force_confirm.tsx'),
              ]),
              route('emails/:separator', './EventsApp/SignupAdmin/RunEmailList.tsx', { id: NamedRoute.RunEmailList }),
              route('signup_changes', './EventsApp/SignupAdmin/RunSignupChangesTable.tsx', {
                id: NamedRoute.RunSignupChangesTable,
              }),
              index('./EventsApp/SignupAdmin/RunSignupsTable.tsx', { id: NamedRoute.RunSignupsTable }),
            ]),

            // Signup summary
            route('signup_summary', './EventsApp/SignupAdmin/RunSignupSummary.tsx', {
              id: NamedRoute.RunSignupSummary,
            }),
          ]),

          // Event page (guarded to prevent access in single event mode)
          layout('./EventsApp/guards/EventPageGuard.tsx', [
            index('./EventsApp/EventPage/index.tsx', { id: NamedRoute.EventPage }),
          ]),
        ]),

        // Events index
        index('./EventsApp/EventCatalog/EventList/index.tsx'),
      ]),

      // Mailing Lists
      layout('./Authentication/guards/canReadAnyMailingList.tsx', [
        ...prefix('mailing_lists', [
          route('ticketed_attendees', './MailingLists/TicketedAttendees.tsx'),
          route('event_proposers', './MailingLists/EventProposers.tsx'),
          route('team_members', './MailingLists/TeamMembers.tsx'),
          route('users_with_pending_bio', './MailingLists/UsersWithPendingBio.tsx'),
          route('waitlists', './MailingLists/WaitlistMailingLists.tsx'),
          route('whos_free', './MailingLists/WhosFree.tsx'),
          index('./MailingLists/index.tsx'),
        ]),
      ]),

      // My Profile
      layout('./Authentication/LoginRequiredRouteGuard.tsx', [
        ...prefix('my_profile', [
          route('edit_bio', './MyProfile/edit_bio.ts'),
          route('edit', './MyProfile/MyProfileForm.tsx', { id: NamedRoute.MyProfileEdit }),
          route('setup', './MyProfile/MyProfileForm.tsx', { id: NamedRoute.MyProfileSetup }),
          index('./MyProfile/MyProfileDisplay.tsx'),
        ]),
      ]),

      // Order History
      route('order_history', './Store/OrderHistory.tsx'),

      // Product Pages
      route('products/:id', './Store/ProductPage.tsx'),

      // Reports
      layout('./Authentication/guards/canReadReports.tsx', [
        ...prefix('reports', [
          route('attendance_by_payment_amount', './Reports/AttendanceByPaymentAmount.tsx'),
          route('event_provided_tickets', './Reports/EventProvidedTickets.tsx'),
          route('events_by_choice', './Reports/EventsByChoice.tsx'),
          route('signup_spy', './Reports/SignupSpy.tsx'),
          index('./Reports/index.tsx'),
        ]),
      ]),

      // Rooms
      route('rooms', './RoomsAdmin/index.tsx', [route(':id', './RoomsAdmin/$id/route.ts')]),

      // Signup Moderation (only in moderated signup mode)
      layout('./AppRootContext/guards/signupModeModerated.tsx', [
        route('signup_moderation', './SignupModeration/index.tsx', [
          // Ranked choice queue (only in ranked choice automation mode)
          layout(
            './AppRootContext/guards/signupAutomationModeRankedChoice.tsx',
            { id: 'SignupModerationRankedChoiceGuard' },
            [
              route('ranked_choice_queue', './SignupModeration/RankedChoiceQueue.tsx', [
                route(':userConProfileId', './SignupModeration/UserRankedChoiceQueue.tsx'),
              ]),
            ],
          ),
          route('signup_requests/:id/accept', './SignupModeration/signup_requests/$id/accept.ts'),
          route('signup_requests/:id/reject', './SignupModeration/signup_requests/$id/reject.ts'),
          route('signup_rounds/:id/rerun', './SignupModeration/signup_rounds/$id/rerun.ts'),
          route('queue', './SignupModeration/SignupModerationQueue.tsx'),
          route('create_signups', './SignupModeration/CreateSignup.tsx'),
          index('./SignupModeration/redirectToQueue.ts'),
        ]),
      ]),

      // Signup Rounds
      ...prefix('signup_rounds', [
        route(':id', './SignupRoundsAdmin/$id.ts', [
          route('results', './SignupRoundsAdmin/RankedChoiceSignupDecisionsPage.tsx'),
        ]),
        index('./SignupRoundsAdmin/SignupRoundsAdminPage.tsx'),
      ]),

      // Staff Positions
      ...prefix('staff_positions', [
        route('new', './StaffPositionAdmin/NewStaffPosition.tsx'),
        route(':id', './StaffPositionAdmin/$id/route.ts', [
          route('edit', './StaffPositionAdmin/EditStaffPosition.tsx', { id: NamedRoute.EditStaffPosition }),
          route('edit_permissions', './StaffPositionAdmin/EditStaffPositionPermissions.tsx', {
            id: NamedRoute.EditStaffPositionPermissions,
          }),
        ]),
        index('./StaffPositionAdmin/StaffPositionsTable.tsx'),
      ]),

      // Ticket
      ...prefix('ticket', [route('new', './MyTicket/TicketPurchasePage.tsx'), index('./MyTicket/MyTicketDisplay.tsx')]),

      // Ticket Types Admin (only when ticket mode is RequiredForSignup)
      layout('./AppRootContext/guards/ticketModeRequiredForSignup.tsx', [
        layout('./Authentication/guards/canManageTicketTypes.tsx', [
          route('ticket_types', './TicketTypeAdmin/route.ts', [
            route('new', './TicketTypeAdmin/NewTicketType.tsx'),
            route(':id', './TicketTypeAdmin/singleTicketTypeRoute.ts', [
              route('edit', './TicketTypeAdmin/EditTicketType.tsx'),
            ]),
            index('./TicketTypeAdmin/TicketTypesList.tsx'),
          ]),
        ]),
      ]),

      // User Activity Alerts
      route(
        'user_activity_alerts',
        './UserActivityAlerts/UserActivityAlertsAdmin.tsx',
        { id: NamedRoute.UserActivityAlerts },
        [
          route('new', './UserActivityAlerts/NewUserActivityAlert.tsx'),
          route(':id/edit', './UserActivityAlerts/EditUserActivityAlert.tsx', { id: NamedRoute.EditUserActivityAlert }),
          index('./UserActivityAlerts/UserActivityAlertsList.tsx'),
        ],
      ),

      // User Con Profiles
      layout('./Authentication/guards/canReadUserConProfiles.tsx', [
        ...prefix('user_con_profiles', [
          route(':id', './UserConProfiles/userConProfileLoader.ts', { id: NamedRoute.AdminUserConProfile }, [
            route('admin_ticket/new', './UserConProfiles/NewTicket.tsx'),
            route('admin_ticket/edit', './UserConProfiles/EditTicket.tsx'),
            route('edit', './UserConProfiles/EditUserConProfile.tsx'),
            index('./UserConProfiles/UserConProfileAdminDisplay.tsx'),
          ]),
          route('new', './UserConProfiles/AddAttendeeModal.tsx'),
          index('./UserConProfiles/AttendeesPage.tsx'),
        ]),
      ]),

      // Convention mode routes
      // Event Proposals Admin
      route('admin_event_proposals', './EventProposals/EventProposalsAdmin.tsx', [
        route(':id', './EventProposals/route_with_loader.ts', { id: NamedRoute.AdminEventProposal }, [
          route('history', './EventProposals/EventProposalHistory.tsx', { id: NamedRoute.EventProposalHistory }, [
            route(':changeGroupId', './EventProposals/EventProposalHistory.tsx', {
              id: NamedRoute.EventProposalHistoryChangeGroup,
            }),
          ]),
          route('edit', './EventProposals/AdminEditEventProposal.tsx', { id: NamedRoute.AdminEditEventProposal }),
          index('./EventProposals/EventProposalAdminDisplay.tsx', { id: NamedRoute.EventProposalAdminDisplay }),
        ]),
        index('./EventProposals/EventProposalsAdminTable.tsx'),
      ]),

      // Event Categories Admin
      layout('./Authentication/guards/canUpdateEventCategories.tsx', [
        route('event_categories', './EventCategoryAdmin/route.ts', { id: NamedRoute.EventCategoryAdmin }, [
          route('new', './EventCategoryAdmin/NewEventCategory.tsx', { id: NamedRoute.NewEventCategory }),
          route(':id', './EventCategoryAdmin/$id.ts', [
            route('edit', './EventCategoryAdmin/EditEventCategory.tsx', { id: NamedRoute.EditEventCategory }),
          ]),
          index('./EventCategoryAdmin/EventCategoryIndex.tsx', { id: NamedRoute.EventCategoryIndex }),
        ]),
      ]),

      // Event Proposals (user-facing)
      route('event_proposals', './EventProposals/route.ts', [
        route(':id', './EventProposals/$id/route.ts', [
          route('admin_notes', './EventProposals/$id/admin_notes.ts'),
          route('edit', './EventProposals/EditEventProposal.tsx'),
          route('transition', './EventProposals/$id/transition.ts'),
        ]),
        index('./EventProposals/redirectToNewProposal.ts'),
      ]),

      // Root site routes
      // Conventions Admin
      route(
        'conventions',
        './RootSiteConventionsAdmin/RootSiteConventionsAdminTable.tsx',
        { id: NamedRoute.RootSiteConventionsAdmin },
        [
          route(
            ':id',
            './RootSiteConventionsAdmin/ConventionDisplay.tsx',
            { id: NamedRoute.RootSiteConventionDisplay },
            [route('clone', './RootSiteConventionsAdmin/clone.tsx')],
          ),
          route('new', './RootSiteConventionsAdmin/new.tsx'),
          index('./RootSiteConventionsAdmin/RootSiteConventionsAdminTable.tsx', {
            id: NamedRoute.RootSiteConventionsAdminTable,
          }),
        ],
      ),

      // Email Routes
      route('email_routes', './RootSiteEmailRoutesAdmin/index.tsx', [
        route(':id', './RootSiteEmailRoutesAdmin/EditEmailRouteModal.tsx'),
        route('new', './RootSiteEmailRoutesAdmin/NewEmailRouteModal.tsx'),
      ]),

      // Organizations
      ...prefix('organizations', [
        route(':id', './OrganizationAdmin/OrganizationDisplay.tsx', { id: NamedRoute.Organization }, [
          route('roles/new', './OrganizationAdmin/NewOrganizationRole.tsx', { id: NamedRoute.NewOrganizationRole }),
          route('roles/:organizationRoleId', './OrganizationAdmin/$id/roles/$organizationRoleId/route.ts', [
            route('edit', './OrganizationAdmin/EditOrganizationRole.tsx', { id: NamedRoute.EditOrganizationRole }),
          ]),
          index('./OrganizationAdmin/OrganizationDisplay.tsx', { id: NamedRoute.OrganizationDisplay }),
        ]),
        index('./OrganizationAdmin/OrganizationIndex.tsx'),
      ]),

      // Users Admin
      layout('./Authentication/guards/canReadUsers.tsx', [
        route('users', './Users/UsersAdmin.tsx', { id: NamedRoute.UserAdmin }, [
          route(':id', './Users/UserAdminDisplay.tsx', { id: NamedRoute.UserAdminDisplay }),
          route('merge/:ids', './Users/MergeUsersModal.tsx'),
          index('./Users/UsersTable.tsx', { id: NamedRoute.UsersTable }),
        ]),
      ]),

      // CMS Pages (wildcard)
      route('pages/*', './CmsPage/index.tsx'),
      index('./CmsPage/index.tsx', { id: NamedRoute.RootPage }),

      // 404 catchall
      route('*', './FourOhFourPage.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
