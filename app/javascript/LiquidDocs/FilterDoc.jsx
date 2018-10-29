import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import MethodDoc from './MethodDoc';

function FilterDoc({ filter }) {
  return (
    <React.Fragment>
      <nav aria-label="breadcrumb mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Documentation home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{filter.name}</li>
        </ol>
      </nav>

      <section id={filter.name} className="card my-4">
        <MethodDoc
          method={{
            ...filter,
            name: `input | ${filter.name}`,
          }}
        />
      </section>
    </React.Fragment>
  );
}

FilterDoc.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default FilterDoc;
