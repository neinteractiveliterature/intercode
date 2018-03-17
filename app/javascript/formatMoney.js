export default function formatMoney(moneyValue) {
  return `$${(moneyValue.fractional / 100.0).toFixed(2)}`;
}
