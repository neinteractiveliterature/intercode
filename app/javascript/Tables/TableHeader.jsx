import React from 'react';
import PropTypes from 'prop-types';

import ColumnSelector from './ColumnSelector';
import ExportButton from './ExportButton';

function TableHeader({
  columnSelectionProps, exportUrl, filtered, renderLeftContent, renderRightContent, sorted,
}) {
  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <ExportButton
          exportUrl={exportUrl}
          filtered={filtered}
          sorted={sorted}
          columns={columnSelectionProps.getVisibleColumnIds()}
        />
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
    getVisibleColumnIds: PropTypes.func.isRequired,
  }).isRequired,
  exportUrl: PropTypes.string.isRequired,
  filtered: PropTypes.arrayOf(PropTypes.shape({})),
  renderLeftContent: PropTypes.func,
  renderRightContent: PropTypes.func,
  sorted: PropTypes.arrayOf(PropTypes.shape({})),
};

TableHeader.defaultProps = {
  filtered: null,
  renderLeftContent: null,
  renderRightContent: null,
  sorted: null,
};

export default TableHeader;
