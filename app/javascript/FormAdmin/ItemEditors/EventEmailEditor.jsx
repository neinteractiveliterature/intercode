import React from 'react';
import PropTypes from 'prop-types';

import CommonQuestionFields from './CommonQuestionFields';

function EventEmailEditor({
  convention, disabled, form, formItem, onChange, renderedFormItem,
}) {
  return (
    <>
      <CommonQuestionFields
        convention={convention}
        disabled={disabled}
        form={form}
        formItem={formItem}
        onChange={onChange}
        renderedFormItem={renderedFormItem}
      />
    </>
  );
}

EventEmailEditor.propTypes = {
  convention: PropTypes.shape({}).isRequired,
  disabled: PropTypes.bool,
  form: PropTypes.shape({}).isRequired,
  formItem: PropTypes.shape({
    properties: PropTypes.shape({}).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  renderedFormItem: PropTypes.shape({}).isRequired,
};

EventEmailEditor.defaultProps = {
  disabled: false,
};

export default EventEmailEditor;
