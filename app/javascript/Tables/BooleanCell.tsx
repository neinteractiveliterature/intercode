import { type RowData } from '@tanstack/react-table';
import { type AppCellContext } from './tableFeatures';
import { useTranslation } from 'react-i18next';

function BooleanCell<TData extends RowData, TValue extends boolean | null | undefined>({
  getValue,
}: AppCellContext<TData, TValue>): React.JSX.Element {
  const { t } = useTranslation();
  return <>{getValue() ? t('general.booleans.yes') : t('general.booleans.no')}</>;
}

export default BooleanCell;
