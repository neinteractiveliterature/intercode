import React from 'react';
import PropTypes from 'prop-types';

import findLiquidTagName from './findLiquidTagName';

function LiquidTagDocHeader({ liquidTag }) {
  const liquidTagName = findLiquidTagName(liquidTag);

  return (
    <>
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
    </>
  );
}

LiquidTagDocHeader.propTypes = {
  liquidTag: PropTypes.shape({}).isRequired,
};

export default LiquidTagDocHeader;
