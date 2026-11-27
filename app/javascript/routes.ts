import { index, layout, route, type RouteConfig } from '@react-router/dev/routes';
import { NamedRoute } from './NamedRoute';
import cmsAdminRoutes from './CmsAdmin/routes';
import eventsRoutes from './EventsApp/routes';
import liquidDocsRoutes from './LiquidDocs/routes';
import signupModerationRoutes from './SignupModeration/routes';

// The app's route tree. Files under framework/routes/wrappers add a loader, middleware, element or error boundary to the
// module they mount, or stand in for a route that has no module of its own.
export default [
  route('framework-check', 'framework/routes/framework-check.tsx'),
  layout('framework/routes/wrappers/layout.ts', [
    route('/admin_forms/:id/edit', 'FormAdmin/FormEditor.tsx', [
      route('section', 'FormAdmin/$id/edit/section/route.ts', [
        route(':sectionId', 'framework/routes/wrappers/admin_forms_id_edit__section___sectionId.ts', [
          route('move', 'FormAdmin/$id/edit/section/$sectionId/move.ts'),
          route('item', 'FormAdmin/$id/edit/section/$sectionId/item/route.ts', [
            route(':itemId', 'framework/routes/wrappers/admin_forms_id_edit__section___sectionId__item___itemId.ts', [
              route('move', 'FormAdmin/$id/edit/section/$sectionId/item/$itemId/move.ts'),
              index('FormAdmin/$id/edit/section/$sectionId/item/$itemId/route.tsx'),
            ]),
          ]),
          index('FormAdmin/$id/edit/section/$sectionId/route.tsx'),
        ]),
      ]),
    ]),
    liquidDocsRoutes,
    layout('AppRootLayout.tsx', [
      layout('framework/routes/wrappers/layout-2.ts', [
        layout('framework/routes/wrappers/layout-3.ts', [
          layout('framework/routes/wrappers/layout-4.ts', [
            route('/admin_event_proposals', 'EventProposals/EventProposalsAdmin.tsx', [
              route(
                ':id',
                'framework/routes/wrappers/admin_event_proposals___id.ts',
                { id: NamedRoute.AdminEventProposal },
                [
                  route('history', 'EventProposals/EventProposalHistory.tsx', { id: NamedRoute.EventProposalHistory }, [
                    route(':changeGroupId', 'EventProposals/EventProposalHistory.tsx', {
                      id: NamedRoute.EventProposalHistoryChangeGroup,
                    }),
                  ]),
                  route('edit', 'EventProposals/AdminEditEventProposal.tsx', { id: NamedRoute.AdminEditEventProposal }),
                  index('EventProposals/EventProposalAdminDisplay.tsx', { id: NamedRoute.EventProposalAdminDisplay }),
                ],
              ),
              index('EventProposals/EventProposalsAdminTable.tsx'),
            ]),
            layout('framework/routes/wrappers/layout-5.ts', [
              route(
                '/event_categories',
                'framework/routes/wrappers/event_categories.ts',
                { id: NamedRoute.EventCategoryAdmin },
                [
                  route('new', 'EventCategoryAdmin/NewEventCategory.tsx', { id: NamedRoute.NewEventCategory }),
                  route(':id', 'EventCategoryAdmin/$id.ts', [
                    route('edit', 'EventCategoryAdmin/EditEventCategory.tsx', { id: NamedRoute.EditEventCategory }),
                  ]),
                  index('EventCategoryAdmin/EventCategoryIndex.tsx', { id: NamedRoute.EventCategoryIndex }),
                ],
              ),
            ]),
            route('/event_proposals', 'framework/routes/wrappers/event_proposals.ts', [
              route(':id', 'EventProposals/$id/route.ts', [
                route('admin_notes', 'EventProposals/$id/admin_notes.ts'),
                route('edit', 'EventProposals/EditEventProposal.tsx'),
                route('transition', 'EventProposals/$id/transition.ts'),
              ]),
              index('framework/routes/wrappers/event_proposals__index.ts'),
            ]),
          ]),
          layout('framework/routes/wrappers/layout-6.ts'),
          layout('framework/routes/wrappers/layout-7.ts', [
            route(
              '/admin_departments',
              'framework/routes/wrappers/admin_departments.ts',
              { id: NamedRoute.DepartmentAdmin },
              [
                route(':id', 'DepartmentAdmin/SingleDepartmentRoute.ts', [
                  route('edit', 'DepartmentAdmin/EditDepartment.tsx'),
                  index('framework/routes/wrappers/admin_departments___id__index.ts'),
                ]),
                route('new', 'DepartmentAdmin/NewDepartment.tsx'),
                index('DepartmentAdmin/DepartmentAdminIndex.tsx'),
              ],
            ),
            route('/admin_events', 'framework/routes/wrappers/admin_events.ts', { id: NamedRoute.EventAdmin }, [
              layout('framework/routes/wrappers/admin_events__layout.ts', [
                route(':eventId/edit', 'EventAdmin/EventAdminEditEvent.tsx'),
              ]),
              layout('framework/routes/wrappers/admin_events__layout-2.ts', [
                route('dropped_events', 'EventAdmin/DroppedEventAdmin.tsx'),
                route(':eventCategoryId', 'framework/routes/wrappers/admin_events___eventCategoryId.ts', [
                  route('events/new', 'EventAdmin/NewEvent.tsx'),
                  route('events/:eventId/edit', 'EventAdmin/EventAdminEditEvent.tsx', {
                    id: 'EventAdmin/EventAdminEditEvent#2',
                  }),
                  route('', 'EventAdmin/CategorySpecificEventAdmin.tsx', [
                    route('events', 'EventAdmin/create.ts', [
                      index('framework/routes/wrappers/admin_events___eventCategoryId____events__index.ts'),
                      route(':eventId', 'EventAdmin/$id.ts', [
                        route('admin_notes', 'EventAdmin/AdminNotesRoute.ts'),
                        route('drop', 'EventAdmin/drop.ts'),
                        route('restore', 'EventAdmin/RestoreEventRoute.ts'),
                        route(
                          'runs',
                          'framework/routes/wrappers/admin_events___eventCategoryId____events___eventId__runs.ts',
                          [
                            route(':runId', 'EventAdmin/SingleRunRoute.ts', [route('edit', 'EventAdmin/EditRun.tsx')]),
                            route('create_multiple', 'EventAdmin/CreateMultipleRunsRoute.ts'),
                            route('new', 'EventAdmin/NewRun.tsx'),
                          ],
                        ),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
              index('framework/routes/wrappers/admin_events__index.ts'),
            ]),
            route('/admin_forms', 'FormAdmin/index.tsx', { id: NamedRoute.AdminForms }, [
              route(':id/edit_advanced', 'FormAdmin/FormJSONEditor.tsx', { id: NamedRoute.FormJSONEditor }),
              route(':id', 'FormAdmin/$id/route.ts'),
              index('FormAdmin/FormAdminIndex.tsx', { id: NamedRoute.FormAdminIndex }),
            ]),
            route('/admin_notifications', 'framework/routes/wrappers/admin_notifications.ts', [
              route(':eventKey', 'NotificationAdmin/NotificationConfiguration.tsx'),
              route(':eventKey/preview', 'NotificationAdmin/preview.ts'),
              index('NotificationAdmin/NotificationAdminIndex.tsx'),
            ]),
            route('/admin_store', 'Store/StoreAdmin.tsx', [
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
              index('framework/routes/wrappers/admin_store__index.ts'),
            ]),
            route('/cart', 'Store/Cart/index.tsx', [
              route('order_entries/:id', 'Store/Cart/order_entries/$id.ts'),
              route('coupon_applications', 'Store/Cart/coupon_applications/route.ts', [
                route(':id', 'Store/Cart/coupon_applications/$id.ts'),
              ]),
            ]),
            route('/clickwrap_agreement', 'ClickwrapAgreement/index.tsx'),
            route('/convention/edit', 'ConventionAdmin/index.tsx'),
            eventsRoutes,
            route('/mailing_lists', 'framework/routes/wrappers/mailing_lists.ts', [
              route('ticketed_attendees', 'MailingLists/TicketedAttendees.tsx'),
              route('event_proposers', 'MailingLists/EventProposers.tsx'),
              route('team_members', 'MailingLists/TeamMembers.tsx'),
              route('users_with_pending_bio', 'MailingLists/UsersWithPendingBio.tsx'),
              route('waitlists', 'MailingLists/WaitlistMailingLists.tsx'),
              route('whos_free', 'MailingLists/WhosFree.tsx'),
              index('MailingLists/index.tsx'),
            ]),
            route('/my_profile', 'framework/routes/wrappers/my_profile.ts', [
              route('edit_bio', 'framework/routes/wrappers/my_profile__edit_bio.ts'),
              route('edit', 'MyProfile/MyProfileForm.tsx'),
              route('setup', 'MyProfile/MyProfileForm.tsx', { id: 'MyProfile/MyProfileForm#2' }),
              index('MyProfile/MyProfileDisplay.tsx'),
            ]),
            route('/order_history', 'Store/OrderHistory.tsx'),
            route('/products/:id', 'Store/ProductPage.tsx'),
            route('/reports', 'framework/routes/wrappers/reports.ts', [
              route('new_and_returning_attendees', 'Reports/NewAndReturningAttendees.tsx'),
              route('attendance_by_payment_amount', 'Reports/AttendanceByPaymentAmount.tsx'),
              route('event_provided_tickets', 'Reports/EventProvidedTickets.tsx'),
              route('events_by_choice', 'Reports/EventsByChoice.tsx'),
              route('signup_spy', 'Reports/SignupSpy.tsx'),
              index('Reports/index.tsx'),
            ]),
            route('/rooms', 'RoomsAdmin/index.tsx', [route(':id', 'RoomsAdmin/$id/route.ts')]),
            signupModerationRoutes,
            route('/signup_rounds', 'SignupRoundsAdmin/index.tsx', [
              route(':id', 'SignupRoundsAdmin/$id.ts', [
                route('results', 'SignupRoundsAdmin/RankedChoiceSignupDecisionsPage.tsx'),
              ]),
              index('SignupRoundsAdmin/SignupRoundsAdminPage.tsx'),
            ]),
            route('/staff_positions', 'StaffPositionAdmin/index.tsx', [
              route('new', 'StaffPositionAdmin/NewStaffPosition.tsx'),
              route(':id', 'StaffPositionAdmin/$id/route.ts', [
                route('edit', 'StaffPositionAdmin/EditStaffPosition.tsx', { id: NamedRoute.EditStaffPosition }),
                route('edit_permissions', 'StaffPositionAdmin/EditStaffPositionPermissions.tsx', {
                  id: NamedRoute.EditStaffPositionPermissions,
                }),
              ]),
              index('StaffPositionAdmin/StaffPositionsTable.tsx'),
            ]),
            route('/ticket', 'framework/routes/wrappers/ticket.ts', [
              route('new', 'MyTicket/TicketPurchasePage.tsx'),
              index('MyTicket/MyTicketDisplay.tsx'),
            ]),
            layout('framework/routes/wrappers/layout-9.ts', [
              route('/ticket_types', 'framework/routes/wrappers/ticket_types.ts', [
                route('new', 'framework/routes/wrappers/ticket_types__new.ts'),
                route(':id', 'TicketTypeAdmin/$id.ts', [
                  route('edit', 'framework/routes/wrappers/ticket_types___id__edit.ts'),
                ]),
                index('framework/routes/wrappers/ticket_types__index.ts'),
              ]),
            ]),
            route(
              '/user_activity_alerts',
              'UserActivityAlerts/UserActivityAlertsAdmin.tsx',
              { id: NamedRoute.UserActivityAlerts },
              [
                route('new', 'UserActivityAlerts/NewUserActivityAlert.tsx'),
                route(':id/edit', 'UserActivityAlerts/EditUserActivityAlert.tsx', {
                  id: NamedRoute.EditUserActivityAlert,
                }),
                index('UserActivityAlerts/UserActivityAlertsList.tsx'),
              ],
            ),
            route('/user_con_profiles', 'framework/routes/wrappers/user_con_profiles.ts', [
              route(':id', 'UserConProfiles/userConProfileLoader.ts', { id: NamedRoute.AdminUserConProfile }, [
                route('admin_ticket', 'framework/routes/wrappers/user_con_profiles___id__admin_ticket.ts', [
                  route('new', 'UserConProfiles/NewTicket.tsx'),
                  route('edit', 'UserConProfiles/EditTicket.tsx'),
                ]),
                route('edit', 'UserConProfiles/EditUserConProfile.tsx'),
                index('UserConProfiles/UserConProfileAdminDisplay.tsx'),
              ]),
              route('', 'UserConProfiles/AttendeesPage.tsx', [route('new', 'UserConProfiles/AddAttendeeModal.tsx')]),
            ]),
          ]),
          layout('framework/routes/wrappers/layout-10.ts', [
            route('/users/sign_in', 'Authentication/DeviseSignInPage.tsx'),
            route('/users/sign_up', 'Authentication/DeviseSignUpPage.tsx'),
            route('/users/password/new', 'Authentication/DeviseForgotPasswordPage.tsx'),
            route('/users/edit', 'Authentication/EditUser.tsx'),
            route('/users/password/edit', 'Authentication/ResetPassword.tsx'),
            route('/conventions', 'RootSiteConventionsAdmin/index.tsx', { id: NamedRoute.RootSiteConventionsAdmin }, [
              route(
                ':id',
                'RootSiteConventionsAdmin/ConventionDisplay.tsx',
                { id: NamedRoute.RootSiteConventionDisplay },
                [route('clone', 'RootSiteConventionsAdmin/clone.tsx')],
              ),
              route(
                '',
                'RootSiteConventionsAdmin/RootSiteConventionsAdminTable.tsx',
                { id: NamedRoute.RootSiteConventionsAdminTable },
                [route('new', 'RootSiteConventionsAdmin/new.tsx')],
              ),
            ]),
            route('/email_routes', 'RootSiteEmailRoutesAdmin/index.tsx', [
              route(':id', 'RootSiteEmailRoutesAdmin/EditEmailRouteModal.tsx'),
              route('new', 'RootSiteEmailRoutesAdmin/NewEmailRouteModal.tsx'),
            ]),
            route(
              '/organizations',
              'framework/routes/wrappers/organizations.ts',
              { id: NamedRoute.OrganizationAdmin },
              [
                route(':id', 'framework/routes/wrappers/organizations___id.ts', { id: NamedRoute.Organization }, [
                  route('roles', 'framework/routes/wrappers/organizations___id__roles.ts', [
                    route('new', 'OrganizationAdmin/NewOrganizationRole.tsx', { id: NamedRoute.NewOrganizationRole }),
                    route(':organizationRoleId', 'OrganizationAdmin/$id/roles/$organizationRoleId/route.ts', [
                      route('edit', 'OrganizationAdmin/EditOrganizationRole.tsx', {
                        id: NamedRoute.EditOrganizationRole,
                      }),
                    ]),
                  ]),
                  index('OrganizationAdmin/OrganizationDisplay.tsx', { id: NamedRoute.OrganizationDisplay }),
                ]),
                index('OrganizationAdmin/OrganizationIndex.tsx'),
              ],
            ),
            layout('framework/routes/wrappers/layout-11.ts', [
              route('/users', 'Users/UsersAdmin.tsx', { id: NamedRoute.UserAdmin }, [
                route(':id', 'Users/UserAdminDisplay.tsx', { id: NamedRoute.UserAdminDisplay }),
                layout('Users/UsersTable.tsx', [
                  route('merge/:ids', 'Users/MergeUsersModal.tsx'),
                  index('framework/routes/wrappers/users__index.ts', { id: NamedRoute.UsersTable }),
                ]),
              ]),
            ]),
          ]),
          cmsAdminRoutes,
          route('/admin_oauth_applications', 'OAuthApplicationAdmin/index.tsx', [
            route('new', 'OAuthApplicationAdmin/NewOAuthApplication.tsx'),
            route(':id', 'OAuthApplicationAdmin/$id/route.ts', [
              route('edit', 'OAuthApplicationAdmin/EditOAuthApplication.tsx', { id: NamedRoute.EditOAuthApplication }),
            ]),
            index('OAuthApplicationAdmin/OAuthApplicationsTable.tsx'),
          ]),
          route('/oauth/authorize', 'OAuth/AuthorizationPrompt.tsx'),
          route('/oauth/callback', 'Authentication/OAuthCallback.tsx'),
          route('/oauth/authorized_applications', 'OAuth/AuthorizedApplications.tsx', [route(':uid', 'OAuth/$uid.ts')]),
        ]),
        route('/pages/*', 'CmsPage/index.tsx'),
        index('CmsPage/index.tsx', { id: 'CmsPage/index#2' }),
        route('*', 'framework/routes/wrappers/route.ts'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
