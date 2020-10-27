import React from 'react';
import { YardMethod } from './DocData';
import { LiquidAssignsQueryFromLocation } from './useLiquidAssignsQueryFromLocation';

export type AssignNameProps = {
  assign: LiquidAssignsQueryFromLocation['liquidAssigns'][0] | YardMethod;
  prefix?: string;
};

function AssignName({ assign, prefix }: AssignNameProps) {
  const concatenatedName = `${prefix || ''}${assign.name}`;
  const rawParts = concatenatedName.split('.');
  const parts = rawParts.map((part, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <React.Fragment key={i}>
      <span className="text-nowrap">{part}</span>
      {i < rawParts.length - 1 ? <>&#8203;.</> : null}
    </React.Fragment>
  ));

  return (
    <>
      <span className="text-nowrap">{'{{ '}</span>
      {parts}
      <span className="text-nowrap">{' }}'}</span>
    </>
  );
}

export default AssignName;
