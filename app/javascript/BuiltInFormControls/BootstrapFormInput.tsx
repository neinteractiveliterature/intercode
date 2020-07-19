import React, { InputHTMLAttributes, ReactNode } from 'react';
import useUniqueId from '../useUniqueId';
import HelpText from './HelpText';

type BootstrapFormInputPropsCommon = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode,
  hideLabel?: boolean,
  helpText?: ReactNode,
  invalidFeedback?: ReactNode,
};

type BootstrapFormInputPropsWithHTMLChange = BootstrapFormInputPropsCommon;
type BootstrapFormInputPropsWithTextChange = Omit<BootstrapFormInputPropsCommon, 'onChange'> & {
  onTextChange: (text: string) => void,
};

export type BootstrapFormInputProps = (
  BootstrapFormInputPropsWithHTMLChange | BootstrapFormInputPropsWithTextChange
);

function isHTMLChangeProps(props: BootstrapFormInputProps):
props is BootstrapFormInputPropsWithHTMLChange {
  return Object.prototype.hasOwnProperty.call(props, 'onChange');
}

function BootstrapFormInput(props: BootstrapFormInputProps) {
  const inputId = useUniqueId(`${props.name || 'input'}-`);

  const {
    helpText, label, hideLabel, invalidFeedback, type, ...otherProps
  } = props;

  const onChangeProp = isHTMLChangeProps(props)
    ? props.onChange
    : ((event: React.ChangeEvent<HTMLInputElement>) => { props.onTextChange(event.target.value); });

  return (
    <div className="form-group">
      <label htmlFor={inputId} className={hideLabel ? 'sr-only' : undefined}>{label}</label>
      <input
        className="form-control"
        id={inputId}
        onChange={onChangeProp}
        type={type ?? 'text'}
        {...otherProps}
      />
      <HelpText>{helpText}</HelpText>
      {invalidFeedback && <div className="invalid-feedback">{invalidFeedback}</div>}
    </div>
  );
}

export default BootstrapFormInput;
