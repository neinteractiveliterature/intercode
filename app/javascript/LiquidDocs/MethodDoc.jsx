import React from 'react';
import PropTypes from 'prop-types';

import AssignName from './AssignName';
import TagDoc from './TagDoc';

function MethodDoc({ method, prefix = null }) {
  if (method.tags.some((tag) => tag.tag_name === 'api')) {
    return null;
  }

  const sortedTags = method.tags.sort((a, b) => {
    // examples go last
    if (a.tag_name === 'example' && b.tag_name !== 'example') {
      return 1;
    }

    if (b.tag_name === 'example' && a.tag_name !== 'example') {
      return -1;
    }

    return 0;
  });

  return (
    <li key={method.name} className="list-group-item">
      <p>
        <code className="font-weight-bold">
          <AssignName assign={method} prefix={prefix} />
        </code>
      </p>

      {method.docstring && (<p>{method.docstring}</p>)}

      <ul className="list-unstyled">
        {
          sortedTags.map((tag, i) => (
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
    docstring: PropTypes.string,
  }).isRequired,
  prefix: PropTypes.string,
};

MethodDoc.defaultProps = {
  prefix: null,
};

export default MethodDoc;
