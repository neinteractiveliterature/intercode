import { Money, MoneyInput } from '../graphqlTypes.generated';

export default function buildMoneyInput(money: null | undefined): null;
export default function buildMoneyInput(money: Money): MoneyInput;
export default function buildMoneyInput(money: Money | null | undefined): MoneyInput | null;
export default function buildMoneyInput(money: Money | null | undefined): MoneyInput | null {
  if (money == null) {
    return null;
  }

  return { fractional: money.fractional, currency_code: money.currency_code };
}
