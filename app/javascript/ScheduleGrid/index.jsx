import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import ScheduleGrid from './ScheduleGrid';

const ScheduleGridApp = ({ basename, ...otherProps }) => (
  <BrowserRouter basename={basename}>
    <ScheduleGrid {...otherProps} />
  </BrowserRouter>
);

ScheduleGridApp.propTypes = {
  basename: PropTypes.string.isRequired,
};

export default ScheduleGridApp;
