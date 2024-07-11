import { useCallback } from 'react';
import { lazyWithAppEntrypointHeadersCheck } from './checkAppEntrypointHeadersMatch';
import { DEFAULT_COMPONENT_MAP, ComponentMap, useParseContent } from './parsePageContent';
import CookieConsent from './UIComponents/CookieConsent';

const AddToCalendarDropdown = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: "my-profile" */ './EventsApp/SignupAdmin/AddToCalendarDropdown'),
);
const EventAdminMenu = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/EventAdminMenu'),
);
const LongFormEventDetails = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/LongFormEventDetails'),
);
const MapboxMap = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: "mapbox-map" */ './Maps/MapboxMap'),
);
const MaximumEventSignupsPreview = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: 'scheduled-value-preview' */ './SignupRoundsAdmin/MaximumEventSignupsPreview'),
);
const ProposeEventButton = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: 'propose-event-button' */ './EventProposals/ProposeEventButton'),
);
const RunsSection = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/RunsSection'),
);
const ShortFormEventDetails = lazyWithAppEntrypointHeadersCheck(
  () => import(/* webpackChunkName: "events-app" */ './EventsApp/EventPage/ShortFormEventDetails'),
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

export function useParseCmsContent() {
  const parseContent = useParseContent();
  const parseCmsContent = useCallback(
    (content: string, componentMap: ComponentMap = CMS_COMPONENT_MAP) => parseContent(content, componentMap),
    [parseContent],
  );
  return parseCmsContent;
}
