import { HTMLProps, useContext, useMemo } from 'react';
import currencyCodes, { CurrencyCodeRecord } from '@breezehr/currency-codes';
import { notEmpty } from '@neinteractiveliterature/litform';
import AppRootContext from '../AppRootContext';

export function useAllowedCurrencies(allowedCurrencyCodes?: string[]): CurrencyCodeRecord[] {
  const { supportedCurrencyCodes } = useContext(AppRootContext);
  const allowedCurrencies = useMemo(() => {
    const sortedCodes = [...(allowedCurrencyCodes ?? supportedCurrencyCodes)].sort();
    return sortedCodes.map((code) => currencyCodes.code(code)).filter(notEmpty);
  }, [allowedCurrencyCodes, supportedCurrencyCodes]);

  return allowedCurrencies;
}

export type CurrencySelectProps = Omit<HTMLProps<HTMLSelectElement>, 'value' | 'onChange'> & {
  value: string | undefined;
  onChange: React.Dispatch<string | undefined>;
  allowedCurrencyCodes?: string[];
};

export default function CurrencySelect({ value, onChange, allowedCurrencyCodes, ...inputProps }: CurrencySelectProps) {
  const allowedCurrencies = useAllowedCurrencies(allowedCurrencyCodes);

  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} {...inputProps}>
      <option value={undefined} aria-label="No currency selected" />
      {allowedCurrencies.map((currency) => (
        <option value={currency.code} key={currency.code}>
          {currency.code}
        </option>
      ))}
    </select>
  );
}
