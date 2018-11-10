import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';

import ScheduleGrid from './ScheduleGrid';
import ScheduleGridConfig from './ScheduleGridConfig';
import { ScheduleGridConsumer, ScheduleGridProvider } from './ScheduleGridContext';

const ScheduleGridApp = ({ basename, configKey, ...otherProps }) => {
  const config = ScheduleGridConfig.get(configKey);

  return (
    <BrowserRouter basename={basename}>
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
    </BrowserRouter>
  );
};

ScheduleGridApp.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default ScheduleGridApp;
