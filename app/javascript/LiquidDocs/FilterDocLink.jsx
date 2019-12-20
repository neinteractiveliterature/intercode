import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

import FilterDocHeader from './FilterDocHeader';

function FilterDocLink({ filter }) {
  const location = useLocation();

  return (
    <Link
      to={`/liquid_docs/filters/${filter.name}${location.search}`}
      className="card-link m-0 text-body"
    >
      <div className="card mb-2">
        <div className="card-header">
          <FilterDocHeader filter={filter} />
        </div>
      </div>
    </Link>
  );
}

FilterDocLink.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default FilterDocLink;
