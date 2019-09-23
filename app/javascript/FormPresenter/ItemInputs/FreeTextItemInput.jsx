import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FieldRequiredFeedback from './FieldRequiredFeedback';
import MarkdownInput from '../../BuiltInFormControls/MarkdownInput';
import RequiredIndicator from './RequiredIndicator';
import useUniqueId from '../../useUniqueId';

function FreeTextItemInput(props) {
  const {
    formItem, onChange, onInteract, value, valueInvalid,
  } = props;
  const domId = useUniqueId(`${formItem.identifier}-`);

  const userInteracted = useCallback(
    () => onInteract(formItem.identifier),
    [onInteract, formItem.identifier],
  );

  const valueChanged = useCallback(
    (newValue) => {
      onChange(newValue);
      userInteracted();
    },
    [onChange, userInteracted],
  );

  const renderLabel = () => (
    <label htmlFor={domId} className="form-item-label">
      <span
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: formItem.properties.caption }}
      />
      <RequiredIndicator formItem={formItem} />
    </label>
  );

  const renderInput = () => {
    if (formItem.properties.format === 'markdown') {
      return (
        <MarkdownInput
          name={formItem.identifier}
          value={value || ''}
          onChange={valueChanged}
          onBlur={userInteracted}
          lines={formItem.properties.lines}
          formControlClassName={classNames({ 'is-invalid': valueInvalid })}
        >
          <FieldRequiredFeedback valueInvalid={valueInvalid} />
        </MarkdownInput>
      );
    }
    if (formItem.properties.lines === 1) {
      return (
        <input
          id={domId}
          name={formItem.identifier}
          type={formItem.properties.free_text_type || 'text'}
          className={classNames('form-control', { 'is-invalid': valueInvalid })}
          value={value || ''}
          onChange={(event) => valueChanged(event.target.value)}
          onBlur={userInteracted}
        />
      );
    }

    return (
      <textarea
        id={domId}
        name={formItem.identifier}
        rows={formItem.properties.lines}
        className={classNames('form-control', { 'is-invalid': valueInvalid })}
        value={value || ''}
        onChange={(event) => valueChanged(event.target.value)}
        onBlur={userInteracted}
      />
    );
  };

  return (
    <div className="form-group">
      {renderLabel()}
      {renderInput()}
      <FieldRequiredFeedback valueInvalid={valueInvalid} />
    </div>
  );
}

FreeTextItemInput.propTypes = {
  formItem: PropTypes.shape({
    identifier: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      caption: PropTypes.string.isRequired,
      format: PropTypes.string,
      lines: PropTypes.number,
      free_text_type: PropTypes.string,
    }).isRequired,
  }).isRequired,
  value: PropTypes.string,
  valueInvalid: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onInteract: PropTypes.func.isRequired,
};

FreeTextItemInput.defaultProps = {
  value: null,
  valueInvalid: false,
};

export default FreeTextItemInput;
