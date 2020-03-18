import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import flatMap from 'lodash/flatMap';

import ReactTableExportButton from './ExportButton';

function SignupChangesTableExportButton({
  exportUrl, filtered, sorted, visibleColumnIds,
}) {
  const columns = useMemo(
    () => flatMap(visibleColumnIds, (columnId) => {
      if (columnId === 'action') {
        return ['action', 'prev_state', 'state'];
      }

      if (columnId === 'bucket_change') {
        return ['prev_bucket', 'bucket'];
      }

      return columnId;
    }),
    [visibleColumnIds],
  );

  return (
    <ReactTableExportButton
      exportUrl={exportUrl}
      filtered={filtered}
      sorted={sorted}
      columns={columns}
    />
  );
}

SignupChangesTableExportButton.propTypes = {
  exportUrl: PropTypes.string.isRequired,
  filtered: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sorted: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  visibleColumnIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SignupChangesTableExportButton;
