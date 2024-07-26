import { useTranslation } from 'react-i18next';

export type BooleanCellProps = {
  value?: boolean | null;
};
function BooleanCell({ value }: BooleanCellProps): JSX.Element {
  const { t } = useTranslation();
  return <>{value ? t('general.booleans.yes') : t('general.booleans.no')}</>;
}

export default BooleanCell;
