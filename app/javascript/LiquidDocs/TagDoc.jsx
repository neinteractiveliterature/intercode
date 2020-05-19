import React from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';

import AssignDocLink from './AssignDocLink';
import findClass from './findClass';
import findMethodReturnClass from './findMethodReturnClass';

const ExampleTagDoc = ({ tag }) => (
  <li>
    <div className="card mt-4 border-success">
      <div className="card-header bg-success-light">
        {
          tag.name
            ? (
              <>
                <strong>Example:</strong>
                {' '}
                {tag.name}
              </>
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

ExampleTagDoc.propTypes = {
  tag: PropTypes.shape({
    name: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
};

const ReturnTagWithClassDoc = ({
  tag, assignName, returnClassName, prefix,
}) => (
  <>
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
  </>
);

ReturnTagWithClassDoc.propTypes = {
  tag: PropTypes.shape({
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  assignName: PropTypes.string.isRequired,
  returnClassName: PropTypes.string.isRequired,
  prefix: PropTypes.string,
};

ReturnTagWithClassDoc.defaultProps = {
  prefix: null,
};

const SeeTagDoc = ({ tag }) => (
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

SeeTagDoc.propTypes = {
  tag: PropTypes.shape({
    name: PropTypes.string,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

const FallbackTagDoc = ({ tag }) => (
  <li>
    <strong>{humanize(tag.tag_name)}</strong>
    {
      tag.types
        ? (
          <>
            {' '}
            <em>
              [
              {tag.types.join(', ')}
              ]
            </em>
          </>
        )
        : null
    }
    {
      tag.text
        ? (
          <>
            {' '}
            &mdash;
            {' '}
            {tag.text}
          </>
        )
        : null
    }
  </li>
);

FallbackTagDoc.propTypes = {
  tag: PropTypes.shape({
    tag_name: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.string),
    text: PropTypes.string,
  }).isRequired,
};

function TagDoc({ tag, method = null, prefix = null }) {
  if (tag.tag_name === 'example') {
    return (<ExampleTagDoc tag={tag} />);
  }

  if (tag.tag_name === 'return') {
    const { returnClassName, assignName } = findMethodReturnClass(method);

    if (findClass(returnClassName)) {
      return (
        <ReturnTagWithClassDoc
          tag={tag}
          assignName={assignName}
          returnClassName={returnClassName}
          prefix={prefix}
        />
      );
    }
  }

  if (tag.tag_name === 'see') {
    return (<SeeTagDoc tag={tag} />);
  }

  return (<FallbackTagDoc tag={tag} />);
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
