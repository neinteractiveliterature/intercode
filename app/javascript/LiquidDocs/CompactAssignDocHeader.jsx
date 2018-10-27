import React from 'react';
import PropTypes from 'prop-types';

import findClass from './findClass';

function CompactAssignDocHeader({ assign, prefix = null, preAssignNameContent = null }) {
  const assignClass = findClass(assign.drop_class_name);

  return (
    <React.Fragment>
      <div>
        {preAssignNameContent}
        <code>
          {'{{ '}
          {prefix}
          {assign.name}
          {' }}'}
        </code>
        <br />
        <strong>
          {assignClass.name}
        </strong>
      </div>
      {
        assignClass.docstring
          ? <p className="mt-2 mb-0">{assignClass.docstring}</p>
          : null
      }
    </React.Fragment>
  );
}

CompactAssignDocHeader.propTypes = {
  assign: PropTypes.shape({
    name: PropTypes.string.isRequired,
    drop_class_name: PropTypes.string.isRequired,
  }).isRequired,
  prefix: PropTypes.string,
  preAssignNameContent: PropTypes.node,
};

CompactAssignDocHeader.defaultProps = {
  prefix: null,
  preAssignNameContent: null,
};

export default CompactAssignDocHeader;
