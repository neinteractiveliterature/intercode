import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CellContext } from '@tanstack/react-table';

function SignupChoiceCell<TData extends { counted?: boolean | null }, TValue extends ReactNode>({
  getValue,
  row: { original },
}: CellContext<TData, TValue>): React.JSX.Element {
  const { t } = useTranslation();

  if (original.counted) {
    return <>{getValue()}</>;
  }

  return <>{t('tables.signupChoice.notCounted')}</>;
}

export default SignupChoiceCell;
