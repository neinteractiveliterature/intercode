import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';

function SignupChoiceCell<RowType extends { counted?: boolean | null }, ValueType>({
  value,
  row: { original },
}: CellProps<RowType, ValueType>): JSX.Element {
  const { t } = useTranslation();

  if (original.counted) {
    return <>{value}</>;
  }

  return <>{t('tables.signupChoice.notCounted')}</>;
}

export default SignupChoiceCell;
