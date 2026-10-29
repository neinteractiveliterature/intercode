import { RouteObject, replace, redirect } from 'react-router';

import FourOhFourPage from './FourOhFourPage';
import { SignupAutomationMode, SignupMode, SiteMode, TicketMode } from './graphqlTypes.generated';
import { appRootMiddleware } from './appRootMiddleware';
import {
  adminSingleTicketTypeLoader,
  adminTicketTypesLoader,
  eventSingleTicketTypeLoader,
  eventTicketTypesLoader,
} from './TicketTypeAdmin/loaders';
import { organizationsLoader, singleOrganizationLoader } from './OrganizationAdmin/loaders';
import { eventProposalWithOwnerLoader } from './EventProposals/loaders';
import { redirectToFirstDayMiddleware } from './EventsApp/conventionDayUrls';
import { signupAdminEventLoader, singleSignupLoader } from './EventsApp/SignupAdmin/loaders';
import { teamMembersLoader } from './EventsApp/TeamMemberAdmin/loader';
import { cmsAdminBaseQueryLoader } from './CmsAdmin/loaders';
import { cmsPagesAdminLoader } from './CmsAdmin/CmsPagesAdmin/loaders';
import { cmsPartialsAdminLoader } from './CmsAdmin/CmsPartialsAdmin/loaders';
import { liquidDocsLoader } from './LiquidDocs/loader';
import { cmsLayoutsAdminLoader } from './CmsAdmin/CmsLayoutsAdmin/loaders';
import { cmsGraphqlQueriesAdminLoader } from './CmsAdmin/CmsGraphqlQueriesAdmin/loaders';
import { cmsContentGroupsAdminLoader } from './CmsAdmin/CmsContentGroupsAdmin/loaders';
import { departmentAdminLoader } from './DepartmentAdmin/loaders';
import { eventCategoryAdminLoader } from './EventCategoryAdmin/loaders';
import { eventAdminEventsLoader, eventAdminRootRedirect } from './EventAdmin/loaders';
import RouteErrorBoundary from 'RouteErrorBoundary';
import { lazyRoute } from './lazyRoute';
import { NamedRoute } from './NamedRoute';
import NonCMSPageWrapper from './NonCMSPageWrapper';
import { guarded, loginRequiredGuard, makeAppRootContextGuard, makeAuthorizationGuard } from './routeGuards';
import { editEventMiddleware, eventPageMiddleware } from './routeMiddleware';

