import { useContext, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import CategoryLegend from './CategoryLegend';
import FullnessLegend from './FullnessLegend';
import ScheduleGrid from './ScheduleGrid';
import { getConfig } from './ScheduleGridConfig';
import { ScheduleGridProvider } from './ScheduleGridContext';
import { RATING_OPTIONS } from '../EventList/EventListMyRatingSelector';
import AppRootContext from '../../AppRootContext';
import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import { parseIntOrNull } from '../../ValueUtils';
import useReactRouterReactTable from '../../Tables/useReactRouterReactTable';
import { FilterCodecs, buildFieldFilterCodecs } from '../../Tables/FilterUtils';
import ErrorDisplay from '../../ErrorDisplay';
import { useAppDateFormat } from '../../TimeUtils';

const filterCodecs = buildFieldFilterCodecs({
  my_rating: FilterCodecs.integerArray,
  hide_conflicts: FilterCodecs.boolean,
});

const DEFAULT_PERSONAL_FILTERS = [
  { id: 'my_rating', value: [1, 0] },
  { id: 'hide_conflicts', value: false },
];

export type ScheduleGridAppProps = {
  configKey: string;
};

function ScheduleGridApp({ configKey }: ScheduleGridAppProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { myProfile } = useContext(AppRootContext);
  const { filters, updateSearch } = useReactRouterReactTable({ ...filterCodecs });
  const config = getConfig(configKey);
  const storageKey = `schedule:${configKey}:personalFilters`;
  const formatDate = useAppDateFormat();

  const loadPersonalFilters = useCallback(() => {
    const storedValue = window.localStorage.getItem(storageKey);
    if (storedValue) {
      try {
        return JSON.parse(storedValue);
      } catch (e) {
        return DEFAULT_PERSONAL_FILTERS;
      }
    }

    return DEFAULT_PERSONAL_FILTERS;
  }, [storageKey]);

  useEffect(() => {
    if (config?.showPersonalFilters && myProfile && !location.search) {
      updateSearch({ filters: loadPersonalFilters() });
    }
  }, [config?.showPersonalFilters, loadPersonalFilters, location, myProfile, updateSearch]);

  const ratingFilter = (filters.find((f) => f.id === 'my_rating') || {}).value;
  const hideConflicts = (filters.find((f) => f.id === 'hide_conflicts') || {}).value;

  const choiceSetValue = [
    ...(ratingFilter || []).map((integer: number) => integer.toString()),
    ...(hideConflicts ? [] : ['conflicts']),
  ];

  const choiceSetChanged = (newValue: string[]) => {
    const integerArray = newValue.filter((choice) => choice !== 'conflicts').map(parseIntOrNull);

    const newFilters = [
      { id: 'my_rating', value: integerArray },
      { id: 'hide_conflicts', value: !newValue.includes('conflicts') },
    ];

    updateSearch({ filters: newFilters });
    window.localStorage.setItem(storageKey, JSON.stringify(newFilters));
  };

  if (!config) {
    return <ErrorDisplay stringError={`Schedule grid configuration "${configKey}" not found`} />;
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            {t(config.titlei18nKey, config.title)}
          </li>
        </ol>
      </nav>
      <ScheduleGridProvider
        config={config}
        myRatingFilter={myProfile ? ratingFilter : null}
        hideConflicts={myProfile ? hideConflicts : false}
      >
        {(timespan) => (
          <div className="mb-4">
            {config.showPersonalFilters && myProfile && (
              <div className="d-flex flex-column flex-md-row bg-light border-bottom">
                <div className="d-flex btn">
                  <span className="mr-2">Show:</span>
                  <ChoiceSet
                    choices={[...RATING_OPTIONS, { label: 'Conflicts', value: 'conflicts' }]}
                    choiceClassName="form-check-inline mr-md-4"
                    containerClassName="d-flex flex-wrap"
                    value={choiceSetValue}
                    onChange={choiceSetChanged}
                    multiple
                  />
                </div>
              </div>
            )}
            <ScheduleGrid timespan={timespan} />
            <div className="font-italic">
              {t('schedule.timezoneMessage', 'All times displayed in {{ offsetName }}.', {
                offsetName: formatDate(new Date(), 'zzzz'),
              })}
            </div>
          </div>
        )}
      </ScheduleGridProvider>
      {(config.legends || []).map((legend, i) => {
        if (legend.type === 'text') {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <p key={i} className="font-italic">
              {legend.text}
            </p>
          );
        }

        if (legend.type === 'category') {
          // eslint-disable-next-line react/no-array-index-key
          return <CategoryLegend key={i} />;
        }

        if (legend.type === 'fullness') {
          // eslint-disable-next-line react/no-array-index-key
          return <FullnessLegend key={i} />;
        }

        return `Unknown legend type ${legend.type}`;
      })}
    </>
  );
}

export default ScheduleGridApp;
