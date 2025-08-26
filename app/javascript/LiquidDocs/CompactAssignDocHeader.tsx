import * as React from 'react';

import AssignName from './AssignName';
import findClass from './findClass';
import { LiquidDocsLoaderResult, useLiquidDocs } from './loader';

export type CompactAssignDocHeaderProps = {
  assign: LiquidDocsLoaderResult['sortedAssigns'][number];
  prefix?: string;
  preAssignNameContent?: React.ReactNode;
};

function CompactAssignDocHeader({
  assign,
  prefix,
  preAssignNameContent,
}: CompactAssignDocHeaderProps): React.JSX.Element {
  const { docData } = useLiquidDocs();
  const assignClass = findClass(docData, assign.drop_class_name);

  return (
    <>
      <div>
        {preAssignNameContent}
        <code>
          <AssignName assign={assign} prefix={prefix} />
        </code>
        <br />
        <strong>{assign.drop_class_name}</strong>
        {assign.cms_variable_value_json ? (
          <>
            <br />
            <strong>Value: </strong>
            <code>{assign.cms_variable_value_json}</code>
          </>
        ) : null}
      </div>
      {assignClass?.docstring ? <p className="mt-2 mb-0">{assignClass.docstring}</p> : null}
    </>
  );
}

export default CompactAssignDocHeader;
