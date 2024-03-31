import { Money } from './graphqlTypes.generated';
import { code } from '@breezehr/currency-codes';

export default function formatMoney(moneyValue: Money | null | undefined, includeCurrency = true): string {
  if (moneyValue == null) {
    return '';
  }

  const currency = code(moneyValue.currency_code);
  if (currency == null) {
    return '';
  }

  const number = moneyValue.fractional / 10 ** currency.digits;

  if (includeCurrency) {
    return number.toLocaleString(navigator.language, {
      style: 'currency',
      currency: currency.code,
    });
  }

  return number.toLocaleString(navigator.language);
}
