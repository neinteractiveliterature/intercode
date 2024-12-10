import { EventPageQueryData, EventPageQueryDocument } from 'EventsApp/EventPage/queries.generated';
import { lazyWithAppEntrypointHeadersCheck } from './checkAppEntrypointHeadersMatch';
import { DEFAULT_COMPONENT_MAP, ComponentMap, parseContent, ParseContentFunction } from './parsePageContent';
import CookieConsent from './UIComponents/CookieConsent';
import { useSuspenseQuery } from '@apollo/client';

function EventIdLoadWrapper(Component: React.ComponentType<{ data: EventPageQueryData }>) {
  function WrappedComponent({ eventId }: { eventId: string }) {
    const { data } = useSuspenseQuery(EventPageQueryDocument, { variables: { eventId } });
    return <Component data={data} />;
  }

  return WrappedComponent;
}

const AddToCalendarDropdown = lazyWithAppEntrypointHeadersCheck(
  () => import('./EventsApp/SignupAdmin/AddToCalendarDropdown'),
);
const ConventionLocationMap = lazyWithAppEntrypointHeadersCheck(() => import('./Maps/ConventionLocationMap'));
const EventAdminMenu = EventIdLoadWrapper(
  lazyWithAppEntrypointHeadersCheck(() => import('./EventsApp/EventPage/EventAdminMenu')),
);
const LongFormEventDetails = EventIdLoadWrapper(
  lazyWithAppEntrypointHeadersCheck(() => import('./EventsApp/EventPage/LongFormEventDetails')),
);
const MaximumEventSignupsPreview = lazyWithAppEntrypointHeadersCheck(
  () => import('./SignupRoundsAdmin/MaximumEventSignupsPreview'),
);
const ProposeEventButton = lazyWithAppEntrypointHeadersCheck(() => import('./EventProposals/ProposeEventButton'));
const RunsSection = EventIdLoadWrapper(
  lazyWithAppEntrypointHeadersCheck(() => import('./EventsApp/EventPage/RunsSection')),
);
const ShortFormEventDetails = EventIdLoadWrapper(
  lazyWithAppEntrypointHeadersCheck(() => import('./EventsApp/EventPage/ShortFormEventDetails')),
);
const WithdrawMySignupButton = lazyWithAppEntrypointHeadersCheck(
  () => import('./EventsApp/EventPage/WithdrawMySignupButton'),
);

export const CMS_COMPONENT_MAP: ComponentMap = {
  ...DEFAULT_COMPONENT_MAP,
  AddToCalendarDropdown,
  ConventionLocationMap,
  CookieConsent,
  EventAdminMenu,
  LongFormEventDetails,
  ProposeEventButton,
  RunsSection,
  MaximumEventSignupsPreview,
  ShortFormEventDetails,
  WithdrawMySignupButton,
};

export const parseCmsContent: ParseContentFunction = (content, componentMap = CMS_COMPONENT_MAP) =>
  parseContent(content, componentMap);