const eventsRoutes: RouteObject[] = [
  {
    loader: guarded([makeAppRootContextGuard(({ convention }) => convention?.site_mode !== SiteMode.SingleEvent)]),
    children: [
      {
        path: 'schedule',
        children: [
          { path: ':day', lazy: lazyRoute(() => import('./EventsApp/ScheduleApp')) },
          { index: true, middleware: [redirectToFirstDayMiddleware] },
        ],
      },
      { path: 'schedule_by_room/*', loader: () => replace('../schedule') },
      { path: 'schedule_with_counts/*', loader: () => replace('../schedule') },
      { path: 'table', lazy: lazyRoute(() => import('./EventsApp/EventCatalog/EventTable')) },
      { index: true, lazy: lazyRoute(() => import('./EventsApp/EventCatalog/EventList')) },
    ],
  },
  {
    loader: guarded([
      makeAppRootContextGuard(
        ({ convention }) => convention?.signup_automation_mode === SignupAutomationMode.RankedChoice,
      ),
    ]),
    children: [{ path: 'my-signup-queue', lazy: lazyRoute(() => import('./EventsApp/MySignupQueue')) }],
  },
  {
    path: ':eventId',
    id: NamedRoute.Event,
    children: [
      { path: 'attach_image', lazy: lazyRoute(() => import('./EventsApp/attach_image')) },
      {
        loader: guarded([
          makeAppRootContextGuard(({ convention }) => convention?.ticket_mode === TicketMode.TicketPerEvent),
        ]),
        children: [
          {
            path: 'ticket_types',
            loader: eventTicketTypesLoader,
            lazy: lazyRoute(() => import('./EventsApp/EventTicketTypesWrapper')),
            children: [
              {
                path: 'new',
                loader: eventTicketTypesLoader,
                lazy: lazyRoute(() => import('./TicketTypeAdmin/NewTicketType')),
              },
              {
                path: ':id/edit',
                loader: eventSingleTicketTypeLoader,
                lazy: lazyRoute(() => import('./TicketTypeAdmin/EditTicketType')),
              },
              {
                index: true,
                loader: eventTicketTypesLoader,
                lazy: lazyRoute(() => import('./TicketTypeAdmin/TicketTypesList')),
              },
            ],
          },
        ],
      },
      {
        path: 'edit',
        middleware: [editEventMiddleware],
        loader: guarded([loginRequiredGuard]),
        children: [
          {
            index: true,
            lazy: lazyRoute(() => import('./EventsApp/StandaloneEditEvent')),
          },
        ],
      },
      {
        path: 'maximum_event_provided_ticket_overrides',
        lazy: lazyRoute(() => import('./EventsApp/MaximumEventProvidedTicketsOverrides/route')),
        children: [
          { path: ':id', lazy: lazyRoute(() => import('./EventsApp/MaximumEventProvidedTicketsOverrides/$id')) },
        ],
      },
      {
        path: 'team_members',
        id: NamedRoute.TeamMembers,
        loader: teamMembersLoader,
        lazy: lazyRoute(() => import('./EventsApp/TeamMemberAdmin')),
        children: [
          {
            path: 'new',
            id: NamedRoute.NewTeamMember,
            lazy: lazyRoute(() => import('./EventsApp/TeamMemberAdmin/NewTeamMember')),
          },
          {
            path: ':teamMemberId',
            id: NamedRoute.EditTeamMember,
            lazy: lazyRoute(() => import('./EventsApp/TeamMemberAdmin/EditTeamMember')),
          },
          {
            path: '',
            id: NamedRoute.TeamMembersIndex,
            lazy: lazyRoute(() => import('./EventsApp/TeamMemberAdmin/TeamMembersIndex')),
            children: [
              {
                path: ':teamMemberId/provide_ticket',
                lazy: lazyRoute(() => import('./EventsApp/TeamMemberAdmin/ProvideTicketModal')),
              },
            ],
          },
        ],
      },
      {
        path: 'history',
        lazy: lazyRoute(() => import('./EventsApp/EventPage/EventHistory')),
        children: [{ path: ':changeGroupId', lazy: lazyRoute(() => import('./EventsApp/EventPage/EventHistory')) }],
      },
      {
        path: 'runs/:runId',
        lazy: lazyRoute(() => import('./EventsApp/SignupAdmin/RunHeader')),
        children: [
          {
            path: 'admin_signups',
            loader: signupAdminEventLoader,
            id: NamedRoute.SignupAdmin,
            children: [
              {
                path: ':id',
                loader: singleSignupLoader,
                id: NamedRoute.EditSignup,
                lazy: lazyRoute(() => import('./EventsApp/SignupAdmin/$id/route')),
                children: [
                  { path: 'change_bucket', lazy: lazyRoute(() => import('./EventsApp/SignupAdmin/$id/change_bucket')) },
                  { path: 'force_confirm', lazy: lazyRoute(() => import('./EventsApp/SignupAdmin/$id/force_confirm')) },
                ],
              },
              {
                lazy: lazyRoute(() => import('./EventsApp/SignupAdmin/SignupsIndex')),
                children: [
                  {
                    path: 'emails/:separator',
                    id: NamedRoute.RunEmailList,
                    lazy: lazyRoute(() => import('./EventsApp/SignupAdmin/RunEmailList')),
                  },
                  {
                    path: 'signup_changes',
                    id: NamedRoute.RunSignupChangesTable,
                    lazy: lazyRoute(() => import('./EventsApp/SignupAdmin/RunSignupChangesTable')),
                  },
                  {
                    index: true,
                    id: NamedRoute.RunSignupsTable,
                    lazy: lazyRoute(() => import('./EventsApp/SignupAdmin/RunSignupsTable')),
                  },
                ],
              },
            ],
          },
          {
            path: 'signup_summary',
            id: NamedRoute.RunSignupSummary,
            lazy: lazyRoute(() => import('./EventsApp/SignupAdmin/RunSignupSummary')),
          },
        ],
      },
      {
        path: '',
        middleware: [eventPageMiddleware],
        children: [{ index: true, id: NamedRoute.EventPage, lazy: lazyRoute(() => import('./EventsApp/EventPage')) }],
      },
    ],
  },
];

const cmsPageRoutes: RouteObject[] = [
  { path: '/pages/*', lazy: lazyRoute(() => import('./CmsPage')) },
  { index: true, lazy: lazyRoute(() => import('./CmsPage')) },
];

