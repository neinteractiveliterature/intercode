import React from 'react';

import formatMoney from '../formatMoney';
import { Money } from '../graphqlTypes.generated';

export type MoneyCellProps = {
  value?: Money | null;
};
const MoneyCell = ({ value }: MoneyCellProps) => <>{formatMoney(value)}</>;

export default MoneyCell;
