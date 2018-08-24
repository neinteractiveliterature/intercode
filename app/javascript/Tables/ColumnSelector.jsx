import React from 'react';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import { ColumnSelectionConsumer } from './ColumnSelectionContext';
import PopperDropdown from '../UIComponents/PopperDropdown';

class ColumnSelector extends React.PureComponent {
  render = () => (
    <ColumnSelectionConsumer>
      {({ getPossibleColumns, getVisibleColumnIds, setVisibleColumnIds }) => (
        <PopperDropdown
          placement="bottom-end"
          renderReference={({ ref, toggle }) => (
            <button type="button" className="btn btn-outline-primary dropdown-toggle" ref={ref} onClick={toggle}>
              Columns
            </button>
          )}
        >
          <div className="px-2">
            <ChoiceSet
              name="columns"
              multiple
              choices={
                getPossibleColumns()
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
