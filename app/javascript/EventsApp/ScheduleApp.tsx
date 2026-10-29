import classNames from 'classnames';
import { useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import AppRootContext from '../AppRootContext';
import MenuIcon from '../NavigationBar/MenuIcon';
import { DropdownMenu } from '../UIComponents/DropdownMenu';
import RunList from './RunList';
import ScheduleGridApp from './ScheduleGrid';
import PersonalScheduleFiltersBar, { usePersonalScheduleFilters } from './ScheduleGrid/PersonalScheduleFiltersBar';
import { useAuthorizationRequiredWithoutLogin } from '../Authentication/useAuthorizationRequired';
import { ScheduleGridConfig, allConfigs } from './ScheduleGrid/ScheduleGridConfig';
import {
  ScheduleGridConventionDataQueryData,
  ScheduleGridConventionDataQueryDocument,
  ScheduleGridEventsQueryDocument,
} from './ScheduleGrid/queries.generated';
import useFilterableEventFormItems from './useFilterableFormItems';
import EventListFilterableFormItemDropdown from './EventCatalog/EventList/EventListFilterableFormItemDropdown';
import useReactRouterReactTable from '../Tables/useReactRouterReactTable';
import { LoaderFunction, useLoaderData, useSearchParams, RouterContextProvider } from 'react-router';
import { apolloClientContext } from '../AppContexts';
import { AppRootQueryData, AppRootQueryDocument } from '../appRootQueries.generated';
import { buildAppRootContextValue } from '../AppRoot';
import {
  getAvailableScheduleConfigs,
  getFetchFormItemIdentifiers,
  getScheduleEventFilters,
  gridEventsQueryVariables,
  listEventsQueryVariables,
  resolveScheduleView,
  SCHEDULE_VIEW_PARAM,
  SCHEDULE_VIEW_STORAGE_KEY,
  scheduleFilterCodecs,
} from './scheduleQueryInputs';
import { conventionDayLoader, ConventionDayLoaderResult } from './conventionDayUrls';
import styles from 'styles/schedule_grid.module.scss';

function getScheduleViewLabel(view: string, t: TFunction) {
  if (view === 'list') {
    return t('schedule.views.listView');
  }

  const config = allConfigs.find((c) => c.key === view);
  if (config != null) {
    return t(config.titlei18nKey, view);
  }

  return view;
}

type ScheduleViewDropdownProps = {
  viewSelected: (view: string) => void;
  scheduleView: string;
  configs: ScheduleGridConfig[];
};

function ScheduleViewDropdown({ viewSelected, scheduleView, configs }: ScheduleViewDropdownProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu
      buttonContent={
        <>
          <strong className="d-none d-md-inline">
            <>{t('schedule.views.scheduleViewSelectorHeader')} </>
          </strong>
          {getScheduleViewLabel(scheduleView, t)}
        </>
      }
      buttonClassName="btn btn-link dropdown-toggle"
      dropdownClassName="p-0"
      // hack to get the menu to "close" when switching views
      key={scheduleView}
    >
      {[['list', 'bi-list-ul'], ...configs.map((config) => [config.key, config.icon])].map(([view, iconName]) => (
        <button
          className={classNames('dropdown-item btn btn-link', { active: view === scheduleView })}
          type="button"
          onClick={() => viewSelected(view)}
          key={view}
        >
          <MenuIcon icon={iconName ?? 'bi-calendar3'} />
          {getScheduleViewLabel(view, t)}
        </button>
      ))}
    </DropdownMenu>
  );
}

export type ScheduleLoaderResult = ConventionDayLoaderResult & {
  data: ScheduleGridConventionDataQueryData;
  scheduleView: string;
  eventFilters: ReturnType<typeof getScheduleEventFilters>;
  fetchFormItemIdentifiers: string[];
};

export const clientLoader: LoaderFunction<RouterContextProvider> = async ({ params, request, context }) => {
  const client = context.get(apolloClientContext);
  const [conventionDayLoaderResult, { data }, { data: appRootData }] = await Promise.all([
    conventionDayLoader(client, { params, request }),
    client.query<ScheduleGridConventionDataQueryData>({ query: ScheduleGridConventionDataQueryDocument }),
    client.query<AppRootQueryData>({ query: AppRootQueryDocument }),
  ]);
  if (conventionDayLoaderResult instanceof Response) {
    return conventionDayLoaderResult;
  }
  if (!data) {
    return new Response(null, { status: 404 });
  }

  const { conventionTimespan, siteMode, currentAbility } = buildAppRootContextValue(appRootData);
  const { searchParams } = new URL(request.url);
  const configs = getAvailableScheduleConfigs({ conventionTimespan, siteMode, currentAbility });
  const scheduleView = resolveScheduleView({
    requestedView: searchParams.get(SCHEDULE_VIEW_PARAM),
    storedView: window.localStorage.getItem(SCHEDULE_VIEW_STORAGE_KEY),
    configs,
    viewportWidth: window.innerWidth,
  });
  const eventFilters = getScheduleEventFilters(searchParams);
  const fetchFormItemIdentifiers = getFetchFormItemIdentifiers(data.convention);

  // Start asking for the events now instead of when the page renders. The page's own request for them joins this one,
  // so this isn't waited for here: the schedule's frame can appear while the events are still on their way.
  const scheduleGridConfig = configs.find((config) => config.key === scheduleView);
  if (scheduleView === 'list' && currentAbility.can_read_schedule) {
    client
      .query({
        query: ScheduleGridEventsQueryDocument,
        variables: listEventsQueryVariables(eventFilters, fetchFormItemIdentifiers),
      })
      .catch(() => {});
  } else if (
    scheduleGridConfig &&
    (scheduleGridConfig.showExtendedCounts
      ? currentAbility.can_read_schedule_with_counts
      : currentAbility.can_read_schedule)
  ) {
    client
      .query({
        query: ScheduleGridEventsQueryDocument,
        variables: gridEventsQueryVariables(
          conventionDayLoaderResult.matchingTimespan,
          fetchFormItemIdentifiers,
          scheduleGridConfig.showExtendedCounts,
          eventFilters,
        ),
      })
      .catch(() => {});
  }

  return {
    ...conventionDayLoaderResult,
    data,
    scheduleView,
    eventFilters,
    fetchFormItemIdentifiers,
  } satisfies ScheduleLoaderResult;
};

