import * as React from 'react';
import { Link, useLocation } from 'react-router';

import AssignDocHeader from './AssignDocHeader';
import CompactAssignDocHeader from './CompactAssignDocHeader';
import findClass from './findClass';
import { LiquidDocsLoaderResult, useLiquidDocs } from './loader';

export type AssignDocLinkProps = {
  assign: LiquidDocsLoaderResult['sortedAssigns'][number];
  compact?: boolean;
  prefix?: string;
  preAssignNameContent?: React.ReactNode;
};

function AssignDocLink({
  assign,
  compact = false,
  prefix,
  preAssignNameContent,
}: AssignDocLinkProps): React.JSX.Element {
  const { docData } = useLiquidDocs();
  const location = useLocation();

  const renderCard = () => (
    <div className="card mb-2">
      <div className="card-header">
        {compact ? (
          <CompactAssignDocHeader assign={assign} prefix={prefix} preAssignNameContent={preAssignNameContent} />
        ) : (
          <AssignDocHeader assign={assign} prefix={prefix} />
        )}
      </div>
    </div>
  );

  const assignClass = findClass(docData, assign.drop_class_name);
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
