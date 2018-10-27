import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AssignDocHeader from './AssignDocHeader';
import CompactAssignDocHeader from './CompactAssignDocHeader';

function AssignDocLink({
  assign, compact = false, prefix = null, preAssignNameContent = null,
}) {
  return (
    <Link to={`/assigns/${prefix || ''}${assign.name}`} className="card-link m-0 text-body">
      <div className="card mb-2">
        <div className="card-header">
          {
            compact
              ? (
                <CompactAssignDocHeader
                  assign={assign}
                  prefix={prefix}
                  preAssignNameContent={preAssignNameContent}
                />
              )
              : <AssignDocHeader assign={assign} prefix={prefix} />
          }
        </div>
      </div>
    </Link>
  );
}

AssignDocLink.propTypes = {
  assign: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  compact: PropTypes.bool,
  prefix: PropTypes.string,
  preAssignNameContent: PropTypes.node,
};

AssignDocLink.defaultProps = {
  compact: false,
  prefix: null,
  preAssignNameContent: null,
};

export default AssignDocLink;
