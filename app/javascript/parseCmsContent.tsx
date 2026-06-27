import { useSuspenseQuery } from '@apollo/client/react';
import { lazyWithAppEntrypointHeadersCheck } from './checkAppEntrypointHeadersMatch';
import parsePageContent, { DEFAULT_COMPONENT_MAP, ComponentMap } from './parsePageContent';
import CookieConsent from './UIComponents/CookieConsent';
import { EventPageQueryDocument } from 'EventsApp/EventPage/queries.generated';

const AddToCalendarDropdown = lazyWithAppEntrypointHeadersCheck(
  () => import('./EventsApp/SignupAdmin/AddToCalendarDropdown'),
);
const ConventionLocationMap = lazyWithAppEntrypointHeadersCheck(() => import('./Maps/ConventionLocationMap'));
const EventAdminMenu = lazyWithAppEntrypointHeadersCheck(() => import('./EventsApp/EventPage/EventAdminMenu'));
const LongFormEventDetails = lazyWithAppEntrypointHeadersCheck(
  () => import('./EventsApp/EventPage/LongFormEventDetails'),
);
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

function EventAdminMenuWrapper({ eventId }: { eventId: string }) {
  const { data } = useSuspenseQuery(EventPageQueryDocument, { variables: { eventId } });
  return <EventAdminMenu data={data} />;
}

function LongFormEventDetailsWrapper({ eventId }: { eventId: string }) {
  const { data } = useSuspenseQuery(EventPageQueryDocument, { variables: { eventId } });
  return <LongFormEventDetails data={data} />;
}

function RunsSectionWrapper({ eventId }: { eventId: string }) {
  const { data } = useSuspenseQuery(EventPageQueryDocument, { variables: { eventId } });
  return <RunsSection data={data} />;
}

function ShortFormEventDetailsWrapper({ eventId }: { eventId: string }) {
  const { data } = useSuspenseQuery(EventPageQueryDocument, { variables: { eventId } });
  return <ShortFormEventDetails data={data} />;
}

export const CMS_COMPONENT_MAP: ComponentMap = {
  ...DEFAULT_COMPONENT_MAP,
  AddToCalendarDropdown,
  ConventionLocationMap,
  CookieConsent,
  EventAdminMenu: EventAdminMenuWrapper,
  LongFormEventDetails: LongFormEventDetailsWrapper,
  ProposeEventButton,
  RunsSection: RunsSectionWrapper,
  MaximumEventSignupsPreview,
  ShortFormEventDetails: ShortFormEventDetailsWrapper,
  WithdrawMySignupButton,
};

export default function parseCmsContent(
  content: string,
  componentMap = CMS_COMPONENT_MAP,
): ReturnType<typeof parsePageContent> {
  return parsePageContent(content, componentMap);
}
