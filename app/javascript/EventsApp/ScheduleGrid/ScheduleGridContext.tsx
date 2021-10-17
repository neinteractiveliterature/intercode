import { createContext, Suspense, useState, useMemo, useCallback, useContext, useEffect, ReactNode } from 'react';
import { detect } from 'detect-browser';
import { useApolloClient } from '@apollo/client';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import ConventionDayTabContainer from './ConventionDayTabContainer';
import Schedule from './Schedule';
import { ScheduleGridEventsQuery } from './queries';
import { timespanFromConvention, getConventionDayTimespans, ConventionForTimespanUtils } from '../../TimespanUtils';
import useCachedLoadableValue from '../../useCachedLoadableValue';
import ScheduleGridSkeleton from './ScheduleGridSkeleton';
import AppRootContext from '../../AppRootContext';
import { ScheduleGridConfig } from './ScheduleGridConfig';
import { TimezoneMode } from '../../graphqlTypes.generated';
import {
  ScheduleGridEventFragment,
  useScheduleGridConventionDataQuery,
  useScheduleGridEventsQuery,
} from './queries.generated';
import { FiniteTimespan } from '../../Timespan';
import FourOhFourPage from '../../FourOhFourPage';

const IS_MOBILE = ['iOS', 'Android OS'].includes(detect()?.os ?? '');

export type RunDetailsVisibilitySpec = {
  runId: string;
  scheduleBlockId: string;
};

export type ScheduleGridContextValue = {
  schedule: Schedule;
  config: ScheduleGridConfig;
  convention: ConventionForTimespanUtils;
  isRunDetailsVisible: (visibilityId: RunDetailsVisibilitySpec) => boolean;
  visibleRunDetails: Map<string, RunDetailsVisibilitySpec[]>;
  toggleRunDetailsVisibility: (visibilityId: RunDetailsVisibilitySpec) => void;
};

const skeletonScheduleGridConfig: ScheduleGridConfig = {
  key: 'skeleton',
  icon: 'bi-calendar3',
  titlei18nKey: 'schedule.skeletonTitle',
  classifyEventsBy: 'category',
  groupEventsBy: 'category',
};

const skeletonSchedule = new Schedule({
  config: skeletonScheduleGridConfig,
  events: [],
  timezoneName: 'Etc/UTC',
  myRatingFilter: undefined,
  hideConflicts: false,
});

const skeletonConvention = {
  timezone_mode: TimezoneMode.UserLocal,
};

