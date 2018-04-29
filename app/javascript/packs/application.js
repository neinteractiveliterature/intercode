/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import 'babel-polyfill';
import 'custom-event-polyfill';

import ClipboardJS from 'clipboard';
import Rails from 'rails-ujs';
import 'bootstrap.native/dist/bootstrap-native-v4';

import 'codemirror';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/mode/multiplex';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';

import WebpackerReact from 'webpacker-react';

import '../styles/application.scss';
import '../inflections';
import '../Codemirror/LiquidMultiplexModes';

import Cart from '../Store/Cart';
import ConventionAdmin from '../ConventionAdmin';
import DatagridFilters from '../Datagrid/DatagridFilters';
import EditSignup from '../SignupAdmin/EditSignup';
import EditUserConProfile from '../UserConProfiles/EditUserConProfile';
import EventAdmin from '../EventAdmin';
import EventProposalForm from '../EventProposals/EventProposalForm';
import EventListSortDropdown from '../UIComponents/EventListSortDropdown';
import FormJSONEditor from '../FormJSONEditor';
import LiquidHTMLEditor from '../StandaloneFormControls/LiquidHTMLEditor';
import MyProfileForm from '../UserConProfiles/MyProfileForm';
import NavigationItemsAdmin from '../NavigationItemsAdmin';
import OrderHistory from '../Store/OrderHistory';
import PageAdminDropdown from '../UIComponents/PageAdminDropdown';
import ProductOrderForm from '../Store/ProductOrderForm';
import RoomsAdmin from '../RoomsAdmin';
import ScheduleGrid from '../ScheduleGrid';
import StaffPositionAdmin from '../StaffPositionAdmin';
import StoreAdmin from '../Store/StoreAdmin';
import StandaloneEditEvent from '../StandaloneEditEvent';
import StandaloneGraphQLComponent from '../StandaloneGraphQLComponent';
import TeamMemberForm from '../BuiltInForms/TeamMemberForm';
import TicketTypeAdmin from '../TicketTypeAdmin';
import TicketPurchaseForm from '../BuiltInForms/TicketPurchaseForm';
import WhosFreeForm from '../BuiltInForms/WhosFreeForm';

WebpackerReact.setup({
  Cart: StandaloneGraphQLComponent(Cart),
  ConventionAdmin: StandaloneGraphQLComponent(ConventionAdmin),
  DatagridFilters,
  EditSignup: StandaloneGraphQLComponent(EditSignup),
  EditUserConProfile: StandaloneGraphQLComponent(EditUserConProfile),
  EventAdmin,
  EventProposalForm: StandaloneGraphQLComponent(EventProposalForm),
  EventListSortDropdown,
  FormJSONEditor: StandaloneGraphQLComponent(FormJSONEditor),
  LiquidHTMLEditor,
  MyProfileForm: StandaloneGraphQLComponent(MyProfileForm),
  NavigationItemsAdmin: StandaloneGraphQLComponent(NavigationItemsAdmin),
  OrderHistory: StandaloneGraphQLComponent(OrderHistory),
  PageAdminDropdown: StandaloneGraphQLComponent(PageAdminDropdown),
  ProductOrderForm: StandaloneGraphQLComponent(ProductOrderForm),
  RoomsAdmin: StandaloneGraphQLComponent(RoomsAdmin),
  ScheduleGrid: StandaloneGraphQLComponent(ScheduleGrid),
  StaffPositionAdmin: StandaloneGraphQLComponent(StaffPositionAdmin),
  StandaloneEditEvent: StandaloneGraphQLComponent(StandaloneEditEvent),
  StoreAdmin: StandaloneGraphQLComponent(StoreAdmin),
  TeamMemberForm: StandaloneGraphQLComponent(TeamMemberForm),
  TicketTypeAdmin: StandaloneGraphQLComponent(TicketTypeAdmin),
  TicketPurchaseForm: StandaloneGraphQLComponent(TicketPurchaseForm),
  WhosFreeForm: StandaloneGraphQLComponent(WhosFreeForm),
});

Rails.start();

// eslint-disable-next-line no-new
new ClipboardJS('[data-clipboard-target], [data-clipboard-text]');
