import { lazyWithBundleHashCheck } from './checkBundleHash';
import parsePageContent, { DEFAULT_COMPONENT_MAP, ComponentMap } from './parsePageContent';
import CookieConsent from './UIComponents/CookieConsent';

const AddToCalendarDropdown = lazyWithBundleHashCheck(
  () =>
    import(/* webpackChunkName: "my-profile" */ './EventsApp/SignupAdmin/AddToCalendarDropdown'),
);
const EventAdminMenu = lazyWithBundleHashCheck(
  () => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/EventAdminMenu'),
);
const LongFormEventDetails = lazyWithBundleHashCheck(
  () => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/LongFormEventDetails'),
);
const MapboxMap = lazyWithBundleHashCheck(
  () => import(/* webpackChunkName: "mapbox-map" */ './Maps/MapboxMap'),
);
const MaximumEventSignupsPreview = lazyWithBundleHashCheck(
  () =>
    import(
      /* webpackChunkName: 'scheduled-value-preview' */ './ConventionAdmin/MaximumEventSignupsPreview'
    ),
);
const ProposeEventButton = lazyWithBundleHashCheck(
  () =>
    import(/* webpackChunkName: 'propose-event-button' */ './EventProposals/ProposeEventButton'),
);
const RunsSection = lazyWithBundleHashCheck(
  () => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/RunsSection'),
);
const ShortFormEventDetails = lazyWithBundleHashCheck(
  () => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/ShortFormEventDetails'),
);
const WithdrawMySignupButton = lazyWithBundleHashCheck(
  () =>
    import(
      /* webpackChunkName: 'withdraw-my-signup-button' */ './EventsApp/EventPage/WithdrawMySignupButton'
    ),
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

export default function parseCmsContent(
  content: string,
  componentMap = CMS_COMPONENT_MAP,
): ReturnType<typeof parsePageContent> {
  return parsePageContent(content, componentMap);
}
