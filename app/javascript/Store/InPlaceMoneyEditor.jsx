import React from 'react';
import PropTypes from 'prop-types';

import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import MoneyInput from './MoneyInput';
import formatMoney from '../formatMoney';

function InPlaceMoneyEditor({ value, children, ...props }) {
  return (
    <InPlaceEditor
      value={value}
      renderInput={({
        commitEditing, cancelEditing, inputProps, committing,
      }) => (
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
                disabled={committing}
              >
                <i className="fa fa-times" />
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={commitEditing}
                aria-label="Commit changes"
                disabled={committing}
              >
                <i className="fa fa-check" />
              </button>
            </>
          )}
        />
      )}
      {...props}
    >
      {children ?? formatMoney(value)}
    </InPlaceEditor>
  );
}

InPlaceMoneyEditor.propTypes = {
  value: PropTypes.shape({}),
  children: PropTypes.node,
};

InPlaceMoneyEditor.defaultProps = {
  value: null,
  children: null,
};

export default InPlaceMoneyEditor;
