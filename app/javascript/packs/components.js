import { mapValues } from 'lodash';

import AppWrapper from '../AppWrapper';
import Cart from '../Store/Cart';
import CmsVariablesAdmin from '../CmsVariablesAdmin';
import ConventionAdmin from '../ConventionAdmin';
import EditUserConProfile from '../UserConProfiles/EditUserConProfile';
import EmailList from '../UIComponents/EmailList';
import EventAdmin from '../EventAdmin';
import EventProposalDisplay from '../EventProposals/EventProposalDisplay';
import EventProposalForm from '../EventProposals/EventProposalForm';
import EventProposalsAdmin from '../EventProposals/EventProposalsAdmin';
import EventsApp from '../EventsApp';
import FormJSONEditor from '../FormJSONEditor';
import LiquidDocs from '../LiquidDocs';
import LiquidHTMLEditor from '../StandaloneFormControls/LiquidHTMLEditor';
import MyProfileForm from '../UserConProfiles/MyProfileForm';
// import NavigationBar from '../NavigationBar';
import NavigationItemsAdmin from '../NavigationItemsAdmin';
import OrderHistory from '../Store/OrderHistory';
import PageAdminDropdown from '../UIComponents/PageAdminDropdown';
import ProductOrderForm from '../Store/ProductOrderForm';
import ProposeEventButton from '../EventProposals/ProposeEventButton';
import RoomsAdmin from '../RoomsAdmin';
import SignupSpyTable from '../Reports/SignupSpyTable';
import StaffPositionAdmin from '../StaffPositionAdmin';
import StoreAdmin from '../Store/StoreAdmin';
import TicketTypeAdmin from '../TicketTypeAdmin';
import TicketPurchaseForm from '../BuiltInForms/TicketPurchaseForm';
import UserActivityAlertsAdmin from '../UserActivityAlerts/UserActivityAlertsAdmin';
import UserConProfileAdminDisplay from '../UserConProfiles/UserConProfileAdminDisplay';
import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';
import UserConProfilesAdmin from '../UserConProfiles/UserConProfilesAdmin';
import WhosFreeForm from '../BuiltInForms/WhosFreeForm';

const unwrappedComponents = {
  Cart,
  CmsVariablesAdmin,
  ConventionAdmin,
  EditUserConProfile,
  EmailList,
  EventAdmin,
  EventsApp,
  EventProposalDisplay,
  EventProposalForm,
  EventProposalsAdmin,
  FormJSONEditor,
  LiquidDocs,
  LiquidHTMLEditor,
  MyProfileForm,
  // NavigationBar,
  NavigationItemsAdmin,
  OrderHistory,
  PageAdminDropdown,
  ProductOrderForm,
  ProposeEventButton,
  RoomsAdmin,
  SignupSpyTable,
  StaffPositionAdmin,
  StoreAdmin,
  TicketTypeAdmin,
  TicketPurchaseForm,
  UserActivityAlertsAdmin,
  UserConProfileAdminDisplay,
  UserConProfileSignupsCard,
  UserConProfilesAdmin,
  WhosFreeForm,
};

const wrappedComponents = mapValues(unwrappedComponents, AppWrapper);

export default wrappedComponents;
export { unwrappedComponents };