function ScheduleApp(): React.JSX.Element {
  const { data, scheduleView, eventFilters, fetchFormItemIdentifiers } = useLoaderData() as ScheduleLoaderResult;
  const { myProfile, currentAbility, conventionTimespan, siteMode, navigationBarRef } = useContext(AppRootContext);
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();
  const { choiceSetValue, choiceSetChanged } = usePersonalScheduleFilters({
    showPersonalFilters: true,
    signedIn: myProfile != null,
  });
  const scheduleGridNavigationBarRef = useRef<HTMLDivElement>(null);

  const configs = useMemo(
    () => getAvailableScheduleConfigs({ conventionTimespan, siteMode, currentAbility }),
    [conventionTimespan, siteMode, currentAbility],
  );

  const scheduleGridConfig = useMemo(() => configs.find((c) => c.key === scheduleView), [scheduleView, configs]);

  const authorizationRequired = useAuthorizationRequiredWithoutLogin(
    scheduleGridConfig?.showExtendedCounts ? 'can_read_schedule_with_counts' : 'can_read_schedule',
  );

  // The view is in the URL so that a link shows the same view; it's also remembered for next time
  const viewSelected = useCallback(
    (view: string) => {
      window.localStorage.setItem(SCHEDULE_VIEW_STORAGE_KEY, view);
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        next.set(SCHEDULE_VIEW_PARAM, view);
        return next;
      });
    },
    [setSearchParams],
  );

  const { filters, updateSearch } = useReactRouterReactTable({ ...scheduleFilterCodecs });

  const filterableFormItems = useFilterableEventFormItems(data.convention);

  const [navigationBarTop, setNavigationBarTop] = useState(0);

  useLayoutEffect(() => {
    const globalNavbar = navigationBarRef.current;
    if (globalNavbar == null) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      setNavigationBarTop(entries[0].contentRect.bottom);
    });

    resizeObserver.observe(globalNavbar);

    return () => resizeObserver.disconnect();
  }, [navigationBarRef]);

  const renderSchedule = () => {
    if (scheduleView === 'list') {
      return (
        <RunList
          fetchFormItemIdentifiers={fetchFormItemIdentifiers}
          convention={data.convention}
          filters={eventFilters}
          scheduleGridNavigationBarRef={scheduleGridNavigationBarRef}
        />
      );
    }

    if (scheduleGridConfig) {
      return (
        <ScheduleGridApp
          fetchFormItemIdentifiers={fetchFormItemIdentifiers}
          configKey={scheduleGridConfig.key}
          convention={data.convention}
          filters={eventFilters}
          currentAbilityCanCreateCmsPartials={data.currentAbility.can_create_cms_partials}
        />
      );
    }

    return <div>{t('schedule.unknownView', { scheduleView })}</div>;
  };

  if (authorizationRequired) {
    return authorizationRequired;
  }

  return (
    <>
      <nav aria-label={t('general.breadcrumbAriaLabel')}>
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            {t('navigation.events.eventSchedule')}
          </li>
        </ol>
      </nav>
      <div
        className={`schedule-grid-navigation-bar ${styles.scheduleGridNavigationBar} mb-3`}
        style={{ top: `${navigationBarTop}px` }}
      >
        {/* We set the ref to the inner content element of the navbar because height overflow isn't working right on the sticky */}
        <div className="bg-light p-1 d-flex flex-wrap" ref={scheduleGridNavigationBarRef}>
          <div className="flex-grow-1 d-flex flex-wrap">
            {configs.length > 0 && (
              <ScheduleViewDropdown viewSelected={viewSelected} scheduleView={scheduleView} configs={configs} />
            )}

            {filterableFormItems.map((item) => (
              <div key={item.id}>
                <EventListFilterableFormItemDropdown
                  convention={data.convention}
                  formItem={item}
                  value={
                    ((filters.find(({ id }) => id === 'form_items')?.value as Record<string, string[]> | undefined) ??
                      {})[item.identifier ?? ''] ?? []
                  }
                  onChange={(newValue) => {
                    const prevValue = filters.find(({ id }) => id === 'form_items') as
                      Record<string, string[]> | undefined;
                    updateSearch({
                      filters: [
                        ...filters.filter(({ id }) => id !== 'form_items'),
                        {
                          id: 'form_items',
                          value: { ...prevValue?.value, [item.identifier ?? '']: newValue },
                        },
                      ],
                    });
                  }}
                />
              </div>
            ))}
          </div>
          {(scheduleGridConfig == null || scheduleGridConfig.showPersonalFilters) && (
            <div>
              <PersonalScheduleFiltersBar choiceSetValue={choiceSetValue} choiceSetChanged={choiceSetChanged} />
            </div>
          )}
        </div>
      </div>
      {renderSchedule()}
    </>
  );
}

export const Component = ScheduleApp;
