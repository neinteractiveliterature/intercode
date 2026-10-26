import { notEmpty } from '@neinteractiveliterature/litform';

import { AppRootQueryData } from '../appRootQueries.generated';
import { EventFiltersInput, SiteMode } from '../graphqlTypes.generated';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import { reactTableFiltersToTableResultsFilters } from '../Tables/TableUtils';
import { decodeReactRouterReactTableSearchParams } from '../Tables/useReactRouterReactTable';
import Timespan, { FiniteTimespan } from '../Timespan';
import { conventionRequiresDates } from './runTimeFormatting';
import { allConfigs, ScheduleGridConfig } from './ScheduleGrid/ScheduleGridConfig';
import { ScheduleGridConventionDataQueryData } from './ScheduleGrid/queries.generated';
import { getFilterableEventFormItems } from './useFilterableFormItems';

// The schedule page's choices (which view, which events to ask for) come from the URL, local storage and the app root
// data. These are plain functions so that the route's loader can work them out before anything renders, and the
// components then show exactly what the loader asked for.

export const SCHEDULE_VIEW_PARAM = 'view';
export const SCHEDULE_VIEW_STORAGE_KEY = 'schedule:view';

const SCHEDULE_VIEWS: readonly string[] = ['list', ...allConfigs.map((config) => config.key)];

// Bootstrap's "medium" breakpoint
const NARROW_VIEWPORT_WIDTH = 768;

export const scheduleFilterCodecs = buildFieldFilterCodecs({
  form_items: FilterCodecs.json,
});

function isScheduleView(view: string | null | undefined): view is string {
  return view != null && SCHEDULE_VIEWS.includes(view);
}

// The grids that can be shown for this convention and this visitor
export function getAvailableScheduleConfigs({
  conventionTimespan,
  siteMode,
  currentAbility,
}: {
  conventionTimespan: Timespan | undefined;
  siteMode: SiteMode | undefined;
  currentAbility: Pick<AppRootQueryData['currentAbility'], 'can_read_schedule_with_counts'>;
}): ScheduleGridConfig[] {
  return allConfigs.filter((config) => {
    // Only show grids for conventions less than a week long
    if (conventionRequiresDates(conventionTimespan, siteMode)) {
      return false;
    }

    if (config.showExtendedCounts && !currentAbility.can_read_schedule_with_counts) {
      return false;
    }

    return true;
  });
}

export function getDefaultScheduleView(configs: ScheduleGridConfig[], viewportWidth: number): string {
  if (viewportWidth < NARROW_VIEWPORT_WIDTH || configs.length === 0) {
    return 'list';
  }

  return configs[0].key;
}

// The view in the URL wins, then the one chosen last time, then the default. Whichever it is, it has to be one that's
// actually available, or the default is used instead.
export function resolveScheduleView({
  requestedView,
  storedView,
  configs,
  viewportWidth,
}: {
  requestedView: string | null | undefined;
  storedView: string | null | undefined;
  configs: ScheduleGridConfig[];
  viewportWidth: number;
}): string {
  const chosenView = [requestedView, storedView].find(isScheduleView);
  if (chosenView === 'list' || (chosenView != null && configs.some((config) => config.key === chosenView))) {
    return chosenView;
  }

  return getDefaultScheduleView(configs, viewportWidth);
}

// The filters that go to the server. The rating and conflict filters are applied in the browser instead.
export function getScheduleEventFilters(searchParams: URLSearchParams) {
  const { filters } = decodeReactRouterReactTableSearchParams(searchParams, {
    decodeFilterValue: scheduleFilterCodecs.decodeFilterValue,
  });

  return reactTableFiltersToTableResultsFilters(
    filters.filter(({ id }) => id !== 'my_rating' && id !== 'hide_conflicts'),
  );
}

export function getFetchFormItemIdentifiers(convention: ScheduleGridConventionDataQueryData['convention']): string[] {
  return getFilterableEventFormItems(convention)
    .map((item) => item.identifier)
    .filter(notEmpty);
}

export function listEventsQueryVariables(filters: EventFiltersInput | undefined, fetchFormItemIdentifiers: string[]) {
  return { filters, fetchFormItemIdentifiers };
}

export function gridEventsQueryVariables(
  timespan: FiniteTimespan,
  fetchFormItemIdentifiers: string[],
  showExtendedCounts?: boolean,
  filters?: EventFiltersInput,
) {
  return {
    start: timespan.start.toISO(),
    finish: timespan.finish.toISO(),
    fetchFormItemIdentifiers,
    extendedCounts: showExtendedCounts || false,
    filters,
  };
}
