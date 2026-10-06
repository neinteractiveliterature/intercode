import { EventListEventsQueryData } from '../../../app/javascript/EventsApp/EventCatalog/EventList/queries.generated';
import { CommonConventionDataFragment } from '../../../app/javascript/EventsApp/queries.generated';
import { TypedFormItem } from '../../../app/javascript/FormAdmin/FormItemUtils';
import {
  FormItemExposeIn,
  SchedulingUi,
  SignupAutomationMode,
  SignupMode,
  SiteMode,
  TicketMode,
  TimezoneMode,
} from '../../../app/javascript/graphqlTypes.generated';

export type CatalogCategory = CommonConventionDataFragment['event_categories'][number];
export type CatalogEventEntry = EventListEventsQueryData['convention']['events_paginated']['entries'][number];
export type CatalogTeamMember = CatalogEventEntry['team_members'][number];

// form items that are shown in the catalog (item.expose_in)
export function buildCatalogFormItem(item: TypedFormItem, publicDescription: string, exposeIn = true) {
  return {
    __typename: 'FormItem' as const,
    id: item.id,
    public_description: publicDescription,
    default_value: null,
    position: 1,
    identifier: item.identifier ?? null,
    item_type: item.item_type,
    rendered_properties: JSON.stringify(item.rendered_properties),
    visibility: item.visibility,
    writeability: item.writeability,
    expose_in: exposeIn ? [FormItemExposeIn.EventCatalog] : null,
  };
}

export function buildCatalogCategory(
  overrides: Partial<CatalogCategory> = {},
  formItems: ReturnType<typeof buildCatalogFormItem>[] = [],
): CatalogCategory {
  return {
    __typename: 'EventCategory',
    id: '4',
    name: 'Tabletop RPG',
    scheduling_ui: SchedulingUi.Regular,
    default_color: '#336699',
    full_color: '#999999',
    signed_up_color: '#cc9900',
    team_member_name: 'GM',
    teamMemberNamePlural: 'GMs',
    event_form: {
      __typename: 'Form',
      id: `form-${overrides.id ?? '4'}`,
      form_sections: [{ __typename: 'FormSection', id: `section-${overrides.id ?? '4'}`, form_items: formItems }],
    },
    ...overrides,
  };
}

export function buildCatalogConvention(
  categories: CatalogCategory[] = [buildCatalogCategory()],
  overrides: Partial<CommonConventionDataFragment> = {},
): CommonConventionDataFragment {
  return {
    __typename: 'Convention',
    id: '1',
    name: 'Test Con',
    starts_at: '2026-06-05T00:00:00Z',
    ends_at: '2026-06-07T23:00:00Z',
    signup_mode: SignupMode.SelfService,
    signup_automation_mode: SignupAutomationMode.None,
    site_mode: SiteMode.Convention,
    timezone_name: 'UTC',
    timezone_mode: TimezoneMode.ConventionLocal,
    ticket_name: 'ticket',
    ticket_mode: TicketMode.Disabled,
    event_categories: categories,
    ...overrides,
  };
}

export function buildCatalogTeamMember(
  id: string,
  name: string,
  { lastName = name.split(' ').slice(-1)[0], display = true, gravatar = false } = {},
): CatalogTeamMember {
  return {
    __typename: 'TeamMember',
    id,
    display_team_member: display,
    user_con_profile: {
      __typename: 'UserConProfile',
      id: `ucp-${id}`,
      last_name: lastName,
      name_without_nickname: name,
      gravatar_enabled: gravatar,
      gravatar_url: 'https://example.com/avatar.png',
    },
  };
}

export function buildCatalogEvent(
  overrides: Partial<CatalogEventEntry> & { form_response_attrs?: Record<string, unknown> } = {},
): CatalogEventEntry {
  const { form_response_attrs: formResponseAttrs, ...rest } = overrides;
  return {
    __typename: 'Event',
    id: '9',
    title: 'Big Game',
    created_at: '2026-01-02T12:00:00Z',
    short_blurb_html: '<p>A fine game</p>',
    form_response_attrs_json_with_rendered_markdown: JSON.stringify(formResponseAttrs ?? {}),
    my_rating: null,
    length_seconds: 3 * 3600,
    event_category: { __typename: 'EventCategory', id: '4' },
    runs: [],
    team_members: [],
    registration_policy: null,
    ...rest,
  };
}

export function buildCatalogRun(id: string, startsAt: string) {
  return { __typename: 'Run' as const, id, starts_at: startsAt };
}

export function buildEventListData(
  entries: CatalogEventEntry[],
  { canReadSchedule = true, currentPage = 1, totalPages = 1 } = {},
): EventListEventsQueryData {
  return {
    __typename: 'Query',
    currentAbility: { __typename: 'Ability', can_read_schedule: canReadSchedule },
    convention: {
      __typename: 'Convention',
      id: '1',
      timezone_mode: TimezoneMode.ConventionLocal,
      events_paginated: {
        __typename: 'EventsPagination',
        total_entries: entries.length,
        total_pages: totalPages,
        current_page: currentPage,
        per_page: 20,
        entries,
      },
    },
  };
}
