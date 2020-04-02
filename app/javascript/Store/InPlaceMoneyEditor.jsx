import React from 'react';
import PropTypes from 'prop-types';

import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import MoneyInput from './MoneyInput';
import formatMoney from '../formatMoney';

function InPlaceMoneyEditor({ value, ...props }) {
  return (
    <InPlaceEditor
      value={value}
      renderInput={({ commitEditing, cancelEditing, inputProps }) => (
        <MoneyInput
          {...inputProps}
          inputGroupClassName="input-group input-group-sm"
          className="form-control form-control-sm"
          appendContent={(
            <>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={cancelEditing}
                aria-label="Cancel editing"
              >
                <i className="fa fa-times" />
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={commitEditing}
                aria-label="Commit changes"
              >
                <i className="fa fa-check" />
              </button>
            </>
          )}
        />
      )}
      {...props}
    >
      {formatMoney(value)}
    </InPlaceEditor>
  );
}

InPlaceMoneyEditor.propTypes = {
  value: PropTypes.shape({}),
};

InPlaceMoneyEditor.defaultProps = {
  value: null,
};

export default InPlaceMoneyEditor;
