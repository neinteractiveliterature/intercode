import React from 'react';
import classNames from 'classnames';

export type CheckmarkProps = {
  value: boolean;
  className?: string;
};

function Checkmark({ value, className }: CheckmarkProps) {
  if (!value) {
    return null;
  }

  return (
    <i className={classNames('fa fa-check', className)}>
      <span className="sr-only">✓</span>
    </i>
  );
}

export default Checkmark;
