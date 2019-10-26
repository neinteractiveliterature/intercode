import React, {
  Suspense, useState, useMemo, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { detect } from 'detect-browser';
import { useApolloClient, useQuery } from 'react-apollo-hooks';

import ConfigPropType from './ConfigPropType';
import ConventionDayTabContainer from './ConventionDayTabContainer';
import ErrorDisplay from '../../ErrorDisplay';
import Schedule from './Schedule';
import { ScheduleGridConventionDataQuery, ScheduleGridEventsQuery, ScheduleGridCombinedQuery } from './queries.gql';
import { timespanFromConvention } from '../../TimespanUtils';
import useQuerySuspended from '../../useQuerySuspended';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import { PIXELS_PER_HOUR, PIXELS_PER_LANE } from './LayoutConstants';
import useCachedLoadableValue from '../../useCachedLoadableValue';

const IS_MOBILE = ['iOS', 'Android OS'].includes(detect().os);

export const ScheduleGridContext = React.createContext({
  schedule: {},
  config: {},
  convention: {},
  isRunDetailsVisible: () => false,
  visibleRunDetailsIds: new Set(),
  toggleRunDetailsVisibility: () => {},
});

export function useScheduleGridProvider(config, convention, events, myRatingFilter) {
  const [visibleRunDetailsIds, setVisibleRunDetailsIds] = useState(new Set());

  const isRunDetailsVisible = useMemo(
    () => (runId) => visibleRunDetailsIds.has(runId),
    [visibleRunDetailsIds],
  );

  const schedule = useMemo(
    () => {
      if (config && convention && events) {
        return new Schedule(config, convention, events, myRatingFilter);
      }

      return {};
    },
    [config, convention, events, myRatingFilter],
  );

  const toggleRunDetailsVisibility = useCallback(
    (runId) => {
      let newVisibility;

      setVisibleRunDetailsIds((prevVisibleRunDetailsIds) => {
        const newVisibleRunDetailsIds = new Set(prevVisibleRunDetailsIds);

        if (prevVisibleRunDetailsIds.has(runId)) {
          newVisibleRunDetailsIds.delete(runId);
          newVisibility = false;
          return newVisibleRunDetailsIds;
        }

        const runTimespan = schedule.getRunTimespan(runId);
        const concurrentRunIds = schedule.getEventRunsOverlapping(runTimespan)
          .map((eventRun) => eventRun.runId);

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
    <div className="schedule-grid mb-4">
      <div className="schedule-grid-content" style={{ backgroundSize: `${PIXELS_PER_HOUR}px ${PIXELS_PER_LANE}px` }}>
        <PageLoadingIndicator visible />
      </div>
    </div>
  );
}

function LoadingOverlay({ loading }) {
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

function MobileScheduleGridProvider({ config, children, myRatingFilter }) {
  const combinedQueryParams = {
    query: ScheduleGridCombinedQuery,
    variables: {
      extendedCounts: config.showExtendedCounts || false,
    },
  };

  const { data, error, loading } = useQuery(combinedQueryParams.query, {
    variables: combinedQueryParams.variables,
  });
  const cachedData = useCachedLoadableValue(loading, error, () => data, [data]);
  const { convention, events } = (cachedData || {});
  const providerValue = useScheduleGridProvider(config, convention, events, myRatingFilter);

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  if (!convention) {
    return <PageLoadingIndicator visible />;
  }

  return (
    <>
      {(convention || {}).pre_schedule_content_html && (
        // eslint-disable-next-line react/no-danger
        <div dangerouslySetInnerHTML={{ __html: convention.pre_schedule_content_html }} />
      )}
      <ConventionDayTabContainer
        basename={config.basename}
        conventionTimespan={timespanFromConvention(convention)}
        timezoneName={convention.timezone_name}
      >
        {(timespan) => (
          <ScheduleGridContext.Provider value={providerValue}>
            <div className="position-relative">
              <LoadingOverlay loading={loading} />
              {children(timespan)}
            </div>
          </ScheduleGridContext.Provider>
        )}
      </ConventionDayTabContainer>
    </>
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
  config, convention, children, timespan, myRatingFilter,
}) {
  const { data, error, loading } = useQuery(ScheduleGridEventsQuery, {
    variables: {
      ...getEventsQueryVariables(timespan, config.showExtendedCounts),
    },
  });
  const cachedData = useCachedLoadableValue(loading, error, () => data, [data]);
  const providerValue = useScheduleGridProvider(
    config,
    convention,
    (cachedData || {}).events || [],
    myRatingFilter,
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

DesktopScheduleGridProviderTabContent.propTypes = {
  config: ConfigPropType.isRequired,
  children: PropTypes.func.isRequired,
  timespan: PropTypes.shape({}).isRequired,
  convention: PropTypes.shape({}).isRequired,
};

function DesktopScheduleGridProvider({ config, children, myRatingFilter }) {
  const { data, error } = useQuerySuspended(ScheduleGridConventionDataQuery);
  const client = useApolloClient();

  const prefetchTimespan = useCallback(
    (timespan) => client.query({
      query: ScheduleGridEventsQuery,
      variables: {
        ...getEventsQueryVariables(timespan, config.showExtendedCounts),
      },
    }),
    [client, config.showExtendedCounts],
  );

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const { convention } = data;

  return (
    <>
      {convention.pre_schedule_content_html && (
        // eslint-disable-next-line react/no-danger
        <div dangerouslySetInnerHTML={{ __html: convention.pre_schedule_content_html }} />
      )}
      <ConventionDayTabContainer
        basename={config.basename}
        conventionTimespan={timespanFromConvention(convention)}
        timezoneName={convention.timezone_name}
        prefetchTimespan={prefetchTimespan}
      >
        {(timespan) => (
          <Suspense fallback={<ScheduleGridSkeleton />}>
            <DesktopScheduleGridProviderTabContent
              config={config}
              convention={convention}
              timespan={timespan}
              myRatingFilter={myRatingFilter}
            >
              {children}
            </DesktopScheduleGridProviderTabContent>
          </Suspense>
        )}
      </ConventionDayTabContainer>
    </>
  );
}

DesktopScheduleGridProvider.propTypes = {
  config: ConfigPropType.isRequired,
  children: PropTypes.func.isRequired,
  myRatingFilter: PropTypes.arrayOf(PropTypes.number),
};

DesktopScheduleGridProvider.defaultProps = {
  myRatingFilter: null,
};

export function ScheduleGridProvider({ config, children, myRatingFilter }) {
  if (IS_MOBILE) {
    return (
      <MobileScheduleGridProvider config={config} myRatingFilter={myRatingFilter}>
        {children}
      </MobileScheduleGridProvider>
    );
  }

  return (
    <DesktopScheduleGridProvider config={config} myRatingFilter={myRatingFilter}>
      {children}
    </DesktopScheduleGridProvider>
  );
}

ScheduleGridProvider.propTypes = {
  config: ConfigPropType.isRequired,
  children: PropTypes.func.isRequired,
  myRatingFilter: PropTypes.arrayOf(PropTypes.number),
};

ScheduleGridProvider.defaultProps = {
  myRatingFilter: null,
};
