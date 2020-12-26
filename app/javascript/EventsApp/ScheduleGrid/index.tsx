import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import CategoryLegend from './CategoryLegend';
import FullnessLegend from './FullnessLegend';
import ScheduleGrid from './ScheduleGrid';
import { getConfig } from './ScheduleGridConfig';
import { ScheduleGridProvider } from './ScheduleGridContext';
import AppRootContext from '../../AppRootContext';
import ErrorDisplay from '../../ErrorDisplay';
import { useAppDateTimeFormat } from '../../TimeUtils';
import PersonalScheduleFiltersBar, {
  usePersonalScheduleFilters,
} from './PersonalScheduleFiltersBar';

export type ScheduleGridAppProps = {
  configKey: string;
};

function ScheduleGridApp({ configKey }: ScheduleGridAppProps) {
  const { t } = useTranslation();
  const { myProfile, timezoneName, language } = useContext(AppRootContext);
  const config = getConfig(configKey);
  const format = useAppDateTimeFormat();
  const {
    choiceSetValue,
    choiceSetChanged,
    ratingFilter,
    hideConflicts,
  } = usePersonalScheduleFilters({
    storageKey: `schedule:${configKey}:personalFilters`,
    showPersonalFilters: config?.showPersonalFilters ?? false,
    signedIn: myProfile != null,
  });

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
        myRatingFilter={myProfile ? ratingFilter : undefined}
        hideConflicts={myProfile ? hideConflicts : false}
      >
        {(timespan) => (
          <div className="mb-4">
            {config.showPersonalFilters && myProfile && (
              <PersonalScheduleFiltersBar
                choiceSetValue={choiceSetValue}
                choiceSetChanged={choiceSetChanged}
              />
            )}
            <div className="m-0 p-2 border-bottom">
              <h3 className="p-0 m-0">{format(timespan.start, 'longWeekdayDate')}</h3>
              <div className="font-italic">
                {t('schedule.timezoneMessage', 'All times displayed in {{ offsetName }}.', {
                  offsetName: timespan.start
                    .reconfigure({
                      locale: language,
                    })
                    .setZone(timezoneName).offsetNameLong,
                })}
              </div>
            </div>
            <ScheduleGrid timespan={timespan} />
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
