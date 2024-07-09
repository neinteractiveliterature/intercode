import classNames from 'classnames';
import { useCallback, useContext, useMemo, useState } from 'react';
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
import { LoadQueryWrapper, notEmpty } from '@neinteractiveliterature/litform/dist';
import { useScheduleGridConventionDataQuery } from './ScheduleGrid/queries.generated';
import useFilterableFormItems from './useFilterableFormItems';
import EventListFilterableFormItemDropdown from './EventCatalog/EventList/EventListFilterableFormItemDropdown';
import useReactRouterReactTable from '../Tables/useReactRouterReactTable';
import { buildFieldFilterCodecs, FilterCodecs } from '../Tables/FilterUtils';
import { reactTableFiltersToTableResultsFilters } from '../Tables/TableUtils';

const filterCodecs = buildFieldFilterCodecs({
  form_items: FilterCodecs.json,
});

const SCHEDULE_VIEWS = ['list', ...allConfigs.map((config) => config.key)];

function getDefaultScheduleView(scheduleGridConfigs: ScheduleGridConfig[]) {
  // Bootstrap's "medium" breakpoint
  if (window.innerWidth < 768 || scheduleGridConfigs.length === 0) {
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

  // Deliberately unreachable code in order to get i18next-parse not to delete these translations
  t('schedule.views.gridView');
  t('schedule.views.gridViewByRoom');
  t('schedule.views.gridViewWithCounts');
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

const ScheduleApp = LoadQueryWrapper(useScheduleGridConventionDataQuery, function ScheduleApp({ data }): JSX.Element {
  const { myProfile, currentAbility, conventionTimespan, siteMode } = useContext(AppRootContext);
  const { t } = useTranslation();
  const { choiceSetValue, choiceSetChanged } = usePersonalScheduleFilters({
    showPersonalFilters: true,
    signedIn: myProfile != null,
  });

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

  const renderSchedule = () => {
    if (scheduleView === 'list') {
      return (
        <RunList
          fetchFormItemIdentifiers={fetchFormItemIdentifiers}
          convention={data.convention}
          filters={effectiveFilters}
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
        />
      );
    }

    return <div>Unknown view: {scheduleView}</div>;
  };

  if (authorizationRequired) {
    if (scheduleGridConfig?.showExtendedCounts && currentAbility.can_read_schedule) {
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
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            {t('navigation.events.eventSchedule')}
          </li>
        </ol>
      </nav>
      <div className="schedule-grid-navigation-bar mb-3">
        <div className="bg-light p-1 d-flex">
          <div className="flex-grow-1 d-flex">
            {configs.length > 0 && (
              <ScheduleViewDropdown viewSelected={viewSelected} scheduleView={scheduleView} configs={configs} />
            )}

            {filterableFormItems.map((item) => (
              <div key={item.id}>
                <EventListFilterableFormItemDropdown
                  convention={data.convention}
                  formItem={item}
                  value={filters.find(({ id }) => id === 'form_items')?.value[item.identifier ?? ''] ?? []}
                  onChange={(newValue) => {
                    const prevValue = filters.find(({ id }) => id === 'form_items');
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
});

export default ScheduleApp;
