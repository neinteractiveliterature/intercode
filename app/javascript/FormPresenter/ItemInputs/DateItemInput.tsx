import { useCallback, ChangeEvent } from 'react';
import classNames from 'classnames';
import { useUniqueId } from '@neinteractiveliterature/litform';

import FieldRequiredFeedback from './FieldRequiredFeedback';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { DateFormItem } from '../../FormAdmin/FormItemUtils';
import CaptionLabel from './CaptionLabel';

export type DateItemInputProps = CommonFormItemInputProps<DateFormItem>;

function DateItemInput(props: DateItemInputProps) {
  const { formItem, onInteract, onChange, value: uncheckedValue, valueInvalid } = props;
  const domId = useUniqueId(`${formItem.identifier}-`);

  const userDidInteract = useCallback(() => {
    onInteract(formItem.identifier);
  }, [onInteract, formItem]);

  const inputChanged = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
      userDidInteract();
    },
    [onChange, userDidInteract],
  );

  const value = typeof uncheckedValue === 'string' ? uncheckedValue : '';

  return (
    <div className="mb-3">
      <CaptionLabel formItem={formItem} htmlFor={domId} />
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <input
        id={domId}
        type="date"
        value={value}
        onChange={inputChanged}
        onBlur={userDidInteract}
        className={classNames('form-control', { 'is-invalid': valueInvalid })}
      />
      <FieldRequiredFeedback valueInvalid={valueInvalid} />
    </div>
  );
}

export default DateItemInput;
