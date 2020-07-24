import React, { InputHTMLAttributes, ReactNode } from 'react';
import useUniqueId from '../useUniqueId';
import HelpText from './HelpText';

type BootstrapFormTextareaPropsCommon = InputHTMLAttributes<HTMLTextAreaElement> & {
  label: ReactNode,
  hideLabel?: boolean,
  helpText?: ReactNode,
  invalidFeedback?: ReactNode,
};

type BootstrapFormTextareaPropsWithHTMLChange = BootstrapFormTextareaPropsCommon;
type BootstrapFormTextareaPropsWithTextChange = Omit<BootstrapFormTextareaPropsCommon, 'onChange'> & {
  onTextChange: (text: string) => void,
};

export type BootstrapFormTextareaProps = (
  BootstrapFormTextareaPropsWithHTMLChange | BootstrapFormTextareaPropsWithTextChange
);

function isHTMLChangeProps(props: BootstrapFormTextareaProps):
  props is BootstrapFormTextareaPropsWithHTMLChange {
  return !Object.prototype.hasOwnProperty.call(props, 'onTextChange');
}

function extractTextareaElementAttributes(
  props: BootstrapFormTextareaProps,
): InputHTMLAttributes<HTMLTextAreaElement> {
  if (isHTMLChangeProps(props)) {
    const {
      helpText, label, hideLabel, invalidFeedback, onChange, ...otherProps
    } = props;
    return otherProps;
  }

  const {
    helpText, label, hideLabel, invalidFeedback, onTextChange, ...otherProps
  } = props;
  return otherProps;
}

function BootstrapFormTextarea(props: BootstrapFormTextareaProps) {
  const {
    name, label, hideLabel, helpText, invalidFeedback,
  } = props;
  const inputId = useUniqueId(`${name}-`);
  const onChangeProp = isHTMLChangeProps(props)
    ? props.onChange
    : ((event: React.ChangeEvent<HTMLTextAreaElement>) => props.onTextChange(event.target.value));

  return (
    <div className="form-group">
      <label htmlFor={inputId} className={hideLabel ? 'sr-only' : undefined}>{label}</label>
      <textarea
        className="form-control"
        id={inputId}
        name={name}
        onChange={onChangeProp}
        {...extractTextareaElementAttributes(props)}
      />
      <HelpText>{helpText}</HelpText>
      {invalidFeedback && <div className="invalid-feedback">{invalidFeedback}</div>}
    </div>
  );
}

export default BootstrapFormTextarea;
