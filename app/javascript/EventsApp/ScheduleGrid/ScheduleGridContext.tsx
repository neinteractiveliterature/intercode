import React, {
  Suspense, useState, useMemo, useCallback, useContext, useEffect, ReactNode,
} from 'react';
import { detect } from 'detect-browser';
import { useApolloClient } from '@apollo/react-hooks';

import ConventionDayTabContainer from './ConventionDayTabContainer';
import ErrorDisplay from '../../ErrorDisplay';
import Schedule from './Schedule';
import { timespanFromConvention, getConventionDayTimespans, ConventionForTimespanUtils } from '../../TimespanUtils';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import useCachedLoadableValue from '../../useCachedLoadableValue';
import ScheduleGridSkeleton from './ScheduleGridSkeleton';
import AppRootContext from '../../AppRootContext';
import ScheduleGridConfig from './ScheduleGridConfig';
import { FiniteTimespan } from '../../Timespan';
import {
  useScheduleGridEventsQueryQuery,
  useScheduleGridConventionDataQueryQuery,
  ScheduleGridEventFragmentFragment,
} from './queries.generated';
import { ScheduleGridEventsQuery } from './queries';

const IS_MOBILE = ['iOS', 'Android OS'].includes(detect()?.os ?? '');

export type ScheduleGridContextValue = {
  schedule: Schedule,
  config: ScheduleGridConfig,
  convention: ConventionForTimespanUtils,
  isRunDetailsVisible: (runId: number) => boolean,
  visibleRunDetailsIds: Set<number>,
  toggleRunDetailsVisibility: (runId: number) => void,
};

const skeletonScheduleGridConfig = new ScheduleGridConfig({
  basename: 'skeleton',
  key: 'skeleton',
  title: 'Skeleton config',
  classifyEventsBy: 'category',
  groupEventsBy: 'category',
});

const skeletonSchedule = new Schedule({
  config: skeletonScheduleGridConfig,
  convention: { timezone_mode: 'user_local' },
  events: [],
  timezoneName: 'Etc/UTC',
});

export const ScheduleGridContext = React.createContext<ScheduleGridContextValue>({
  schedule: skeletonSchedule,
  config: skeletonScheduleGridConfig,
  convention: {
    timezone_mode: 'user_local',
  },
  isRunDetailsVisible: () => false,
  visibleRunDetailsIds: new Set(),
  toggleRunDetailsVisibility: () => {},
});

export type ScheduleGridFiltersContextValue = {
  myRatingFilter?: number[],
  hideConflicts: boolean,
};

const ScheduleGridFiltersContext = React.createContext<ScheduleGridFiltersContextValue>({
  myRatingFilter: undefined,
  hideConflicts: false,
});

export function useScheduleGridProvider(
  config: ScheduleGridConfig,
  convention: ConventionForTimespanUtils,
  events: ScheduleGridEventFragmentFragment[],
  myRatingFilter?: number[],
  hideConflicts?: boolean,
) {
  const { timezoneName } = useContext(AppRootContext);
  const [visibleRunDetailsIds, setVisibleRunDetailsIds] = useState(new Set<number>());

  const isRunDetailsVisible = useMemo(
    () => (runId: number) => visibleRunDetailsIds.has(runId),
    [visibleRunDetailsIds],
  );

  const schedule: Schedule = useMemo(
    () => {
      if (config && convention && events) {
        return new Schedule({
          config, convention, events, myRatingFilter, hideConflicts, timezoneName,
        });
      }

      return skeletonSchedule;
    },
    [config, convention, events, hideConflicts, myRatingFilter, timezoneName],
  );

  const toggleRunDetailsVisibility = useCallback(
    (runId: number) => {
      if (!schedule) {
        return false;
      }

      let newVisibility: boolean = false;

      setVisibleRunDetailsIds((prevVisibleRunDetailsIds) => {
        const newVisibleRunDetailsIds = new Set(prevVisibleRunDetailsIds);

        if (prevVisibleRunDetailsIds.has(runId)) {
          newVisibleRunDetailsIds.delete(runId);
          newVisibility = false;
          return newVisibleRunDetailsIds;
        }

        const runTimespan = schedule.getRunTimespan(runId);
        const concurrentRunIds = runTimespan
          ? schedule.getEventRunsOverlapping(runTimespan).map((eventRun) => eventRun.runId)
          : [];

        concurrentRunIds.forEach((concurrentRunId) => {
          newVisibleRunDetailsIds.delete(concurrentRunId);
        });
        newVisibleRunDetailsIds.add(runId);
        newVisibility = true;

        return newVisibleRunDetailsIds;
      });

      return newVisibility;
    },
    [schedule],
  );

  return {
    schedule,
    convention,
    config,
    isRunDetailsVisible,
    visibleRunDetailsIds,
    toggleRunDetailsVisibility,
  };
}

