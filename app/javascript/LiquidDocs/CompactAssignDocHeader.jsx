import React from 'react';
import PropTypes from 'prop-types';

import AssignName from './AssignName';
import findClass from './findClass';

function CompactAssignDocHeader({ assign, prefix = null, preAssignNameContent = null }) {
  const assignClass = findClass(assign.drop_class_name);

  return (
    <>
      <div>
        {preAssignNameContent}
        <code>
          <AssignName assign={assign} prefix={prefix} />
        </code>
        <br />
        <strong>
          {assign.drop_class_name}
        </strong>
        {
          assign.cms_variable_value_json
            ? (
              <>
                <br />
                <strong>
                  Value:
                  {' '}
                </strong>
                <code>
                  {assign.cms_variable_value_json}
                </code>
              </>
            )
            : null
        }
      </div>
      {
        (assignClass || {}).docstring
          ? <p className="mt-2 mb-0">{assignClass.docstring}</p>
          : null
      }
    </>
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
