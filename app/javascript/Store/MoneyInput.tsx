import { ChangeEvent, ReactNode, useContext, useMemo, useState } from 'react';
import * as React from 'react';
import { parseFloatOrNull } from '@neinteractiveliterature/litform';
import currencyCodes from '@breezehr/currency-codes';

import formatMoney from '../formatMoney';
import { Money } from '../graphqlTypes.generated';
import AppRootContext from '../AppRootContext';
import CurrencySelect from './CurrencySelect';

// adapted from https://stackoverflow.com/a/53749034
const getCurrencySymbol = (locale: string, currency: string) =>
  (0)
    .toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })
    .replace(/\d/g, '')
    .trim();

export type MoneyInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  value?: Money | null;
  onChange: React.Dispatch<React.SetStateAction<Money | undefined>>;
  appendContent?: ReactNode;
  inputGroupClassName?: string;
  allowedCurrencyCodes?: string[];
};

export default React.forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  { value, onChange, appendContent, inputGroupClassName, className, allowedCurrencyCodes, ...inputProps },
  ref,
) {
  const { defaultCurrencyCode, supportedCurrencyCodes } = useContext(AppRootContext);
  const defaultCurrencyCodeForThisInput = useMemo(() => {
    if (allowedCurrencyCodes?.includes(defaultCurrencyCode)) {
      return defaultCurrencyCode;
    } else if (allowedCurrencyCodes != null) {
      return allowedCurrencyCodes[0];
    } else {
      return defaultCurrencyCode;
    }
  }, [allowedCurrencyCodes, defaultCurrencyCode]);

  const currency = useMemo(() => {
    if (value?.currency_code) {
      return currencyCodes.code(value.currency_code)!;
    } else {
      return currencyCodes.code(defaultCurrencyCodeForThisInput)!;
    }
  }, [value?.currency_code, defaultCurrencyCodeForThisInput]);

  const showCurrencySelect = useMemo(() => {
    if (allowedCurrencyCodes && allowedCurrencyCodes.length > 1) {
      return true;
    }

    if (allowedCurrencyCodes == null && supportedCurrencyCodes.length > 1) {
      return true;
    }

    return false;
  }, [allowedCurrencyCodes, supportedCurrencyCodes]);

  const [inputValue, setInputValue] = useState(() => formatMoney(value, false));
  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    const floatValue = parseFloatOrNull(newValue);
    if (floatValue != null) {
      onChange({
        __typename: 'Money',
        fractional: Math.floor(floatValue * 10 ** currency.digits),
        currency_code: currency.code,
      });
    } else {
      onChange(undefined);
    }
  };

  return (
    <div className={inputGroupClassName || 'input-group'}>
      <span className="input-group-text">{getCurrencySymbol(navigator.language, currency.code)}</span>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <input
        type="text"
        className={className ?? 'form-control'}
        value={inputValue}
        onChange={inputChanged}
        ref={ref}
        {...inputProps}
      />
      {showCurrencySelect && (
        <CurrencySelect
          aria-label="Currency"
          className="form-select flex-shrink-1"
          value={value?.currency_code}
          allowedCurrencyCodes={allowedCurrencyCodes}
          onChange={(newCurrencyCode) =>
            onChange((prevValue) => ({
              __typename: 'Money',
              fractional:
                (prevValue?.fractional ?? 0) /
                10 **
                  (currencyCodes.code(prevValue?.currency_code ?? defaultCurrencyCodeForThisInput)!.digits -
                    currencyCodes.code(newCurrencyCode ?? defaultCurrencyCodeForThisInput)!.digits),
              currency_code: newCurrencyCode ?? defaultCurrencyCodeForThisInput,
            }))
          }
        />
      )}
      {appendContent}
    </div>
  );
});
