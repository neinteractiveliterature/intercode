import { ChangeEvent, ReactNode, useState } from 'react';
import * as React from 'react';
import { parseFloatOrNull } from '@neinteractiveliterature/litform';

import formatMoney from '../formatMoney';
import { Money } from '../graphqlTypes.generated';

export type MoneyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> & {
  value?: Money | null;
  onChange: React.Dispatch<Money | undefined>;
  appendContent?: ReactNode;
  inputGroupClassName?: string;
};

export default React.forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  { value, onChange, appendContent, inputGroupClassName, className, ...inputProps },
  ref,
) {
  const [inputValue, setInputValue] = useState(formatMoney(value, false));
  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    const floatValue = parseFloatOrNull(newValue);
    if (floatValue != null) {
      onChange({
        __typename: 'Money',
        fractional: Math.floor(floatValue * 100.0),
        currency_code: 'USD',
      });
    } else {
      onChange(undefined);
    }
  };

  return (
    <div className={inputGroupClassName || 'input-group'}>
      <span className="input-group-text">$</span>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <input
        type="text"
        className={className ?? 'form-control'}
        value={inputValue}
        onChange={inputChanged}
        ref={ref}
        {...inputProps}
      />
      {appendContent}
    </div>
  );
});
