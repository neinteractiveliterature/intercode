import AssignName from './AssignName';
import findClass from './findClass';
import { LiquidAssignsQueryFromLocationData } from './useLiquidAssignsQueryFromLocation';

export type AssignDocHeaderProps = {
  assign: LiquidAssignsQueryFromLocationData['cmsParent']['liquidAssigns'][0];
  prefix?: string;
};

function AssignDocHeader({ assign, prefix }: AssignDocHeaderProps): JSX.Element {
  const assignClass = findClass(assign.drop_class_name);

  return (
    <>
      <h2>
        <code>
          <AssignName assign={assign} prefix={prefix} />
        </code>
      </h2>
      <h5>{assign.drop_class_name}</h5>
      <p className="mb-0">{assignClass?.docstring}</p>
    </>
  );
}

export default AssignDocHeader;
