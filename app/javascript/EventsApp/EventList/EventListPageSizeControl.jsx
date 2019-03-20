import React from 'react';
import PropTypes from 'prop-types';

function EventListPageSizeControl({ pageSize, onPageSizeChange }) {
  return (
    <div className="form-inline align-items-start">
      <select
        className="form-control mx-1"
        value={pageSize.toString()}
        onChange={(event) => { onPageSizeChange(Number.parseInt(event.target.value, 10)); }}
      >
        {[10, 20, 50, 100, 200].map(pageSizeOption => (
          <option value={pageSizeOption.toString()} key={pageSizeOption}>
            {pageSizeOption}
            {' '}
            per page
          </option>
        ))}
      </select>
    </div>
  );
}

EventListPageSizeControl.propTypes = {
  pageSize: PropTypes.number.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

export default EventListPageSizeControl;