const commonRoutes: RouteObject[] = [
  {
    lazy: lazyRoute(() => import('./CmsAdmin')),
    loader: cmsAdminBaseQueryLoader,
    id: NamedRoute.CmsAdmin,
    children: [
      {
        path: '/cms_pages',
        loader: cmsPagesAdminLoader,
        id: NamedRoute.CmsPagesAdmin,
        children: [
          {
            path: ':id',
            lazy: lazyRoute(() => import('./CmsAdmin/CmsPagesAdmin/SinglePageRoute')),
            children: [
              { path: 'edit', lazy: lazyRoute(() => import('./CmsAdmin/CmsPagesAdmin/EditCmsPage')) },
              { path: 'view_source', lazy: lazyRoute(() => import('./CmsAdmin/CmsPagesAdmin/ViewCmsPageSource')) },
            ],
          },
          { path: 'new', lazy: lazyRoute(() => import('./CmsAdmin/CmsPagesAdmin/NewCmsPage')) },
          { index: true, lazy: lazyRoute(() => import('./CmsAdmin/CmsPagesAdmin/CmsPagesAdminTable')) },
        ],
      },
      {
        path: '/cms_partials',
        loader: cmsPartialsAdminLoader,
        id: NamedRoute.CmsPartialsAdmin,
        children: [
          {
            path: ':id',
            lazy: lazyRoute(() => import('./CmsAdmin/CmsPartialsAdmin/SinglePartialRoute')),
            children: [
              { path: 'edit', lazy: lazyRoute(() => import('./CmsAdmin/CmsPartialsAdmin/EditCmsPartial')) },
              {
                path: 'view_source',
                lazy: lazyRoute(() => import('./CmsAdmin/CmsPartialsAdmin/ViewCmsPartialSource')),
              },
            ],
          },
          { path: 'new', lazy: lazyRoute(() => import('./CmsAdmin/CmsPartialsAdmin/NewCmsPartial')) },
          { index: true, lazy: lazyRoute(() => import('./CmsAdmin/CmsPartialsAdmin/CmsPartialsAdminTable')) },
        ],
      },
      { path: '/cms_files', id: NamedRoute.CmsFiles, lazy: lazyRoute(() => import('./CmsAdmin/CmsFilesAdmin')) },
      { path: '/cms_navigation_items', lazy: lazyRoute(() => import('./CmsAdmin/NavigationItemsAdmin')) },
      {
        path: '/cms_layouts',
        loader: cmsLayoutsAdminLoader,
        id: NamedRoute.CmsLayoutsAdmin,
        children: [
          {
            path: ':id',
            lazy: lazyRoute(() => import('./CmsAdmin/CmsLayoutsAdmin/SingleLayoutRoute')),
            children: [
              { path: 'edit', lazy: lazyRoute(() => import('./CmsAdmin/CmsLayoutsAdmin/EditCmsLayout')) },
              { path: 'view_source', lazy: lazyRoute(() => import('./CmsAdmin/CmsLayoutsAdmin/ViewCmsLayoutSource')) },
            ],
          },
          { path: 'new', lazy: lazyRoute(() => import('./CmsAdmin/CmsLayoutsAdmin/NewCmsLayout')) },
          { index: true, lazy: lazyRoute(() => import('./CmsAdmin/CmsLayoutsAdmin/CmsLayoutsAdminTable')) },
        ],
      },
      {
        path: '/cms_variables',
        lazy: lazyRoute(() => import('./CmsAdmin/CmsVariablesAdmin')),
        children: [{ path: ':key', lazy: lazyRoute(() => import('./CmsAdmin/CmsVariablesAdmin/SingleVariableRoute')) }],
      },
      {
        path: '/cms_graphql_queries',
        loader: cmsGraphqlQueriesAdminLoader,
        id: NamedRoute.CmsGraphqlQueriesAdmin,
        children: [
          {
            path: ':id',
            lazy: lazyRoute(() => import('./CmsAdmin/CmsGraphqlQueriesAdmin/SingleGraphqlQueryRoute')),
            children: [
              { path: 'edit', lazy: lazyRoute(() => import('./CmsAdmin/CmsGraphqlQueriesAdmin/EditCmsGraphqlQuery')) },
              {
                path: 'view_source',
                lazy: lazyRoute(() => import('./CmsAdmin/CmsGraphqlQueriesAdmin/ViewCmsGraphqlQuerySource')),
              },
            ],
          },
          { path: 'new', lazy: lazyRoute(() => import('./CmsAdmin/CmsGraphqlQueriesAdmin/NewCmsGraphqlQuery')) },
          {
            index: true,
            lazy: lazyRoute(() => import('./CmsAdmin/CmsGraphqlQueriesAdmin/CmsGraphqlQueriesAdminTable')),
          },
        ],
      },
      {
        path: '/cms_content_groups',
        loader: cmsContentGroupsAdminLoader,
        id: NamedRoute.CmsContentGroupsAdmin,
        children: [
          {
            path: ':id',
            lazy: lazyRoute(() => import('./CmsAdmin/CmsContentGroupsAdmin/SingleCmsContentGroupRoute')),
            children: [
              { path: 'edit', lazy: lazyRoute(() => import('./CmsAdmin/CmsContentGroupsAdmin/EditCmsContentGroup')) },
              { index: true, lazy: lazyRoute(() => import('./CmsAdmin/CmsContentGroupsAdmin/ViewCmsContentGroup')) },
            ],
          },
          { path: 'new', lazy: lazyRoute(() => import('./CmsAdmin/CmsContentGroupsAdmin/NewCmsContentGroup')) },
          { index: true, lazy: lazyRoute(() => import('./CmsAdmin/CmsContentGroupsAdmin/CmsContentGroupsAdminTable')) },
        ],
      },
      {
        loader: guarded([makeAppRootContextGuard(({ convention }) => convention?.name == null)]),
        children: [{ path: '/root_site', lazy: lazyRoute(() => import('./RootSiteAdmin/EditRootSite')) }],
      },
    ],
  },
  {
    path: '/admin_oauth_applications',
    lazy: lazyRoute(() => import('./OAuthApplicationAdmin')),
    children: [
      { path: 'new', lazy: lazyRoute(() => import('./OAuthApplicationAdmin/NewOAuthApplication')) },
      {
        path: ':id',
        lazy: lazyRoute(() => import('./OAuthApplicationAdmin/$id/route')),
        children: [
          {
            path: 'edit',
            id: NamedRoute.EditOAuthApplication,
            lazy: lazyRoute(() => import('./OAuthApplicationAdmin/EditOAuthApplication')),
          },
        ],
      },
      { index: true, lazy: lazyRoute(() => import('./OAuthApplicationAdmin/OAuthApplicationsTable')) },
    ],
  },
  { path: '/oauth/authorize', lazy: lazyRoute(() => import('./OAuth/AuthorizationPrompt')) },
  { path: '/oauth/callback', lazy: lazyRoute(() => import('./Authentication/OAuthCallback')) },
  {
    path: '/oauth/authorized_applications',
    lazy: lazyRoute(() => import('./OAuth/AuthorizedApplications')),
    children: [{ path: ':uid', lazy: lazyRoute(() => import('./OAuth/$uid')) }],
  },
];

