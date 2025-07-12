import { HTMLProps, useEffect, useRef } from 'react';

export default function IndeterminateCheckbox({
  indeterminate,
  className = '',
  checked,
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !checked && !!indeterminate;
    }
  }, [indeterminate, checked]);

  return (
    <div className="form-check">
      <input type="checkbox" ref={ref} className={`form-check ${className}`} checked={checked} {...rest} />
    </div>
  );
}
