import React from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';

import AssignDocLink from './AssignDocLink';
import findClass from './findClass';
import findMethodReturnClass from './findMethodReturnClass';

function TagDoc({ tag, method = null, prefix = null }) {
  if (tag.tag_name === 'example') {
    return (
      <li>
        <div className="card mt-4 border-success">
          <div className="card-header bg-success-light">
            {
              tag.name
                ? (
                  <React.Fragment>
                    <strong>Example:</strong>
                    {' '}
                    {tag.name}
                  </React.Fragment>
                )
                : <strong>Example</strong>
            }
          </div>

          <div className="card-body">
            <code>{tag.text}</code>
          </div>
        </div>
      </li>
    );
  }

  if (tag.tag_name === 'return') {
    const { returnClassName, assignName } = findMethodReturnClass(method);
    const returnClass = findClass(returnClassName);

    if (returnClass) {
      return (
        <React.Fragment>
          <p className="mb-1">
            <strong>Return:</strong>
            {' '}
            <em>
              {tag.types.join(', ')}
            </em>
          </p>
          <div className="d-flex align-items-start">
            <div className="h3 mr-1">
              ↳
            </div>
            <AssignDocLink
              assign={{ name: assignName, drop_class_name: returnClassName }}
              compact
              prefix={prefix}
            />
          </div>
        </React.Fragment>
      );
    }
  }

  if (tag.tag_name === 'see') {
    return (
      <li>
        <strong>See:</strong>
        {' '}
        {
          tag.name
            ? <a href={tag.name}>{tag.text}</a>
            : tag.text
        }
      </li>
    );
  }

  return (
    <li>
      <strong>{humanize(tag.tag_name)}</strong>
      {
        tag.types
          ? (
            <React.Fragment>
              {' '}
              <em>
                [
                {tag.types.join(', ')}
                ]
              </em>
            </React.Fragment>
          )
          : null
      }
      {
        tag.text
          ? (
            <React.Fragment>
              {' '}
              &mdash;
              {' '}
              {tag.text}
            </React.Fragment>
          )
          : null
      }
    </li>
  );
}

TagDoc.propTypes = {
  tag: PropTypes.shape({
    tag_name: PropTypes.string.isRequired,
    name: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string),
    text: PropTypes.string,
  }).isRequired,
  method: PropTypes.shape({}),
  prefix: PropTypes.string,
};

TagDoc.defaultProps = {
  method: null,
  prefix: null,
};

export default TagDoc;
