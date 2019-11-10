import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useUniqueId from '../../useUniqueId';
import { formItemPropertyUpdater } from '../FormItemUtils';
import CommonQuestionFields from './CommonQuestionFields';
import { FormItemEditorContext } from '../FormEditorContexts';

function TimespanEditor({ disabled }) {
  const { formItem, setFormItem } = useContext(FormItemEditorContext);
  const captionInputId = useUniqueId('timespan-caption-');

  return (
    <>
      <CommonQuestionFields />
      <div className="form-group">
        <label htmlFor={captionInputId} className="form-item-label">
          Caption
        </label>
        <LiquidInput
          id={captionInputId}
          disabled={disabled}
          disablePreview
          value={formItem.properties.caption || ''}
          onChange={formItemPropertyUpdater('caption', setFormItem)}
        />
      </div>
    </>
  );
}

TimespanEditor.propTypes = {
  disabled: PropTypes.bool,
};

TimespanEditor.defaultProps = {
  disabled: false,
};

export default TimespanEditor;
