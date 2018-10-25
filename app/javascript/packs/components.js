import Cart from '../Store/Cart';
import ConventionAdmin from '../ConventionAdmin';
import EditUserConProfile from '../UserConProfiles/EditUserConProfile';
import EventAdmin from '../EventAdmin';
import EventList from '../EventList';
import EventProposalDisplay from '../EventProposals/EventProposalDisplay';
import EventProposalForm from '../EventProposals/EventProposalForm';
import EventProposalsAdmin from '../EventProposals/EventProposalsAdmin';
import FormJSONEditor from '../FormJSONEditor';
import LiquidHTMLEditor from '../StandaloneFormControls/LiquidHTMLEditor';
import MyProfileForm from '../UserConProfiles/MyProfileForm';
// import NavigationBar from '../NavigationBar';
import NavigationItemsAdmin from '../NavigationItemsAdmin';
import OrderHistory from '../Store/OrderHistory';
import PageAdminDropdown from '../UIComponents/PageAdminDropdown';
import ProductOrderForm from '../Store/ProductOrderForm';
import ProposeEventButton from '../EventProposals/ProposeEventButton';
import RoomsAdmin from '../RoomsAdmin';
import RunSignupSummary from '../SignupAdmin/RunSignupSummary';
import ScheduleGrid from '../ScheduleGrid';
import SignupAdmin from '../SignupAdmin';
import SignupSpyTable from '../Reports/SignupSpyTable';
import StaffPositionAdmin from '../StaffPositionAdmin';
import StoreAdmin from '../Store/StoreAdmin';
import StandaloneEditEvent from '../StandaloneEditEvent';
import AppWrapper from '../AppWrapper';
import TeamMemberForm from '../BuiltInForms/TeamMemberForm';
import TicketTypeAdmin from '../TicketTypeAdmin';
import TicketPurchaseForm from '../BuiltInForms/TicketPurchaseForm';
import UserActivityAlertsAdmin from '../UserActivityAlerts/UserActivityAlertsAdmin';
import UserConProfileAdminDisplay from '../UserConProfiles/UserConProfileAdminDisplay';
import UserConProfileSignupsCard from '../SignupAdmin/UserConProfileSignupsCard';
import UserConProfilesAdmin from '../UserConProfiles/UserConProfilesAdmin';
import WhosFreeForm from '../BuiltInForms/WhosFreeForm';

const components = {
  Cart: AppWrapper(Cart),
  ConventionAdmin: AppWrapper(ConventionAdmin),
  EditUserConProfile: AppWrapper(EditUserConProfile),
  EventAdmin: AppWrapper(EventAdmin),
  EventList: AppWrapper(EventList),
  EventProposalDisplay: AppWrapper(EventProposalDisplay),
  EventProposalForm: AppWrapper(EventProposalForm),
  EventProposalsAdmin: AppWrapper(EventProposalsAdmin),
  FormJSONEditor: AppWrapper(FormJSONEditor),
  LiquidHTMLEditor,
  MyProfileForm: AppWrapper(MyProfileForm),
  // NavigationBar: AppWrapper(NavigationBar),
  NavigationItemsAdmin: AppWrapper(NavigationItemsAdmin),
  OrderHistory: AppWrapper(OrderHistory),
  PageAdminDropdown: AppWrapper(PageAdminDropdown),
  ProductOrderForm: AppWrapper(ProductOrderForm),
  ProposeEventButton: AppWrapper(ProposeEventButton),
  RoomsAdmin: AppWrapper(RoomsAdmin),
  RunSignupSummary: AppWrapper(RunSignupSummary),
  ScheduleGrid: AppWrapper(ScheduleGrid),
  SignupAdmin: AppWrapper(SignupAdmin),
  SignupSpyTable: AppWrapper(SignupSpyTable),
  StaffPositionAdmin: AppWrapper(StaffPositionAdmin),
  StandaloneEditEvent: AppWrapper(StandaloneEditEvent),
  StoreAdmin: AppWrapper(StoreAdmin),
  TeamMemberForm: AppWrapper(TeamMemberForm),
  TicketTypeAdmin: AppWrapper(TicketTypeAdmin),
  TicketPurchaseForm: AppWrapper(TicketPurchaseForm),
  UserActivityAlertsAdmin: AppWrapper(UserActivityAlertsAdmin),
  UserConProfileAdminDisplay: AppWrapper(UserConProfileAdminDisplay),
  UserConProfileSignupsCard: AppWrapper(UserConProfileSignupsCard),
  UserConProfilesAdmin: AppWrapper(UserConProfilesAdmin),
  WhosFreeForm: AppWrapper(WhosFreeForm),
};

export default components;
