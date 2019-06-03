import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import FilterDocHeader from './FilterDocHeader';

function FilterDocLink({ filter }) {
  return (
    <Link to={`/liquid_docs/filters/${filter.name}`} className="card-link m-0 text-body">
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
