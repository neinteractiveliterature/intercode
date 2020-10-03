import React from 'react';

import ReactTableExportButtonWithColumnTransform, {
  ReactTableExportButtonWithColumnTransformProps,
} from './ReactTableExportButtonWithColumnTransform';

const transformColumnIdForExport = (columnId: string) => {
  if (columnId === 'action') {
    return ['action', 'prev_state', 'state'];
  }

  if (columnId === 'bucket_change') {
    return ['prev_bucket', 'bucket'];
  }

  return columnId;
};

export type SignupChangesTableExportButtonProps = Omit<
  ReactTableExportButtonWithColumnTransformProps,
  'columnTransform'
>;

function SignupChangesTableExportButton({ ...props }: SignupChangesTableExportButtonProps) {
  return (
    <ReactTableExportButtonWithColumnTransform
      {...props}
      columnTransform={transformColumnIdForExport}
    />
  );
}

export default SignupChangesTableExportButton;
