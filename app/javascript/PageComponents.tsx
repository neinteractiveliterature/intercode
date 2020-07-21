import React from 'react';
import mapValues from 'lodash/mapValues';

import ClickwrapAgreement from './ClickwrapAgreement';
import CmsPage from './CmsPage';
import { lazyWithBundleHashCheck } from './checkBundleHash';

function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function NonCMSPageWrapper(WrappedComponent: React.ComponentType): React.FunctionComponent {
  const wrapper = (props: any) => (
    <div className="non-cms-page">
      <WrappedComponent {...props} />
    </div>
  );
  wrapper.displayName = `NonCMSPageWrapper(${getDisplayName(WrappedComponent)})`;
  return wrapper;
}

const UnwrappedNonCMSPageComponents = {
  AuthorizedApplications: () => import(/* webpackChunkName: "authorized-applications" */ './OAuth/AuthorizedApplications'),
  Cart: () => import(/* webpackChunkName: "store" */ './Store/Cart'),
  CmsAdmin: () => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin'),
  ConventionAdmin: () => import(/* webpackChunkName: "convention-admin" */ './ConventionAdmin'),
  DepartmentAdmin: () => import(/* webpackChunkName: "department-admin" */ './DepartmentAdmin'),
  EditUser: () => import(/* webpackChunkName: "authentication-forms" */ './Authentication/EditUser'),
  EventAdmin: () => import(/* webpackChunkName: "event-admin" */ './EventAdmin'),
  EventCategoryAdmin: () => import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin'),
  EventProposalsAdmin: () => import(/* webpackChunkName: "event-proposals-admin" */ './EventProposals/EventProposalsAdmin'),
  EventsApp: () => import(/* webpackChunkName: "events-app" */ './EventsApp'),
  EditEventProposal: () => import(/* webpackChunkName: "edit-event-proposal" */ './EventProposals/EditEventProposal'),
  FormAdmin: () => import(/* webpackChunkName: "form-admin" */ './FormAdmin'),
  FormEditor: () => import(/* webpackChunkName: "form-editor" */ './FormAdmin/FormEditor'),
  MailingLists: () => import(/* webpackChunkName: "mailing-lists" */ './MailingLists'),
  MyProfile: () => import(/* webpackChunkName: "my-profile" */ './MyProfile'),
  MyTicket: () => import(/* webpackChunkName: 'my-ticket' */ './MyTicket'),
  NotificationAdmin: () => import(/* webpackChunkName: 'notification-admin' */ './NotificationAdmin'),
  OAuthApplications: () => import(/* webpackChunkName: "oauth-applications" */ './OAuthApplications'),
  OAuthAuthorizationPrompt: () => import(/* webpackChunkName: "oauth-authorization-prompt" */ './OAuth/AuthorizationPrompt'),
  OrderHistory: () => import(/* webpackChunkName: "store" */ './Store/OrderHistory'),
  OrganizationAdmin: () => import(/* webpackChunkName: "organization-admin" */ './OrganizationAdmin'),
  ProductPage: () => import(/* webpackChunkName: "store" */ './Store/ProductPage'),
  Reports: () => import(/* webpackChunkName: "reports" */ './Reports'),
  ResetPassword: () => import(/* webpackChunkName: "authentication-forms" */ './Authentication/ResetPassword'),
  RoomsAdmin: () => import(/* webpackChunkName: "rooms-admin" */ './RoomsAdmin'),
  RootSiteConventionsAdmin: () => import(/* webpackChunkName: "root-site-conventions-admin" */ './RootSiteConventionsAdmin'),
  RootSiteEmailRoutesAdmin: () => import(/* webpackChunkName: "root-site-email-routes-admin" */ './RootSiteEmailRoutesAdmin'),
  SignupModeration: () => import(/* webpackChunkName: "signup-moderation" */ './SignupModeration'),
  StaffPositionAdmin: () => import(/* webpackChunkName: "staff-position-admin" */ './StaffPositionAdmin'),
  StoreAdmin: () => import(/* webpackChunkName: "store-admin" */ './Store/StoreAdmin'),
  TicketTypeAdmin: () => import(/* webpackChunkName: "ticket-type-admin" */ './TicketTypeAdmin'),
  UserActivityAlertsAdmin: () => import(/* webpackChunkName: "user-activity-alerts-admin" */ './UserActivityAlerts/UserActivityAlertsAdmin'),
  UserConProfilesAdmin: () => import(/* webpackChunkName: "user-con-profiles-admin" */ './UserConProfiles/UserConProfilesAdmin'),
  UsersAdmin: () => import(/* webpackChunkName: "users-admin" */ './Users/UsersAdmin'),
};

const NonCMSPageComponents = {
  ...mapValues(
    UnwrappedNonCMSPageComponents,
    (component) => NonCMSPageWrapper(lazyWithBundleHashCheck(component)),
  ),
  WrappedClickwrapAgreement: NonCMSPageWrapper(ClickwrapAgreement),
};

const PageComponents = {
  ...NonCMSPageComponents,
  CmsPage,
};

export default PageComponents;