export const ScheduleGridContext = createContext<ScheduleGridContextValue>({
  schedule: skeletonSchedule,
  config: skeletonScheduleGridConfig,
  convention: skeletonConvention,
  isRunDetailsVisible: () => false,
  visibleRunDetails: new Map<string, RunDetailsVisibilitySpec[]>(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleRunDetailsVisibility: () => {},
});

export type ScheduleGridFiltersContextValue = {
  myRatingFilter?: number[];
  hideConflicts: boolean;
};

const ScheduleGridFiltersContext = createContext<ScheduleGridFiltersContextValue>({
  myRatingFilter: undefined,
  hideConflicts: false,
});

function runDetailsVisibilitySpecsMatch(a: RunDetailsVisibilitySpec, b: RunDetailsVisibilitySpec) {
  return a.runId === b.runId && a.scheduleBlockId === b.scheduleBlockId;
}

function checkRunDetailsVisibity(
  visibleRunDetails: Map<string, RunDetailsVisibilitySpec[]>,
  visibilitySpec: RunDetailsVisibilitySpec,
) {
  const visibleSpecs = visibleRunDetails.get(visibilitySpec.runId);
  if (!visibleSpecs) {
    return false;
  }

  return visibleSpecs.some((spec) => runDetailsVisibilitySpecsMatch(spec, visibilitySpec));
}

export function useScheduleGridProvider(
  config: ScheduleGridConfig | undefined,
  convention: ConventionForTimespanUtils | undefined,
  events: ScheduleGridEventFragment[] | undefined,
  myRatingFilter?: number[],
  hideConflicts?: boolean,
): ScheduleGridContextValue {
  const { timezoneName } = useContext(AppRootContext);
  const [visibleRunDetails, setVisibleRunDetailsIds] = useState(new Map<string, RunDetailsVisibilitySpec[]>());

  const isRunDetailsVisible = useMemo(
    () => (visibilitySpec: RunDetailsVisibilitySpec) => checkRunDetailsVisibity(visibleRunDetails, visibilitySpec),
    [visibleRunDetails],
  );

  const schedule = useMemo(() => {
    if (config && convention && events) {
      return new Schedule({
        config,
        events,
        myRatingFilter,
        hideConflicts: hideConflicts ?? false,
        timezoneName,
      });
    }

    return skeletonSchedule;
  }, [config, convention, events, hideConflicts, myRatingFilter, timezoneName]);

  const toggleRunDetailsVisibility = useCallback(
    (visibilitySpec: RunDetailsVisibilitySpec) => {
      let newVisibility = false;

      setVisibleRunDetailsIds((prevVisibleRunDetails) => {
        const newVisibleRunDetails = new Map<string, RunDetailsVisibilitySpec[]>();
        prevVisibleRunDetails.forEach((visibleSpecs, visibleRunId) => {
          newVisibleRunDetails.set(visibleRunId, [...visibleSpecs]);
        });

        if (checkRunDetailsVisibity(prevVisibleRunDetails, visibilitySpec)) {
          const visibleSpecsForRun = prevVisibleRunDetails.get(visibilitySpec.runId);
          newVisibleRunDetails.set(
            visibilitySpec.runId,
            (visibleSpecsForRun ?? []).filter(
              (visibleSpec) => !runDetailsVisibilitySpecsMatch(visibleSpec, visibilitySpec),
            ),
          );
          newVisibility = false;
          return newVisibleRunDetails;
        }

        const runTimespan = schedule.getRunTimespan(visibilitySpec.runId);
        const concurrentRunIds = runTimespan ? schedule.getRunIdsOverlapping(runTimespan) : [];

        concurrentRunIds.forEach((concurrentRunId: string) => {
          newVisibleRunDetails.delete(concurrentRunId);
        });
        // throw out the old visibility specs for this run because by definition they overlap
        newVisibleRunDetails.set(visibilitySpec.runId, [visibilitySpec]);
        newVisibility = true;

        return newVisibleRunDetails;
      });

      return newVisibility;
    },
    [schedule],
  );

  return {
    schedule,
    convention: convention ?? skeletonConvention,
    config: config ?? skeletonScheduleGridConfig,
    isRunDetailsVisible,
    visibleRunDetails,
    toggleRunDetailsVisibility,
  };
}

type LoadingOverlayProps = {
  loading?: boolean;
};

function LoadingOverlay({ loading }: LoadingOverlayProps) {
  if (!loading) {
    return null;
  }

  return (
    <div
      className="position-absolute d-flex align-items-center justify-content-center"
      style={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
    >
      <PageLoadingIndicator visible={loading} iconSet="bootstrap-icons" />
    </div>
  );
}

function getEventsQueryVariables(timespan: FiniteTimespan, showExtendedCounts?: boolean) {
  return {
    start: timespan.start.toISO(),
    finish: timespan.finish.toISO(),
    extendedCounts: showExtendedCounts || false,
  };
}

type ScheduleGridProviderTabContentProps = {
  config: ScheduleGridConfig;
  convention: ConventionForTimespanUtils;
  children: (timespan: FiniteTimespan) => ReactNode;
  timespan: FiniteTimespan;
  afterLoaded: () => void;
};

function ScheduleGridProviderTabContent({
  config,
  convention,
  children,
  timespan,
  afterLoaded,
}: ScheduleGridProviderTabContentProps) {
  const { myRatingFilter, hideConflicts } = useContext(ScheduleGridFiltersContext);
  const { data, error, loading } = useScheduleGridEventsQuery({
    variables: {
      ...getEventsQueryVariables(timespan, config.showExtendedCounts),
    },
  });
  const cachedData = useCachedLoadableValue(loading, error, () => data, [data]);
  const providerValue = useScheduleGridProvider(
    config,
    convention,
    cachedData?.convention.events ?? [],
    myRatingFilter,
    hideConflicts,
  );

  useEffect(() => {
    if (!loading && !error) {
      afterLoaded();
    }
  }, [afterLoaded, error, loading]);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <ScheduleGridContext.Provider value={providerValue}>
      <div className="position-relative">
        <LoadingOverlay loading={loading} />
        {children(timespan)}
      </div>
    </ScheduleGridContext.Provider>
  );
}

export type ScheduleGridProviderProps = {
  config: ScheduleGridConfig;
  children: ScheduleGridProviderTabContentProps['children'];
  myRatingFilter?: number[];
  hideConflicts: boolean;
};

export function ScheduleGridProvider({
  config,
  children,
  myRatingFilter,
  hideConflicts,
}: ScheduleGridProviderProps): JSX.Element {
  const { timezoneName } = useContext(AppRootContext);
  const filtersContextValue = { myRatingFilter, hideConflicts };
  const prefetchAll = IS_MOBILE;
  const { data, loading, error } = useScheduleGridConventionDataQuery();
  const client = useApolloClient();

  const prefetchTimespan = useCallback(
    (timespan) =>
      client.query({
        query: ScheduleGridEventsQuery,
        variables: {
          ...getEventsQueryVariables(timespan, config.showExtendedCounts),
        },
      }),
    [client, config.showExtendedCounts],
  );

  const conventionOrNull = loading || error || !data ? null : data.convention;

  const conventionTimespan = useMemo(
    () => (conventionOrNull ? timespanFromConvention(conventionOrNull) : null),
    [conventionOrNull],
  );

  const conventionDayTimespans = useMemo(
    () =>
      conventionOrNull && conventionTimespan?.isFinite()
        ? getConventionDayTimespans(conventionTimespan, timezoneName)
        : [],
    [conventionOrNull, conventionTimespan, timezoneName],
  );

  const afterTabLoaded = useCallback(() => {
    if (prefetchAll) {
      conventionDayTimespans.forEach(prefetchTimespan);
    }
  }, [conventionDayTimespans, prefetchAll, prefetchTimespan]);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (loading) {
    return <ScheduleGridSkeleton />;
  }

  if (!conventionOrNull) {
    return <FourOhFourPage />;
  }

  const convention = conventionOrNull;

  return (
    <ScheduleGridFiltersContext.Provider value={filtersContextValue}>
      {convention.pre_schedule_content_html && (
        // eslint-disable-next-line react/no-danger
        <div dangerouslySetInnerHTML={{ __html: convention.pre_schedule_content_html }} />
      )}
      <ConventionDayTabContainer
        basename="/events/schedule"
        conventionTimespan={conventionTimespan as FiniteTimespan} // TODO: make this work with infinite cons
        prefetchTimespan={prefetchTimespan}
      >
        {(timespan) => (
          <Suspense fallback={<ScheduleGridSkeleton />}>
            <ScheduleGridProviderTabContent
              config={config}
              convention={convention}
              timespan={timespan}
              afterLoaded={afterTabLoaded}
            >
              {children}
            </ScheduleGridProviderTabContent>
          </Suspense>
        )}
      </ConventionDayTabContainer>
    </ScheduleGridFiltersContext.Provider>
  );
}
