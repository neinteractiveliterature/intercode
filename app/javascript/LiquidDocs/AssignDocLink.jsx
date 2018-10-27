import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AssignDocHeader from './AssignDocHeader';

function AssignDocLink({ assign, prefix = null }) {
  return (
    <Link to={`/assigns/${prefix || ''}${assign.name}`} className="card-link text-body">
      <div className="card mb-2">
        <div className="card-header">
          <AssignDocHeader assign={assign} prefix={prefix} />
        </div>
      </div>
    </Link>
  );
}

AssignDocLink.propTypes = {
  assign: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  prefix: PropTypes.string,
};

AssignDocLink.defaultProps = {
  prefix: null,
};

export default AssignDocLink;
