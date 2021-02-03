import classNames from 'classnames';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import AppRootContext from '../AppRootContext';
import MenuIcon from '../NavigationBar/MenuIcon';
import { DropdownMenu } from '../UIComponents/DropdownMenu';
import RunList from './RunList';
import ScheduleGridApp from './ScheduleGrid';
import PersonalScheduleFiltersBar, {
  usePersonalScheduleFilters,
} from './ScheduleGrid/PersonalScheduleFiltersBar';
import ScheduleGridConfigs from '../../../config/schedule_grid_configs.json';
import { useAuthorizationRequiredWithoutLogin } from '../Authentication/useAuthorizationRequired';

const SCHEDULE_VIEWS = ['list', ...ScheduleGridConfigs.map((config) => config.key)];

type ScheduleViewDropdownProps = {
  viewSelected: (view: string) => void;
  scheduleView: string;
};

function getScheduleViewLabel(view: string, t: TFunction) {
  if (view === 'list') {
    return t('schedule.views.listView', 'List view');
  }

  const config = ScheduleGridConfigs.find((c) => c.key === view);
  if (config != null) {
    return t(config.titlei18nKey, view);
  }

  return view;

  // Deliberately unreachable code in order to get i18next-parse not to delete these translations
  t('schedule.views.gridView', 'Grid view');
  t('schedule.views.gridViewByRoom', 'Grid view by room');
  t('schedule.views.gridViewWithCounts', 'Grid view with counts');
}

function ScheduleViewDropdown({ viewSelected, scheduleView }: ScheduleViewDropdownProps) {
  const { t } = useTranslation();
  const { currentAbility } = useContext(AppRootContext);

  const authorizedConfigs = useMemo(
    () =>
      ScheduleGridConfigs.filter(
        (config) => !config.showExtendedCounts || currentAbility.can_read_schedule_with_counts,
      ),
    [currentAbility.can_read_schedule_with_counts],
  );

  return (
    <DropdownMenu
      buttonContent={
        <>
          <strong className="d-none d-md-inline">
            {t('schedule.views.scheduleViewSelectorHeader', 'View type:')}{' '}
          </strong>
          {getScheduleViewLabel(scheduleView, t)}
        </>
      }
      buttonClassName="btn btn-link dropdown-toggle"
      dropdownClassName="p-0"
      // hack to get the menu to "close" when switching views
      key={scheduleView}
    >
      {[['list', 'fa-list'], ...authorizedConfigs.map((config) => [config.key, config.icon])].map(
        ([view, iconName]) => (
          <button
            className={classNames('dropdown-item btn btn-link', { active: view === scheduleView })}
            type="button"
            onClick={() => viewSelected(view)}
            key={view}
          >
            <MenuIcon icon={iconName ?? 'fa-calendar'} />
            {getScheduleViewLabel(view, t)}
          </button>
        ),
      )}
    </DropdownMenu>
  );
}

export default function ScheduleApp() {
  const { myProfile, currentAbility } = useContext(AppRootContext);
  const { t } = useTranslation();
  const { choiceSetValue, choiceSetChanged } = usePersonalScheduleFilters({
    showPersonalFilters: true,
    signedIn: myProfile != null,
  });

  const [scheduleView, setScheduleView] = useState<string>(() => {
    const storedView = window.localStorage.getItem('schedule:view');
    if (storedView && (SCHEDULE_VIEWS as readonly string[]).includes(storedView)) {
      return storedView as string;
    }

    // Bootstrap's "medium" breakpoint
    if (window.innerWidth < 768) {
      return 'list';
    }

    return 'con_schedule';
  });

  const scheduleGridConfig = useMemo(
    () => ScheduleGridConfigs.find((c) => c.key === scheduleView),
    [scheduleView],
  );

  const authorizationRequired = useAuthorizationRequiredWithoutLogin(
    scheduleGridConfig?.showExtendedCounts ? 'can_read_schedule_with_counts' : 'can_read_schedule',
  );

  const viewSelected = useCallback((view: string) => {
    window.localStorage.setItem('schedule:view', view);
    setScheduleView(view);
  }, []);

  const renderSchedule = () => {
    if (scheduleView === 'list') {
      return <RunList />;
    }

    if (scheduleGridConfig) {
      return <ScheduleGridApp configKey={scheduleGridConfig.key} />;
    }

    return <div>Unknown view: {scheduleView}</div>;
  };

  if (authorizationRequired) {
    if (scheduleGridConfig?.showExtendedCounts && currentAbility.can_read_schedule) {
      const authorizedView =
        ScheduleGridConfigs.find((config) => !config.showExtendedCounts)?.key ?? 'list';
      setScheduleView(authorizedView);
      return <></>;
    }

    return authorizationRequired;
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            {t('navigation.events.eventSchedule', 'Event Schedule')}
          </li>
        </ol>
      </nav>

      <div className="schedule-grid-navigation-bar">
        <div className="bg-light p-1 d-flex">
          <div className="flex-grow-1">
            <ScheduleViewDropdown viewSelected={viewSelected} scheduleView={scheduleView} />
          </div>
          {(scheduleGridConfig == null || scheduleGridConfig.showPersonalFilters) && (
            <div>
              <PersonalScheduleFiltersBar
                choiceSetValue={choiceSetValue}
                choiceSetChanged={choiceSetChanged}
              />
            </div>
          )}
        </div>
      </div>

      {renderSchedule()}
    </>
  );
}
