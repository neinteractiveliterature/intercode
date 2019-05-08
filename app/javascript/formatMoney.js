export default function formatMoney(moneyValue, includeCurrency = true) {
  if (moneyValue == null) {
    return '';
  }

  const number = moneyValue.fractional / 100.0;

  if (includeCurrency) {
    return number.toLocaleString('en-US', { style: 'currency', currency: moneyValue.currency_code });
  }

  return number.toLocaleString('en-US');
}
