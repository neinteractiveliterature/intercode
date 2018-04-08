export default function formatMoney(moneyValue, includeCurrency = true) {
  const number = (moneyValue.fractional / 100.0).toFixed(2).toString();

  if (includeCurrency) {
    return `$${number}`;
  }

  return number;
}
