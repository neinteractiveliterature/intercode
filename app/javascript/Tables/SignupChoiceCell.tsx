import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from '@tanstack/react-table';

function SignupChoiceCell<RowType extends { counted?: boolean | null }, ValueType extends ReactNode>({
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
