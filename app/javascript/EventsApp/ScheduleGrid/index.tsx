import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import CategoryLegend from './CategoryLegend';
import FullnessLegend from './FullnessLegend';
import ScheduleGrid from './ScheduleGrid';
import { getConfig } from './ScheduleGridConfig';
import { ScheduleGridProvider } from './ScheduleGridContext';
import AppRootContext from '../../AppRootContext';
import { useAppDateTimeFormat } from '../../TimeUtils';
import { usePersonalScheduleFilters } from './PersonalScheduleFiltersBar';
import { ScheduleGridConventionDataQueryData } from './queries.generated';
import { EventFiltersInput } from '../../graphqlTypes.generated';
import { useLoaderData } from 'react-router';
import { ConventionDayLoaderResult } from '../conventionDayUrls';

export type ScheduleGridAppProps = {
  configKey: string;
  fetchFormItemIdentifiers: string[];
  convention: ScheduleGridConventionDataQueryData['convention'];
  filters?: EventFiltersInput;
};

function ScheduleGridApp({
  configKey,
  convention,
  fetchFormItemIdentifiers,
  filters,
}: ScheduleGridAppProps): JSX.Element {
  const { t } = useTranslation();
  const { myProfile, timezoneName, language } = useContext(AppRootContext);
  const config = getConfig(configKey);
  const format = useAppDateTimeFormat();
  const { ratingFilter, hideConflicts } = usePersonalScheduleFilters({
    showPersonalFilters: config?.showPersonalFilters ?? false,
    signedIn: myProfile != null,
  });
  const { matchingTimespan: timespan } = useLoaderData() as ConventionDayLoaderResult;

  if (!config) {
    return <ErrorDisplay stringError={t('schedule.gridConfigNotFound', { configKey })} />;
  }

  return (
    <div className="mt-2">
      <ScheduleGridProvider
        convention={convention}
        config={config}
        fetchFormItemIdentifiers={fetchFormItemIdentifiers}
        myRatingFilter={myProfile ? ratingFilter : undefined}
        hideConflicts={myProfile ? hideConflicts : false}
        filters={filters}
      >
        <div className="mb-4">
          <div className="m-0 p-2 border-bottom">
            <h3 className="p-0 m-0">{format(timespan.start, 'longWeekdayDate')}</h3>
            <div className="font-italic">
              {t('schedule.timezoneMessage', {
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
      </ScheduleGridProvider>
      {(config.legends || []).map((legend, i) => {
        if (legend.type === 'text') {
          return (
            <p key={i} className="font-italic">
              {legend.text}
            </p>
          );
        }

        if (legend.type === 'category') {
          return <CategoryLegend key={i} />;
        }

        if (legend.type === 'fullness') {
          return <FullnessLegend key={i} />;
        }

        return `Unknown legend type ${legend.type}`;
      })}
    </div>
  );
}

export default ScheduleGridApp;
