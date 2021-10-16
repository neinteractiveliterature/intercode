import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

import AssignDocHeader from './AssignDocHeader';
import CompactAssignDocHeader from './CompactAssignDocHeader';
import findClass from './findClass';
import { LiquidAssignsQueryFromLocationData } from './useLiquidAssignsQueryFromLocation';

export type AssignDocLinkProps = {
  assign: LiquidAssignsQueryFromLocationData['cmsParent']['liquidAssigns'][0];
  compact?: boolean;
  prefix?: string;
  preAssignNameContent?: React.ReactNode;
};

function AssignDocLink({
  assign,
  compact = false,
  prefix,
  preAssignNameContent,
}: AssignDocLinkProps): JSX.Element {
  const location = useLocation();

  const renderCard = () => (
    <div className="card mb-2">
      <div className="card-header">
        {compact ? (
          <CompactAssignDocHeader
            assign={assign}
            prefix={prefix}
            preAssignNameContent={preAssignNameContent}
          />
        ) : (
          <AssignDocHeader assign={assign} prefix={prefix} />
        )}
      </div>
    </div>
  );

  const assignClass = findClass(assign.drop_class_name);
  if (!assignClass) {
    return renderCard();
  }

  return (
    <Link
      to={`/liquid_docs/assigns/${prefix || ''}${assign.name}${location.search}`}
      className="card-link m-0 text-body"
    >
      {renderCard()}
    </Link>
  );
}

export default AssignDocLink;
