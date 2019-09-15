import React from 'react';
import PropTypes from 'prop-types';

import AssignName from './AssignName';
import TagDoc from './TagDoc';

function MethodDoc({ method, prefix = null }) {
  if (method.tags.some((tag) => tag.tag_name === 'api')) {
    return null;
  }

  return (
    <li key={method.name} className="list-group-item">
      <p>
        <code className="font-weight-bold">
          <AssignName assign={method} prefix={prefix} />
        </code>
      </p>

      <p className="mb-0">
        {method.docstring}
      </p>

      <ul className="list-unstyled">
        {
          method.tags.map((tag, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TagDoc tag={tag} key={`${tag.tag_name}-${i}`} method={method} prefix={prefix} />
          ))
        }
      </ul>
    </li>
  );
}

MethodDoc.propTypes = {
  method: PropTypes.shape({
    name: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      tag_name: PropTypes.string,
    })).isRequired,
  }).isRequired,
  prefix: PropTypes.string,
};

MethodDoc.defaultProps = {
  prefix: null,
};

export default MethodDoc;
