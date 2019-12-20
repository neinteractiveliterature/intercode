import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

import findLiquidTagName from './findLiquidTagName';
import LiquidTagDocHeader from './LiquidTagDocHeader';

function LiquidTagDocLink({ liquidTag }) {
  const location = useLocation();
  const liquidTagName = findLiquidTagName(liquidTag);

  return (
    <Link
      to={`/liquid_docs/tags/${liquidTagName}${location.search}`}
      className="card-link m-0 text-body"
    >
      <div className="card mb-2">
        <div className="card-header">
          <LiquidTagDocHeader liquidTag={liquidTag} />
        </div>
      </div>
    </Link>
  );
}

LiquidTagDocLink.propTypes = {
  liquidTag: PropTypes.shape({}).isRequired,
};

export default LiquidTagDocLink;
