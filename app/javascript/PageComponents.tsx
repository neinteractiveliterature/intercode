import * as React from 'react';

import ClickwrapAgreement from './ClickwrapAgreement';
import CmsPage from './CmsPage';
import { lazyWithAppEntrypointHeadersCheck } from './checkAppEntrypointHeadersMatch';

function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function NonCMSPageWrapper<TProps extends JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<TProps>,
): React.FunctionComponent<TProps> {
  const wrapper = (props: TProps) => (
    <div className="non-cms-page">
      <WrappedComponent {...props} />
    </div>
  );
  wrapper.displayName = `NonCMSPageWrapper(${getDisplayName(WrappedComponent)})`;
  return wrapper;
}

const UnwrappedNonCMSPageComponents = {
  AuthorizedApplications: () =>
    import(/* webpackChunkName: "authorized-applications" */ './OAuth/AuthorizedApplications'),
  Cart: () => import(/* webpackChunkName: "store" */ './Store/Cart'),
  CmsAdmin: () => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin'),
  CmsContentGroupsAdmin: () =>
    import(/* webpackChunkName: "cms-content-groups-admin" */ './CmsAdmin/CmsContentGroupsAdmin'),
  CmsFilesAdmin: () => import(/* webpackChunkName: "cms-files-admin" */ './CmsAdmin/CmsFilesAdmin'),
  CmsGraphqlQueriesAdmin: () =>
    import(/* webpackChunkName: "cms-graphql-queries-admin" */ './CmsAdmin/CmsGraphqlQueriesAdmin'),
  CmsLayoutsAdmin: () => import(/* webpackChunkName: "cms-layouts-admin" */ './CmsAdmin/CmsLayoutsAdmin'),
  CmsPagesAdmin: () => import(/* webpackChunkName: "cms-pages-admin" */ './CmsAdmin/CmsPagesAdmin'),
  CmsPartialsAdmin: () => import(/* webpackChunkName: "cms-partials-admin" */ './CmsAdmin/CmsPartialsAdmin'),
  CmsVariablesAdmin: () => import(/* webpackChunkName: "cms-variables-admin" */ './CmsAdmin/CmsVariablesAdmin'),
  ConventionAdmin: () => import(/* webpackChunkName: "convention-admin" */ './ConventionAdmin'),
  ConventionDisplay: () =>
    import(/* webpackChunkName: "root-site-conventions-admin" */ './RootSiteConventionsAdmin/ConventionDisplay'),
  DepartmentAdmin: () => import(/* webpackChunkName: "department-admin" */ './DepartmentAdmin'),
  EditEventCategory: () =>
    import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin/EditEventCategory'),
  EditOrganizationRole: () =>
    import(/* webpackChunkName: "organization-admin" */ './OrganizationAdmin/EditOrganizationRole'),
  EditUser: () => import(/* webpackChunkName: "authentication-forms" */ './Authentication/EditUser'),
  EventAdmin: () => import(/* webpackChunkName: "event-admin" */ './EventAdmin'),
  EventCategoryAdmin: () => import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin'),
  EventCategoryIndex: () =>
    import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin/EventCategoryIndex'),
  EventProposalsAdmin: () =>
    import(/* webpackChunkName: "event-proposals-admin" */ './EventProposals/EventProposalsAdmin'),
  EventsApp: () => import(/* webpackChunkName: "events-app" */ './EventsApp'),
  EditEventProposal: () => import(/* webpackChunkName: "edit-event-proposal" */ './EventProposals/EditEventProposal'),
  FormAdmin: () => import(/* webpackChunkName: "form-admin" */ './FormAdmin'),
  FormEditor: () => import(/* webpackChunkName: "form-editor" */ './FormAdmin/FormEditor'),
  FormItemEditorLayout: () => import(/* webpackChunkName: "form-editor" */ './FormAdmin/FormItemEditorLayout'),
  FormSectionEditorLayout: () => import(/* webpackChunkName: "form-editor" */ './FormAdmin/FormSectionEditorLayout'),
  MailingLists: () => import(/* webpackChunkName: "mailing-lists" */ './MailingLists'),
  MyProfile: () => import(/* webpackChunkName: "my-profile" */ './MyProfile'),
  MyTicket: () => import(/* webpackChunkName: 'my-ticket' */ './MyTicket'),
  NavigationItemsAdmin: () =>
    import(/* webpackChunkName: "navigation-items-admin" */ './CmsAdmin/NavigationItemsAdmin'),
  NewEventCategory: () =>
    import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin/NewEventCategory'),
  NewOrganizationRole: () =>
    import(/* webpackChunkName: "organization-admin" */ './OrganizationAdmin/NewOrganizationRole'),
  NotificationAdmin: () => import(/* webpackChunkName: 'notification-admin' */ './NotificationAdmin'),
  OAuthApplications: () => import(/* webpackChunkName: "oauth-applications" */ './OAuthApplications'),
  OAuthAuthorizationPrompt: () =>
    import(/* webpackChunkName: "oauth-authorization-prompt" */ './OAuth/AuthorizationPrompt'),
  OrderHistory: () => import(/* webpackChunkName: "store" */ './Store/OrderHistory'),
  OrganizationAdmin: () => import(/* webpackChunkName: "organization-admin" */ './OrganizationAdmin'),
  OrganizationDisplay: () =>
    import(/* webpackChunkName: "organization-admin" */ './OrganizationAdmin/OrganizationDisplay'),
  OrganizationIndex: () => import(/* webpackChunkName: "organization-admin" */ './OrganizationAdmin/OrganizationIndex'),
  ProductPage: () => import(/* webpackChunkName: "store" */ './Store/ProductPage'),
  Reports: () => import(/* webpackChunkName: "reports" */ './Reports'),
  ResetPassword: () => import(/* webpackChunkName: "authentication-forms" */ './Authentication/ResetPassword'),
  RoomsAdmin: () => import(/* webpackChunkName: "rooms-admin" */ './RoomsAdmin'),
  RootSiteAdmin: () => import(/* webpackChunkName: "root-site-admin" */ './RootSiteAdmin'),
  RootSiteConventionsAdmin: () =>
    import(/* webpackChunkName: "root-site-conventions-admin" */ './RootSiteConventionsAdmin'),
  RootSiteConventionsAdminTable: () =>
    import(
      /* webpackChunkName: "root-site-conventions-admin" */ './RootSiteConventionsAdmin/RootSiteConventionsAdminTable'
    ),
  RootSiteEmailRoutesAdmin: () =>
    import(/* webpackChunkName: "root-site-email-routes-admin" */ './RootSiteEmailRoutesAdmin'),
  SignupModeration: () => import(/* webpackChunkName: "signup-moderation" */ './SignupModeration'),
  SignupRoundsAdmin: () => import(/* webpackChunkName: "signup-rounds-admin" */ './SignupRoundsAdmin'),
  StaffPositionAdmin: () => import(/* webpackChunkName: "staff-position-admin" */ './StaffPositionAdmin'),
  StoreAdmin: () => import(/* webpackChunkName: "store-admin" */ './Store/StoreAdmin'),
  TicketTypeAdmin: () => import(/* webpackChunkName: "ticket-type-admin" */ './TicketTypeAdmin'),
  UserActivityAlertsAdmin: () =>
    import(/* webpackChunkName: "user-activity-alerts-admin" */ './UserActivityAlerts/UserActivityAlertsAdmin'),
  UserConProfilesAdmin: () =>
    import(/* webpackChunkName: "user-con-profiles-admin" */ './UserConProfiles/UserConProfilesAdmin'),
  UserAdminDisplay: () => import(/* webpackChunkName: "users-admin" */ './Users/UserAdminDisplay'),
  UsersAdmin: () => import(/* webpackChunkName: "users-admin" */ './Users/UsersAdmin'),
  UsersTable: () => import(/* webpackChunkName: "users-admin" */ './Users/UsersTable'),
};

const NonCMSPageComponents: Record<
  keyof typeof UnwrappedNonCMSPageComponents | 'WrappedClickwrapAgreement',
  React.ComponentType
> = {
  ...(Object.fromEntries(
    Object.entries(UnwrappedNonCMSPageComponents).map(([name, component]) => [
      name,
      NonCMSPageWrapper(lazyWithAppEntrypointHeadersCheck(component)),
    ]),
  ) as Record<keyof typeof UnwrappedNonCMSPageComponents, React.ComponentType>),
  WrappedClickwrapAgreement: NonCMSPageWrapper(ClickwrapAgreement),
};

const PageComponents = {
  ...NonCMSPageComponents,
  CmsPage,
};

export default PageComponents;
