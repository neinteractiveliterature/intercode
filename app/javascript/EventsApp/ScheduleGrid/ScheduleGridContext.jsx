import React, {
  Suspense, useState, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { detect } from 'detect-browser';
import { useApolloClient } from 'react-apollo-hooks';

import ConfigPropType from './ConfigPropType';
import ConventionDayTabContainer from './ConventionDayTabContainer';
import ErrorDisplay from '../../ErrorDisplay';
import Schedule from './Schedule';
import { ScheduleGridConventionDataQuery, ScheduleGridEventsQuery, ScheduleGridCombinedQuery } from './queries.gql';
import { timespanFromConvention } from '../../TimespanUtils';
import useQuerySuspended from '../../useQuerySuspended';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from './LayoutConstants';

const IS_MOBILE = ['iOS', 'Android OS'].includes(detect().os);

export const ScheduleGridContext = React.createContext({
  schedule: {},
  config: {},
  convention: {},
  isRunDetailsVisible: () => false,
  visibleRunDetailsIds: new Set(),
  toggleRunDetailsVisibility: () => {},
});

function useScheduleGridProvider(config, convention, events) {
  const [visibleRunDetailsIds, setVisibleRunDetailsIds] = useState(new Set());

  const isRunDetailsVisible = useMemo(
    () => runId => visibleRunDetailsIds.has(runId),
    [visibleRunDetailsIds],
  );

  const schedule = useMemo(
    () => {
      if (config && convention && events) {
        return new Schedule(config, convention, events);
      }

      return {};
    },
    [config, convention, events],
  );

  const toggleRunDetailsVisibility = useCallback(
    (runId) => {
      let newVisibility;

      setVisibleRunDetailsIds((prevVisibleRunDetailsIds) => {
        if (prevVisibleRunDetailsIds.has(runId)) {
          const newVisibleRunDetailsIds = new Set(prevVisibleRunDetailsIds);
          newVisibleRunDetailsIds.delete(runId);
          newVisibility = false;
          return newVisibleRunDetailsIds;
        }

        const runTimespan = schedule.getRunTimespan(runId);
        const concurrentRunIds = schedule.getEventRunsOverlapping(runTimespan)
          .map(eventRun => eventRun.runId);

        const newVisibleRunDetailsIds = new Set(prevVisibleRunDetailsIds);
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

function ScheduleGridSkeleton() {
  return (
    <div className="schedule-grid mb-4 bg-light">
      <div className="schedule-grid-content" style={{ backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px` }}>
        <PageLoadingIndicator visible />
      </div>
    </div>
  );
}

function MobileScheduleGridProvider({ config, children }) {
  const combinedQueryParams = {
    query: ScheduleGridCombinedQuery,
    variables: { extendedCounts: config.showExtendedCounts || false },
  };

  const { data, error } = useQuerySuspended(combinedQueryParams.query, {
    variables: combinedQueryParams.variables,
  });
  const { convention, events } = (data || {});
  const providerValue = useScheduleGridProvider(config, convention, events);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <ConventionDayTabContainer
      basename={config.basename}
      conventionTimespan={timespanFromConvention(convention)}
      timezoneName={convention.timezone_name}
    >
      {timespan => (
        <ScheduleGridContext.Provider value={providerValue}>
          {children(timespan)}
        </ScheduleGridContext.Provider>
      )}
    </ConventionDayTabContainer>
  );
}

MobileScheduleGridProvider.propTypes = {
  config: ConfigPropType.isRequired,
  children: PropTypes.func.isRequired,
};

function getEventsQueryVariables(timespan, showExtendedCounts) {
  return {
    start: timespan.start.toISOString(),
    finish: timespan.finish.toISOString(),
    extendedCounts: showExtendedCounts || false,
  };
}

function DesktopScheduleGridProviderTabContent({
  config, convention, children, timespan,
}) {
  const { data: { events }, error } = useQuerySuspended(ScheduleGridEventsQuery, {
    variables: getEventsQueryVariables(timespan, config.showExtendedCounts),
  });
  const providerValue = useScheduleGridProvider(config, convention, events);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <ScheduleGridContext.Provider value={providerValue}>
      {children(timespan)}
    </ScheduleGridContext.Provider>
  );
}

DesktopScheduleGridProviderTabContent.propTypes = {
  config: ConfigPropType.isRequired,
  children: PropTypes.func.isRequired,
  timespan: PropTypes.shape({}).isRequired,
  convention: PropTypes.shape({}).isRequired,
};

function DesktopScheduleGridProvider({ config, children }) {
  const { data, error } = useQuerySuspended(ScheduleGridConventionDataQuery);
  const client = useApolloClient();

  const prefetchTimespan = useCallback(
    timespan => client.query({
      query: ScheduleGridEventsQuery,
      variables: getEventsQueryVariables(timespan, config.showExtendedCounts),
    }),
    [client, config.showExtendedCounts],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { convention } = data;

  return (
    <ConventionDayTabContainer
      basename={config.basename}
      conventionTimespan={timespanFromConvention(convention)}
      timezoneName={convention.timezone_name}
      prefetchTimespan={prefetchTimespan}
    >
      {timespan => (
        <Suspense fallback={<ScheduleGridSkeleton />}>
          <DesktopScheduleGridProviderTabContent
            config={config}
            convention={convention}
            timespan={timespan}
          >
            {children}
          </DesktopScheduleGridProviderTabContent>
        </Suspense>
      )}
    </ConventionDayTabContainer>
  );
}

DesktopScheduleGridProvider.propTypes = {
  config: ConfigPropType.isRequired,
  children: PropTypes.func.isRequired,
};

export function ScheduleGridProvider({ config, children }) {
  if (IS_MOBILE) {
    return <MobileScheduleGridProvider config={config}>{children}</MobileScheduleGridProvider>;
  }

  return (
    <DesktopScheduleGridProvider config={config}>
      {children}
    </DesktopScheduleGridProvider>
  );
}

ScheduleGridProvider.propTypes = {
  config: ConfigPropType.isRequired,
  children: PropTypes.func.isRequired,
};
