import {
  EventAdminEventsQueryData,
  EventAdminSingleEventQueryData,
} from '../../../app/javascript/EventAdmin/queries.generated';
import { TypedFormItem } from '../../../app/javascript/FormAdmin/FormItemUtils';
import {
  FormItemRole,
  FormType,
  SchedulingUi,
  SignupAutomationMode,
  SignupMode,
  SiteMode,
  TicketMode,
  TimezoneMode,
} from '../../../app/javascript/graphqlTypes.generated';
import { buildFreeTextItem, buildTimespanItem } from './formItems';
import { buildProposalForm } from './eventProposals';

type Convention = EventAdminEventsQueryData['convention'];
export type AdminEventCategory = Convention['event_categories'][number];
export type AdminEvent = Convention['events'][number];
export type AdminRun = AdminEvent['runs'][number];

export function buildEventFormItems(): TypedFormItem[] {
  return [
    buildFreeTextItem({ identifier: 'title', caption: 'Title', required: true }),
    buildTimespanItem({ identifier: 'length_seconds', caption: 'Event length' }),
  ];
}

export function buildAdminEventCategory(overrides: Partial<AdminEventCategory> = {}): AdminEventCategory {
  return {
    __typename: 'EventCategory',
    id: '4',
    name: 'Tabletop RPG',
    scheduling_ui: SchedulingUi.Regular,
    default_color: '#336699',
    full_color: '#999999',
    signed_up_color: '#cc9900',
    teamMemberNamePlural: 'GMs',
    team_member_name: 'GM',
    event_form: buildProposalForm(buildEventFormItems(), FormType.Event),
    ...overrides,
  };
}

export function buildAdminRun(overrides: Partial<AdminRun> = {}): AdminRun {
  return {
    __typename: 'Run',
    id: '33',
    starts_at: '2026-06-05T18:00:00Z',
    schedule_note: null,
    title_suffix: null,
    room_names: ['Ballroom'],
    confirmed_signup_count: 0,
    not_counted_signup_count: 0,
    grouped_signup_counts: [],
    rooms: [{ __typename: 'Room', id: '2', name: 'Ballroom' }],
    my_signups: [],
    my_signup_requests: [],
    my_signup_ranked_choices: [],
    ...overrides,
  };
}

export function buildAdminEvent(overrides: Partial<AdminEvent> = {}): AdminEvent {
  return {
    __typename: 'Event',
    id: '9',
    title: 'Big Game',
    author: 'Alice',
    bucket_ids_with_pending_signups_or_requests: [],
    description: null,
    organization: null,
    url: null,
    con_mail_destination: null,
    can_play_concurrently: false,
    short_blurb: null,
    participant_communications: null,
    content_warnings: null,
    email: null,
    length_seconds: 3 * 60 * 60,
    status: 'active',
    description_html: null,
    current_user_form_item_viewer_role: FormItemRole.Admin,
    current_user_form_item_writer_role: FormItemRole.Admin,
    admin_notes: null,
    event_category: { __typename: 'EventCategory', id: '4' },
    registration_policy: null,
    runs: [],
    maximum_event_provided_tickets_overrides: [],
    images: [],
    ...overrides,
  };
}

export function buildEventAdminEventsData({
  categories = [buildAdminEventCategory()],
  events = [] as AdminEvent[],
  convention = {} as Partial<Convention>,
  canOverrideTickets = false,
}: {
  categories?: AdminEventCategory[];
  events?: AdminEvent[];
  convention?: Partial<Convention>;
  canOverrideTickets?: boolean;
} = {}): EventAdminEventsQueryData {
  return {
    __typename: 'Query',
    currentAbility: {
      __typename: 'Ability',
      can_override_maximum_event_provided_tickets: canOverrideTickets,
      can_manage_runs: true,
    },
    convention: {
      __typename: 'Convention',
      id: '1',
      name: 'Test Con',
      starts_at: '2026-06-05T00:00:00Z',
      ends_at: '2026-06-07T23:00:00Z',
      timezone_name: 'UTC',
      timezone_mode: TimezoneMode.ConventionLocal,
      event_mailing_list_domain: null,
      site_mode: SiteMode.Convention,
      signup_mode: SignupMode.SelfService,
      signup_automation_mode: SignupAutomationMode.None,
      ticket_name: 'ticket',
      ticket_mode: TicketMode.Disabled,
      event_categories: categories,
      rooms: [
        { __typename: 'Room', id: '2', name: 'Ballroom' },
        { __typename: 'Room', id: '3', name: 'Salon' },
      ],
      ticket_types: [],
      events,
      ...convention,
    },
  };
}

export function buildEventAdminSingleEventData(event: AdminEvent): EventAdminSingleEventQueryData {
  return {
    __typename: 'Query',
    conventionByRequestHost: {
      __typename: 'Convention',
      id: '1',
      event: { ...event, form_response_attrs_json: JSON.stringify({ title: event.title }) },
    },
  };
}
