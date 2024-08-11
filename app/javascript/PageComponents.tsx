import * as React from 'react';

import ClickwrapAgreement from './ClickwrapAgreement';
import CmsPage from './CmsPage';
import { lazyWithAppEntrypointHeadersCheck } from './checkAppEntrypointHeadersMatch';

const UnwrappedNonCMSPageComponents = {
  AuthorizedApplications: () =>
    import(/* webpackChunkName: "authorized-applications" */ './OAuth/AuthorizedApplications'),
  Cart: () => import(/* webpackChunkName: "store" */ './Store/Cart'),
  CmsAdmin: () => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin'),
  CmsContentGroupsAdminTable: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsContentGroupsAdmin/CmsContentGroupsAdminTable'),
  CmsFilesAdmin: () => import(/* webpackChunkName: "cms-files-admin" */ './CmsAdmin/CmsFilesAdmin'),
  CmsVariablesAdmin: () => import(/* webpackChunkName: "cms-variables-admin" */ './CmsAdmin/CmsVariablesAdmin'),
  ConventionAdmin: () => import(/* webpackChunkName: "convention-admin" */ './ConventionAdmin'),
  ConventionDisplay: () =>
    import(/* webpackChunkName: "root-site-conventions-admin" */ './RootSiteConventionsAdmin/ConventionDisplay'),
  EditCmsContentGroup: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsContentGroupsAdmin/EditCmsContentGroup'),
  EditEventCategory: () =>
    import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin/EditEventCategory'),
  EditOrganizationRole: () =>
    import(/* webpackChunkName: "organization-admin" */ './OrganizationAdmin/EditOrganizationRole'),
  EditUser: () => import(/* webpackChunkName: "authentication-forms" */ './Authentication/EditUser'),
  EventCategoryAdmin: () => import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin'),
  EventCategoryIndex: () =>
    import(/* webpackChunkName: "event-category-admin" */ './EventCategoryAdmin/EventCategoryIndex'),
  EventProposalsAdmin: () =>
    import(/* webpackChunkName: "event-proposals-admin" */ './EventProposals/EventProposalsAdmin'),
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
  NewCmsContentGroup: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsContentGroupsAdmin/NewCmsContentGroup'),
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
  ViewCmsContentGroup: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsContentGroupsAdmin/ViewCmsContentGroup'),

  CmsGraphqlQueriesAdminTable: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsGraphqlQueriesAdmin/CmsGraphqlQueriesAdminTable'),
  EditCmsGraphqlQuery: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsGraphqlQueriesAdmin/EditCmsGraphqlQuery'),
  NewCmsGraphqlQuery: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsGraphqlQueriesAdmin/NewCmsGraphqlQuery'),
  ViewCmsGraphqlQuerySource: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsGraphqlQueriesAdmin/ViewCmsGraphqlQuerySource'),

  CmsLayoutsAdminTable: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsLayoutsAdmin/CmsLayoutsAdminTable'),
  EditCmsLayout: () => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsLayoutsAdmin/EditCmsLayout'),
  NewCmsLayout: () => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsLayoutsAdmin/NewCmsLayout'),
  ViewCmsLayoutSource: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsLayoutsAdmin/ViewCmsLayoutSource'),

  CmsPagesAdminTable: () => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsPagesAdmin/CmsPagesAdminTable'),
  EditCmsPage: () => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsPagesAdmin/EditCmsPage'),
  NewCmsPage: () => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsPagesAdmin/NewCmsPage'),
  ViewCmsPageSource: () => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsPagesAdmin/ViewCmsPageSource'),

  CmsPartialsAdminTable: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsPartialsAdmin/CmsPartialsAdminTable'),
  EditCmsPartial: () => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsPartialsAdmin/EditCmsPartial'),
  NewCmsPartial: () => import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsPartialsAdmin/NewCmsPartial'),
  ViewCmsPartialSource: () =>
    import(/* webpackChunkName: "cms-admin" */ './CmsAdmin/CmsPartialsAdmin/ViewCmsPartialSource'),

  DepartmentAdminIndex: () =>
    import(/* webpackChunkName: "department-admin" */ './DepartmentAdmin/DepartmentAdminIndex'),
  EditDepartment: () => import(/* webpackChunkName: "department-admin" */ './DepartmentAdmin/EditDepartment'),
  NewDepartment: () => import(/* webpackChunkName: "department-admin" */ './DepartmentAdmin/NewDepartment'),
};

const NonCMSPageComponents: Record<keyof typeof UnwrappedNonCMSPageComponents, React.ComponentType> = {
  ...(Object.fromEntries(
    Object.entries(UnwrappedNonCMSPageComponents).map(([name, component]) => [
      name,
      lazyWithAppEntrypointHeadersCheck(component),
    ]),
  ) as Record<keyof typeof UnwrappedNonCMSPageComponents, React.LazyExoticComponent<React.ComponentType>>),
};

const PageComponents = {
  ...NonCMSPageComponents,
  ClickwrapAgreement,
  CmsPage,
};

export default PageComponents;
