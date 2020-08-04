import React, { useCallback } from 'react';
import classNames from 'classnames';

import FieldRequiredFeedback from './FieldRequiredFeedback';
import MarkdownInput from '../../BuiltInFormControls/MarkdownInput';
import useUniqueId from '../../useUniqueId';
import CaptionLabel from './CaptionLabel';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { FreeTextFormItem } from '../../FormAdmin/FormItemUtils';

export type FreeTextItemInputProps = CommonFormItemInputProps<FreeTextFormItem>;

function FreeTextItemInput(props: FreeTextItemInputProps) {
  const {
    formItem, onChange, onInteract, value: uncheckedValue, valueInvalid,
  } = props;
  const domId = useUniqueId(`${formItem.identifier}-`);
  const value = (typeof uncheckedValue === 'string') ? uncheckedValue : '';

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

  const renderInput = () => {
    if (formItem.rendered_properties.format === 'markdown') {
      return (
        <MarkdownInput
          value={value || ''}
          onChange={valueChanged}
          onBlur={userInteracted}
          lines={formItem.rendered_properties.lines}
          formControlClassName={classNames({ 'is-invalid': valueInvalid })}
        >
          <FieldRequiredFeedback valueInvalid={valueInvalid} />
        </MarkdownInput>
      );
    }
    if (formItem.rendered_properties.lines === 1) {
      return (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <input
          id={domId}
          name={formItem.identifier}
          type={formItem.rendered_properties.free_text_type || 'text'}
          className={classNames('form-control', { 'is-invalid': valueInvalid })}
          value={value || ''}
          onChange={(event) => valueChanged(event.target.value)}
          onBlur={userInteracted}
        />
      );
    }

    return (
      // eslint-disable-next-line jsx-a11y/control-has-associated-label
      <textarea
        id={domId}
        name={formItem.identifier}
        rows={formItem.rendered_properties.lines}
        className={classNames('form-control', { 'is-invalid': valueInvalid })}
        value={value || ''}
        onChange={(event) => valueChanged(event.target.value)}
        onBlur={userInteracted}
      />
    );
  };

  return (
    <div className="form-group">
      <CaptionLabel formItem={formItem} htmlFor={domId} />
      {renderInput()}
      <FieldRequiredFeedback valueInvalid={valueInvalid} />
    </div>
  );
}

export default FreeTextItemInput;
