import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

import AssignDocHeader from './AssignDocHeader';
import CompactAssignDocHeader from './CompactAssignDocHeader';
import findClass from './findClass';

function AssignDocLink({
  assign, compact = false, prefix = null, preAssignNameContent = null,
}) {
  const location = useLocation();

  const renderCard = () => (
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
  );

  const assignClass = findClass(assign.drop_class_name);
  if (!assignClass) {
    return renderCard();
  }

  return (
    <Link
      to={`/liquid_docs/assigns/${prefix || ''}${assign.name}${location.search}`}
      className="card-link m-0 text-body"
    >
      {renderCard()}
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
