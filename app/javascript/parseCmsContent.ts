import { lazyWithAppEntrypointHeadersCheck } from './checkAppEntrypointHeadersMatch';
import { DEFAULT_COMPONENT_MAP, ComponentMap, parseContent, ParseContentFunction } from './parsePageContent';
import CookieConsent from './UIComponents/CookieConsent';

const AddToCalendarDropdown = lazyWithAppEntrypointHeadersCheck(
  () => import('./EventsApp/SignupAdmin/AddToCalendarDropdown'),
);
const EventAdminMenu = lazyWithAppEntrypointHeadersCheck(() => import('./EventsApp/EventPage/EventAdminMenu'));
const LongFormEventDetails = lazyWithAppEntrypointHeadersCheck(
  () => import('./EventsApp/EventPage/LongFormEventDetails'),
);
const MapboxMap = lazyWithAppEntrypointHeadersCheck(() => import('./Maps/MapboxMap'));
const MaximumEventSignupsPreview = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: 'scheduled-value-preview' */ './SignupRoundsAdmin/MaximumEventSignupsPreview'),
);
const ProposeEventButton = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: 'propose-event-button' */ './EventProposals/ProposeEventButton'),
);
const RunsSection = lazyWithAppEntrypointHeadersCheck(() => import('./EventsApp/EventPage/RunsSection'));
const ShortFormEventDetails = lazyWithAppEntrypointHeadersCheck(
  () => import('./EventsApp/EventPage/ShortFormEventDetails'),
);
const WithdrawMySignupButton = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: 'withdraw-my-signup-button' */ './EventsApp/EventPage/WithdrawMySignupButton'),
);

export const CMS_COMPONENT_MAP: ComponentMap = {
  ...DEFAULT_COMPONENT_MAP,
  AddToCalendarDropdown,
  CookieConsent,
  EventAdminMenu,
  LongFormEventDetails,
  MapboxMap,
  ProposeEventButton,
  RunsSection,
  MaximumEventSignupsPreview,
  ShortFormEventDetails,
  WithdrawMySignupButton,
};

export const parseCmsContent: ParseContentFunction = (content, componentMap = CMS_COMPONENT_MAP) =>
  parseContent(content, componentMap);
