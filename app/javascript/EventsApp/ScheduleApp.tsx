import { assertNever } from 'assert-never';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppRootContext from '../AppRootContext';
import MenuIcon from '../NavigationBar/MenuIcon';
import { DropdownMenu } from '../UIComponents/DropdownMenu';
import RunList from './RunList';
import ScheduleGridApp from './ScheduleGrid';
import PersonalScheduleFiltersBar, {
  usePersonalScheduleFilters,
} from './ScheduleGrid/PersonalScheduleFiltersBar';

const SCHEDULE_VIEWS = ['list', 'grid', 'gridByRoom', 'gridWithCounts'] as const;
type ScheduleView = typeof SCHEDULE_VIEWS[number];

export default function ScheduleApp() {
  const { myProfile } = useContext(AppRootContext);
  const { t } = useTranslation();
  const { choiceSetValue, choiceSetChanged } = usePersonalScheduleFilters({
    storageKey: `schedule:personalFilters`,
    showPersonalFilters: true,
    signedIn: myProfile != null,
  });

  const [scheduleView, setScheduleView] = useState<ScheduleView>(() => {
    const storedView = window.localStorage.getItem('schedule:view');
    if (storedView && (SCHEDULE_VIEWS as readonly string[]).includes(storedView)) {
      return storedView as ScheduleView;
    }

    // Bootstrap's "medium" breakpoint
    if (window.innerWidth < 768) {
      return 'list';
    }

    return 'grid';
  });

  const viewSelected = useCallback((view: ScheduleView) => {
    window.localStorage.setItem('schedule:view', view);
    setScheduleView(view);
  }, []);

  const scheduleViewLabels = useMemo<Record<ScheduleView, string>>(
    () => ({
      list: t('schedule.views.listView', 'List view'),
      grid: t('schedule.views.gridView', 'Grid view'),
      gridByRoom: t('schedule.views.gridViewByRoom', 'Grid view by room'),
      gridWithCounts: t('schedule.views.gridViewWithCounts', 'Grid view with counts'),
    }),
    [t],
  );

  const renderSchedule = () => {
    if (scheduleView === 'list') {
      return <RunList />;
    }

    if (scheduleView === 'grid') {
      return <ScheduleGridApp configKey="con_schedule" />;
    }

    if (scheduleView === 'gridByRoom') {
      return <ScheduleGridApp configKey="con_schedule_by_room" />;
    }

    if (scheduleView === 'gridWithCounts') {
      return <ScheduleGridApp configKey="schedule_with_counts" />;
    }

    assertNever(scheduleView, true);
    return <ScheduleGridApp configKey="con_schedule" />;
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            {t('navigation.events.eventSchedule', 'Event schedule')}
          </li>
        </ol>
      </nav>

      <h1>{t('navigation.events.eventSchedule', 'Event schedule')}</h1>

      <div className="schedule-grid-navigation-bar">
        <div className="bg-light p-1 d-flex">
          <div className="flex-grow-1">
            <DropdownMenu
              buttonContent={scheduleViewLabels[scheduleView]}
              buttonClassName="btn btn-link dropdown-toggle"
              dropdownClassName="p-0"
            >
              <button
                className="dropdown-item btn btn-link"
                type="button"
                onClick={() => viewSelected('list')}
              >
                <MenuIcon icon="fa-list" />
                {scheduleViewLabels.list}
              </button>
              <button
                className="dropdown-item btn btn-link"
                type="button"
                onClick={() => viewSelected('grid')}
              >
                <MenuIcon icon="fa-calendar" />
                {scheduleViewLabels.grid}
              </button>
              <button
                className="dropdown-item btn btn-link"
                type="button"
                onClick={() => viewSelected('gridByRoom')}
              >
                <MenuIcon icon="fa-calendar-o" />
                {scheduleViewLabels.gridByRoom}
              </button>
              <button
                className="dropdown-item btn btn-link"
                type="button"
                onClick={() => viewSelected('gridWithCounts')}
              >
                <MenuIcon icon="fa-calendar-check-o" />
                {scheduleViewLabels.gridWithCounts}
              </button>
            </DropdownMenu>
          </div>
          <div>
            <PersonalScheduleFiltersBar
              choiceSetValue={choiceSetValue}
              choiceSetChanged={choiceSetChanged}
            />
          </div>
        </div>
      </div>

      {renderSchedule()}
    </>
  );
}