export type LoadingOverlayProps = {
  loading?: boolean,
};

function LoadingOverlay({ loading }: LoadingOverlayProps) {
  if (!loading) {
    return null;
  }

  return (
    <div
      className="position-absolute d-flex align-items-center justify-content-center"
      style={{
        top: 0, left: 0, bottom: 0, right: 0,
      }}
    >
      <PageLoadingIndicator visible={loading} />
    </div>
  );
}

function getEventsQueryVariables(timespan: FiniteTimespan, showExtendedCounts?: boolean) {
  return {
    start: timespan.start.toISO(),
    finish: timespan.finish.toISO(),
    extendedCounts: showExtendedCounts ?? false,
  };
}

type ScheduleGridProviderTabContentProps = {
  config: ScheduleGridConfig,
  convention: ConventionForTimespanUtils,
  children: (timespan: FiniteTimespan) => ReactNode,
  timespan: FiniteTimespan,
  afterLoaded: () => any,
};

function ScheduleGridProviderTabContent({
  config, convention, children, timespan, afterLoaded,
}: ScheduleGridProviderTabContentProps) {
  const { myRatingFilter, hideConflicts } = useContext(ScheduleGridFiltersContext);
  const { data, error, loading } = useScheduleGridEventsQueryQuery({
    variables: {
      ...getEventsQueryVariables(timespan, config.showExtendedCounts),
    },
  });
  const cachedData = useCachedLoadableValue(loading, error, () => data, [data]);
  const providerValue = useScheduleGridProvider(
    config,
    convention,
    cachedData?.events || [],
    myRatingFilter,
    hideConflicts,
  );

  useEffect(
    () => {
      if (!loading && !error) {
        afterLoaded();
      }
    },
    [afterLoaded, error, loading],
  );

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
  config: ScheduleGridConfig,
  children: ScheduleGridProviderTabContentProps['children'],
  myRatingFilter?: number[],
  hideConflicts?: boolean,
};

export function ScheduleGridProvider({
  config, children, myRatingFilter, hideConflicts,
}: ScheduleGridProviderProps) {
  const { timezoneName } = useContext(AppRootContext);
  const filtersContextValue = { myRatingFilter, hideConflicts: hideConflicts ?? false };
  const prefetchAll = IS_MOBILE;
  const { data, loading, error } = useScheduleGridConventionDataQueryQuery();
  const client = useApolloClient();

  const prefetchTimespan = useCallback(
    (timespan: FiniteTimespan) => client.query({
      query: ScheduleGridEventsQuery,
      variables: getEventsQueryVariables(timespan, config.showExtendedCounts),
    }),
    [client, config.showExtendedCounts],
  );

  const convention = (loading || error || !data) ? null : data.convention;

  const conventionTimespan = useMemo(
    () => (convention ? timespanFromConvention(convention) : null),
    [convention],
  );

  const conventionDayTimespans = useMemo(
    () => (
      conventionTimespan?.isFinite()
        ? getConventionDayTimespans(
          conventionTimespan,
          timezoneName,
        )
        : []
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conventionTimespan, timezoneName],
  );

  const afterTabLoaded = useCallback(
    () => {
      if (prefetchAll) {
        conventionDayTimespans.forEach(prefetchTimespan);
      }
    },
    [conventionDayTimespans, prefetchAll, prefetchTimespan],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (loading) {
    return <ScheduleGridSkeleton />;
  }

  if (!convention) {
    return <ErrorDisplay stringError="Convention not found" />;
  }

  return (
    <ScheduleGridFiltersContext.Provider value={filtersContextValue}>
      {convention?.pre_schedule_content_html && (
        // eslint-disable-next-line react/no-danger
        <div dangerouslySetInnerHTML={{ __html: convention.pre_schedule_content_html }} />
      )}
      <ConventionDayTabContainer
        basename={config.basename}
        conventionTimespan={conventionTimespan}
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
