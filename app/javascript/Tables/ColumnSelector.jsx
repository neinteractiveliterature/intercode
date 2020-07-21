import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import PopperDropdown from '../UIComponents/PopperDropdown';

function ColumnSelector({
  alwaysVisibleColumns, possibleColumns, visibleColumnIds, setVisibleColumnIds,
}) {
  const { t } = useTranslation();
  const renderHiddenColumnCount = () => {
    const count = (
      possibleColumns.length
      - visibleColumnIds.filter((columnId) => !alwaysVisibleColumns.includes(columnId)).length
      - alwaysVisibleColumns.length
    );

    if (count <= 0) {
      return null;
    }

    return (
      <>
        {' '}
        <span className="badge badge-primary">
          {count}
        </span>
      </>
    );
  };

  return (
    <PopperDropdown
      placement="bottom-end"
      renderReference={({ ref, toggle }) => (
        <button type="button" className="btn btn-outline-primary dropdown-toggle" ref={ref} onClick={toggle}>
          {t('tables.columnSelectorButton', 'Columns')}
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
              .filter((column) => !alwaysVisibleColumns.includes(column.id))
              .map((column) => ({ label: column.Header, value: column.id }))
          }
          value={visibleColumnIds}
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
  visibleColumnIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  setVisibleColumnIds: PropTypes.func.isRequired,
};

export default ColumnSelector;