const commonInConventionRoutes: RouteObject[] = [
  {
    path: '/admin_departments',
    id: NamedRoute.DepartmentAdmin,
    loader: guarded([makeAuthorizationGuard('can_update_departments')], departmentAdminLoader),
    children: [
      {
        path: ':id',
        lazy: lazyRoute(() => import('./DepartmentAdmin/SingleDepartmentRoute')),
        children: [
          { path: 'edit', lazy: lazyRoute(() => import('./DepartmentAdmin/EditDepartment')) },
          { index: true, loader: () => redirect('..') },
        ],
      },
      { path: 'new', lazy: lazyRoute(() => import('./DepartmentAdmin/NewDepartment')) },
      { index: true, lazy: lazyRoute(() => import('./DepartmentAdmin/DepartmentAdminIndex')) },
    ],
  },
  {
    path: '/admin_events',
    lazy: lazyRoute(() => import('./EventAdmin')),
    loader: eventAdminEventsLoader,
    id: NamedRoute.EventAdmin,
    children: [
      {
        loader: guarded([makeAppRootContextGuard(({ convention }) => convention?.site_mode === SiteMode.SingleEvent)]),
        children: [{ path: ':eventId/edit', lazy: lazyRoute(() => import('./EventAdmin/EventAdminEditEvent')) }],
      },
      {
        loader: guarded([makeAppRootContextGuard(({ convention }) => convention?.site_mode !== SiteMode.SingleEvent)]),
        children: [
          { path: 'dropped_events', lazy: lazyRoute(() => import('./EventAdmin/DroppedEventAdmin')) },
          {
            path: ':eventCategoryId',
            children: [
              { path: 'events/new', lazy: lazyRoute(() => import('./EventAdmin/NewEvent')) },
              { path: 'events/:eventId/edit', lazy: lazyRoute(() => import('./EventAdmin/EventAdminEditEvent')) },
              {
                path: '',
                lazy: lazyRoute(() => import('./EventAdmin/CategorySpecificEventAdmin')),
                children: [
                  {
                    path: 'events',
                    lazy: lazyRoute(() => import('./EventAdmin/create')),
                    children: [
                      { index: true, loader: () => redirect('..') },
                      {
                        path: ':eventId',
                        lazy: lazyRoute(() => import('./EventAdmin/$id')),
                        children: [
                          { path: 'admin_notes', lazy: lazyRoute(() => import('./EventAdmin/AdminNotesRoute')) },
                          { path: 'drop', lazy: lazyRoute(() => import('./EventAdmin/drop')) },
                          { path: 'restore', lazy: lazyRoute(() => import('./EventAdmin/RestoreEventRoute')) },
                          {
                            path: 'runs',
                            children: [
                              {
                                path: ':runId',
                                lazy: lazyRoute(() => import('./EventAdmin/SingleRunRoute')),
                                children: [{ path: 'edit', lazy: lazyRoute(() => import('./EventAdmin/EditRun')) }],
                              },
                              {
                                path: 'create_multiple',
                                lazy: lazyRoute(() => import('./EventAdmin/CreateMultipleRunsRoute')),
                              },
                              { path: 'new', lazy: lazyRoute(() => import('./EventAdmin/NewRun')) },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { index: true, loader: eventAdminRootRedirect },
    ],
  },
  {
    path: '/admin_forms',
    id: NamedRoute.AdminForms,
    lazy: lazyRoute(() => import('./FormAdmin')),
    children: [
      {
        path: ':id/edit_advanced',
        id: NamedRoute.FormJSONEditor,
        lazy: lazyRoute(() => import('./FormAdmin/FormJSONEditor')),
      },
      { path: ':id', lazy: lazyRoute(() => import('./FormAdmin/$id/route')) },
      { index: true, id: NamedRoute.FormAdminIndex, lazy: lazyRoute(() => import('./FormAdmin/FormAdminIndex')) },
    ],
  },
  {
    path: '/admin_notifications',
    loader: guarded([makeAuthorizationGuard('can_update_notification_templates')]),
    children: [
      {
        path: ':eventKey',
        lazy: lazyRoute(() => import('./NotificationAdmin/NotificationConfiguration')),
      },
      {
        path: ':eventKey/preview',
        lazy: lazyRoute(() => import('./NotificationAdmin/preview')),
      },
      { index: true, lazy: lazyRoute(() => import('./NotificationAdmin/NotificationAdminIndex')) },
    ],
  },
  {
    path: '/admin_store',
    lazy: lazyRoute(() => import('./Store/StoreAdmin')),
    children: [
      {
        path: 'products',
        lazy: lazyRoute(() => import('./Store/ProductAdmin')),
        children: [{ path: ':id', lazy: lazyRoute(() => import('./Store/ProductAdmin/$id')) }],
      },
      {
        path: 'coupons',
        lazy: lazyRoute(() => import('./Store/CouponAdmin/CouponAdminTable')),
        children: [
          { path: ':id', lazy: lazyRoute(() => import('./Store/CouponAdmin/EditCouponModal')) },
          { path: 'new', lazy: lazyRoute(() => import('./Store/CouponAdmin/NewCouponModal')) },
        ],
      },
      {
        path: 'orders',
        lazy: lazyRoute(() => import('./Store/OrderAdmin')),
        children: [
          {
            path: ':id',
            lazy: lazyRoute(() => import('./Store/OrderAdmin/$id')),
            children: [
              { path: 'cancel', lazy: lazyRoute(() => import('./Store/OrderAdmin/cancel')) },
              { path: 'mark_paid', lazy: lazyRoute(() => import('./Store/OrderAdmin/mark_paid')) },
              {
                path: 'order_entries',
                lazy: lazyRoute(() => import('./Store/OrderAdmin/order_entries/route')),
                children: [
                  {
                    path: ':orderEntryId',
                    lazy: lazyRoute(() => import('./Store/OrderAdmin/order_entries/$orderEntryId')),
                  },
                ],
              },
              {
                path: 'coupon_applications',
                lazy: lazyRoute(() => import('./Store/OrderAdmin/coupon_applications/route')),
                children: [
                  {
                    path: ':couponApplicationId',
                    lazy: lazyRoute(() => import('./Store/OrderAdmin/coupon_applications/$couponApplicationId')),
                  },
                ],
              },
            ],
          },
          { path: 'new', lazy: lazyRoute(() => import('./Store/OrderAdmin/new')) },
        ],
      },
      { path: 'order_summary', lazy: lazyRoute(() => import('./Store/OrderSummary')) },
      { index: true, loader: () => redirect('./products') },
    ],
  },
  {
    path: '/cart',
    lazy: lazyRoute(() => import('./Store/Cart')),
    children: [
      { path: 'order_entries/:id', lazy: lazyRoute(() => import('./Store/Cart/order_entries/$id')) },
      {
        path: 'coupon_applications',
        lazy: lazyRoute(() => import('./Store/Cart/coupon_applications/route')),
        children: [{ path: ':id', lazy: lazyRoute(() => import('./Store/Cart/coupon_applications/$id')) }],
      },
    ],
  },
  { path: '/clickwrap_agreement', lazy: lazyRoute(() => import('./ClickwrapAgreement')) },
  { path: '/convention/edit', lazy: lazyRoute(() => import('./ConventionAdmin')) },
  { path: '/events', children: eventsRoutes },
  {
    path: '/mailing_lists',
    loader: guarded([makeAuthorizationGuard('can_read_any_mailing_list')]),
    children: [
      { path: 'ticketed_attendees', lazy: lazyRoute(() => import('./MailingLists/TicketedAttendees')) },
      { path: 'event_proposers', lazy: lazyRoute(() => import('./MailingLists/EventProposers')) },
      { path: 'team_members', lazy: lazyRoute(() => import('./MailingLists/TeamMembers')) },
      { path: 'users_with_pending_bio', lazy: lazyRoute(() => import('./MailingLists/UsersWithPendingBio')) },
      { path: 'waitlists', lazy: lazyRoute(() => import('./MailingLists/WaitlistMailingLists')) },
      { path: 'whos_free', lazy: lazyRoute(() => import('./MailingLists/WhosFree')) },
      { index: true, lazy: lazyRoute(() => import('./MailingLists')) },
    ],
  },
  {
    path: '/my_profile',
    loader: guarded([loginRequiredGuard]),
    children: [
      { path: 'edit_bio', loader: () => replace('./edit') },
      { path: 'edit', lazy: lazyRoute(() => import('./MyProfile/MyProfileForm')) },
      { path: 'setup', lazy: lazyRoute(() => import('./MyProfile/MyProfileForm')) },
      { index: true, lazy: lazyRoute(() => import('./MyProfile/MyProfileDisplay')) },
    ],
  },
  { path: '/order_history', lazy: lazyRoute(() => import('./Store/OrderHistory')) },
  { path: '/products/:id', lazy: lazyRoute(() => import('./Store/ProductPage')) },
  {
    path: '/reports',
    loader: guarded([makeAuthorizationGuard('can_read_reports')]),
    children: [
      { path: 'new_and_returning_attendees', lazy: lazyRoute(() => import('./Reports/NewAndReturningAttendees')) },
      { path: 'attendance_by_payment_amount', lazy: lazyRoute(() => import('./Reports/AttendanceByPaymentAmount')) },
      { path: 'event_provided_tickets', lazy: lazyRoute(() => import('./Reports/EventProvidedTickets')) },
      { path: 'events_by_choice', lazy: lazyRoute(() => import('./Reports/EventsByChoice')) },
      { path: 'signup_spy', lazy: lazyRoute(() => import('./Reports/SignupSpy')) },
      { index: true, lazy: lazyRoute(() => import('./Reports')) },
    ],
  },
  {
    path: '/rooms',
    lazy: lazyRoute(() => import('./RoomsAdmin')),
    children: [{ path: ':id', lazy: lazyRoute(() => import('./RoomsAdmin/$id/route')) }],
  },
  {
    loader: guarded([makeAppRootContextGuard(({ convention }) => convention?.signup_mode === SignupMode.Moderated)]),
    children: [
      {
        path: '/signup_moderation',
        lazy: lazyRoute(() => import('./SignupModeration')),
        children: [
          {
            loader: guarded([
              makeAppRootContextGuard(
                ({ convention }) => convention?.signup_automation_mode === SignupAutomationMode.RankedChoice,
              ),
            ]),
            children: [
              {
                path: 'ranked_choice_queue',
                lazy: lazyRoute(() => import('./SignupModeration/RankedChoiceQueue')),
                children: [
                  {
                    path: ':userConProfileId',
                    lazy: lazyRoute(() => import('./SignupModeration/UserRankedChoiceQueue')),
                  },
                ],
              },
            ],
          },
          {
            path: 'signup_requests',
            children: [
              {
                path: ':id',
                children: [
                  { path: 'accept', lazy: lazyRoute(() => import('./SignupModeration/signup_requests/$id/accept')) },
                  { path: 'reject', lazy: lazyRoute(() => import('./SignupModeration/signup_requests/$id/reject')) },
                ],
              },
            ],
          },
          {
            path: 'signup_rounds',
            children: [
              {
                path: ':id',
                children: [
                  { path: 'rerun', lazy: lazyRoute(() => import('./SignupModeration/signup_rounds/$id/rerun')) },
                ],
              },
            ],
          },
          { path: 'queue', lazy: lazyRoute(() => import('./SignupModeration/SignupModerationQueue')) },
          { path: 'create_signups', lazy: lazyRoute(() => import('./SignupModeration/CreateSignup')) },
          { index: true, loader: () => redirect('./queue') },
        ],
      },
    ],
  },
  {
    path: '/signup_rounds',
    lazy: lazyRoute(() => import('./SignupRoundsAdmin')),
    children: [
      {
        path: ':id',
        lazy: lazyRoute(() => import('./SignupRoundsAdmin/$id')),
        children: [
          { path: 'results', lazy: lazyRoute(() => import('./SignupRoundsAdmin/RankedChoiceSignupDecisionsPage')) },
        ],
      },
      { index: true, lazy: lazyRoute(() => import('./SignupRoundsAdmin/SignupRoundsAdminPage')) },
    ],
  },
  {
    path: '/staff_positions',
    lazy: lazyRoute(() => import('./StaffPositionAdmin')),
    children: [
      { path: 'new', lazy: lazyRoute(() => import('./StaffPositionAdmin/NewStaffPosition')) },
      {
        path: ':id',
        lazy: lazyRoute(() => import('./StaffPositionAdmin/$id/route')),
        children: [
          {
            path: 'edit',
            id: NamedRoute.EditStaffPosition,
            lazy: lazyRoute(() => import('./StaffPositionAdmin/EditStaffPosition')),
          },
          {
            path: 'edit_permissions',
            id: NamedRoute.EditStaffPositionPermissions,
            lazy: lazyRoute(() => import('./StaffPositionAdmin/EditStaffPositionPermissions')),
          },
        ],
      },
      { index: true, lazy: lazyRoute(() => import('./StaffPositionAdmin/StaffPositionsTable')) },
    ],
  },
  {
    path: '/ticket',
    children: [
      { path: 'new', lazy: lazyRoute(() => import('./MyTicket/TicketPurchasePage')) },
      { index: true, lazy: lazyRoute(() => import('./MyTicket/MyTicketDisplay')) },
    ],
  },
  {
    loader: guarded([
      makeAppRootContextGuard(({ convention }) => convention?.ticket_mode === TicketMode.RequiredForSignup),
    ]),
    children: [
      {
        path: '/ticket_types',
        loader: guarded([makeAuthorizationGuard('can_manage_ticket_types')]),
        children: [
          {
            path: 'new',
            loader: adminTicketTypesLoader,
            lazy: lazyRoute(() => import('./TicketTypeAdmin/NewTicketType')),
          },
          {
            path: ':id',
            lazy: lazyRoute(() => import('./TicketTypeAdmin/$id')),
            children: [
              {
                path: 'edit',
                loader: adminSingleTicketTypeLoader,
                lazy: lazyRoute(() => import('./TicketTypeAdmin/EditTicketType')),
              },
            ],
          },
          {
            index: true,
            loader: adminTicketTypesLoader,
            lazy: lazyRoute(() => import('./TicketTypeAdmin/TicketTypesList')),
          },
        ],
      },
    ],
  },
  {
    path: '/user_activity_alerts',
    id: NamedRoute.UserActivityAlerts,
    lazy: lazyRoute(() => import('./UserActivityAlerts/UserActivityAlertsAdmin')),
    children: [
      { path: 'new', lazy: lazyRoute(() => import('./UserActivityAlerts/NewUserActivityAlert')) },
      {
        path: ':id/edit',
        id: NamedRoute.EditUserActivityAlert,
        lazy: lazyRoute(() => import('./UserActivityAlerts/EditUserActivityAlert')),
      },
      { index: true, lazy: lazyRoute(() => import('./UserActivityAlerts/UserActivityAlertsList')) },
    ],
  },
  {
    path: '/user_con_profiles',
    loader: guarded([makeAuthorizationGuard('can_read_user_con_profiles')]),
    children: [
      {
        path: ':id',
        id: NamedRoute.AdminUserConProfile,
        lazy: lazyRoute(() => import('./UserConProfiles/userConProfileLoader')),
        children: [
          {
            path: 'admin_ticket',
            children: [
              { path: 'new', lazy: lazyRoute(() => import('./UserConProfiles/NewTicket')) },
              { path: 'edit', lazy: lazyRoute(() => import('./UserConProfiles/EditTicket')) },
            ],
          },
          { path: 'edit', lazy: lazyRoute(() => import('./UserConProfiles/EditUserConProfile')) },
          { index: true, lazy: lazyRoute(() => import('./UserConProfiles/UserConProfileAdminDisplay')) },
        ],
      },
      {
        path: '',
        lazy: lazyRoute(() => import('./UserConProfiles/AttendeesPage')),
        children: [{ path: 'new', lazy: lazyRoute(() => import('./UserConProfiles/AddAttendeeModal')) }],
      },
    ],
  },
];

const conventionModeRoutes: RouteObject[] = [
  {
    path: '/admin_event_proposals',
    lazy: lazyRoute(() => import('./EventProposals/EventProposalsAdmin')),
    children: [
      {
        path: ':id',
        id: NamedRoute.AdminEventProposal,
        loader: eventProposalWithOwnerLoader,
        children: [
          {
            path: 'history',
            id: NamedRoute.EventProposalHistory,
            lazy: lazyRoute(() => import('./EventProposals/EventProposalHistory')),
            children: [
              {
                path: ':changeGroupId',
                id: NamedRoute.EventProposalHistoryChangeGroup,
                lazy: lazyRoute(() => import('./EventProposals/EventProposalHistory')),
              },
            ],
          },
          {
            path: 'edit',
            id: NamedRoute.AdminEditEventProposal,
            lazy: lazyRoute(() => import('./EventProposals/AdminEditEventProposal')),
          },
          {
            index: true,
            id: NamedRoute.EventProposalAdminDisplay,
            lazy: lazyRoute(() => import('./EventProposals/EventProposalAdminDisplay')),
          },
        ],
      },
      { index: true, lazy: lazyRoute(() => import('./EventProposals/EventProposalsAdminTable')) },
    ],
  },
  {
    loader: guarded([makeAuthorizationGuard('can_update_event_categories')]),
    children: [
      {
        path: '/event_categories',
        lazy: lazyRoute(() => import('./EventCategoryAdmin')),
        id: NamedRoute.EventCategoryAdmin,
        loader: eventCategoryAdminLoader,
        children: [
          {
            path: 'new',
            id: NamedRoute.NewEventCategory,
            lazy: lazyRoute(() => import('./EventCategoryAdmin/NewEventCategory')),
          },
          {
            path: ':id',
            lazy: lazyRoute(() => import('./EventCategoryAdmin/$id')),
            children: [
              {
                path: 'edit',
                id: NamedRoute.EditEventCategory,
                lazy: lazyRoute(() => import('./EventCategoryAdmin/EditEventCategory')),
              },
            ],
          },
          {
            index: true,
            id: NamedRoute.EventCategoryIndex,
            lazy: lazyRoute(() => import('./EventCategoryAdmin/EventCategoryIndex')),
          },
        ],
      },
    ],
  },
  {
    path: '/event_proposals',
    children: [
      {
        path: ':id',
        lazy: lazyRoute(() => import('./EventProposals/$id/route')),
        children: [
          { path: 'admin_notes', lazy: lazyRoute(() => import('./EventProposals/$id/admin_notes')) },
          { path: 'edit', lazy: lazyRoute(() => import('./EventProposals/EditEventProposal')) },
          { path: 'transition', lazy: lazyRoute(() => import('./EventProposals/$id/transition')) },
        ],
      },
      {
        index: true,
        loader: () => replace('/pages/new-proposal'),
        lazy: lazyRoute(() => import('./EventProposals/route')),
      },
    ],
  },
];

const singleEventModeRoutes: RouteObject[] = [];

const rootSiteRoutes: RouteObject[] = [
  { path: '/users/sign_in', lazy: lazyRoute(() => import('./Authentication/DeviseSignInPage')) },
  { path: '/users/sign_up', lazy: lazyRoute(() => import('./Authentication/DeviseSignUpPage')) },
  { path: '/users/password/new', lazy: lazyRoute(() => import('./Authentication/DeviseForgotPasswordPage')) },
  { path: '/users/edit', lazy: lazyRoute(() => import('./Authentication/EditUser')) },
  { path: '/users/password/edit', lazy: lazyRoute(() => import('./Authentication/ResetPassword')) },
  {
    path: '/conventions',
    id: NamedRoute.RootSiteConventionsAdmin,
    lazy: lazyRoute(() => import('./RootSiteConventionsAdmin')),
    children: [
      {
        path: ':id',
        id: NamedRoute.RootSiteConventionDisplay,
        lazy: lazyRoute(() => import('./RootSiteConventionsAdmin/ConventionDisplay')),
        children: [{ path: 'clone', lazy: lazyRoute(() => import('./RootSiteConventionsAdmin/clone')) }],
      },
      {
        path: '',
        id: NamedRoute.RootSiteConventionsAdminTable,
        lazy: lazyRoute(() => import('./RootSiteConventionsAdmin/RootSiteConventionsAdminTable')),
        children: [{ path: 'new', lazy: lazyRoute(() => import('./RootSiteConventionsAdmin/new')) }],
      },
    ],
  },
  {
    path: '/email_routes',
    lazy: lazyRoute(() => import('./RootSiteEmailRoutesAdmin')),
    children: [
      { path: ':id', lazy: lazyRoute(() => import('./RootSiteEmailRoutesAdmin/EditEmailRouteModal')) },
      { path: 'new', lazy: lazyRoute(() => import('./RootSiteEmailRoutesAdmin/NewEmailRouteModal')) },
    ],
  },
  {
    path: '/organizations',
    id: NamedRoute.OrganizationAdmin,
    loader: organizationsLoader,
    lazy: lazyRoute(() => import('./OrganizationAdmin')),
    children: [
      {
        path: ':id',
        loader: singleOrganizationLoader,
        id: NamedRoute.Organization,
        children: [
          {
            path: 'roles',
            children: [
              {
                path: 'new',
                id: NamedRoute.NewOrganizationRole,
                lazy: lazyRoute(() => import('./OrganizationAdmin/NewOrganizationRole')),
              },
              {
                path: ':organizationRoleId',
                lazy: lazyRoute(() => import('./OrganizationAdmin/$id/roles/$organizationRoleId/route')),
                children: [
                  {
                    path: 'edit',
                    id: NamedRoute.EditOrganizationRole,
                    lazy: lazyRoute(() => import('./OrganizationAdmin/EditOrganizationRole')),
                  },
                ],
              },
            ],
          },
          {
            index: true,
            id: NamedRoute.OrganizationDisplay,
            lazy: lazyRoute(() => import('./OrganizationAdmin/OrganizationDisplay')),
          },
        ],
      },
      { index: true, lazy: lazyRoute(() => import('./OrganizationAdmin/OrganizationIndex')) },
    ],
  },
  {
    loader: guarded([makeAuthorizationGuard('can_read_users')]),
    children: [
      {
        path: '/users',
        lazy: lazyRoute(() => import('./Users/UsersAdmin')),
        id: NamedRoute.UserAdmin,
        children: [
          { path: ':id', id: NamedRoute.UserAdminDisplay, lazy: lazyRoute(() => import('./Users/UserAdminDisplay')) },
          {
            lazy: lazyRoute(() => import('./Users/UsersTable')),
            children: [
              { path: 'merge/:ids', lazy: lazyRoute(() => import('./Users/MergeUsersModal')) },
              { index: true, id: NamedRoute.UsersTable },
            ],
          },
        ],
      },
    ],
  },
];

export const appLayoutRoutes: RouteObject[] = [
  {
    element: <NonCMSPageWrapper />,
    children: [
      {
        loader: guarded([
          makeAppRootContextGuard(
            ({ convention }) => convention?.name != null && convention?.site_mode !== SiteMode.SingleEvent,
          ),
        ]),
        children: conventionModeRoutes,
      },
      {
        loader: guarded([
          makeAppRootContextGuard(
            ({ convention }) => convention?.name != null && convention?.site_mode === SiteMode.SingleEvent,
          ),
        ]),
        children: singleEventModeRoutes,
      },
      {
        loader: guarded([makeAppRootContextGuard(({ convention }) => convention?.name != null)]),
        children: commonInConventionRoutes,
      },
      {
        loader: guarded([makeAppRootContextGuard(({ convention }) => convention?.name == null)]),
        children: rootSiteRoutes,
      },
      ...commonRoutes,
    ],
  },
  ...cmsPageRoutes,
  { path: '*', element: <FourOhFourPage /> },
];

export const appRootRoutes: RouteObject[] = [
  {
    lazy: lazyRoute(() => import('./AppRoot')),
    middleware: [appRootMiddleware],
    children: [
      {
        path: '/admin_forms/:id/edit',
        lazy: lazyRoute(() => import('./FormAdmin/FormEditor')),
        children: [
          {
            path: 'section',
            lazy: lazyRoute(() => import('./FormAdmin/$id/edit/section/route')),
            children: [
              {
                path: ':sectionId',
                children: [
                  {
                    path: 'move',
                    lazy: lazyRoute(() => import('./FormAdmin/$id/edit/section/$sectionId/move')),
                  },
                  {
                    path: 'item',
                    lazy: lazyRoute(() => import('./FormAdmin/$id/edit/section/$sectionId/item/route')),
                    children: [
                      {
                        path: ':itemId',
                        children: [
                          {
                            path: 'move',
                            lazy: lazyRoute(() => import('./FormAdmin/$id/edit/section/$sectionId/item/$itemId/move')),
                          },
                          {
                            index: true,
                            lazy: lazyRoute(() => import('./FormAdmin/$id/edit/section/$sectionId/item/$itemId/route')),
                          },
                        ],
                      },
                    ],
                  },
                  { index: true, lazy: lazyRoute(() => import('./FormAdmin/$id/edit/section/$sectionId/route')) },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '/liquid_docs',
        id: NamedRoute.LiquidDocs,
        loader: liquidDocsLoader,
        children: [
          { path: 'assigns/:name', lazy: lazyRoute(() => import('./LiquidDocs/AssignDoc')) },
          { path: 'filters/:name', lazy: lazyRoute(() => import('./LiquidDocs/FilterDoc')) },
          { path: 'tags/:name', lazy: lazyRoute(() => import('./LiquidDocs/LiquidTagDoc')) },
          { index: true, lazy: lazyRoute(() => import('./LiquidDocs')) },
        ],
      },
      {
        lazy: lazyRoute(() => import('./AppRootLayout')),
        children: [{ ErrorBoundary: RouteErrorBoundary, children: appLayoutRoutes }],
      },
    ],
  },
];
