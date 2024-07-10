import { Fragment } from 'react';
import { YardMethod } from './DocData';
import { LiquidAssignsQueryFromLocationData } from './useLiquidAssignsQueryFromLocation';

export type AssignNameProps = {
  assign: LiquidAssignsQueryFromLocationData['cmsParent']['liquidAssigns'][0] | YardMethod;
  prefix?: string;
};

function AssignName({ assign, prefix }: AssignNameProps): JSX.Element {
  const concatenatedName = `${prefix || ''}${assign.name}`;
  const rawParts = concatenatedName.split('.');
  const parts = rawParts.map((part, i) => (
     
    <Fragment key={i}>
      <span className="text-nowrap">{part}</span>
      {i < rawParts.length - 1 ? <>&#8203;.</> : null}
    </Fragment>
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
