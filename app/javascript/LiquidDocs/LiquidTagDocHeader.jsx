import React from 'react';
import PropTypes from 'prop-types';

import findLiquidTagName from './findLiquidTagName';

function LiquidTagDocHeader({ liquidTag }) {
  const liquidTagName = findLiquidTagName(liquidTag);

  return (
    <React.Fragment>
      <div>
        <code>
          {'{% '}
          {liquidTagName}
          {' %}'}
        </code>
      </div>
      {
        liquidTag.docstring
          ? <p className="mt-2 mb-0">{liquidTag.docstring}</p>
          : null
      }
    </React.Fragment>
  );
}

LiquidTagDocHeader.propTypes = {
  liquidTag: PropTypes.shape({}).isRequired,
};

export default LiquidTagDocHeader;
