import React from 'react';
import { YardClass } from './DocData';

import findLiquidTagName from './findLiquidTagName';

export type LiquidTagDocHeaderProps = {
  liquidTag: YardClass;
};

function LiquidTagDocHeader({ liquidTag }: LiquidTagDocHeaderProps) {
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
      {liquidTag.docstring ? <p className="mt-2 mb-0">{liquidTag.docstring}</p> : null}
    </>
  );
}

export default LiquidTagDocHeader;
