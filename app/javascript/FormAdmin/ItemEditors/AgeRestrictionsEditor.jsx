import React from 'react';
import PropTypes from 'prop-types';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater } from '../FormItemUtils';
import CommonQuestionFields from './CommonQuestionFields';

function AgeRestrictionsEditor({
  convention, form, formItem, onChange, disabled, renderedFormItem,
}) {
  const captionInputId = useUniqueId('age-restrictions-caption-');

  return (
    <>
      <CommonQuestionFields
        convention={convention}
        form={form}
        formItem={formItem}
        onChange={onChange}
        renderedFormItem={renderedFormItem}
      />
      <div className="form-group">
        <label htmlFor={captionInputId} className="form-item-label">
          Caption
        </label>
        <LiquidInput
          id={captionInputId}
          disabled={disabled}
          disablePreview
          value={formItem.properties.caption || ''}
          onChange={formItemPropertyUpdater('caption', onChange)}
        />
      </div>
    </>
  );
}

AgeRestrictionsEditor.propTypes = {
  convention: PropTypes.shape({}).isRequired,
  disabled: PropTypes.bool,
  form: PropTypes.shape({}).isRequired,
  formItem: PropTypes.shape({
    properties: PropTypes.shape({
      caption: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  renderedFormItem: PropTypes.shape({}).isRequired,
};

AgeRestrictionsEditor.defaultProps = {
  disabled: false,
};

export default AgeRestrictionsEditor;
