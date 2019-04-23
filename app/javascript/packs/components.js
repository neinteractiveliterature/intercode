/* eslint-disable import/first, import/newline-after-import */

import { lazy } from 'react';
import { mapValues } from 'lodash';

import AppWrapper from '../AppWrapper';
const Cart = lazy(() => import(/* webpackChunkName: "cart" */ '../Store/Cart'));
const CmsAdmin = lazy(() => import(/* webpackChunkName: "cms-admin" */ '../CmsAdmin'));
const ConventionAdmin = lazy(() => import(/* webpackChunkName: "convention-admin" */ '../ConventionAdmin'));
const EmailList = lazy(() => import(/* webpackChunkName: "email-list" */ '../UIComponents/EmailList'));
const EventAdmin = lazy(() => import(/* webpackChunkName: "event-admin" */ '../EventAdmin'));
const EventCategoryAdmin = lazy(() => import(/* webpackChunkName: "event-category-admin" */ '../EventCategoryAdmin'));
const EventProposalForm = lazy(() => import(/* webpackChunkName: "event-proposal-form" */ '../EventProposals/EventProposalForm'));
const EventProposalsAdmin = lazy(() => import(/* webpackChunkName: "event-proposals-admin" */ '../EventProposals/EventProposalsAdmin'));
const EventsApp = lazy(() => import(/* webpackChunkName: "events-app" */ '../EventsApp'));
const FormAdmin = lazy(() => import(/* webpackChunkName: "form-admin" */ '../FormAdmin'));
const LiquidDocs = lazy(() => import(/* webpackChunkName: "liquid-docs" */ '../LiquidDocs'));
import LiquidHTMLEditor from '../StandaloneFormControls/LiquidHTMLEditor';
const MyProfile = lazy(() => import(/* webpackChunkName: "my-profile" */ '../MyProfile'));
// import NavigationBar from '../NavigationBar';
import OAuthPermissionsPrompt from '../OAuthPermissionsPrompt';
const OrderHistory = lazy(() => import(/* webpackChunkName: "order-history" */ '../Store/OrderHistory'));
const OrganizationAdmin = lazy(() => import(/* webpackChunkName: "organization-admin" */ '../OrganizationAdmin'));
import PageAdminDropdown from '../UIComponents/PageAdminDropdown';
const ProductOrderForm = lazy(() => import(/* webpackChunkName: "product-order-form" */ '../Store/ProductOrderForm'));
import ProposeEventButton from '../EventProposals/ProposeEventButton';
const RoomsAdmin = lazy(() => import(/* webpackChunkName: "rooms-admin" */ '../RoomsAdmin'));
const RootSiteAdmin = lazy(() => import(/* webpackChunkName: "root-site-admin" */ '../RootSiteAdmin'));
const SignupSpyTable = lazy(() => import(/* webpackChunkName: "signup-spy-table" */ '../Reports/SignupSpyTable'));
const StaffPositionAdmin = lazy(() => import(/* webpackChunkName: "staff-position-admin" */ '../StaffPositionAdmin'));
const StoreAdmin = lazy(() => import(/* webpackChunkName: "store-admin" */ '../Store/StoreAdmin'));
const TicketTypeAdmin = lazy(() => import(/* webpackChunkName: "ticket-type-admin" */ '../TicketTypeAdmin'));
import TicketPurchaseForm from '../BuiltInForms/TicketPurchaseForm';
const UserActivityAlertsAdmin = lazy(() => import(/* webpackChunkName: "user-activity-alerts-admin" */ '../UserActivityAlerts/UserActivityAlertsAdmin'));
const UserConProfilesAdmin = lazy(() => import(/* webpackChunkName: "user-con-profiles-admin" */ '../UserConProfiles/UserConProfilesAdmin'));
const UsersAdmin = lazy(() => import(/* webpackChunkName: "users-admin" */ '../Users/UsersAdmin'));
const WhosFreeForm = lazy(() => import(/* webpackChunkName: "whos-free-form" */ '../BuiltInForms/WhosFreeForm'));
import WithdrawMySignupButton from '../EventsApp/EventPage/WithdrawMySignupButton';

const unwrappedComponents = {
  Cart,
  CmsAdmin,
  ConventionAdmin,
  EmailList,
  EventAdmin,
  EventCategoryAdmin,
  EventsApp,
  EventProposalForm,
  EventProposalsAdmin,
  FormAdmin,
  LiquidDocs,
  LiquidHTMLEditor,
  MyProfile,
  // NavigationBar,
  OAuthPermissionsPrompt,
  OrderHistory,
  OrganizationAdmin,
  PageAdminDropdown,
  ProductOrderForm,
  ProposeEventButton,
  RoomsAdmin,
  RootSiteAdmin,
  SignupSpyTable,
  StaffPositionAdmin,
  StoreAdmin,
  TicketTypeAdmin,
  TicketPurchaseForm,
  UserActivityAlertsAdmin,
  UserConProfilesAdmin,
  UsersAdmin,
  WhosFreeForm,
  WithdrawMySignupButton,
};

const wrappedComponents = mapValues(unwrappedComponents, AppWrapper);

export default wrappedComponents;
export { unwrappedComponents };
