import { lazyWithBundleHashCheck } from './checkBundleHash';
import parsePageContent, { DEFAULT_COMPONENT_MAP } from './parsePageContent';

const EventAdminMenu = lazyWithBundleHashCheck(() => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/EventAdminMenu'));
const LongFormEventDetails = lazyWithBundleHashCheck(() => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/LongFormEventDetails'));
const ProposeEventButton = lazyWithBundleHashCheck(() => import(/* webpackChunkName: 'propose-event-button' */ './EventProposals/ProposeEventButton'));
const RunsSection = lazyWithBundleHashCheck(() => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/RunsSection'));
const ShortFormEventDetails = lazyWithBundleHashCheck(() => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/ShortFormEventDetails'));
const WithdrawMySignupButton = lazyWithBundleHashCheck(() => import(/* webpackChunkName: 'withdraw-my-signup-button' */ './EventsApp/EventPage/WithdrawMySignupButton'));

export const CMS_COMPONENT_MAP = {
  ...DEFAULT_COMPONENT_MAP,
  EventAdminMenu,
  LongFormEventDetails,
  ProposeEventButton,
  RunsSection,
  ShortFormEventDetails,
  WithdrawMySignupButton,
};

export default function parseCmsContent(content, componentMap = CMS_COMPONENT_MAP) {
  return parsePageContent(content, componentMap);
}
