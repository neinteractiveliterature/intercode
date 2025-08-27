import { CellContext } from '@tanstack/react-table';
import formatMoney from '../formatMoney';
import { Money } from '../graphqlTypes.generated';

function MoneyCell<TData, TValue extends Money | undefined | null>({
  getValue,
}: CellContext<TData, TValue>): React.JSX.Element {
  return <>{formatMoney(getValue())}</>;
}

export default MoneyCell;
