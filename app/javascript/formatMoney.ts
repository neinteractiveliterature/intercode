import { Money } from './graphqlTypes.generated';

export default function formatMoney(
  moneyValue: Money | null | undefined,
  includeCurrency = true,
): string {
  if (moneyValue == null) {
    return '';
  }

  const number = moneyValue.fractional / 100.0;

  if (includeCurrency) {
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: moneyValue.currency_code || 'USD',
    });
  }

  return number.toLocaleString('en-US');
}
