import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { transformsReducer } from '../../ComposableFormUtils';

export const partialReducer = transformsReducer({});

function CmsPartialForm({ partial, dispatch, readOnly }) {
  const changeCallback = (key) => (value) => dispatch({ type: 'change', key, value });

  return (
    <>
      <BootstrapFormInput
        label="Name"
        value={partial.name || ''}
        onTextChange={changeCallback('name')}
        readOnly={readOnly}
      />

      <BootstrapFormInput
        label="Admin notes"
        value={partial.admin_notes || ''}
        onTextChange={changeCallback('admin_notes')}
        readOnly={readOnly}
      />

      <div className="form-group">
        <legend className="col-form-label">Content</legend>
        <LiquidInput
          value={partial.content}
          onChange={changeCallback('content')}
          codeMirrorOptions={{ readOnly }}
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
  dispatch: PropTypes.func,
  readOnly: PropTypes.bool,
};

CmsPartialForm.defaultProps = {
  dispatch: null,
  readOnly: false,
};

export default CmsPartialForm;
