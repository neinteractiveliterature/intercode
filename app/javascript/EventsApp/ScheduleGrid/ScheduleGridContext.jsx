import React, {
  Suspense, useState, useMemo, useCallback, useContext, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { detect } from 'detect-browser';
import { useApolloClient, useQuery } from 'react-apollo-hooks';

import ConfigPropType from './ConfigPropType';
import ConventionDayTabContainer from './ConventionDayTabContainer';
import ErrorDisplay from '../../ErrorDisplay';
import Schedule from './Schedule';
import { ScheduleGridConventionDataQuery, ScheduleGridEventsQuery } from './queries.gql';
import { timespanFromConvention, getConventionDayTimespans } from '../../TimespanUtils';
import useQuerySuspended from '../../useQuerySuspended';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import useCachedLoadableValue from '../../useCachedLoadableValue';
import ScheduleGridSkeleton from './ScheduleGridSkeleton';

const IS_MOBILE = ['iOS', 'Android OS'].includes(detect().os);

export const ScheduleGridContext = React.createContext({
  schedule: {},
  config: {},
  convention: {},
  isRunDetailsVisible: () => false,
  visibleRunDetailsIds: new Set(),
  toggleRunDetailsVisibility: () => {},
});

const ScheduleGridFiltersContext = React.createContext({
  myRatingFilter: null,
  hideConflicts: false,
});

export function useScheduleGridProvider(config, convention, events, myRatingFilter, hideConflicts) {
  const [visibleRunDetailsIds, setVisibleRunDetailsIds] = useState(new Set());

  const isRunDetailsVisible = useMemo(
    () => (runId) => visibleRunDetailsIds.has(runId),
    [visibleRunDetailsIds],
  );

  const schedule = useMemo(
    () => {
      if (config && convention && events) {
        return new Schedule(config, convention, events, myRatingFilter, hideConflicts);
      }

      return {};
    },
    [config, convention, events, hideConflicts, myRatingFilter],
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

LoadingOverlay.propTypes = {
  loading: PropTypes.bool,
};

LoadingOverlay.defaultProps = {
  loading: false,
};

function getEventsQueryVariables(timespan, showExtendedCounts) {
  return {
    start: timespan.start.toISOString(),
    finish: timespan.finish.toISOString(),
    extendedCounts: showExtendedCounts || false,
  };
}

function ScheduleGridProviderTabContent({
  config, convention, children, timespan, afterLoaded,
}) {
  const { myRatingFilter, hideConflicts } = useContext(ScheduleGridFiltersContext);
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

ScheduleGridProviderTabContent.propTypes = {
  config: ConfigPropType.isRequired,
  children: PropTypes.func.isRequired,
  timespan: PropTypes.shape({}).isRequired,
  convention: PropTypes.shape({}).isRequired,
  afterLoaded: PropTypes.func.isRequired,
};

export function ScheduleGridProvider({
  config, children, myRatingFilter, hideConflicts,
}) {
  const filtersContextValue = { myRatingFilter, hideConflicts };
  const prefetchAll = IS_MOBILE;
  const { data, loading, error } = useQuerySuspended(ScheduleGridConventionDataQuery);
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

  const convention = (loading || error) ? null : data.convention;

  const conventionTimespan = useMemo(
    () => (convention ? timespanFromConvention(convention) : null),
    [convention],
  );

  const conventionDayTimespans = useMemo(
    () => (
      convention && conventionTimespan.isFinite()
        ? getConventionDayTimespans(
          conventionTimespan,
          convention.timezone_name,
        )
        : []
    ),
    [convention, conventionTimespan],
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

  return (
    <ScheduleGridFiltersContext.Provider value={filtersContextValue}>
      {convention.pre_schedule_content_html && (
        // eslint-disable-next-line react/no-danger
        <div dangerouslySetInnerHTML={{ __html: convention.pre_schedule_content_html }} />
      )}
      <ConventionDayTabContainer
        basename={config.basename}
        conventionTimespan={conventionTimespan}
        timezoneName={convention.timezone_name}
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

ScheduleGridProvider.propTypes = {
  config: ConfigPropType.isRequired,
  children: PropTypes.func.isRequired,
  myRatingFilter: PropTypes.arrayOf(PropTypes.number),
  hideConflicts: PropTypes.bool,
};

ScheduleGridProvider.defaultProps = {
  myRatingFilter: null,
  hideConflicts: false,
};

