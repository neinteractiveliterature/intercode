import React from 'react';
import PropTypes from 'prop-types';

import ColumnSelector from './ColumnSelector';
import ExportButton from './ExportButton';

function TableHeader({
  columnSelectionProps, exportButton, exportUrl, filtered,
  renderLeftContent, renderRightContent, sorted,
}) {
  return (
    <div className="d-flex mb-2">
      <div className="flex-grow-1">
        {exportButton || (exportUrl && (
          <ExportButton
            exportUrl={exportUrl}
            filtered={filtered}
            sorted={sorted}
            columns={columnSelectionProps.visibleColumnIds}
          />
        ))}
        {(renderLeftContent || (() => null))()}
      </div>
      <div>
        {(renderRightContent || (() => null))()}
        <ColumnSelector {...columnSelectionProps} />
      </div>
    </div>
  );
}

TableHeader.propTypes = {
  columnSelectionProps: PropTypes.shape({
    visibleColumnIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  exportButton: PropTypes.node,
  exportUrl: PropTypes.string,
  filtered: PropTypes.arrayOf(PropTypes.shape({})),
  renderLeftContent: PropTypes.func,
  renderRightContent: PropTypes.func,
  sorted: PropTypes.arrayOf(PropTypes.shape({})),
};

TableHeader.defaultProps = {
  exportButton: null,
  exportUrl: null,
  filtered: null,
  renderLeftContent: null,
  renderRightContent: null,
  sorted: null,
};

export default TableHeader;
