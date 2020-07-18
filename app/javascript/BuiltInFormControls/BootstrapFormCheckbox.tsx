import React, {
  ReactNode, ChangeEventHandler, ChangeEvent, InputHTMLAttributes,
} from 'react';
import classnames from 'classnames';

import useUniqueId from '../useUniqueId';

export type BootstrapFormCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string,
  label: ReactNode,
  checked: boolean,
  onChange?: ChangeEventHandler<HTMLInputElement>,
  onCheckedChange?: (value: boolean) => void,
  disabled?: boolean,
  type: 'radio' | 'checkbox',
  className?: string,
  inputClassName?: string,
};

function BootstrapFormCheckbox(props: BootstrapFormCheckboxProps) {
  const {
    className,
    inputClassName,
    label,
    onChange,
    onCheckedChange,
    ...otherProps
  } = props;

  const inputId = useUniqueId(otherProps.name ? `${otherProps.name}-` : 'checkbox-');
  const onChangeProp = onChange || (
    onCheckedChange
      ? ((event: ChangeEvent<HTMLInputElement>) => { onCheckedChange(event.target.checked); })
      : () => {}
  );

  return (
    <div className={classnames('form-check', className)}>
      <label className="form-check-label" htmlFor={inputId}>
        <input
          className={classnames('form-check-input', inputClassName)}
          id={inputId}
          onChange={onChangeProp}
          {...otherProps}
        />
        {' '}
        {label}
      </label>
    </div>
  );
}

export default BootstrapFormCheckbox;
