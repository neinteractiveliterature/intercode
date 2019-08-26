import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { transformsReducer } from '../../ComposableFormUtils';

export const partialReducer = transformsReducer({});

function CmsPartialForm({ partial, dispatch }) {
  const changeCallback = (key) => (value) => dispatch({ type: 'change', key, value });

  return (
    <>
      <BootstrapFormInput
        label="Name"
        value={partial.name || ''}
        onTextChange={changeCallback('name')}
      />

      <BootstrapFormInput
        label="Admin notes"
        value={partial.admin_notes || ''}
        onTextChange={changeCallback('admin_notes')}
      />

      <div className="form-group">
        <legend className="col-form-label">Content</legend>
        <LiquidInput
          value={partial.content}
          onChange={changeCallback('content')}
        />
      </div>
    </>
  );
}

CmsPartialForm.propTypes = {
  partial: PropTypes.shape({
    name: PropTypes.string,
    admin_notes: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default CmsPartialForm;
