import React from 'react';
import PropTypes from 'prop-types';

import AssignName from './AssignName';
import findClass from './findClass';

function AssignDocHeader({ assign, prefix = null }) {
  const assignClass = findClass(assign.drop_class_name);

  return (
    <React.Fragment>
      <h2>
        <code>
          <AssignName assign={assign} prefix={prefix} />
        </code>
      </h2>
      <h5>
        {assign.drop_class_name}
      </h5>
      <p className="mb-0">{assignClass.docstring}</p>
    </React.Fragment>
  );
}

AssignDocHeader.propTypes = {
  assign: PropTypes.shape({
    name: PropTypes.string.isRequired,
    drop_class_name: PropTypes.string.isRequired,
  }).isRequired,
  prefix: PropTypes.string,
};

AssignDocHeader.defaultProps = {
  prefix: null,
};

export default AssignDocHeader;
