import React, { useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import CategoryLegend from './CategoryLegend';
import FullnessLegend from './FullnessLegend';
import ScheduleGrid from './ScheduleGrid';
import ScheduleGridConfig from './ScheduleGridConfig';
import { ScheduleGridProvider } from './ScheduleGridContext';
import { RATING_OPTIONS } from '../EventList/EventListMyRatingSelector';
import AppRootContext from '../../AppRootContext';
import ChoiceSet from '../../BuiltInFormControls/ChoiceSet';
import { Transforms } from '../../ComposableFormUtils';
import useReactRouterReactTable from '../../Tables/useReactRouterReactTable';
import { FilterCodecs, buildFieldFilterCodecs } from '../../Tables/FilterUtils';

const filterCodecs = buildFieldFilterCodecs({
  my_rating: FilterCodecs.integerArray,
  hide_conflicts: FilterCodecs.boolean,
});

const DEFAULT_PERSONAL_FILTERS = [
  { id: 'my_rating', value: [1, 0] },
  { id: 'hide_conflicts', value: false },
];

function ScheduleGridApp({ configKey }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { myProfile, timezoneName, language } = useContext(AppRootContext);
  const { filtered, onFilteredChange } = useReactRouterReactTable({ ...filterCodecs });
  const config = ScheduleGridConfig.get(configKey);
  const storageKey = `schedule:${configKey}:personalFilters`;

  const loadPersonalFilters = useCallback(
    () => {
      const storedValue = window.localStorage.getItem(storageKey);
      if (storedValue) {
        try {
          return JSON.parse(storedValue);
        } catch (e) {
          return DEFAULT_PERSONAL_FILTERS;
        }
      }

      return DEFAULT_PERSONAL_FILTERS;
    },
    [storageKey],
  );

  useEffect(() => {
    if (config.showPersonalFilters && myProfile && !location.search) {
      onFilteredChange(loadPersonalFilters());
    }
  }, [config.showPersonalFilters, loadPersonalFilters, location, myProfile, onFilteredChange]);

  const ratingFilter = (filtered.find((f) => f.id === 'my_rating') || {}).value;
  const hideConflicts = (filtered.find((f) => f.id === 'hide_conflicts') || {}).value;

  const choiceSetValue = [
    ...(ratingFilter || []).map((integer) => integer.toString()),
    ...(hideConflicts ? [] : ['conflicts']),
  ];

  const choiceSetChanged = (newValue) => {
    const integerArray = newValue.filter((choice) => choice !== 'conflicts').map(Transforms.integer);

    const newFiltered = [
      { id: 'my_rating', value: integerArray },
      { id: 'hide_conflicts', value: !newValue.includes('conflicts') },
    ];

    onFilteredChange(newFiltered);
    window.localStorage.setItem(storageKey, JSON.stringify(newFiltered));
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            {config.title}
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
              {t(
                'schedule.timezoneMessage',
                'All times displayed in {{ offsetName }}.',
                {
                  offsetName: DateTime.fromISO(timespan.start.toISOString())
                    .reconfigure({ locale: language, timezoneName })
                    .offsetNameLong,
                },
              )}
            </div>
          </div>
        )}
      </ScheduleGridProvider>
      {
        (config.legends || []).map((legend, i) => {
          if (legend.type === 'text') {
            // eslint-disable-next-line react/no-array-index-key
            return <p key={i} className="font-italic">{legend.text}</p>;
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
        })
      }
    </>
  );
}

ScheduleGridApp.propTypes = {
  configKey: PropTypes.string.isRequired,
};

export default ScheduleGridApp;
