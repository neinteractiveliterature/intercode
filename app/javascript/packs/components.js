/* eslint-disable import/first, import/newline-after-import */

import { lazy } from 'react';
import mapValues from 'lodash-es/mapValues';

import AppRoot from '../AppRoot';
import AppWrapper from '../AppWrapper';
const Cart = lazy(() => import(/* webpackChunkName: "cart" */ '../Store/Cart'));
const EditUser = lazy(() => import(/* webpackChunkName: "authentication-forms" */ '../Authentication/EditUser'));
const EmailList = lazy(() => import(/* webpackChunkName: "email-list" */ '../UIComponents/EmailList'));
const EventProposalForm = lazy(() => import(/* webpackChunkName: "event-proposal-form" */ '../EventProposals/EventProposalForm'));
const EventsApp = lazy(() => import(/* webpackChunkName: "events-app" */ '../EventsApp'));
const LiquidDocs = lazy(() => import(/* webpackChunkName: "liquid-docs" */ '../LiquidDocs'));
const MyProfile = lazy(() => import(/* webpackChunkName: "my-profile" */ '../MyProfile'));
const MyTicket = lazy(() => import(/* webpackChunkName: 'my-ticket' */ '../MyTicket'));
const OAuthPermissionsPrompt = lazy(() => import(/* webpackChunkName: 'oauth-permissions-prompt' */ '../OAuthPermissionsPrompt'));
const OrderHistory = lazy(() => import(/* webpackChunkName: "order-history" */ '../Store/OrderHistory'));
const OrganizationAdmin = lazy(() => import(/* webpackChunkName: "organization-admin" */ '../OrganizationAdmin'));
const ProductOrderForm = lazy(() => import(/* webpackChunkName: "product-order-form" */ '../Store/ProductOrderForm'));
const ResetPassword = lazy(() => import(/* webpackChunkName: "authentication-forms" */ '../Authentication/ResetPassword'));
const RootSiteAdmin = lazy(() => import(/* webpackChunkName: "root-site-admin" */ '../RootSiteAdmin'));
import SignInButton from '../Authentication/SignInButton';
import SignOutButton from '../Authentication/SignOutButton';
import SignUpButton from '../Authentication/SignUpButton';
const UsersAdmin = lazy(() => import(/* webpackChunkName: "users-admin" */ '../Users/UsersAdmin'));

const unwrappedComponents = {
  AppRoot,
  Cart,
  EditUser,
  EmailList,
  EventsApp,
  EventProposalForm,
  LiquidDocs,
  MyProfile,
  MyTicket,
  OAuthPermissionsPrompt,
  OrderHistory,
  OrganizationAdmin,
  ProductOrderForm,
  ResetPassword,
  RootSiteAdmin,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UsersAdmin,
};

const wrappedComponents = mapValues(unwrappedComponents, AppWrapper);

export default wrappedComponents;
export { unwrappedComponents };
