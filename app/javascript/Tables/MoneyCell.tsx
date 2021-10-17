import formatMoney from '../formatMoney';
import { Money } from '../graphqlTypes.generated';

export type MoneyCellProps = {
  value?: Money | null;
};
const MoneyCell = ({ value }: MoneyCellProps): JSX.Element => <>{formatMoney(value)}</>;

export default MoneyCell;
