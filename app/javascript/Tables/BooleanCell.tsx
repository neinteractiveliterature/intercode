import { CellContext } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

function BooleanCell<TData, TValue extends boolean | null | undefined>({
  getValue,
}: CellContext<TData, TValue>): JSX.Element {
  const { t } = useTranslation();
  return <>{getValue() ? t('general.booleans.yes') : t('general.booleans.no')}</>;
}

export default BooleanCell;
