import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import flatMap from 'lodash/flatMap';

import ReactTableExportButton from './ExportButton';

function ReactTableExportButtonWithColumnTransform({
  exportUrl, filtered, sorted, visibleColumnIds, columnTransform,
}) {
  const columns = useMemo(
    () => flatMap(visibleColumnIds, columnTransform),
    [visibleColumnIds, columnTransform],
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

ReactTableExportButtonWithColumnTransform.propTypes = {
  exportUrl: PropTypes.string.isRequired,
  filtered: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sorted: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  visibleColumnIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnTransform: PropTypes.func.isRequired,
};

export default ReactTableExportButtonWithColumnTransform;
