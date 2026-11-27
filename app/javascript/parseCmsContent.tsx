import { lazy } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';
import parsePageContent, { DEFAULT_COMPONENT_MAP, ComponentMap } from './parsePageContent';
import CookieConsent from './UIComponents/CookieConsent';
import { EventPageQueryDocument } from 'EventsApp/EventPage/queries.generated';

const AddToCalendarDropdown = lazy(() => import('./EventsApp/SignupAdmin/AddToCalendarDropdown'));
const ConventionLocationMap = lazy(() => import('./Maps/ConventionLocationMap'));
const EventAdminMenu = lazy(() => import('./EventsApp/EventPage/EventAdminMenu'));
const LongFormEventDetails = lazy(() => import('./EventsApp/EventPage/LongFormEventDetails'));
const MaximumEventSignupsPreview = lazy(
  () => import(/* webpackChunkName: 'scheduled-value-preview' */ './SignupRoundsAdmin/MaximumEventSignupsPreview'),
);
const ProposeEventButton = lazy(
  () => import(/* webpackChunkName: 'propose-event-button' */ './EventProposals/ProposeEventButton'),
);
const RunsSection = lazy(() => import('./EventsApp/EventPage/RunsSection'));
const ShortFormEventDetails = lazy(() => import('./EventsApp/EventPage/ShortFormEventDetails'));
const WithdrawMySignupButton = lazy(
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
