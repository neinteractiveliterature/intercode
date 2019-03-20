import React from 'react';
import PropTypes from 'prop-types';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import PopperDropdown from '../UIComponents/PopperDropdown';

function ColumnSelector({
  alwaysVisibleColumns, possibleColumns, getVisibleColumnIds, setVisibleColumnIds,
}) {
  const renderHiddenColumnCount = () => {
    const count = (
      possibleColumns.length
      - getVisibleColumnIds().filter(columnId => !alwaysVisibleColumns.includes(columnId)).length
      - alwaysVisibleColumns.length
    );

    if (count <= 0) {
      return null;
    }

    return (
      <React.Fragment>
        {' '}
        <span className="badge badge-primary">
          {count}
        </span>
      </React.Fragment>
    );
  };

  return (
    <PopperDropdown
      placement="bottom-end"
      renderReference={({ ref, toggle }) => (
        <button type="button" className="btn btn-outline-primary dropdown-toggle" ref={ref} onClick={toggle}>
          Columns
          {renderHiddenColumnCount()}
        </button>
      )}
    >
      <div className="px-2">
        <ChoiceSet
          name="columns"
          multiple
          choices={
            possibleColumns
              .filter(column => !alwaysVisibleColumns.includes(column.id))
              .map(column => ({ label: column.Header, value: column.id }))
          }
          value={getVisibleColumnIds()}
          onChange={setVisibleColumnIds}
        />
      </div>
    </PopperDropdown>
  );
}

ColumnSelector.propTypes = {
  alwaysVisibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  possibleColumns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
  getVisibleColumnIds: PropTypes.func.isRequired,
  setVisibleColumnIds: PropTypes.func.isRequired,
};

export default ColumnSelector;
