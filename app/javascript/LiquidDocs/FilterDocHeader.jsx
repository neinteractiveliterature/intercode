import React from 'react';
import PropTypes from 'prop-types';

function FilterDocHeader({ filter }) {
  return (
    <React.Fragment>
      <div>
        <code>
          {'{{ input | '}
          {filter.name}
          {' }}'}
        </code>
      </div>
      {
        filter.docstring
          ? <p className="mt-2 mb-0">{filter.docstring}</p>
          : null
      }
    </React.Fragment>
  );
}

FilterDocHeader.propTypes = {
  filter: PropTypes.shape({}).isRequired,
};

export default FilterDocHeader;
