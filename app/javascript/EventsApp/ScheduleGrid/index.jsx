import React from 'react';
import PropTypes from 'prop-types';

import CategoryLegend from './CategoryLegend';
import FullnessLegend from './FullnessLegend';
import ScheduleGrid from './ScheduleGrid';
import ScheduleGridConfig from './ScheduleGridConfig';
import { ScheduleGridConsumer, ScheduleGridProvider } from './ScheduleGridContext';

const ScheduleGridApp = ({ configKey, ...otherProps }) => {
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
      <ScheduleGridProvider config={config}>
        {timespan => (
          <ScheduleGridConsumer>
            {({ schedule }) => (
              <ScheduleGrid
                config={config}
                schedule={schedule}
                timespan={timespan}
                {...otherProps}
              />
            )}
          </ScheduleGridConsumer>
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
};

ScheduleGridApp.propTypes = {
  configKey: PropTypes.string.isRequired,
};

export default ScheduleGridApp;
