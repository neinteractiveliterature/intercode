import React, { ReactNode } from 'react';

import useUniqueId from '../useUniqueId';
import HelpText from './HelpText';

export type FormGroupWithLabelProps = {
  children: (id: string) => ReactNode,
  label: ReactNode,
  name?: string,
  helpText?: ReactNode,
  className?: string,
  labelClassName?: string,
};

function FormGroupWithLabel({
  children, label, name, helpText, className, labelClassName,
}: FormGroupWithLabelProps) {
  const id = useUniqueId(`${name || 'input'}-`);

  return (
    <div className={className ?? 'form-group'}>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {children(id)}
      <HelpText>{helpText}</HelpText>
    </div>
  );
}

export default FormGroupWithLabel;
