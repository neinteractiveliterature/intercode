import { InputHTMLAttributes, ReactNode } from 'react';
import * as React from 'react';
import useUniqueId from '../useUniqueId';
import HelpText from './HelpText';
import classNames from 'classnames';

type BootstrapFormInputPropsCommon = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  hideLabel?: boolean;
  helpText?: ReactNode;
  invalidFeedback?: ReactNode;
};

type BootstrapFormInputPropsWithHTMLChange = BootstrapFormInputPropsCommon;
type BootstrapFormInputPropsWithTextChange = Omit<BootstrapFormInputPropsCommon, 'onChange'> & {
  onTextChange: (text: string) => void;
};

export type BootstrapFormInputProps =
  | BootstrapFormInputPropsWithHTMLChange
  | BootstrapFormInputPropsWithTextChange;

function isHTMLChangeProps(
  props: BootstrapFormInputProps,
): props is BootstrapFormInputPropsWithHTMLChange {
  return !Object.prototype.hasOwnProperty.call(props, 'onTextChange');
}

function extractInputElementAttributes(
  props: BootstrapFormInputProps,
): InputHTMLAttributes<HTMLInputElement> {
  if (isHTMLChangeProps(props)) {
    const { helpText, label, hideLabel, invalidFeedback, type, onChange, ...otherProps } = props;
    return otherProps;
  }

  const { helpText, label, hideLabel, invalidFeedback, type, onTextChange, ...otherProps } = props;
  return otherProps;
}

function BootstrapFormInput(props: BootstrapFormInputProps) {
  const inputId = useUniqueId(`${props.name || 'input'}-`);
  const inputAttributes = extractInputElementAttributes(props);

  const onChangeProp = isHTMLChangeProps(props)
    ? props.onChange
    : (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onTextChange(event.target.value);
      };

  return (
    <div className="mb-3">
      <label htmlFor={inputId} className={classNames('form-label', { 'sr-only': props.hideLabel })}>
        {props.label}
      </label>
      <input
        className="form-control"
        id={inputId}
        onChange={onChangeProp}
        type={props.type ?? 'text'}
        {...inputAttributes}
      />
      <HelpText>{props.helpText}</HelpText>
      {props.invalidFeedback && <div className="invalid-feedback">{props.invalidFeedback}</div>}
    </div>
  );
}

export default BootstrapFormInput;
