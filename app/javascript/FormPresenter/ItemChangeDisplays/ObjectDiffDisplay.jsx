import React from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash-es/uniq';

import TextDiffDisplay from './TextDiffDisplay';

function ObjectDiffDisplay({
  before, after, renderKey, renderValue, showUnchanged,
}) {
  const combinedKeys = uniq([
    ...Object.keys(before || {}), ...Object.keys(after || {}),
  ]).sort();

  const keyRenderer = renderKey || ((key) => key);
  const valueRenderer = renderValue || ((key, beforeValue, afterValue) => (
    <TextDiffDisplay
      before={(beforeValue || '').toString()}
      after={(afterValue || '').toString()}
    />
  ));

  return (
    <dl className="row mb-0">
      {combinedKeys.map((key) => {
        const beforeValue = (before || {})[key];
        const afterValue = (after || {})[key];

        if (!showUnchanged && JSON.stringify(beforeValue) === JSON.stringify(afterValue)) {
          return null;
        }

        return (
          <React.Fragment key={key}>
            <dt className="col-sm-3">{keyRenderer(key, beforeValue, afterValue)}</dt>
            <dd className="col-sm-9">
              {valueRenderer(key, beforeValue, afterValue)}
            </dd>
          </React.Fragment>
        );
      })}
    </dl>
  );
}

ObjectDiffDisplay.propTypes = {
  before: PropTypes.shape({}),
  after: PropTypes.shape({}),
  renderKey: PropTypes.func,
  renderValue: PropTypes.func,
  showUnchanged: PropTypes.bool,
};

ObjectDiffDisplay.defaultProps = {
  before: {},
  after: {},
  renderKey: null,
  renderValue: null,
  showUnchanged: false,
};

export default ObjectDiffDisplay;
