import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';

import ScheduleGrid from './ScheduleGrid';
import { ScheduleGridConsumer, ScheduleGridProvider } from './ScheduleGridContext';

const ScheduleGridApp = ({ basename, config, ...otherProps }) => (
  <BrowserRouter basename={basename}>
    <ScheduleGridProvider config={config}>
      {timespan => (
        <ScheduleGridConsumer>
          {({ schedule }) => (
            <ScheduleGrid config={config} schedule={schedule} timespan={timespan} {...otherProps} />
          )}
        </ScheduleGridConsumer>
      )}
    </ScheduleGridProvider>
  </BrowserRouter>
);

ScheduleGridApp.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default ScheduleGridApp;
