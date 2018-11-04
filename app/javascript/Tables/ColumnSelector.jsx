import React from 'react';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import { ColumnSelectionConsumer } from './ColumnSelectionContext';
import PopperDropdown from '../UIComponents/PopperDropdown';

class ColumnSelector extends React.PureComponent {
  renderHiddenColumnCount = (alwaysVisibleColumns, getPossibleColumns, getVisibleColumnIds) => {
    const count = (
      getPossibleColumns().length
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
  }

  render = () => (
    <ColumnSelectionConsumer>
      {({
        alwaysVisibleColumns, getPossibleColumns, getVisibleColumnIds, setVisibleColumnIds,
      }) => (
        <PopperDropdown
          placement="bottom-end"
          renderReference={({ ref, toggle }) => (
            <button type="button" className="btn btn-outline-primary dropdown-toggle" ref={ref} onClick={toggle}>
              Columns
              {
                this.renderHiddenColumnCount(
                  alwaysVisibleColumns,
                  getPossibleColumns,
                  getVisibleColumnIds,
                )
              }
            </button>
          )}
        >
          <div className="px-2">
            <ChoiceSet
              name="columns"
              multiple
              choices={
                getPossibleColumns()
                  .filter(column => !alwaysVisibleColumns.includes(column.id))
                  .map(column => ({ label: column.Header, value: column.id }))
              }
              value={getVisibleColumnIds()}
              onChange={setVisibleColumnIds}
            />
          </div>
        </PopperDropdown>
      )}
    </ColumnSelectionConsumer>
  )
}

export default ColumnSelector;
