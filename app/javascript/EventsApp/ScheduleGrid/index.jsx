import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import CategoryLegend from './CategoryLegend';
import FullnessLegend from './FullnessLegend';
import ScheduleGrid from './ScheduleGrid';
import ScheduleGridConfig from './ScheduleGridConfig';
import { ScheduleGridProvider } from './ScheduleGridContext';
import EventListMyRatingSelector from '../EventList/EventListMyRatingSelector';
import AppRootContext from '../../AppRootContext';

function ScheduleGridApp({ configKey }) {
  const { myProfile } = useContext(AppRootContext);
  const [ratingFilter, setRatingFilter] = useState([1, 0]);
  const config = ScheduleGridConfig.get(configKey);

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            {config.title}
          </li>
        </ol>
      </nav>
      <ScheduleGridProvider config={config} myRatingFilter={myProfile ? ratingFilter : null}>
        {(timespan) => (
          <div className="mb-4">
            <ScheduleGrid timespan={timespan} />
            {config.showPersonalFilters && myProfile && (
              <EventListMyRatingSelector value={ratingFilter} onChange={setRatingFilter} />
            )}
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
