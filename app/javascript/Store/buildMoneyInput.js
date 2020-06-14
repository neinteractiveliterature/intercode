export default function buildMoneyInput(money) {
  if (money == null) {
    return null;
  }

  return { fractional: money.fractional, currency_code: money.currency_code };
}
