import React from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';

function TagDoc({ tag }) {
  if (tag.tag_name === 'example') {
    return (
      <li>
        <div className="card mt-4">
          <div className="card-header">
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
};

export default TagDoc;
