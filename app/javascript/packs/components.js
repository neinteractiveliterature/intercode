import { mapValues } from 'lodash';

import AppWrapper from '../AppWrapper';
import Cart from '../Store/Cart';
import CmsGraphqlQueriesAdmin from '../CmsGraphqlQueriesAdmin';
import CmsVariablesAdmin from '../CmsVariablesAdmin';
import ConventionAdmin from '../ConventionAdmin';
import EditUserConProfile from '../UserConProfiles/EditUserConProfile';
import EmailList from '../UIComponents/EmailList';
import EventAdmin from '../EventAdmin';
import EventCategoryAdmin from '../EventCategoryAdmin';
import EventProposalDisplay from '../EventProposals/EventProposalDisplay';
import EventProposalForm from '../EventProposals/EventProposalForm';
import EventProposalsAdmin from '../EventProposals/EventProposalsAdmin';
import EventsApp from '../EventsApp';
import FormAdmin from '../FormAdmin';
import LiquidDocs from '../LiquidDocs';
import LiquidHTMLEditor from '../StandaloneFormControls/LiquidHTMLEditor';
import MyProfileForm from '../UserConProfiles/MyProfileForm';
// import NavigationBar from '../NavigationBar';
import NavigationItemsAdmin from '../NavigationItemsAdmin';
import OAuthPermissionsPrompt from '../OAuthPermissionsPrompt';
import OrderHistory from '../Store/OrderHistory';
import OrganizationAdmin from '../OrganizationAdmin';
import PageAdminDropdown from '../UIComponents/PageAdminDropdown';
import ProductOrderForm from '../Store/ProductOrderForm';
import ProposeEventButton from '../EventProposals/ProposeEventButton';
import RoomsAdmin from '../RoomsAdmin';
import RootSiteAdmin from '../RootSiteAdmin';
import SignupSpyTable from '../Reports/SignupSpyTable';
import StaffPositionAdmin from '../StaffPositionAdmin';
import StoreAdmin from '../Store/StoreAdmin';
import TicketTypeAdmin from '../TicketTypeAdmin';
import TicketPurchaseForm from '../BuiltInForms/TicketPurchaseForm';
import UserActivityAlertsAdmin from '../UserActivityAlerts/UserActivityAlertsAdmin';
import UserConProfileAdminDisplay from '../UserConProfiles/UserConProfileAdminDisplay';
import UserConProfileSignupsCard from '../EventsApp/SignupAdmin/UserConProfileSignupsCard';
import UserConProfilesAdmin from '../UserConProfiles/UserConProfilesAdmin';
import UsersAdmin from '../Users/UsersAdmin';
import WhosFreeForm from '../BuiltInForms/WhosFreeForm';
import WithdrawMySignupButton from '../EventsApp/EventPage/WithdrawMySignupButton';

const unwrappedComponents = {
  Cart,
  CmsGraphqlQueriesAdmin,
  CmsVariablesAdmin,
  ConventionAdmin,
  EditUserConProfile,
  EmailList,
  EventAdmin,
  EventCategoryAdmin,
  EventsApp,
  EventProposalDisplay,
  EventProposalForm,
  EventProposalsAdmin,
  FormAdmin,
  LiquidDocs,
  LiquidHTMLEditor,
  MyProfileForm,
  // NavigationBar,
  NavigationItemsAdmin,
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
  UserConProfileAdminDisplay,
  UserConProfileSignupsCard,
  UserConProfilesAdmin,
  UsersAdmin,
  WhosFreeForm,
  WithdrawMySignupButton,
};

const wrappedComponents = mapValues(unwrappedComponents, AppWrapper);

export default wrappedComponents;
export { unwrappedComponents };
