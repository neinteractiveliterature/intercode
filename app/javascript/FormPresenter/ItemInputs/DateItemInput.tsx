import { useCallback, ChangeEvent, useId } from 'react';
import classNames from 'classnames';

import FieldRequiredFeedback from './FieldRequiredFeedback';
import { CommonFormItemInputProps } from './CommonFormItemInputProps';
import { DateFormItem } from '../../FormAdmin/FormItemUtils';
import CaptionLabel from './CaptionLabel';
import { VisibilityDisclosureCard } from './PermissionDisclosures';

export type DateItemInputProps = CommonFormItemInputProps<DateFormItem>;

function DateItemInput(props: DateItemInputProps): React.JSX.Element {
  const { formItem, formTypeIdentifier, onInteract, onChange, value: uncheckedValue, valueInvalid } = props;
  const domId = useId();

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

  const value = uncheckedValue ?? '';

  return (
    <div className="mb-3">
      <VisibilityDisclosureCard formItem={formItem} formTypeIdentifier={formTypeIdentifier}>
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
      </VisibilityDisclosureCard>
    </div>
  );
}

export default DateItemInput;
