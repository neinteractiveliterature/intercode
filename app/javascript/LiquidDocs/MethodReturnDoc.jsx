import React from 'react';
import PropTypes from 'prop-types';

import AssignDocLink from './AssignDocLink';
import findClass from './findClass';
import findMethodReturnClass from './findMethodReturnClass';

function MethodReturnDoc({ method, prefix = null }) {
  const { returnClassName, assignName } = findMethodReturnClass(method);
  const returnClass = findClass(returnClassName);

  if (!returnClass) {
    return null;
  }

  return (
    <AssignDocLink
      assign={{ name: assignName, drop_class_name: returnClassName }}
      prefix={prefix}
    />
  );
}

MethodReturnDoc.propTypes = {
  method: PropTypes.shape({}).isRequired,
  prefix: PropTypes.string,
};

MethodReturnDoc.defaultProps = {
  prefix: null,
};

export default MethodReturnDoc;
