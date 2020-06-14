import React from 'react';

import ReactTableExportButtonWithColumnTransform from './ReactTableExportButtonWithColumnTransform';

const transformColumnIdForExport = (columnId) => {
  if (columnId === 'action') {
    return ['action', 'prev_state', 'state'];
  }

  if (columnId === 'bucket_change') {
    return ['prev_bucket', 'bucket'];
  }

  return columnId;
};

function SignupChangesTableExportButton({ ...props }) {
  return (
    <ReactTableExportButtonWithColumnTransform
      {...props}
      columnTransform={transformColumnIdForExport}
    />
  );
}

export default SignupChangesTableExportButton;
