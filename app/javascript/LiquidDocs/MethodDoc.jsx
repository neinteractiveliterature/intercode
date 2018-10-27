import React from 'react';
import PropTypes from 'prop-types';

import MethodReturnDoc from './MethodReturnDoc';
import TagDoc from './TagDoc';

function MethodDoc({ method, prefix = null, alreadyRenderedClasses = [] }) {
  if (method.tags.some(tag => tag.tag_name === 'api')) {
    return null;
  }

  return (
    <li key={method.name} className="list-group-item">
      <h5>
        <code>
          {'{{ '}
          {prefix}
          {method.name}
          {' }}'}
        </code>
      </h5>

      <p className="mb-0">
        {method.docstring}
      </p>

      <ul className="list-unstyled">
        {
          // eslint-disable-next-line react/no-array-index-key
          method.tags.map((tag, i) => <TagDoc tag={tag} key={`${tag.tag_name}-${i}`} />)
        }
      </ul>

      <MethodReturnDoc
        method={method}
        prefix={prefix}
        alreadyRenderedClasses={alreadyRenderedClasses}
      />
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
  alreadyRenderedClasses: PropTypes.arrayOf(PropTypes.string),
};

MethodDoc.defaultProps = {
  prefix: null,
  alreadyRenderedClasses: [],
};

export default MethodDoc;
