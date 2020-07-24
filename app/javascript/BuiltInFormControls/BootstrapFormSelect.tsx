import React, { SelectHTMLAttributes, ReactNode } from 'react';
import useUniqueId from '../useUniqueId';

type BootstrapFormSelectPropsCommon = SelectHTMLAttributes<HTMLSelectElement> & {
  label: ReactNode,
};

type BootstrapFormSelectPropsWithHTMLChange = BootstrapFormSelectPropsCommon;
type BootstrapFormSelectPropsWithTextChange = Omit<BootstrapFormSelectPropsCommon, 'onChange'> & {
  onValueChange: (value: string) => void,
};

export type BootstrapFormSelectProps = (
  BootstrapFormSelectPropsWithHTMLChange | BootstrapFormSelectPropsWithTextChange
);

function isHTMLChangeProps(props: BootstrapFormSelectProps):
props is BootstrapFormSelectPropsWithHTMLChange {
  return !Object.prototype.hasOwnProperty.call(props, 'onValueChange');
}

function extractSelectElementAttributes(
  props: BootstrapFormSelectProps,
): SelectHTMLAttributes<HTMLSelectElement> {
  if (isHTMLChangeProps(props)) {
    const {
      label, onChange, ...otherProps
    } = props;
    return otherProps;
  }

  const { label, ...otherProps } = props;
  return otherProps;
}

function BootstrapFormSelect(props: BootstrapFormSelectProps) {
  const inputId = useUniqueId(props.name ? `${props.name}-` : 'select-');
  const onChangeProp = isHTMLChangeProps(props)
    ? props.onChange
    : ((event: React.ChangeEvent<HTMLSelectElement>) => props.onValueChange(event.target.value));

  return (
    <div className="form-group">
      <label htmlFor={inputId}>{props.label}</label>
      <select
        className="form-control"
        id={inputId}
        onChange={onChangeProp}
        {...extractSelectElementAttributes(props)}
      />
    </div>
  );
}

export default BootstrapFormSelect;
