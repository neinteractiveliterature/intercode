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
import { conventionRequiresDates } from './runTimeFormatting';
import { notEmpty } from '@neinteractiveliterature/litform';
import {
  ScheduleGridConventionDataQueryData,
  ScheduleGridConventionDataQueryDocument,
} from './ScheduleGrid/queries.generated';
import useFilterableFormItems from './useFilterableFormItems';
import EventListFilterableFormItemDropdown from './EventCatalog/EventList/EventListFilterableFormItemDropdown';
import useReactRouterReactTable from '../Tables/useReactRouterReactTable';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import { reactTableFiltersToTableResultsFilters } from '../Tables/TableUtils';
import styles from 'styles/schedule_grid.module.scss';
import { conventionDayLoader } from './conventionDayUrls';
import { Route } from './+types/ScheduleApp';
import Timespan from 'Timespan';

const filterCodecs = buildFieldFilterCodecs({
  form_items: FilterCodecs.json,
});

const SCHEDULE_VIEWS = ['list', ...allConfigs.map((config) => config.key)];

function getDefaultScheduleView(scheduleGridConfigs: ScheduleGridConfig[]) {
  // Bootstrap's "medium" breakpoint
  if (window.innerWidth < 768 || scheduleGridConfigs.length === 0) {
    // eslint-disable-next-line i18next/no-literal-string
    return 'list';
  }

  return scheduleGridConfigs[0].key;
}

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

export const loader = async ({ params, request, context }: Route.LoaderArgs) => {
  const client = context.client;
  const [conventionDayLoaderResult, { data }] = await Promise.all([
    conventionDayLoader({ params, request, context }),
    await client.query<ScheduleGridConventionDataQueryData>({
      query: ScheduleGridConventionDataQueryDocument,
    }),
  ]);
  if (conventionDayLoaderResult instanceof Response) {
    throw conventionDayLoaderResult;
  }

  return { conventionDayLoaderResult, data };
};

function ScheduleApp({ loaderData: { data, conventionDayLoaderResult } }: Route.ComponentProps): JSX.Element {
  const { myProfile, currentAbility, conventionTimespan, siteMode, navigationBarRef } = useContext(AppRootContext);
  const { t } = useTranslation();
  const { choiceSetValue, choiceSetChanged } = usePersonalScheduleFilters({
    showPersonalFilters: true,
    signedIn: myProfile != null,
  });
  const scheduleGridNavigationBarRef = useRef<HTMLDivElement>(null);
  const timespan = useMemo(
    () => Timespan.deserialize(conventionDayLoaderResult.matchingTimespan),
    [conventionDayLoaderResult.matchingTimespan],
  );

  const configs = useMemo(
    () =>
      allConfigs.filter((config) => {
        // Only show grids for conventions less than a week long
        if (conventionRequiresDates(conventionTimespan, siteMode)) {
          return false;
        }

        if (config.showExtendedCounts && !currentAbility.can_read_schedule_with_counts) {
          return false;
        }

        return true;
      }),
    [currentAbility.can_read_schedule_with_counts, conventionTimespan, siteMode],
  );

  const [scheduleView, setScheduleView] = useState<string>(() => {
    const storedView = window.localStorage.getItem('schedule:view');
    if (storedView && (SCHEDULE_VIEWS as readonly string[]).includes(storedView)) {
      return storedView as string;
    }

    return getDefaultScheduleView(configs);
  });

  const scheduleGridConfig = useMemo(() => configs.find((c) => c.key === scheduleView), [scheduleView, configs]);

  const authorizationRequired = useAuthorizationRequiredWithoutLogin(
    scheduleGridConfig?.showExtendedCounts ? 'can_read_schedule_with_counts' : 'can_read_schedule',
  );

  const viewSelected = useCallback((view: string) => {
    window.localStorage.setItem('schedule:view', view);
    setScheduleView(view);
  }, []);

  const { filters, updateSearch } = useReactRouterReactTable({ ...filterCodecs });
  const effectiveFilters = useMemo(
    () =>
      reactTableFiltersToTableResultsFilters(filters.filter(({ id }) => id !== 'my_rating' && id !== 'hide_conflicts')),
    [filters],
  );

  const filterableFormItems = useFilterableFormItems(data.convention);
  const fetchFormItemIdentifiers = useMemo(
    () => filterableFormItems.map((item) => item.identifier).filter(notEmpty),
    [filterableFormItems],
  );

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
          filters={effectiveFilters}
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
          filters={effectiveFilters}
          currentAbilityCanCreateCmsPartials={data.currentAbility.can_create_cms_partials}
          timespan={timespan}
        />
      );
    }

    return <div>{t('schedule.unknownView', { scheduleView })}</div>;
  };

  if (authorizationRequired) {
    if (scheduleGridConfig?.showExtendedCounts && currentAbility.can_read_schedule) {
      // eslint-disable-next-line i18next/no-literal-string
      const authorizedView = configs.find((config) => !config.showExtendedCounts)?.key ?? 'list';
      setScheduleView(authorizedView);
      return <></>;
    }

    return authorizationRequired;
  }

  if (scheduleView && scheduleView !== 'list' && !scheduleGridConfig) {
    setScheduleView(getDefaultScheduleView(configs));
    return <></>;
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
                      | Record<string, string[]>
                      | undefined;
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

export default ScheduleApp;
