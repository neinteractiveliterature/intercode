/* eslint-disable import/first, import/newline-after-import */

import { lazy } from 'react';
import mapValues from 'lodash-es/mapValues';

import AppRoot from '../AppRoot';
import AppWrapper from '../AppWrapper';
const Cart = lazy(() => import(/* webpackChunkName: "cart" */ '../Store/Cart'));
const CmsAdmin = lazy(() => import(/* webpackChunkName: "cms-admin" */ '../CmsAdmin'));
const ConventionAdmin = lazy(() => import(/* webpackChunkName: "convention-admin" */ '../ConventionAdmin'));
const EditUser = lazy(() => import(/* webpackChunkName: "authentication-forms" */ '../Authentication/EditUser'));
const EmailList = lazy(() => import(/* webpackChunkName: "email-list" */ '../UIComponents/EmailList'));
const EventAdmin = lazy(() => import(/* webpackChunkName: "event-admin" */ '../EventAdmin'));
const EventCategoryAdmin = lazy(() => import(/* webpackChunkName: "event-category-admin" */ '../EventCategoryAdmin'));
const EventProposalForm = lazy(() => import(/* webpackChunkName: "event-proposal-form" */ '../EventProposals/EventProposalForm'));
const EventProposalsAdmin = lazy(() => import(/* webpackChunkName: "event-proposals-admin" */ '../EventProposals/EventProposalsAdmin'));
const EventsApp = lazy(() => import(/* webpackChunkName: "events-app" */ '../EventsApp'));
const FormAdmin = lazy(() => import(/* webpackChunkName: "form-admin" */ '../FormAdmin'));
const LiquidDocs = lazy(() => import(/* webpackChunkName: "liquid-docs" */ '../LiquidDocs'));
const MailingLists = lazy(() => import(/* webpackChunkName: "mailing-lists" */ '../MailingLists'));
const MyProfile = lazy(() => import(/* webpackChunkName: "my-profile" */ '../MyProfile'));
const MyTicket = lazy(() => import(/* webpackChunkName: 'my-ticket' */ '../MyTicket'));
const OAuthPermissionsPrompt = lazy(() => import(/* webpackChunkName: 'oauth-permissions-prompt' */ '../OAuthPermissionsPrompt'));
const OrderHistory = lazy(() => import(/* webpackChunkName: "order-history" */ '../Store/OrderHistory'));
const OrganizationAdmin = lazy(() => import(/* webpackChunkName: "organization-admin" */ '../OrganizationAdmin'));
const ProductOrderForm = lazy(() => import(/* webpackChunkName: "product-order-form" */ '../Store/ProductOrderForm'));
const Reports = lazy(() => import(/* webpackChunkName: "reports" */ '../Reports'));
const ResetPassword = lazy(() => import(/* webpackChunkName: "authentication-forms" */ '../Authentication/ResetPassword'));
const RoomsAdmin = lazy(() => import(/* webpackChunkName: "rooms-admin" */ '../RoomsAdmin'));
const RootSiteAdmin = lazy(() => import(/* webpackChunkName: "root-site-admin" */ '../RootSiteAdmin'));
import SignInButton from '../Authentication/SignInButton';
import SignOutButton from '../Authentication/SignOutButton';
import SignUpButton from '../Authentication/SignUpButton';
const SignupSpyTable = lazy(() => import(/* webpackChunkName: "signup-spy-table" */ '../Reports/SignupSpyTable'));
const StaffPositionAdmin = lazy(() => import(/* webpackChunkName: "staff-position-admin" */ '../StaffPositionAdmin'));
const StoreAdmin = lazy(() => import(/* webpackChunkName: "store-admin" */ '../Store/StoreAdmin'));
const TicketTypeAdmin = lazy(() => import(/* webpackChunkName: "ticket-type-admin" */ '../TicketTypeAdmin'));
const UserActivityAlertsAdmin = lazy(() => import(/* webpackChunkName: "user-activity-alerts-admin" */ '../UserActivityAlerts/UserActivityAlertsAdmin'));
const UserConProfilesAdmin = lazy(() => import(/* webpackChunkName: "user-con-profiles-admin" */ '../UserConProfiles/UserConProfilesAdmin'));
const UsersAdmin = lazy(() => import(/* webpackChunkName: "users-admin" */ '../Users/UsersAdmin'));

const unwrappedComponents = {
  AppRoot,
  Cart,
  CmsAdmin,
  ConventionAdmin,
  EditUser,
  EmailList,
  EventAdmin,
  EventCategoryAdmin,
  EventsApp,
  EventProposalForm,
  EventProposalsAdmin,
  FormAdmin,
  LiquidDocs,
  MailingLists,
  MyProfile,
  MyTicket,
  OAuthPermissionsPrompt,
  OrderHistory,
  OrganizationAdmin,
  ProductOrderForm,
  Reports,
  ResetPassword,
  RoomsAdmin,
  RootSiteAdmin,
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignupSpyTable,
  StaffPositionAdmin,
  StoreAdmin,
  TicketTypeAdmin,
  UserActivityAlertsAdmin,
  UserConProfilesAdmin,
  UsersAdmin,
};

const wrappedComponents = mapValues(unwrappedComponents, AppWrapper);

export default wrappedComponents;
export { unwrappedComponents };
