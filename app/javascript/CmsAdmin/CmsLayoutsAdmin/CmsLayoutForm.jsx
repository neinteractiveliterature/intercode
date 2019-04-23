import React from 'react';
import PropTypes from 'prop-types';

import BootstrapFormInput from '../../BuiltInFormControls/BootstrapFormInput';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { transformsReducer } from '../../ComposableFormUtils';

export const layoutReducer = transformsReducer({});

function CmsLayoutForm({ layout, dispatch }) {
  const changeCallback = key => value => dispatch({ type: 'change', key, value });

  return (
    <>
      <BootstrapFormInput
        label="Name"
        value={layout.name || ''}
        onTextChange={changeCallback('name')}
      />

      <BootstrapFormInput
        label="Admin notes"
        value={layout.admin_notes || ''}
        onTextChange={changeCallback('admin_notes')}
      />

      <BootstrapFormInput
        label="Navigation bar CSS classes"
        className="form-control text-monospace"
        value={layout.navbar_classes || ''}
        onTextChange={changeCallback('navbar_classes')}
        helpText={(
          <>
            Overrides the default CSS classes for the Bootstrap navigation bar
            {' (by default, '}
            <code>
              navbar-fixed-top navbar-expand-md mb-4 navbar-dark bg-intercode-blue
            </code>
            {')'}
          </>
        )}
      />

      <div className="form-group">
        <legend className="col-form-label">Content</legend>
        <LiquidInput
          value={layout.content}
          onChange={changeCallback('content')}
        />
      </div>
    </>
  );
}

CmsLayoutForm.propTypes = {
  layout: PropTypes.shape({
    name: PropTypes.string,
    admin_notes: PropTypes.string,
    navbar_classes: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default CmsLayoutForm;
