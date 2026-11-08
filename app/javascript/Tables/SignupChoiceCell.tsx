import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { type AppCellContext } from './tableFeatures';

function SignupChoiceCell<TData extends { counted?: boolean | null }, TValue extends ReactNode>({
  getValue,
  row: { original },
}: AppCellContext<TData, TValue>): React.JSX.Element {
  const { t } = useTranslation();

  if (original.counted) {
    return <>{getValue()}</>;
  }

  return <>{t('tables.signupChoice.notCounted')}</>;
}

export default SignupChoiceCell;
