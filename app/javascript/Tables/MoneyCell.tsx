import { type RowData } from '@tanstack/react-table';
import { type AppCellContext } from './tableFeatures';
import formatMoney from '../formatMoney';
import { Money } from '../graphqlTypes.generated';

function MoneyCell<TData extends RowData, TValue extends Money | undefined | null>({
  getValue,
}: AppCellContext<TData, TValue>): React.JSX.Element {
  return <>{formatMoney(getValue())}</>;
}

export default MoneyCell;
